using QrAr.Api.Models;

namespace QrAr.Api.Dtos
{
    public sealed record ExperienceDto(
         string Id,
         string Title,
         string Type,
         string MediaUrl,
         string? ThumbnailUrl,
         bool IsActive,
         DateTime CreatedAtUtc,
         string QRCodeUrl,
         // ✅ NUEVOS CAMPOS PARA MODELOS 3D
         string? ModelData,
         string? ModelFormat,
         long? ModelSize,
         string? ModelFileName)
    {
        public static ExperienceDto ToDto(Experience e) =>
            new(e.Id,
                e.Title,
                e.Type,
                e.MediaUrl,
                e.ThumbnailUrl,
                e.IsActive,
                e.CreatedAtUtc,
                e.QRCodeUrl,
                // ✅ MAPEAR NUEVOS CAMPOS
                e.ModelData,
                e.ModelFormat,
                e.ModelSize,
                e.ModelFileName);
    }


}
