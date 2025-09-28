import {
  Model3DFile,
  SUPPORTED_3D_FORMATS,
  getModelFormatFromExtension,
} from "@/types/experience";

// Utilidades para manejar archivos 3D
export class Model3DUtils {
  // Convertir File a Model3DFile
  static async fileToModel3DFile(file: File): Promise<Model3DFile> {
    const format = getModelFormatFromExtension(file.name);
    if (!format) {
      throw new Error(`Formato de archivo no soportado: ${file.name}`);
    }

    const arrayBuffer = await file.arrayBuffer();

    return {
      data: new Uint8Array(arrayBuffer),
      format,
      size: file.size,
      fileName: file.name,
      mimeType: SUPPORTED_3D_FORMATS[format],
    };
  }

  // Validar tamaño máximo (ej: 50MB)
  static validateFileSize(size: number, maxSizeMB: number = 50): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }

  // Crear URL blob temporal para preview
  static createBlobUrl(
    data: Uint8Array | ArrayBuffer | Buffer,
    mimeType: string
  ): string {
    let blobData: ArrayBuffer;

    if (data instanceof ArrayBuffer) {
      // Caso más directo: ya es ArrayBuffer
      blobData = data;
    } else if (data instanceof Uint8Array) {
      // Verificar si tiene un buffer válido y convertir
      if (data.buffer instanceof ArrayBuffer) {
        // Crear una copia del buffer para evitar problemas de offset
        blobData = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength
        );
      } else {
        // Fallback: crear nuevo ArrayBuffer manualmente
        const newBuffer = new ArrayBuffer(data.length);
        const newView = new Uint8Array(newBuffer);
        newView.set(data);
        blobData = newBuffer;
      }
    } else {
      // Manejar cualquier otro tipo (incluyendo Buffer de Node.js)
      // Verificar si tiene propiedades tipo Buffer
      const bufferLike = data as any;
      if (
        bufferLike &&
        typeof bufferLike.length === "number" &&
        bufferLike[0] !== undefined
      ) {
        const bufferLength = bufferLike.length;
        blobData = new ArrayBuffer(bufferLength);
        const view = new Uint8Array(blobData);

        // Copiar byte por byte
        for (let i = 0; i < bufferLength; i++) {
          view[i] = bufferLike[i];
        }
      } else {
        throw new Error(
          `Tipo de datos no soportado para crear Blob URL: ${typeof data}`
        );
      }
    }

    const blob = new Blob([blobData], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  // Limpiar URL blob
  static revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  // Inspeccionar propiedades de los datos
  static inspectData(data: Uint8Array | ArrayBuffer | Buffer) {
    const result: any = {
      type: typeof data,
      constructor: data.constructor.name,
      isArrayBuffer: data instanceof ArrayBuffer,
      isUint8Array: data instanceof Uint8Array,
      isBuffer:
        typeof Buffer !== "undefined" &&
        Buffer.isBuffer &&
        Buffer.isBuffer(data),
    };

    if (data instanceof ArrayBuffer) {
      result.byteLength = data.byteLength;
      result.detached = data.detached;
      result.resizable = data.resizable;
    } else if (data instanceof Uint8Array) {
      result.length = data.length;
      result.byteLength = data.byteLength;
      result.byteOffset = data.byteOffset;
      result.buffer = {
        constructor: data.buffer.constructor.name,
        byteLength: data.buffer.byteLength,
        isArrayBuffer: data.buffer instanceof ArrayBuffer,
      };
    } else {
      // Para Buffer u otros tipos
      const bufferLike = data as any;
      result.length = bufferLike.length || "undefined";
      result.properties = Object.getOwnPropertyNames(bufferLike).slice(0, 10); // Primeras 10 propiedades
    }

    return result;
  }

  // Normalizar datos a Uint8Array para almacenamiento consistente
  static normalizeToUint8Array(
    data: Uint8Array | ArrayBuffer | Buffer
  ): Uint8Array {
    if (data instanceof Uint8Array) {
      return data;
    } else if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    } else {
      // Manejar Buffer u otros tipos
      const bufferLike = data as any;
      if (bufferLike && typeof bufferLike.length === "number") {
        const result = new Uint8Array(bufferLike.length);
        for (let i = 0; i < bufferLike.length; i++) {
          result[i] = bufferLike[i];
        }
        return result;
      } else {
        throw new Error(
          `No se puede normalizar el tipo de datos: ${typeof data}`
        );
      }
    }
  }

  // Obtener información detallada del archivo 3D
  static getDetailedFileInfo(
    data: Uint8Array | ArrayBuffer | Buffer,
    fileName: string
  ) {
    const format = getModelFormatFromExtension(fileName);
    const normalizedData = this.normalizeToUint8Array(data);
    const dataInfo = this.inspectData(data);

    return {
      fileName,
      format,
      isSupported: format !== null,
      mimeType: format
        ? SUPPORTED_3D_FORMATS[format]
        : "application/octet-stream",
      size: normalizedData.length,
      originalDataInfo: dataInfo,
      normalizedSize: normalizedData.length,
      // Información adicional sobre el formato
      formatInfo: format
        ? {
            name: format.toUpperCase(),
            isBinary: [
              "glb",
              "fbx",
              "3ds",
              "blend",
              "ply",
              "stl",
              "usdc",
            ].includes(format),
            isText: ["gltf", "obj", "dae", "x3d", "usda"].includes(format),
          }
        : null,
    };
  }
}
