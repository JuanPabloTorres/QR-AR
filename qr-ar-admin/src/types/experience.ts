export type Experience = {
  id: string;
  title: string;
  type: "Video" | "Model3D" | "Message";
  mediaUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAtUtc?: string;
};
