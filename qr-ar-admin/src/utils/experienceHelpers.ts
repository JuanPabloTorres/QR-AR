import { Experience } from "@/types/experience";

export const EXPERIENCE_TYPES = {
  Video: { label: "📹 Video", icon: "📹" },
  Model3D: { label: "🎯 Modelo 3D", icon: "🎯" },
  Image: { label: "🖼️ Imagen", icon: "🖼️" },
  Message: { label: "💬 Mensaje", icon: "💬" },
} as const;

export function getExperienceTypeInfo(type: Experience["type"]) {
  return EXPERIENCE_TYPES[type] || { label: type, icon: "❓" };
}

export function getStatusColor(isActive: boolean) {
  return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}
export function getTypeColor(type: Experience["type"]) {
  switch (type) {
    case "Video":
      return "bg-blue-100 text-blue-800";
    case "Model3D":
      return "bg-purple-100 text-purple-800";
    case "Image":
      return "bg-yellow-100 text-yellow-800";
    case "Message":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
