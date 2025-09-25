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

      const updatedExperience = await updateExperience(experience.id, {
        title,
        type,
        mediaUrl,
        thumbnailUrl,
        isActive,
        qrCodeUrl,
      });

      // Update local state with response
      setExperience(updatedExperience);
      setSuccess(true);

      setTimeout(() => {
        router.push("/experiences");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error saving experience");
    } finally {
      setLoading(false);
    }
  }

  if (!experience) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass rounded-3xl border border-red-500/20 p-12 text-center animate-fadeIn">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Experience Not Found
          </h2>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
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

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Edit Experience
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Modify your augmented reality experience
            </p>

            {/* Experience ID Badge */}
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
              <span className="font-mono">
                ID: {experience.id.substring(0, 8)}...
              </span>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 glass rounded-2xl border border-green-500/20 p-6 animate-fadeIn">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-green-800 dark:text-green-400 mb-1">
                    Experience updated successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Redirecting to experiences list...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="glass rounded-3xl border border-white/20 animate-slideIn">
            <form onSubmit={onSubmit} className="p-8 space-y-8">
              {/* Title */}
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
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Content type
                </label>
                <div className="relative">
                  <select
                    id="type"
                    className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white appearance-none bg-no-repeat bg-right bg-[length:16px] bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] pr-12"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="Video">📹 Video</option>
                    <option value="Image">🖼️ Image</option>
                    <option value="Model3D">🎯 3D Model</option>
                    <option value="Message">💬 Message</option>
                  </select>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Media URL */}
              <div className="space-y-2">
                <label
                  htmlFor="mediaUrl"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Multimedia content URL
                </label>
                <div className="relative">
                  <input
                    id="mediaUrl"
                    type="url"
                    className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://example.com/my-content"
                    required
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
                  URL of the video, image, 3D model or content that will be
                  displayed in AR
                </p>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <label
                  htmlFor="thumbnailUrl"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Thumbnail image URL{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="thumbnailUrl"
                    type="url"
                    className="w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Active status */}
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
                      Active experience
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Active experiences can be scanned and viewed by users in
                      real time
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    } transition-colors`}
                  ></div>
                </div>
              </div>

              {/* Error Message */}
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
                        Error updating experience
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="relative w-5 h-5 mr-3">
                          <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        </div>
                        Saving changes...
                      </>
                    ) : (
                      <>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </span>
                  {!loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>

                <Link
                  href={`/ar/${experience.id}`}
                  className="group flex-1 glass px-8 py-4 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-blue-500/50 text-center"
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
              </div>
            </form>
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
