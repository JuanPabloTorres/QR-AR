namespace QrAr.Api.Models
{
    public sealed class Experience : BaseModel
    {
        public string Title { get; set; } = default!;
        public string Type { get; set; } = "Video"; // "Video" | "Model3D" | "Message"
        public string MediaUrl { get; set; } = default!;
        public string? ThumbnailUrl { get; set; }
        public string QRCodeUrl { get; set; } = default!;

        // ✅ NUEVOS CAMPOS PARA MODELOS 3D
        public string? ModelData { get; set; }             // Datos binarios del modelo
        public string? ModelFormat { get; set; }         // "gltf", "glb", "fbx", etc.
        public long? ModelSize { get; set; }             // Tamaño en bytes
        public string? ModelFileName { get; set; }       // Nombre original del archivo

    }
}