using Funq;
using ServiceStack;
using ServiceStack.Mvc;
using MyApp.ServiceInterface;
using ServiceStack.Host.Handlers;
using ServiceStack.IO;
using HttpMethods = ServiceStack.HttpMethods;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Configure ASP.NET Core IOC Dependencies
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) {}

    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });
        
        // For TodosService
        Plugins.Add(new AutoQueryDataFeature());
        Plugins.Add(new PrettyUrlsFeature());
    }
}

public class PrettyUrlsFeature : IPlugin
{
    public string[] Extensions { get; set; } = { "html" };
    
    public void Register(IAppHost appHost)
    {
        var fs = ((ServiceStackHost)appHost).GetVirtualFileSource<FileSystemVirtualFiles>();
        appHost.CatchAllHandlers.Add((string httpMethod, string pathInfo, string filePath) =>
        {
            if (httpMethod == HttpMethods.Get && !pathInfo.Contains('.'))
            {
                foreach (var ext in Extensions)
                {
                    var relativePath = pathInfo + "." + ext;
                    var file = fs.GetFile(relativePath);
                    if (file != null)
                        return new StaticFileHandler(file);
                }
            }
            return null;
        });
    }
}