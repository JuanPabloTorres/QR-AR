using Microsoft.EntityFrameworkCore;
using QrAr.Api.DbContexts;
using QrAr.Api.Models;

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

        private static async Task<IResult> CreateAnalyticsEvent(string eventName, string id, AppDbContext db)
        {
            if (string.IsNullOrWhiteSpace(eventName) || string.IsNullOrWhiteSpace(id))
                return Results.BadRequest("EventName and ID are required");

            var analyticsEvent = new AnalyticsEvent
            {
                ExperienceId = id,
                EventName = eventName,
                CreatedAtUtc = DateTime.UtcNow
            };

            db.Analytics.Add(analyticsEvent);

            await db.SaveChangesAsync();

            return Results.Accepted();
        }

        private static async Task<IResult> GetAnalyticsSummary(int days, AppDbContext db)
        {
            days = days is <= 0 or > 365 ? 30 : days;

            var since = DateTime.UtcNow.AddDays(-days);

            var data = await db.Analytics
                .Where(a => a.CreatedAtUtc >= since)
                .GroupBy(a => new { a.ExperienceId, a.EventName })
                .Select(g => new { g.Key.ExperienceId, g.Key.EventName, Count = g.Count() })
                .ToListAsync();

            // Pivot rápido por experiencia
            var summary = new Dictionary<string, Dictionary<string, int>>();

            foreach (var record in data)
            {
                if (!summary.TryGetValue(record.ExperienceId, out var metrics))
                    summary[record.ExperienceId] = metrics = new();

                metrics[record.EventName] = record.Count;
            }

            return Results.Ok(summary);
        }
    }
}