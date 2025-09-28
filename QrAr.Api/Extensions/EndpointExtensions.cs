using QrAr.Api.Controllers;

namespace QrAr.Api.Extensions;

public static class EndpointExtensions
{
    public static WebApplication MapApiEndpoints(this WebApplication app)
    {
        // Map all controller endpoints
        app.MapExperiencesEndpoints();
        app.MapAnalyticsEndpoints();

        return app;
    }
}