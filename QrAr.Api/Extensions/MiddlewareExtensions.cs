using QrAr.Api.Configuration;
using QrAr.Api.Middleware;

namespace QrAr.Api.Extensions;

public static class MiddlewareExtensions
{
    public static WebApplication UseQrArMiddleware(this WebApplication app)
    {
        // Global exception handling
        app.UseMiddleware<GlobalExceptionMiddleware>();

        // CORS
        app.UseCors("default");

        // Swagger (only in development)
        app.UseSwaggerConfiguration();

        return app;
    }
}