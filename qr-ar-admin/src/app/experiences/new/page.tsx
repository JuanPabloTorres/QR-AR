"use client";
import { useState } from "react";
import { createExperience } from "@/lib/apiClient";
import { generateShortUUID } from "@/utils/uuid";
import { Model3DUtils } from "@/utils/Model3DUtils";
import { Model3DFile, getModelFormatFromExtension } from "@/types/experience";
import Link from "next/link";

export default function NewExperiencePage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Video" | "Model3D" | "Message">("Video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para archivos 3D
  const [model3DFile, setModel3DFile] = useState<Model3DFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileProcessing, setFileProcessing] = useState(false);

  // Funciones para manejar archivos 3D
  const handleFileSelect = async (file: File) => {
    setFileError(null);
    setFileProcessing(true);

    try {
      // Validar formato
      const format = getModelFormatFromExtension(file.name);
      if (!format) {
        throw new Error(
          `Formato de archivo no soportado: ${file.name.split(".").pop()}`
        );
      }

      // Validar tamaño (50MB máximo)
      if (!Model3DUtils.validateFileSize(file.size, 50)) {
        throw new Error(
          "El archivo es demasiado grande. Máximo 50MB permitidos."
        );
      }

      // Procesar archivo
      const model3DFile = await Model3DUtils.fileToModel3DFile(file);

      setModel3DFile(model3DFile);
      setSelectedFile(file);
      setMediaUrl(`/models/${file.name}`); // URL temporal para la base de datos
    } catch (err: any) {
      setFileError(err.message);
      setModel3DFile(null);
      setSelectedFile(null);
      setMediaUrl("");
    } finally {
      setFileProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setModel3DFile(null);
    setSelectedFile(null);
    setFileError(null);
    setMediaUrl("");
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    // Validar que si es tipo Model3D, debe tener un archivo
    if (type === "Model3D" && !model3DFile) {
      setError("Debes seleccionar un archivo 3D para este tipo de experiencia");
      return;
    }

    setLoading(true);

    try {
      const id = generateShortUUID();

      // Generate QR code URL for the experience
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://localhost:3000";
      const experienceUrl = `${baseUrl}/ar/${id}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        experienceUrl
      )}`;

      // Crear objeto de experiencia base
      const experienceData: any = {
        title,
        type,
        mediaUrl,
        thumbnailUrl,
        isActive,
        qrCodeUrl,
      };

      // Add 3D model data if necessary
      if (type === "Model3D" && model3DFile) {
        // model3DFile.data is already base64 encoded string, so use it directly
        experienceData.modelData = model3DFile.data;
        experienceData.modelFormat = model3DFile.format;
        experienceData.modelSize = model3DFile.size;
        experienceData.modelFileName = model3DFile.fileName;
      }

      const exp = await createExperience(experienceData);
      setCreatedId(id); // Usamos el ID generado localmente
    } catch (err: any) {
      setError(err.message || "Error creating experience");
    } finally {
      setLoading(false);
    }
  }

  if (createdId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass rounded-3xl border border-green-500/20 p-12 text-center animate-fadeIn">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
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
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Experience Created!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Your AR experience has been successfully created and is ready to
            use.
          </p>

          <div className="glass-darker rounded-2xl p-6 mb-8 text-left border border-white/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
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
              Experience Information
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Experience ID:
                </span>
                <div className="mt-1 p-3 glass rounded-lg border border-white/20">
                  <code className="text-blue-600 dark:text-blue-400 font-mono text-sm break-all">
                    {createdId}
                  </code>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  AR Experience URL:
                </span>
                <div className="mt-1 p-3 glass rounded-lg border border-white/20">
                  <code className="text-purple-600 dark:text-purple-400 font-mono text-sm break-all">
                    https://ar.tu-dominio.com/experience/{createdId}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/experiences"
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="flex items-center justify-center">
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
                View All Experiences
              </span>
            </Link>
            <button
              onClick={() => {
                setCreatedId(null);
                setTitle("");
                setMediaUrl("");
                setThumbnailUrl("");
                setType("Video");
                setIsActive(true);
                // Limpiar campos de modelo 3D
                setModel3DFile(null);
                setSelectedFile(null);
                setFileError(null);
                setFileProcessing(false);
              }}
              className="group glass px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-green-500/50"
            >
              <span className="flex items-center justify-center">
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
                Create Another Experience
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
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
          Create New Experience
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Complete the information to create a unique augmented reality
          experience
        </p>
      </div>

      {/* Formulario modernizado */}
      <div className="glass rounded-3xl border border-white/20 animate-slideIn">
        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {/* Title modernized */}
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

          {/* Type modernized */}
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

          {/* Media URL modernized */}
          <div className="space-y-2">
            <label
              htmlFor="mediaUrl"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Multimedia content URL
              {type === "Model3D" && model3DFile && (
                <span className="text-green-600 ml-2 text-xs">
                  (Auto-filled from uploaded file)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                id="mediaUrl"
                type="text"
                className={`w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  type === "Model3D" && model3DFile
                    ? "bg-gray-100/50 dark:bg-gray-800/50"
                    : ""
                }`}
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/my-content or /models/model.glb"
                required={type !== "Model3D" || !model3DFile}
                disabled={type === "Model3D" && !!model3DFile}
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
              {type === "Model3D" && model3DFile
                ? "URL is automatically set when you upload a 3D file"
                : "URL or path of the video, 3D model or content (e.g., https://example.com/model.glb or /models/model.glb)"}
            </p>
          </div>

          {/* 3D Model File Upload - Solo aparece cuando type es Model3D */}
          {type === "Model3D" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Upload 3D Model File
                </label>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear file
                  </button>
                )}
              </div>

              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                    : selectedFile
                    ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                    : fileError
                    ? "border-red-500 bg-red-50/50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                } glass`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  title="Upload 3D model file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleInputChange}
                  accept=".gltf,.glb,.fbx,.obj,.dae,.3ds,.blend,.ply,.stl,.x3d,.usd,.usda,.usdc"
                  disabled={fileProcessing}
                />

                <div className="text-center">
                  {fileProcessing ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-12 h-12 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        Processing file...
                      </p>
                    </div>
                  ) : selectedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                        File uploaded successfully!
                      </p>
                      <div className="glass-darker rounded-lg p-4 text-left w-full max-w-sm">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Name:
                            </span>
                            <span className="ml-2 text-gray-900 dark:text-white font-medium">
                              {selectedFile.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Size:
                            </span>
                            <span className="ml-2 text-gray-900 dark:text-white">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Format:
                            </span>
                            <span className="ml-2 text-gray-900 dark:text-white uppercase">
                              {model3DFile?.format}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Drag & drop your 3D model here
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        or click to browse files
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400 dark:text-gray-500">
                        <span className="px-2 py-1 glass rounded">GLTF</span>
                        <span className="px-2 py-1 glass rounded">GLB</span>
                        <span className="px-2 py-1 glass rounded">FBX</span>
                        <span className="px-2 py-1 glass rounded">OBJ</span>
                        <span className="px-2 py-1 glass rounded">DAE</span>
                        <span className="px-2 py-1 glass rounded">3DS</span>
                        <span className="px-2 py-1 glass rounded">+more</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error message */}
              {fileError && (
                <div className="glass rounded-lg border border-red-500/20 p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                        Error uploading file
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {fileError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* File requirements */}
              <div className="glass-darker rounded-lg p-4 border border-white/10">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  File Requirements:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Maximum file size: 50MB</li>
                  <li>
                    • Supported formats: GLTF, GLB, FBX, OBJ, DAE, 3DS, BLEND,
                    PLY, STL, X3D, USD
                  </li>
                  <li>• Recommended: GLB format for best performance</li>
                </ul>
              </div>
            </div>
          )}

          {/* URL Thumbnail modernizada */}
          <div className="space-y-2">
            <label
              htmlFor="thumbnailUrl"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Thumbnail image URL{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
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
              Image that will be shown as a preview of the experience
            </p>
          </div>

          {/* Active status modernized */}
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
                  Active experiences can be scanned and viewed por los usuarios
                  en tiempo real
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
                    Error creating experience
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button modernized */}
          <div className="flex justify-end pt-8 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="relative w-5 h-5 mr-3">
                      <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </div>
                    Creating experience...
                  </>
                ) : (
                  <>
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
                    Create Experience
                  </>
                )}
              </span>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
