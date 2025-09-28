using QrAr.Api.Services;

namespace QrAr.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static async Task<WebApplication> InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeederService>();
        
        await seeder.SeedAsync();

        return app;
    }
}