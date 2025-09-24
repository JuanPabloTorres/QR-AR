import { Experience } from "@/types/experience";

// Hardcoded test experiences
export const testExperiences: Record<string, Experience> = {
  "test-message": {
    id: "test-message",
    title: "Hello World AR!",
    type: "Message",
    mediaUrl: "",
    isActive: true,
  },
  "test-video": {
    id: "test-video",
    title: "Video AR",
    type: "Video",
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isActive: true,
  },
  "test-model": {
    id: "test-model",
    title: "Astronauta 3D",
    type: "Model3D",
    mediaUrl:
      "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb",
    isActive: true,
  },
};

export function getTestExperience(id: string): Experience | null {
  return testExperiences[id] || null;
}
