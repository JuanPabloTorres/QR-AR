import { Experience } from "@/types/experience";

// Hardcoded test experiences
export const testExperiences: Record<string, Experience> = {
  "test-message": {
    id: "test-message",
    title: "Hello World AR!",
    description: "Mensaje de bienvenida en realidad aumentada",
    type: "Message",
    mediaUrl: "",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "test-video": {
    id: "test-video",
    title: "Video AR",
    description: "Video de demostración en AR",
    type: "Video",
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "test-model": {
    id: "test-model",
    title: "Astronauta 3D",
    description: "Modelo 3D de astronauta con animaciones",
    type: "Model3D",
    mediaUrl:
      "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "test-tipche": {
    id: "test-tipche",
    title: "Ti-pche",
    description:
      "Modelo 3D Ti-pche de Hector Blanco desde Sketchfab. Experiencia AR interactiva con rotación automática.",
    type: "Model3D",
    mediaUrl: "/models/6e47b68d13a0413d8fd5fa248a639e8b.glb",
    thumbnailUrl:
      "https://media.sketchfab.com/models/6e47b68d13a0413d8fd5fa248a639e8b/thumbnails/thumbnail.jpg",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "test-duck": {
    id: "test-duck",
    title: "Pato de Goma 3D",
    description: "Modelo 3D clásico para pruebas",
    type: "Model3D",
    mediaUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "test-helmet": {
    id: "test-helmet",
    title: "Casco Espacial",
    description: "Modelo 3D de casco con materiales PBR",
    type: "Model3D",
    mediaUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "test-image": {
    id: "test-image",
    title: "Imagen AR",
    description: "Imagen de prueba en realidad aumentada",
    type: "Image",
    mediaUrl: "/next.svg",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Experiencia Ti-pche con ID de Sketchfab
  "6e47b68d13a0413d8fd5fa248a639e8b": {
    id: "6e47b68d13a0413d8fd5fa248a639e8b",
    title: "Ti-pche",
    description:
      "Modelo 3D Ti-pche de Hector Blanco desde Sketchfab. Experiencia AR interactiva creada desde código embed de Sketchfab.",
    type: "Model3D",
    mediaUrl: "/models/6e47b68d13a0413d8fd5fa248a639e8b.glb",
    thumbnailUrl:
      "https://media.sketchfab.com/models/6e47b68d13a0413d8fd5fa248a639e8b/thumbnails/thumbnail.jpg",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export function getTestExperience(id: string): Experience | null {
  return testExperiences[id] || null;
}
