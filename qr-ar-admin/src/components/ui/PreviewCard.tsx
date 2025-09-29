"use client";
import { Experience } from "@/types/experience";
import { useState } from "react";
import Model3DViewer from "./Model3DViewer";

interface PreviewCardProps {
  experience: Experience;
  className?: string;
}

export default function PreviewCard({
  experience,
  className = "",
}: PreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const createMediaUrl = (experience: Experience): string => {
    // Si hay modelData (Base64), crear un Blob URL
    if (experience.modelData) {
      let mimeType = "application/octet-stream";

      if (experience.type === "Video") {
        mimeType = "video/mp4";
      } else if (experience.type === "Image") {
        mimeType = "image/jpeg";
      } else if (experience.type === "Model3D") {
        if (experience.modelFormat?.toLowerCase() === "glb") {
          mimeType = "model/gltf-binary";
        } else if (experience.modelFormat?.toLowerCase() === "gltf") {
          mimeType = "model/gltf+json";
        }
      }

      try {
        const binaryString = atob(experience.modelData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("Error creating blob URL:", error);
        return experience.mediaUrl || "";
      }
    }

    return experience.mediaUrl || "";
  };

  const renderPreview = () => {
    switch (experience.type) {
      case "Video":
        const videoUrl = createMediaUrl(experience);
        return (
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!videoError && videoUrl ? (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
                onError={() => setVideoError(true)}
                onLoadedData={(e) => {
                  // Mostrar frame del segundo 1 para preview
                  const video = e.target as HTMLVideoElement;
                  video.currentTime = 1;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">Video Preview</p>
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
              📹 VIDEO
            </div>
          </div>
        );

      case "Image":
        const imageUrl = createMediaUrl(experience);
        return (
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!imageError && imageUrl ? (
              <img
                src={imageUrl}
                alt={experience.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">Image Preview</p>
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
              🖼️ IMAGE
            </div>
          </div>
        );

      case "Model3D":
        return (
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {experience.modelData || experience.id ? (
              <Model3DViewer
                modelData={experience.modelData}
                modelFormat={experience.modelFormat}
                experienceId={experience.id}
                mediaUrl={experience.mediaUrl}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">3D Model Preview</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sin datos de modelo
                  </p>
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
              🎯 3D MODEL
            </div>
            {experience.modelFileName && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                {experience.modelFileName}
              </div>
            )}
          </div>
        );

      case "Message":
        return (
          <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Message Experience
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {experience.title}
              </p>
            </div>
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
              💬 MESSAGE
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">❓</div>
              <p className="text-sm text-gray-500">Unknown Type</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>{renderPreview()}</div>
  );
}
