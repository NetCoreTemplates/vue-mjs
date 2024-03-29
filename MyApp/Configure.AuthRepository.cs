using ServiceStack.Web;
using ServiceStack.Auth;
using ServiceStack.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureAuthRepository))]

namespace MyApp
{
    // Custom User Table with extended Metadata properties
    public class AppUser : UserAuth
    {
        public string? ProfileUrl { get; set; }
        public string? LastLoginIp { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }

    public class AppUserAuthEvents : AuthEvents
    {
        public override void OnAuthenticated(IRequest req, IAuthSession session, IServiceBase authService, 
            IAuthTokens tokens, Dictionary<string, string> authInfo)
        {
            var authRepo = HostContext.AppHost.GetAuthRepository(req);
            using (authRepo as IDisposable)
            {
                var userAuth = (AppUser)authRepo.GetUserAuth(session.UserAuthId);
                userAuth.ProfileUrl = session.GetProfileUrl();
                userAuth.LastLoginIp = req.UserHostAddress;
                userAuth.LastLoginDate = DateTime.UtcNow;
                authRepo.SaveUserAuth(userAuth);
            }
        }
    }

    public class ConfigureAuthRepository : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            // Uncomment to use In Memory Auth
            // .ConfigureServices(services => services.AddSingleton<IAuthRepository>(c =>
            //     new InMemoryAuthRepository<AppUser, UserAuthDetails>()))
            .ConfigureServices(services => services.AddSingleton<IAuthRepository>(c =>
                new OrmLiteAuthRepository<AppUser, UserAuthDetails>(c.GetRequiredService<IDbConnectionFactory>())))
            .ConfigureAppHost(appHost => {
                var authRepo = appHost.Resolve<IAuthRepository>();
                authRepo.InitSchema();
                //TODO Delete or change default User's Password 
                CreateUser(authRepo, "admin@email.com", "Admin User", "p@55wOrd", roles: new[]{ AppRoles.Admin });
                CreateUser(authRepo, "manager@email.com", "The Manager", "p@55wOrd", roles: new[] { AppRoles.Employee, AppRoles.Manager });
                CreateUser(authRepo, "employee@email.com", "A Employee", "p@55wOrd", roles: new[] { AppRoles.Employee });
            }, afterConfigure: appHost => 
                appHost.AssertPlugin<AuthFeature>().AuthEvents.Add(new AppUserAuthEvents()));

        // Add initial Users to the configured Auth Repository
        public void CreateUser(IAuthRepository authRepo, string email, string name, string password, string[] roles)
        {
            if (authRepo.GetUserAuthByUserName(email) == null)
            {
                var newAdmin = new AppUser { Email = email, DisplayName = name };
                var user = authRepo.CreateUserAuth(newAdmin, password);
                authRepo.AssignRoles(user, roles);
            }
        }
    }
}
