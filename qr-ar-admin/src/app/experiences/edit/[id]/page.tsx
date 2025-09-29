"use client";
import { useEffect, useState } from "react";
import { getExperienceById, updateExperience } from "@/lib/apiClient";
import { Experience } from "@/types/experience";
import { Model3DUtils } from "@/utils/Model3DUtils";
import { Model3DFile, getModelFormatFromExtension } from "@/types/experience";
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

  // Estados para archivos 3D
  const [model3DFile, setModel3DFile] = useState<Model3DFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [hasExistingModel3D, setHasExistingModel3D] = useState(false);

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const exp = await getExperienceById(id);

        if (!exp || !exp.data) {
          setError("Experience not found");
          return;
        }

        setExperience(exp.data);
        setTitle(exp.data?.title);
        setType(exp.data?.type);
        setMediaUrl(exp.data?.mediaUrl);
        setThumbnailUrl(exp.data?.thumbnailUrl || "");
        setIsActive(exp.data?.isActive);

        // Verificar si tiene datos de modelo 3D existente
        if (exp.data?.type === "Model3D" && exp.data?.modelData) {
          setHasExistingModel3D(true);
        }
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
      setHasExistingModel3D(false); // Ya no estamos usando el modelo existente
    } catch (err: any) {
      setFileError(err.message);
      setModel3DFile(null);
      setSelectedFile(null);
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
    // Restaurar URL original si había modelo existente
    if (hasExistingModel3D && experience) {
      setMediaUrl(experience.mediaUrl);
    } else {
      setMediaUrl("");
    }
  };

  const keepExistingModel = () => {
    setModel3DFile(null);
    setSelectedFile(null);
    setFileError(null);
    if (experience) {
      setMediaUrl(experience.mediaUrl);
    }
  };

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

      // Crear objeto de actualización base
      const updateData: any = {
        title,
        type,
        mediaUrl,
        thumbnailUrl,
        isActive,
        qrCodeUrl,
      };

      // Agregar datos del modelo 3D si hay un nuevo archivo
      if (type === "Model3D" && model3DFile) {
        updateData.modelData = model3DFile.data;
        updateData.modelFormat = model3DFile.format;
        updateData.modelSize = model3DFile.size;
        updateData.modelFileName = model3DFile.fileName;
      }

      await updateExperience(experience.id, updateData);

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
                {type === "Model3D" && (selectedFile || hasExistingModel3D) && (
                  <span className="text-green-600 ml-2 text-xs">
                    {selectedFile
                      ? "(Auto-filled from uploaded file)"
                      : "(Using existing model)"}
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  id="mediaUrl"
                  type="url"
                  className={`w-full px-4 py-4 glass-input rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    type === "Model3D" && selectedFile
                      ? "bg-gray-100/50 dark:bg-gray-800/50"
                      : ""
                  }`}
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mi-contenido"
                  disabled={type === "Model3D" && !!selectedFile}
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
                {type === "Model3D" && selectedFile
                  ? "URL is automatically set when you upload a new 3D file"
                  : "URL del video, modelo 3D o contenido que se mostrará en AR"}
              </p>
            </div>

            {/* 3D Model File Upload - Solo aparece cuando type es Model3D */}
            {type === "Model3D" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    3D Model File
                  </label>
                  <div className="flex space-x-2">
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={clearFile}
                        className="text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        Clear new file
                      </button>
                    )}
                    {hasExistingModel3D && !selectedFile && (
                      <span className="text-sm text-green-600">
                        Using existing model
                      </span>
                    )}
                  </div>
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
                    title="Upload new 3D model file"
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
                          New file uploaded successfully!
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
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
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
                    ) : hasExistingModel3D ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
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
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                          Using existing 3D model
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                          Upload a new file to replace it
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400 dark:text-gray-500">
                          <span className="px-2 py-1 glass rounded">GLTF</span>
                          <span className="px-2 py-1 glass rounded">GLB</span>
                          <span className="px-2 py-1 glass rounded">FBX</span>
                          <span className="px-2 py-1 glass rounded">OBJ</span>
                          <span className="px-2 py-1 glass rounded">+more</span>
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
                          Upload a new 3D model
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                          Drag & drop or click to browse files
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
                    <li>
                      • Upload a new file to replace the existing 3D model
                    </li>
                    <li>• Leave empty to keep the current model</li>
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
