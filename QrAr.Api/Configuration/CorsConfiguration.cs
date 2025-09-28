using Microsoft.Extensions.Options;

namespace QrAr.Api.Configuration;

public class CorsConfiguration
{
    public const string SectionName = "Cors";
    
    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
    public string PolicyName { get; set; } = "default";
}

public static class CorsConfigurationExtensions
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var corsConfig = configuration.GetSection(CorsConfiguration.SectionName).Get<CorsConfiguration>()
                        ?? new CorsConfiguration
                        {
                            AllowedOrigins = new[]
                            {
                                "http://localhost:3000",       // Next.js (admin) en desarrollo
                                "http://localhost:3001",       // Next.js (WebAR) en desarrollo
                                "https://ar.tu-dominio.com",   // WebAR (producción)
                                "https://qr-ar-webar-jstllshmq-juan-p-torres-torres-projects.vercel.app", // WebAR (Vercel)
                            }
                        };

        services.AddCors(options =>
        {
            options.AddPolicy(corsConfig.PolicyName, policy => policy
                .WithOrigins(corsConfig.AllowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod());
        });

        return services;
    }
}