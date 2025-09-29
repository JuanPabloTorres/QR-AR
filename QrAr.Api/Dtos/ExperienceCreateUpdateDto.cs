namespace QrAr.Api.Dtos
{
    public sealed record ExperienceCreateUpdateDto(
      string Title,
      string Type,        // "Video" | "Model3D" | "Message"
      string MediaUrl,
      string? ThumbnailUrl,
      bool IsActive,
      // ✅ NUEVOS CAMPOS PARA MODELOS 3D
      string? ModelData,             // Datos binarios del modelo codificados en base64
      string? ModelFormat,         // "gltf", "glb", "fbx", etc.
      long? ModelSize,             // Tamaño en bytes
      string? ModelFileName       // Nombre original del archivo
    );
}
