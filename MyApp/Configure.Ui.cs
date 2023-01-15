using System.Net;
using System.Text;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using MyApp.ServiceModel.Types;
using ServiceStack.Text;

[assembly: HostingStartup(typeof(MyApp.ConfigureUi))]

namespace MyApp;

public class ConfigureUi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            RazorPage.Config = new() {
                ForbiddenPartial = "~/Pages/Shared/Forbidden.cshtml", //Optional. render error in page instead
            };
            
            //Referenced in Contacts.cs EvalAllowableEntries
            appHost.ScriptContext.Args[nameof(AppData)] = AppData.Instance;
        });
}

public class AppData
{
    internal static readonly AppData Instance = new();

    public Dictionary<string, string> Colors { get; } = new() {
        {"#ffa4a2", "Red"},
        {"#b2fab4", "Green"},
        {"#9be7ff", "Blue"}
    };
    public List<string> FilmGenres { get; } = EnumUtils.GetValues<FilmGenre>().Map(x => x.ToDescription());

    public List<KeyValuePair<string, string>> Titles { get; } = EnumUtils.GetValues<Title>()
        .Where(x => x != Title.Unspecified)
        .ToKeyValuePairs();
}

public static class HtmlHelperExtensions
{
    public static Dictionary<string, string> ContactColors(this IHtmlHelper html) => AppData.Instance.Colors;
    public static List<KeyValuePair<string, string>> ContactTitles(this IHtmlHelper html) => AppData.Instance.Titles;
    public static List<string> ContactGenres(this IHtmlHelper html) => AppData.Instance.FilmGenres;
}
