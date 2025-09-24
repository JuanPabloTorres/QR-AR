namespace QrAr.Api.Models
{
    public sealed class ExperienceRecord
    {
        public string Id { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Type { get; set; } = "Video"; // "Video" | "Model3D" | "Message"
        public string MediaUrl { get; set; } = default!;
        public string? ThumbnailUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
