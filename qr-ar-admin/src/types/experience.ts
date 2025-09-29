export type Experience = {
  id: string;
  title: string;
  type: "Video" | "Model3D" | "Image" | "Message";
  mediaUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAtUtc: string;
  qrCodeUrl?: string;
};

export type Experience = {
  id: string;
  title: string;
  type: "Video" | "Model3D" | "Image" | "Message";
  mediaUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAtUtc: string;
  qrCodeUrl?: string;
};

// Extended types for 3D model functionality
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

// Helper types for 3D model handling
export type Model3DFile = {
  data: Uint8Array | ArrayBuffer | Buffer;
  format: Model3DFormat;
  size: number;
  fileName: string;
  mimeType: string;
};

// Utility for supported 3D formats
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

// Helper for determining format from extension
export function getModelFormatFromExtension(
  filename: string
): Model3DFormat | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension && Object.keys(SUPPORTED_3D_FORMATS).includes(extension)
    ? (extension as Model3DFormat)
    : null;
}

// Request types
export type CreateExperienceRequest = Omit<Experience, "id" | "createdAtUtc">;
export type UpdateExperienceRequest = Omit<Experience, "id" | "createdAtUtc">;
