using Funq;
using MyApp.ServiceInterface;
using ServiceStack.DataAnnotations;
using ServiceStack.NativeTypes;

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
        
        Plugins.Add(new CorsFeature(new[] {
            "http://localhost:5173", //vite dev
        }, allowCredentials:true));

    }
}
