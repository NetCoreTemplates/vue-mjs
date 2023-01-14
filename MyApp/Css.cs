using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace MyApp;

public static class Css
{
    public const string Link = "font-semibold text-indigo-600 hover:text-indigo-500";
    public const string LinkUnderline = "underline hover:text-success duration-200 transition-colors";
}

public static class CssHtmlExtensions
{
    public const string BaseUrl = "https://github.com/NetCoreTemplates/vue-mjs/blob/main";

    public static IHtmlContent SrcComponent(this IHtmlHelper html, string path, string? size = null, string? cls = null) =>
        html.SrcLink($"/MyApp/wwwroot/mjs/components/{path}", size, cls);
    
    public static IHtmlContent SrcPage(this IHtmlHelper html, string path, string? size = null, string? cls = null) =>
        html.SrcLink($"/MyApp/wwwroot/Pages/{path}", size, cls);
    
    public static IHtmlContent SrcLink(this IHtmlHelper html, string path, string? size = null, string? cls = null)
    {
        size ??= "w-8 h-8";
        cls ??= "text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500";
        return html.Raw($"<a href=\"{BaseUrl + path}\" title=\"Source Code\"><svg class=\"{size} {cls}\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m10 20l4-16m4 4l4 4l-4 4M6 16l-4-4l4-4\"/></svg></a>");
    }
}
