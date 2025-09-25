"use client";
import { useState } from "react";
import { useExperiences, useExperienceActions } from "@/hooks/useApi";
import { downloadArExperienceQrCode } from "@/utils/qrCodeHelpers";
import Link from "next/link";

export default function ExperiencesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { data, loading, error, refetch } = useExperiences({
    search: search || undefined,
    type: typeFilter || undefined,
    page: 1,
    pageSize: 50,
    onlyActive: undefined,
  });

  const { remove, loading: actionLoading } = useExperienceActions();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        await remove(id);
        refetch(); // Reload list after delete
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header modernizado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AR Experiences
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage and administer all your augmented reality experiences
          </p>
        </div>
        <Link
          href="/experiences/new"
          className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 min-w-[180px] text-center animate-slideIn"
        >
          <span className="relative z-10 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Experience
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>

      {/* Search and Filters modernizados */}
      <div className="glass rounded-2xl p-6 border border-white/20 animate-fadeIn [animation-delay:200ms]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                className="w-full px-4 py-3 pl-12 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search by title or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="lg:w-48">
            <select
              className="w-full px-4 py-3 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white appearance-none bg-no-repeat bg-right bg-[length:16px] bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] pr-10"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              title="Filter by experience type"
            >
              <option value="">All types</option>
              <option value="Video">Videos</option>
              <option value="Model3D">3D Models</option>
              <option value="Message">Messages</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="group px-6 py-3 glass text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 min-w-[120px]"
          >
            <svg
              className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </button>
        </div>
      </div>

      {/* Content modernizado */}
      <div className="animate-fadeIn [animation-delay:400ms]">
        {error ? (
          <div className="glass rounded-2xl border border-red-500/20 p-12 text-center">
            <div className="text-red-500 mb-6">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Error loading experiences
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : loading ? (
          <div className="glass rounded-2xl border border-white/20 p-12 text-center">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Loading experiences...
            </p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="glass rounded-2xl border border-white/20 p-12 text-center">
            <div className="text-gray-400 mb-6">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No experiences found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Start by creating your first AR experience and transform ideas
              into reality.
            </p>
            <Link
              href="/experiences/new"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="relative z-10">New Experience</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((x, index) => (
              <div
                key={x.id}
                className={`group glass rounded-2xl p-6 border border-white/20 hover:border-blue-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 animate-slideIn`}
              >
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        x.type === "Video"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : x.type === "Model3D"
                          ? "bg-gradient-to-r from-purple-500 to-purple-600"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {x.type === "Video" ? (
                        <svg
                          className="w-6 h-6 text-white"
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
                      ) : x.type === "Model3D" ? (
                        <svg
                          className="w-6 h-6 text-white"
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
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          x.type === "Video"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : x.type === "Model3D"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {x.type}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      x.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {x.isActive ? "Activa" : "Inactiva"}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {x.title}
                </h3>

                {/* ID */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    ID: {x.id.substring(0, 8)}...
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Link
                    href={`/experiences/${x.id}`}
                    className="group/action flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                  >
                    <svg
                      className="w-4 h-4 mr-1 group-hover/action:scale-110 transition-transform duration-300"
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
                    View
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          await downloadArExperienceQrCode(x.id, x.title);
                        } catch (error) {
                          alert("Error downloading QR code");
                        }
                      }}
                      className="group/action flex items-center px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4 mr-1 group-hover/action:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4"
                        />
                      </svg>
                      QR
                    </button>

                    <Link
                      href={`/experiences/edit/${x.id}`}
                      className="group/action flex items-center px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4 mr-1 group-hover/action:scale-110 transition-transform duration-300"
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
                      Edit
                    </Link>

                    <button
                      onClick={async () => {
                        await handleDelete(x.id);
                      }}
                      disabled={actionLoading}
                      className="group/action flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4 mr-1 group-hover/action:scale-110 transition-transform duration-300"
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
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
