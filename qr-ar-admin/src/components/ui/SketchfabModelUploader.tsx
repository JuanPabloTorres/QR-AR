"use client";

import { useState } from "react";
import {
  parseSketchfabEmbed,
  extractSketchfabId,
  MODEL_CONFIGS,
  type ModelSize,
} from "@/utils/sketchfabUtils";

interface SketchfabModelUploaderProps {
  onModelSelect: (modelData: {
    url: string;
    title: string;
    author?: string;
    modelId: string;
    size: ModelSize;
  }) => void;
  onClose?: () => void;
}

export default function SketchfabModelUploader({
  onModelSelect,
  onClose,
}: SketchfabModelUploaderProps) {
  const [embedInput, setEmbedInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<ModelSize>("medium");
  const [preview, setPreview] = useState<{
    title: string;
    author?: string;
    modelId: string;
  } | null>(null);

  const handleEmbedChange = (value: string) => {
    setEmbedInput(value);
    setError("");
    setPreview(null);

    if (value.trim()) {
      try {
        const modelData = parseSketchfabEmbed(value);
        if (modelData) {
          setPreview({
            title: modelData.title,
            author: modelData.author,
            modelId: modelData.id,
          });
        } else {
          // Intentar extraer solo el ID de una URL simple
          const modelId = extractSketchfabId(value);
          if (modelId) {
            setPreview({
              title: `Modelo 3D ${modelId}`,
              modelId,
            });
          }
        }
      } catch (err) {
        // Silenciar errores durante la escritura
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!embedInput.trim()) return;

    setIsProcessing(true);
    setError("");

    try {
      let modelData = parseSketchfabEmbed(embedInput);

      if (!modelData) {
        // Intentar extraer ID de URL simple
        const modelId = extractSketchfabId(embedInput);
        if (!modelId) {
          throw new Error("No se pudo extraer el ID del modelo de Sketchfab");
        }

        modelData = {
          id: modelId,
          title: `Modelo 3D ${modelId}`,
          embedUrl: `https://sketchfab.com/models/${modelId}/embed`,
          downloadUrl: `/models/${modelId}.glb`,
        };
      }

      // Verificar que el archivo local existe (opcional)
      // En producción podrías implementar la descarga automática aquí

      onModelSelect({
        url: modelData.downloadUrl || `/models/${modelData.id}.glb`,
        title: modelData.title,
        author: modelData.author,
        modelId: modelData.id,
        size: selectedSize,
      });

      // Limpiar formulario
      setEmbedInput("");
      setPreview(null);
    } catch (error) {
      console.error("Error procesando modelo de Sketchfab:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Agregar Modelo 3D de Sketchfab
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Cerrar"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código embed o URL de Sketchfab
          </label>
          <textarea
            value={embedInput}
            onChange={(e) => handleEmbedChange(e.target.value)}
            placeholder="Pega aquí el código embed de Sketchfab o la URL del modelo..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ejemplo:
            https://sketchfab.com/models/6e47b68d13a0413d8fd5fa248a639e8b/embed
          </p>
        </div>

        {preview && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Vista previa:</h3>
            <div className="space-y-1 text-sm">
              <div>
                <strong>Título:</strong> {preview.title}
              </div>
              {preview.author && (
                <div>
                  <strong>Autor:</strong> {preview.author}
                </div>
              )}
              <div>
                <strong>ID del modelo:</strong> {preview.modelId}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                El archivo se buscará en:{" "}
                <code>/models/{preview.modelId}.glb</code>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamaño del modelo en AR
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as ModelSize)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            title="Seleccionar tamaño del modelo"
            aria-label="Tamaño del modelo en AR"
          >
            <option value="small">Pequeño (0.3x)</option>
            <option value="medium">Mediano (0.5x)</option>
            <option value="large">Grande (1.0x)</option>
            <option value="character">Personaje (0.8x, ajustado en Y)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Escala: {JSON.stringify(MODEL_CONFIGS[selectedSize].scale)}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isProcessing || !embedInput.trim() || !preview}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isProcessing ? "Procesando..." : "Agregar Modelo 3D"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Instrucciones:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal ml-4">
          <li>Ve a Sketchfab.com y encuentra el modelo 3D que quieres usar</li>
          <li>Copia la URL del modelo o el código de embed</li>
          <li>
            Descarga el archivo GLB del modelo y colócalo en{" "}
            <code>/public/models/</code>
          </li>
          <li>
            El archivo debe tener el nombre: <code>{"{model-id}"}.glb</code>
          </li>
          <li>
            Pega la URL o código embed aquí y selecciona el tamaño deseado
          </li>
        </ol>
      </div>
    </div>
  );
}
