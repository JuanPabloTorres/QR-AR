// src/app/experiences/viewer/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useExperience } from "@/hooks/useApi";
import Link from "next/link";
import PreviewCard from "@/components/ui/PreviewCard";
import { downloadArExperienceQrCode } from "@/utils/qrCodeHelpers";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ExperienceViewer({ params }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const {
    data: experience,
    loading,
    error,
  } = useExperience(resolvedParams?.id || null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Cargando experiencia...
          </p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Experiencia no encontrada
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error ||
              "La experiencia que buscas no existe o ha sido eliminada."}
          </p>
          <Link
            href="/experiences"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Volver a experiencias
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadQR = () => {
    downloadArExperienceQrCode(experience.title, experience.qrCodeUrl);
  };

  const getStatusBadge = () => {
    return experience.isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
        Activa
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
        Inactiva
      </span>
    );
  };

  const getTypeIcon = () => {
    switch (experience.type) {
      case "Video":
        return "🎬";
      case "Image":
        return "🖼️";
      case "Model3D":
        return "🎯";
      case "Message":
        return "💬";
      default:
        return "📱";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/experiences"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a experiencias
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/experiences/edit/${experience.id}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Link>
            <Link
              href={`/ar/${experience.id}`}
              target="_blank"
              className="flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Ver en AR
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Column */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {experience.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl">{getTypeIcon()}</span>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {experience.type}
                </span>
                {getStatusBadge()}
              </div>

              {/* Preview Card */}
              <PreviewCard experience={experience} className="mb-6" />

              {/* Experience Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Información de la experiencia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        ID:
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                        {experience.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Creado:
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {new Date(experience.createdAtUtc).toLocaleString()}
                      </span>
                    </div>
                    {experience.type === "Model3D" &&
                      experience.modelFormat && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Formato:
                            </span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400 uppercase">
                              {experience.modelFormat}
                            </span>
                          </div>
                          {experience.modelSize && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Tamaño:
                              </span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {(experience.modelSize / (1024 * 1024)).toFixed(
                                  2
                                )}{" "}
                                MB
                              </span>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Column */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="glass rounded-2xl p-6 border border-white/20 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Código QR
              </h3>
              <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                <img
                  src={experience.qrCodeUrl}
                  alt="QR Code"
                  className="w-32 h-32"
                />
              </div>
              <button
                onClick={handleDownloadQR}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Descargar QR
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Escanea para abrir la experiencia AR
              </p>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Acciones rápidas
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/ar/${experience.id}`}
                  target="_blank"
                  className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Probar AR
                </Link>
                <Link
                  href={`/experiences/edit/${experience.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar
                </Link>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/ar/${experience.id}`;
                    navigator.clipboard.writeText(url);
                    alert("URL copiada al portapapeles");
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copiar URL
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="glass rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estadísticas
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Vistas:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    -
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Última vista:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    -
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Las estadísticas estarán disponibles próximamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
