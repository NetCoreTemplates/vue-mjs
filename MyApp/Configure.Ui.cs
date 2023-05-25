using Microsoft.AspNetCore.Mvc.Rendering;
using ServiceStack.OrmLite;

[assembly: HostingStartup(typeof(MyApp.ConfigureUi))]

namespace MyApp;

public class ConfigureUi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            RazorPage.Config = new() {
                ForbiddenPartial = "~/Pages/Shared/Forbidden.cshtml", //Optional. render error in page instead
            };
            
            //Allow Referencing in #Script expressions, e.g. [Input(EvalAllowableEntries)]
            appHost.ScriptContext.Args[nameof(AppData)] = AppData.Instance;
        });
}

// Shared App Data
public class AppData
{
    internal static readonly AppData Instance = new();
}

public record PageStats(string Label, string Href, int Total);
public static class HtmlExtensions
{
    public static async Task<List<PageStats>> GetPageStatesAsync(this IHtmlHelper html)
    {
        using var db = HostContext.AppHost.GetDbConnection();
        return (await db.SelectAsync<(string label, string href, int total)>(@"
            SELECT 'Bookings', '/admin/bookings', COUNT(*) FROM Booking UNION  
            SELECT 'Coupons',  '/admin/coupons',  COUNT(*) FROM Coupon"))
            .Map(x => new PageStats(x.label, x.href, x.total));
    }
}