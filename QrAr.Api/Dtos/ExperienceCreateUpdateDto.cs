namespace QrAr.Api.Dtos
{
    public sealed record ExperienceCreateUpdateDto(
      string Title,
      string Type,        // "Video" | "Model3D" | "Image" | "Message"
      string MediaUrl,
      string? ThumbnailUrl,
      bool IsActive,
      string? QrCodeUrl);
}
