export type Experience = {
  id: string;
  title: string;
  description?: string;
  type: "Video" | "Model3D" | "Image" | "Message";
  mediaUrl: string;
  thumbnailUrl?: string;
  // Nuevos campos para objetos 3D
  modelData?: Uint8Array | ArrayBuffer | Buffer; // Datos binarios del modelo 3D
  modelFormat?: Model3DFormat; // Formato del archivo 3D
  modelSize?: number; // Tamaño del archivo en bytes
  modelFileName?: string; // Nombre original del archivo
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdAtUtc?: string;
  qrCodeUrl?: string; // URL del código QR generado
};

// Tipos de formatos 3D soportados
export type Model3DFormat =
  | "gltf" // GL Transmission Format
  | "glb" // Binary GL Transmission Format
  | "fbx" // Autodesk FBX
  | "obj" // Wavefront OBJ
  | "dae" // COLLADA
  | "3ds" // 3D Studio Max
  | "blend" // Blender
  | "ply" // Polygon File Format
  | "stl" // Stereolithography
  | "x3d" // X3D
  | "usd" // Universal Scene Description
  | "usda" // Universal Scene Description (ASCII)
  | "usdc"; // Universal Scene Description (Binary)

// Utilidad para validar formatos 3D
export const SUPPORTED_3D_FORMATS: Record<Model3DFormat, string> = {
  gltf: "model/gltf+json",
  glb: "model/gltf-binary",
  fbx: "application/octet-stream",
  obj: "text/plain",
  dae: "model/vnd.collada+xml",
  "3ds": "application/x-3ds",
  blend: "application/x-blender",
  ply: "application/octet-stream",
  stl: "application/sla",
  x3d: "model/x3d+xml",
  usd: "model/vnd.usd",
  usda: "model/vnd.usd+ascii",
  usdc: "model/vnd.usd+binary",
};

// Helper para determinar el formato desde la extensión
export function getModelFormatFromExtension(
  filename: string
): Model3DFormat | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension && Object.keys(SUPPORTED_3D_FORMATS).includes(extension)
    ? (extension as Model3DFormat)
    : null;
}

// Tipo para la carga de archivos 3D
export type Model3DFile = {
  data: Uint8Array | ArrayBuffer | Buffer;
  format: Model3DFormat;
  size: number;
  fileName: string;
  mimeType: string;
};

export type CreateExperienceRequest = Omit<Experience, "id" | "createdAtUtc">;
export type UpdateExperienceRequest = Omit<Experience, "id" | "createdAtUtc">;

// Tipo específico para experiencias con modelos 3D
export type Model3DExperience = Experience & {
  type: "Model3D";
  modelData: Uint8Array | ArrayBuffer | Buffer;
  modelFormat: Model3DFormat;
  modelSize: number;
  modelFileName: string;
};
