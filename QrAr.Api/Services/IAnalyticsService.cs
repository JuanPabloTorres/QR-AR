using QrAr.Api.Models;

namespace QrAr.Api.Services;

public interface IAnalyticsService
{
    Task<bool> CreateEventAsync(string eventName, string experienceId);
    Task<Dictionary<string, Dictionary<string, int>>> GetSummaryAsync(int days);
}