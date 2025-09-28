using QrAr.Api.Services;

namespace QrAr.Api.Configuration;

public static class ServicesConfiguration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register application services
        services.AddScoped<IDatabaseSeederService, DatabaseSeederService>();
        services.AddScoped<IExperienceService, ExperienceService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();

        return services;
    }
}