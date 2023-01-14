using System.Globalization;
using System.Text;
using Markdig;
using Markdig.Syntax;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using MyApp.Pages;
using ServiceStack.Host.Handlers;
using ServiceStack.IO;
using ServiceStack.Logging;
using ServiceStack.Text;
using RazorPage = Microsoft.AspNetCore.Mvc.Razor.RazorPage;

[assembly: HostingStartup(typeof(MyApp.ConfigureMarkdown))]

namespace MyApp;

public class ConfigureMarkdown : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => { services.AddSingleton<BlogPosts>(); })
        .ConfigureAppHost(afterAppHostInit: appHost =>
        {
            var blogPosts = appHost.Resolve<BlogPosts>();
            blogPosts.VirtualFiles = appHost.GetVirtualFileSource<FileSystemVirtualFiles>();

            //Optional, prerender on deployment with: dotnet run --AppTasks=prerender 
            AppTasks.Register("prerender", args => blogPosts.LoadPosts("_blog/posts", renderTo: "blog"));
            AppTasks.Run();

            if (appHost.IsDevelopmentEnvironment())
            {
                blogPosts.LoadPosts("_blog/posts", renderTo: "blog");
            }
            else
            {
                blogPosts.LoadPosts("_blog/posts");
            }
        });
}

public class BlogPosts
{
    private ILogger<BlogPosts> log;
    private IRazorViewEngine viewEngine;
    public BlogPosts(ILogger<BlogPosts> log, IRazorViewEngine viewEngine)
    {
        this.log = log;
        this.viewEngine = viewEngine;
    }

    public string PagePath { get; set; } = "/Pages/Post.cshtml";

    public string FallbackProfileUrl { get; set; } =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230891b2' d='M12 2a5 5 0 1 0 5 5a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3a3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z'%3E%3C/path%3E%3C/svg%3E";
    public string FallbackSplashUrl { get; set; } = "https://source.unsplash.com/random/2000x1000/?stationary";

    public Dictionary<string, string> AuthorProfileUrls { get; set; } = new()
    {
        ["Lucy Bates"] = "/img/authors/author1.svg",
        ["Gayle Smith"] = "/img/authors/author2.svg",
        ["Brandon Foley"] = "/img/authors/author3.svg",
    };

    public string GetAuthorProfileUrl(string? name) => name != null && AuthorProfileUrls.TryGetValue(name, out var url)
        ? url
        : FallbackProfileUrl;

    public IVirtualFiles VirtualFiles { get; set; }
    public List<MarkdownFileInfo> Posts { get; set; } = new();

    public List<MarkdownFileInfo> GetPosts(string? author = null, string? tag = null)
    {
        IEnumerable<MarkdownFileInfo> latestPosts = Posts
            .Where(x => x.Date < DateTime.UtcNow);
        if (author != null)
            latestPosts = latestPosts.Where(x => x.Author == author);
        if (tag != null)
            latestPosts = latestPosts.Where(x => x.Tags.Contains(tag));
        return latestPosts.OrderByDescending(x => x.Date).ToList();
    }

    public string GetPostLink(MarkdownFileInfo post, bool isStatic) => isStatic
        ? $"/blog/{post.Slug}"
        : $"/posts/{post.Slug}";

    public string GetPostsLink() => "/posts";
    public string GetAuthorLink(string author) => GetPostsLink().AddQueryParam("author", author);
    public string GetTagLink(string tag) => GetPostsLink().AddQueryParam("tag", tag);
    public string GetDateLabel(DateTime? date) => X.Map(date ?? DateTime.UtcNow, d => d.ToString("MMMM d, yyyy"))!;
    public string GetDateTimestamp(DateTime? date) => X.Map(date ?? DateTime.UtcNow, d => d.ToString("O"))!;

    public MarkdownFileInfo? FindPostBySlug(string name) => Posts.FirstOrDefault(x => x.Slug == name);

    public MarkdownFileInfo? Load(string path) => Load(path, CreatePipeline());

    public MarkdownFileInfo? Load(string path, MarkdownPipeline pipeline)
    {
        var file = VirtualFiles.GetFile(path)
                   ?? throw new FileNotFoundException(path.LastRightPart('/'));
        var content = file.ReadAllText();

        var writer = new StringWriter();
        var renderer = new Markdig.Renderers.HtmlRenderer(writer);
        pipeline.Setup(renderer);

        var document = Markdown.Parse(content, pipeline);
        renderer.Render(document);

        var block = document
            .Descendants<Markdig.Extensions.Yaml.YamlFrontMatterBlock>()
            .FirstOrDefault();

        var doc = block?
            .Lines // StringLineGroup[]
            .Lines // StringLine[]
            .Select(x => $"{x}\n")
            .ToList()
            .Select(x => x.Replace("---", string.Empty))
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => KeyValuePairs.Create(x.LeftPart(':').Trim(), x.RightPart(':').Trim()))
            .ToObjectDictionary()
            .ConvertTo<MarkdownFileInfo>();

        if (doc?.Title == null)
        {
            log.LogWarning("No frontmatter found for {0}, ignoring...", file.VirtualPath);
            return null;
        }

        doc.Path = file.VirtualPath;
        doc.Slug = file.Name.RightPart('_').LastLeftPart('.');
        doc.FileName = file.Name;
        doc.HtmlFileName = $"{file.Name.RightPart('_').LastLeftPart('.')}.html";
        var datePart = file.Name.LeftPart('_');
        if (!DateTime.TryParseExact(datePart, "yyyy-MM-dd", CultureInfo.InvariantCulture,
                DateTimeStyles.AdjustToUniversal, out var date))
        {
            log.LogWarning("Could not parse date '{0}', ignoring...", datePart);
            return null;
        }

        doc.Date = date;
        doc.Content = content;
        doc.WordCount = WordCount(content);
        doc.LineCount = LineCount(content);
        writer.Flush();
        doc.Preview = writer.ToString();

        var page = viewEngine.GetView("", PagePath, isMainPage:false);
        var feature = HostContext.AssertPlugin<RazorFormat>();
        using var ms = MemoryStreamFactory.GetStream();
        //var razorPage = (Microsoft.AspNetCore.Mvc.RazorPages.Page)((RazorView)page.View!).RazorPage;
        var model = new PostModel(this) {
            Static = true,
        }.Populate(doc);
        feature.WriteHtmlAsync(ms, page.View, model).GetAwaiter().GetResult();
        ms.Position = 0;
        doc.HtmlPage = Encoding.UTF8.GetString(ms.ReadFullyAsMemory().Span);
        return doc;
    }

    public MarkdownPipeline CreatePipeline()
    {
        var pipeline = new MarkdownPipelineBuilder()
            .UseYamlFrontMatter()
            .UseAdvancedExtensions()
            .Build();
        return pipeline;
    }

    public void LoadPosts(string fromDirectory, string? renderTo = null)
    {
        var fs = VirtualFiles ?? throw new NullReferenceException($"{nameof(VirtualFiles)} is not populated");
        var files = fs.GetDirectory(fromDirectory).GetAllFiles().ToList();
        var log = LogManager.GetLogger(GetType());
        log.InfoFormat("Found {0} posts", files.Count);

        if (renderTo != null)
            fs.DeleteFolder(renderTo);

        var pipeline = CreatePipeline();

        foreach (var file in files)
        {
            try
            {
                log.InfoFormat("Found {0}", file.VirtualPath);
                var doc = Load(file.VirtualPath, pipeline);
                if (doc == null)
                    continue;

                Posts.Add(doc);

                if (renderTo != null)
                {
                    fs.WriteFile($"{renderTo}/{doc.HtmlFileName}", doc.HtmlPage);
                }
            }
            catch (Exception e)
            {
                log.Error(e, "Couldn't load {0}: {1}", file.VirtualPath, e.Message);
            }
        }
    }

    public string GetSummarySplash(MarkdownFileInfo post)
    {
        var splash = post.Splash ?? FallbackSplashUrl;
        return splash.StartsWith("https://images.unsplash.com")
            ? splash.LeftPart('?') + "?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
            : splash;
    }

    public int WordsPerMin { get; set; } = 225;
    public char[] WordBoundaries { get; set; } = { ' ', '.', '?', '!', '(', ')', '[', ']' };
    public int WordCount(string str) => str.Split(WordBoundaries, StringSplitOptions.RemoveEmptyEntries).Length;
    public int LineCount(string str) => str.CountOccurrencesOf('\n');
    public int MinutesRead(int? words) => (int)Math.Ceiling((words ?? 1) / (double)WordsPerMin);
}

public class MarkdownFileInfo
{
    public string Path { get; set; } = default!;
    public string? Slug { get; set; }
    public string? FileName { get; set; }
    public string? HtmlFileName { get; set; }
    public string? Title { get; set; }
    public string? Summary { get; set; }
    public string? Splash { get; set; }
    public string? Author { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime? Date { get; set; }
    public string? Content { get; set; }
    public string? Preview { get; set; }
    public string? HtmlPage { get; set; }
    public int? WordCount { get; set; }
    public int? LineCount { get; set; }
}
