"use client";

import { useState, useEffect } from "react";
import { Experience } from "@/types/experience";
import {
  generateArExperienceQrCode,
  downloadArExperienceQrCode,
  getArExperienceUrl,
} from "@/utils/qrCodeHelpers";

interface QrCodeManagerProps {
  experience: Experience;
  className?: string;
}

export default function QrCodeManager({
  experience,
  className = "",
}: QrCodeManagerProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate QR code on mount
  useEffect(() => {
    generateQrCode();
  }, [experience.id]);

  const generateQrCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const dataUrl = await generateArExperienceQrCode(experience.id);
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate QR code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadArExperienceQrCode(experience.id, experience.title);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to download QR code"
      );
    }
  };

  const arUrl = getArExperienceUrl(experience.id);

  if (loading) {
    return (
      <div className={`glass rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Generating QR code...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`glass rounded-2xl p-6 border border-red-500/20 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-500"
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
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
              QR Code Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
        <button
          onClick={generateQrCode}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              QR Code
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Scan to access AR experience
            </p>
          </div>
        </div>

        {/* QR Code Display */}
        {qrCodeDataUrl && (
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <img
                src={qrCodeDataUrl}
                alt={`QR Code for ${experience.title}`}
                className="w-48 h-48 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* AR URL */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            AR Experience URL
          </label>
          <div className="glass-darker rounded-lg p-3 border border-white/20">
            <code className="text-sm text-blue-600 dark:text-blue-400 font-mono break-all">
              {arUrl}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="group flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="flex items-center justify-center">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              Download PNG
            </span>
          </button>

          <button
            onClick={() => navigator.clipboard?.writeText(arUrl)}
            className="group flex-1 glass px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-blue-500/50"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy URL
            </span>
          </button>
        </div>

        {/* Usage Instructions */}
        <div className="glass-darker rounded-lg p-4 border border-white/10">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            📱 How to use
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Open the camera app on your mobile device</li>
            <li>• Point the camera at the QR code</li>
            <li>• Tap the notification to open the AR experience</li>
            <li>• Allow camera permissions when prompted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
