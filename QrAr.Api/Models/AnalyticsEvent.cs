namespace QrAr.Api.Models
{
    public sealed class AnalyticsEvent : BaseModel
    {

        public string ExperienceId { get; set; } = default!;
        public string EventName { get; set; } = default!; // scan | view-started | view-completed

    }
}
