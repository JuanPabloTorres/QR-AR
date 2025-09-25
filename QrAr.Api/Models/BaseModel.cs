namespace QrAr.Api.Models
{
    public class BaseModel
    {
        public string Id { get; set; } = default!;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public Guid CreatedBy { get; set; }

        public DateTime UpdatedAtUtc { get; set; }

        public Guid UpdatedBy { get; set; }


    }
}
