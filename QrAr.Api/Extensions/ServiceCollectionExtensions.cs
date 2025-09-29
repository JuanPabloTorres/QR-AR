using QrAr.Api.Configuration;

namespace QrAr.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddQrArApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        return services
            .AddDatabaseConfiguration(configuration)
            .AddCorsConfiguration(configuration)
            .AddSwaggerConfiguration()
            .AddServerConfiguration()
            .AddApplicationServices();
    }
}