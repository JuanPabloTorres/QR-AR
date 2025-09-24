namespace QrAr.Api.Models
{
    public sealed class AnalyticsEvent
    {
        public int Id { get; set; }
        public string ExperienceId { get; set; } = default!;
        public string EventName { get; set; } = default!; // scan | view-started | view-completed
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
