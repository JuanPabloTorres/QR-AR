"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExperienceById, deleteExperience } from "@/lib/apiClient";
import { Experience } from "@/types/experience";
import Link from "next/link";
import QrCodeManager from "@/components/ui/QrCodeManager";
import { useRouter } from "next/navigation";

export default function ExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadExperience = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const exp = await getExperienceById(id);
        if (!exp) {
          setError("Experience not found");
          return;
        }
        setExperience(exp);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load experience"
        );
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, [id]);

  const handleDelete = async () => {
    if (!experience) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete "${experience.title}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteExperience(experience.id);
      router.push("/experiences");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete experience"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
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

  if (error || !experience) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="glass rounded-3xl border border-red-500/20 p-12 text-center animate-fadeIn">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "Experience not found"}
          </p>
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return "📹";
      case "Image":
        return "🖼️";
      case "Model3D":
        return "🎯";
      case "Message":
        return "💬";
      default:
        return "📄";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Video":
        return "from-red-500 to-pink-500";
      case "Image":
        return "from-green-500 to-emerald-500";
      case "Model3D":
        return "from-purple-500 to-violet-500";
      case "Message":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Experience Details */}
        <div>
          {/* Header */}
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

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {experience.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTypeColor(
                      experience.type
                    )}`}
                  >
                    <span className="mr-2">{getTypeIcon(experience.type)}</span>
                    {experience.type}
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      experience.isActive
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        experience.isActive
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    {experience.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* ID Badge */}
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="font-mono">ID: {experience.id}</span>
            </div>
          </div>

          {/* Experience Details Card */}
          <div className="glass rounded-3xl border border-white/20 p-8 space-y-6 mb-8 animate-slideIn">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Experience Details
            </h2>

            {/* Media URL */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Media URL
              </label>
              <div className="glass-darker rounded-lg p-3 border border-white/20">
                <code className="text-sm text-blue-600 dark:text-blue-400 font-mono break-all">
                  {experience.mediaUrl}
                </code>
              </div>
            </div>

            {/* Thumbnail URL */}
            {experience.thumbnailUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Thumbnail URL
                </label>
                <div className="glass-darker rounded-lg p-3 border border-white/20">
                  <code className="text-sm text-purple-600 dark:text-purple-400 font-mono break-all">
                    {experience.thumbnailUrl}
                  </code>
                </div>
              </div>
            )}

            {/* Created Date */}
            {experience.createdAtUtc && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Created
                </label>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(experience.createdAtUtc).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            )}

            {/* Media Preview */}
            {experience.type === "Video" && experience.mediaUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Media Preview
                </label>
                <div className="glass-darker rounded-lg p-4 border border-white/20">
                  <video
                    src={experience.mediaUrl}
                    controls
                    className="w-full max-h-64 rounded-lg"
                  />
                </div>
              </div>
            )}

            {experience.type === "Image" && experience.mediaUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Media Preview
                </label>
                <div className="glass-darker rounded-lg p-4 border border-white/20">
                  <img
                    src={experience.mediaUrl}
                    alt={experience.title}
                    className="w-full max-h-64 rounded-lg object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slideIn">
            <Link
              href={`/experiences/edit/${experience.id}`}
              className="group flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-center"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
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
                Edit Experience
              </span>
            </Link>

            <Link
              href={`/ar/${experience.id}`}
              className="group flex-1 glass px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-green-500/50 text-center"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:animate-pulse"
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
                Preview AR
              </span>
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="group flex-1 glass px-6 py-3 text-red-700 dark:text-red-400 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center">
                {deleting ? (
                  <>
                    <div className="relative w-5 h-5 mr-2">
                      <div className="absolute inset-0 rounded-full border-2 border-red-300/30"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                    </div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 group-hover:animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Experience
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column - QR Code Manager */}
        <div className="lg:sticky lg:top-6">
          <QrCodeManager experience={experience} className="animate-slideIn" />
        </div>
      </div>
    </div>
  );
}
