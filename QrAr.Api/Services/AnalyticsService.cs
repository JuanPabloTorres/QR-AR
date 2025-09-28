using Microsoft.EntityFrameworkCore;
using QrAr.Api.DbContexts;
using QrAr.Api.Models;

namespace QrAr.Api.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;

    public AnalyticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateEventAsync(string eventName, string experienceId)
    {
        if (string.IsNullOrWhiteSpace(eventName) || string.IsNullOrWhiteSpace(experienceId))
            return false;

        var analyticsEvent = new AnalyticsEvent
        {
            ExperienceId = experienceId,
            EventName = eventName,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Analytics.Add(analyticsEvent);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<Dictionary<string, Dictionary<string, int>>> GetSummaryAsync(int days)
    {
        days = days is <= 0 or > 365 ? 30 : days;

        var since = DateTime.UtcNow.AddDays(-days);

        var data = await _context.Analytics
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

        return summary;
    }
}