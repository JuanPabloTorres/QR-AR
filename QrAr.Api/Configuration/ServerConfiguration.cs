using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;

namespace QrAr.Api.Configuration;

public static class ServerConfiguration
{
    public static IServiceCollection AddServerConfiguration(this IServiceCollection services)
    {
        // Configure Kestrel server options
        services.Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = 100 * 1024 * 1024; // 100MB
        });

        // Configure Form options for multipart uploads
        services.Configure<FormOptions>(options =>
        {
            options.ValueLengthLimit = 100 * 1024 * 1024; // 100MB
            options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100MB
        });

        return services;
    }
}