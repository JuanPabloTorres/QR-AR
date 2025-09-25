import QRCode from "qrcode";

/**
 * Generate a QR code data URL for an AR experience
 * @param experienceId - The ID of the AR experience
 * @param baseUrl - The base URL of the application (defaults to current host in browser)
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateArExperienceQrCode(
  experienceId: string,
  baseUrl?: string
): Promise<string> {
  // Use window.location.origin in browser, or provided baseUrl
  const host =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const arUrl = `${host}/ar/${experienceId}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(arUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Download a QR code as a PNG file
 * @param experienceId - The ID of the AR experience
 * @param experienceTitle - The title of the experience (for filename)
 * @param baseUrl - Optional base URL
 */
export async function downloadArExperienceQrCode(
  experienceId: string,
  experienceTitle: string,
  baseUrl?: string
): Promise<void> {
  try {
    const qrCodeDataUrl = await generateArExperienceQrCode(
      experienceId,
      baseUrl
    );

    // Create a safe filename
    const safeTitle = experienceTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `qr_${safeTitle}_${experienceId.slice(0, 8)}.png`;

    // Create download link
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading QR code:", error);
    throw new Error("Failed to download QR code");
  }
}

/**
 * Generate QR code as a Canvas element (for custom rendering)
 * @param experienceId - The ID of the AR experience
 * @param baseUrl - Optional base URL
 * @returns Promise<HTMLCanvasElement>
 */
export async function generateArExperienceQrCodeCanvas(
  experienceId: string,
  baseUrl?: string
): Promise<HTMLCanvasElement> {
  const host =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const arUrl = `${host}/ar/${experienceId}`;

  try {
    const canvas = document.createElement("canvas");

    await QRCode.toCanvas(canvas, arUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    return canvas;
  } catch (error) {
    console.error("Error generating QR code canvas:", error);
    throw new Error("Failed to generate QR code canvas");
  }
}

/**
 * Get the AR URL for an experience
 * @param experienceId - The ID of the AR experience
 * @param baseUrl - Optional base URL
 * @returns string - The full AR URL
 */
export function getArExperienceUrl(
  experienceId: string,
  baseUrl?: string
): string {
  const host =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${host}/ar/${experienceId}`;
}
