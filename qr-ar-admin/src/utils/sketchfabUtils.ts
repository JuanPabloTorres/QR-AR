/**
 * Utilidades para trabajar con modelos 3D de Sketchfab
 */

export interface SketchfabModel {
  id: string;
  title: string;
  embedUrl: string;
  downloadUrl?: string;
  author?: string;
}

/**
 * Extrae el ID del modelo de una URL de embed de Sketchfab
 * @param embedUrl URL de embed de Sketchfab
 * @returns ID del modelo o null si no es válida
 */
export function extractSketchfabId(embedUrl: string): string | null {
  // Buscar el patrón /models/{id}/embed
  const match = embedUrl.match(/\/models\/([a-f0-9-]+)\/embed/);
  return match ? match[1] : null;
}

/**
 * Extrae información de un iframe embed de Sketchfab
 * @param embedHtml HTML del iframe embed
 * @returns Información del modelo o null
 */
export function parseSketchfabEmbed(embedHtml: string): SketchfabModel | null {
  try {
    // Extraer URL del src
    const srcMatch = embedHtml.match(/src=["']([^"']+)["']/);
    if (!srcMatch) return null;

    const embedUrl = srcMatch[1];
    const modelId = extractSketchfabId(embedUrl);
    if (!modelId) return null;

    // Extraer título si está disponible
    const titleMatch = embedHtml.match(/title=["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : `Modelo 3D ${modelId}`;

    // Extraer autor del texto del embed
    const authorMatch = embedHtml.match(/by\s+<a[^>]*>([^<]+)<\/a>/);
    const author = authorMatch ? authorMatch[1] : undefined;

    return {
      id: modelId,
      title,
      embedUrl,
      author,
      downloadUrl: `/models/${modelId}.glb`, // Ruta local esperada
    };
  } catch (error) {
    console.error("Error parsing Sketchfab embed:", error);
    return null;
  }
}

/**
 * Valida si una URL es de Sketchfab
 * @param url URL a validar
 * @returns true si es una URL válida de Sketchfab
 */
export function isValidSketchfabUrl(url: string): boolean {
  return /sketchfab\.com\/models\/[a-f0-9-]+/i.test(url);
}

/**
 * Convierte diferentes formatos de URL de Sketchfab a URL de modelo
 * @param input URL o embed HTML de Sketchfab
 * @returns URL del modelo o null si no es válida
 */
export function normalizeSketchfabInput(input: string): string | null {
  // Si es HTML de embed
  if (input.includes("<iframe") || input.includes("sketchfab-embed-wrapper")) {
    const model = parseSketchfabEmbed(input);
    return model ? `https://sketchfab.com/models/${model.id}` : null;
  }

  // Si es una URL directa
  if (isValidSketchfabUrl(input)) {
    return input;
  }

  return null;
}

/**
 * Genera las URLs comunes para un modelo de Sketchfab
 * @param modelId ID del modelo
 * @returns Objeto con URLs relevantes
 */
export function getSketchfabUrls(modelId: string) {
  return {
    model: `https://sketchfab.com/models/${modelId}`,
    embed: `https://sketchfab.com/models/${modelId}/embed`,
    api: `https://api.sketchfab.com/v3/models/${modelId}`,
    thumbnail: `https://media.sketchfab.com/models/${modelId}/thumbnails/thumbnail.jpg`,
    // Rutas locales esperadas
    localGlb: `/models/${modelId}.glb`,
    localGltf: `/models/${modelId}.gltf`,
  };
}

/**
 * Configuraciones predefinidas para modelos 3D en AR
 */
export const MODEL_CONFIGS = {
  small: {
    scale: [0.3, 0.3, 0.3],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  medium: {
    scale: [0.5, 0.5, 0.5],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  large: {
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  character: {
    scale: [0.8, 0.8, 0.8],
    position: [0, -0.5, 0],
    rotation: [0, 0, 0],
  },
} as const;

export type ModelSize = keyof typeof MODEL_CONFIGS;
