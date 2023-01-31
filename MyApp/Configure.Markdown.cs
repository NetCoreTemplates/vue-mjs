using System.Globalization;
using System.Text;
using Markdig;
using Markdig.Syntax;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using ServiceStack.IO;
using ServiceStack.Logging;
using ServiceStack.Text;

[assembly: HostingStartup(typeof(MyApp.ConfigureMarkdown))]

namespace MyApp;

public class ConfigureMarkdown : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services =>
        {
            services.AddSingleton<RazorPagesEngine>();
            services.AddSingleton<BlogPosts>();
        })
        .ConfigureAppHost(
            appHost => appHost.Plugins.Add(new CleanUrlsFeature()),
            afterPluginsLoaded: appHost => 
        {
            var blogPosts = appHost.Resolve<BlogPosts>();
            blogPosts.VirtualFiles = appHost.GetVirtualFileSource<FileSystemVirtualFiles>();

            //Optional, prerender to /blog with: `$ npm run prerender` 
            AppTasks.Register("prerender", args => blogPosts.LoadPosts("_blog/posts", renderTo: "blog"));

            blogPosts.LoadPosts("_blog/posts");
        });
}

public class BlogPosts
{
    private readonly ILogger<BlogPosts> log;
    private readonly RazorPagesEngine razorPages;
    public BlogPosts(ILogger<BlogPosts> log, RazorPagesEngine razorPages)
    {
        this.log = log;
        this.razorPages = razorPages;
    }
    public IVirtualFiles VirtualFiles { get; set; } = default!;
    public List<MarkdownFileInfo> Posts { get; set; } = new();

    public string PagesPath { get; set; } = "/Pages/Posts/Index.cshtml";
    public string PagePath { get; set; } = "/Pages/Posts/Post.cshtml";

    public string FallbackProfileUrl { get; set; } = Svg.ToDataUri(Svg.Create(Svg.Body.User, stroke:"none").Replace("fill='currentColor'","fill='#0891b2'"));
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

    public string GetPostLink(MarkdownFileInfo post, bool isStatic = false) => isStatic
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

        var page = razorPages.GetView(PagePath);
        var model = new Pages.Posts.PostModel(this) { Static = true }.Populate(doc);
        doc.HtmlPage = RenderToHtml(page.View, model);
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
        Posts.Clear();
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
                var doc = Load(file.VirtualPath, pipeline);
                if (doc == null)
                    continue;

                Posts.Add(doc);

                // prerender /blog/{slug}.html
                if (renderTo != null)
                {
                    log.InfoFormat("Writing {0}/{1}...", renderTo, doc.HtmlFileName);
                    fs.WriteFile($"{renderTo}/{doc.HtmlFileName}", doc.HtmlPage);
                }
            }
            catch (Exception e)
            {
                log.Error(e, "Couldn't load {0}: {1}", file.VirtualPath, e.Message);
            }
        }

        // prerender /blog/index.html
        if (renderTo != null)
        {
            log.InfoFormat("Writing {0}/index.html...", renderTo);
            RenderToFile(razorPages.GetView(PagesPath).View, new Pages.Posts.IndexModel { Static = true }, $"{renderTo}/index.html");
        }
    }

    public void RenderToFile(IView? page, PageModel model, string renderTo) => 
        VirtualFiles.WriteFile(renderTo, RenderToHtml(page, model));
    public async Task RenderToFileAsync(IView? page, PageModel model, string renderTo, CancellationToken token=default) => 
        await VirtualFiles.WriteFileAsync(renderTo, await RenderToHtmlAsync(page, model, token), token);

    public string RenderToHtml(IView? page, PageModel model)
    {
        using var ms = MemoryStreamFactory.GetStream();
        razorPages.WriteHtmlAsync(ms, page, model).GetAwaiter().GetResult(); // No better way to run Async on Startup
        ms.Position = 0;
        var html = Encoding.UTF8.GetString(ms.ReadFullyAsMemory().Span);
        return html;
    }

    public async Task<string> RenderToHtmlAsync(IView? page, PageModel model, CancellationToken token=default)
    {
        using var ms = MemoryStreamFactory.GetStream();
        await razorPages.WriteHtmlAsync(ms, page, model);
        ms.Position = 0;
        var html = Encoding.UTF8.GetString((await ms.ReadFullyAsMemoryAsync(token)).Span);
        return html;
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
