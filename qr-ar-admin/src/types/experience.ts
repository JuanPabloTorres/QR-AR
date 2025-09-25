export type Experience = {
  id: string;
  title: string;
  type: "Video" | "Model3D" | "Image" | "Message";
  mediaUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAtUtc?: string;
  qrCodeUrl?: string; // URL del código QR generado
};

export type CreateExperienceRequest = Omit<Experience, "id" | "createdAtUtc">;
export type UpdateExperienceRequest = Omit<Experience, "id" | "createdAtUtc">;
