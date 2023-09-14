using ServiceStack.IO;

[assembly: HostingStartup(typeof(MyApp.ConfigureMarkdown))]

namespace MyApp;

public class ConfigureMarkdown : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context,services) =>
        {
            context.Configuration.GetSection(nameof(AppConfig)).Bind(AppConfig.Instance);
            services.AddSingleton(AppConfig.Instance);
            services.AddSingleton<RazorPagesEngine>();
            services.AddSingleton<MarkdownBlog>();
        })
        .ConfigureAppHost(
            appHost => appHost.Plugins.Add(new CleanUrlsFeature()),
            afterPluginsLoaded: appHost => 
        {
            var blogPosts = appHost.Resolve<MarkdownBlog>();
            blogPosts.VirtualFiles = appHost.GetVirtualFileSource<FileSystemVirtualFiles>();
            blogPosts.LoadFrom("_posts");
        });
}

public class AppConfig
{
    public static AppConfig Instance { get; } = new();
    public string LocalBaseUrl { get; set; }
    public string PublicBaseUrl { get; set; }
    public string? GitPagesBaseUrl { get; set; }
    public string? SiteTwitter { get; set; }
    public List<AuthorInfo> Authors { get; set; } = new();
    public string? BlogTitle { get; set; }
    public string? BlogDescription { get; set; }
    public string? BlogEmail { get; set; }
    public string? CopyrightOwner { get; set; }
    public string? BlogImageUrl { get; set; }
}

// Add additional frontmatter info to include
public class MarkdownFileInfo : MarkdownFileBase
{
}