"use client";
import { useEffect, useState } from "react";
import { getExperienceById, updateExperience } from "@/lib/apiClient";
import { Experience } from "@/types/experience";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import QrCodeManager from "@/components/ui/QrCodeManager";

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Video" | "Model3D" | "Image" | "Message">(
    "Video"
  );
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const exp = await getExperienceById(id);
        if (!exp) {
          setError("Experience not found");
          return;
        }

        setExperience(exp);
        setTitle(exp.title);
        setType(exp.type);
        setMediaUrl(exp.mediaUrl);
        setThumbnailUrl(exp.thumbnailUrl || "");
        setIsActive(exp.isActive);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load experience"
        );
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadExperience();
    }
  }, [id]);

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass rounded-3xl border border-white/20 p-12 text-center animate-fadeIn">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading experience...
          </p>
        </div>
      </div>
    );
  }

  if (error && !experience) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass rounded-3xl border border-red-500/20 p-12 text-center animate-fadeIn">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/experiences"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!experience) return;

    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      // Generate QR code URL for the experience
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const qrCodeUrl =
        experience.qrCodeUrl || `${baseUrl}/ar/${experience.id}`;

      await updateExperience(experience.id, {
        title,
        type,
        mediaUrl,
        thumbnailUrl,
        isActive,
        qrCodeUrl,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/experiences");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header modernizado */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center space-x-3 mb-4">
          <Link
            href="/experiences"
            className="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
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
            Back to experiences
          </Link>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Edit Experience
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Modify the information of your augmented reality experience
        </p>

        {/* Experience ID Badge modernizado */}
        <div className="inline-flex items-center px-4 py-2 glass rounded-xl border border-white/20 text-sm font-medium text-gray-700 dark:text-gray-300">
          <svg
            className="w-4 h-4 mr-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z"
            />
          </svg>
          <span className="font-mono">
            ID: {experience?.id.substring(0, 8)}...
          </span>
        </div>
      </div>

      {/* Mensaje de éxito modernizado */}
      {success && (
        <div className="mb-8 glass rounded-2xl border border-green-500/20 p-6 animate-fadeIn">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-green-800 dark:text-green-400 mb-1">
                ¡Cambios guardados!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                The experience has been successfully updated. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Formulario */}
        <div className="glass rounded-3xl border border-white/20 animate-slideIn">
          <form onSubmit={onSubmit} className="p-8 space-y-8">
            {/* Título modernizado */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Experience title
              </label>
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: My first AR experience"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Tipo modernizado */}
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Tipo de contenido
              </label>
              <div className="relative">
                <select
                  id="type"
                  className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white appearance-none bg-no-repeat bg-right bg-[length:16px] bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] pr-12"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="Video">📹 Video</option>
                  <option value="Image">🖼️ Imagen</option>
                  <option value="Model3D">🎯 Modelo 3D</option>
                  <option value="Message">💬 Mensaje</option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* URL Media modernizada */}
            <div className="space-y-2">
              <label
                htmlFor="mediaUrl"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                URL del contenido multimedia
              </label>
              <div className="relative">
                <input
                  id="mediaUrl"
                  type="url"
                  className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mi-contenido"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                URL del video, modelo 3D o contenido que se mostrará en AR
              </p>
            </div>

            {/* URL Thumbnail modernizada */}
            <div className="space-y-2">
              <label
                htmlFor="thumbnailUrl"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                URL de la imagen miniatura{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <input
                  id="thumbnailUrl"
                  type="url"
                  className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={thumbnailUrl ?? ""}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://ejemplo.com/miniatura.jpg"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-500"
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
                Imagen que se mostrará como vista previa de la experiencia
              </p>
            </div>

            {/* Estado activo modernizado */}
            <div className="glass-darker rounded-2xl p-6 border border-white/10">
              <div className="flex items-start space-x-4">
                <div className="flex items-center h-6 mt-1">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="isActive"
                    className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    Experiencia activa
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Las experiencias activas pueden ser escaneadas y
                    visualizadas por los usuarios en tiempo real
                  </p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  } transition-colors`}
                ></div>
              </div>
            </div>

            {/* Mensaje de error modernizado */}
            {error && (
              <div className="glass rounded-2xl border border-red-500/20 p-6 animate-fadeIn">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-red-800 dark:text-red-400 mb-1">
                      Error al guardar cambios
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de guardar modernizado */}
            <div className="flex justify-end pt-8 border-t border-white/10">
              <button
                type="submit"
                disabled={loading || success}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none min-w-[200px]"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="relative w-5 h-5 mr-3">
                        <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      </div>
                      Guardando cambios...
                    </>
                  ) : success ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Guardado exitosamente
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Guardar Cambios
                    </>
                  )}
                </span>
                {!loading && !success && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Columna derecha - QR Code Manager */}
        <div className="space-y-6">
          {experience && <QrCodeManager experience={experience} />}
        </div>
      </div>
    </div>
  );
}
