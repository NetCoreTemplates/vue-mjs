var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var mvcBuilder = builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    mvcBuilder.AddRazorRuntimeCompilation();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// app.Use(async (context, next) =>
// {
//     // call the remainder of the pipeline
//     await next.Invoke();
//
//     // if it is not 404, ignore the request
//     // if (context.Response.StatusCode != 404)
//     //     return;
//
//     // the requested path
//     string requestedPath = context.Request.Path;
//
//     // the file name part (may contain slashes at first)
//     string name = requestedPath;
//
//     // if the path contains a slash
//     int index = requestedPath.LastIndexOf('/');
//
//     // trim it to just the name
//     if (index > -1)
//         name = requestedPath.Substring(index);
//
//     // if the name already has an extension, ignore the request
//     //TODO: dot may not indicate extension...
//     if (name.Contains('.'))
//         return;
//
//     // otherwise, if a corresponding .html file exists,
//     // then process the request with that path.
//     if (File.Exists(app.Environment.WebRootPath + requestedPath.Replace("/", "\\") + ".html"))
//     {
//         context.Response.StatusCode = 200;
//         context.Request.Path = requestedPath + ".html";
//         await next.Invoke();
//     }
// });

app.UseServiceStack(new AppHost());

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();


app.UseStatusCodePagesWithReExecute("/Error", "?status={0}");

app.Run();