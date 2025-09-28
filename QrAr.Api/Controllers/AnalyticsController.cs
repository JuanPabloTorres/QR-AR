using Microsoft.EntityFrameworkCore;
using QrAr.Api.DbContexts;
using QrAr.Api.Dtos.Responses;
using QrAr.Api.Models;
using QrAr.Api.Services;

namespace QrAr.Api.Controllers
{
    public static class AnalyticsController
    {
        public static void MapAnalyticsEndpoints(this WebApplication app)
        {
            // POST /api/analytics/{eventName}/{id}
            app.MapPost("/api/analytics/{eventName}/{id}", CreateAnalyticsEvent);

            // GET /api/analytics/summary?days=30
            app.MapGet("/api/analytics/summary", GetAnalyticsSummary);
        }

        private static async Task<IResult> CreateAnalyticsEvent(string eventName, string id, 
            IAnalyticsService analyticsService)
        {
            var success = await analyticsService.CreateEventAsync(eventName, id);
            
            if (!success)
                return Results.BadRequest(ApiResponses.ValidationError("EventName and ID are required"));

            return Results.Ok(ApiResponses.Success("Analytics event created successfully"));
        }

        private static async Task<IResult> GetAnalyticsSummary(int days, IAnalyticsService analyticsService)
        {
            var summary = await analyticsService.GetSummaryAsync(days);

            return Results.Ok(ApiResponses.Success(summary, 
                $"Analytics summary retrieved for the last {days} days"));
        }
    }
}