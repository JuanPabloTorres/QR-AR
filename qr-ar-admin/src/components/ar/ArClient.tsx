"use client";

import { useEffect, useRef, useState } from "react";
import { Experience } from "@/types/experience";
import { useMindArScripts } from "@/hooks/useMindAR";

interface ArClientProps {
  id: string;
}

export default function ArClient({ id }: ArClientProps) {
  const { ready: scriptsReady, error: scriptsError } = useMindArScripts();
  const [status, setStatus] = useState("Inicializando AR...");
  const [error, setError] = useState<string>("");
  const [exp, setExp] = useState<Experience | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [awaitingPermission, setAwaitingPermission] = useState(false);
  const arSceneRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile and has camera
  useEffect(() => {
    const checkDeviceCapabilities = async () => {
      // Check if mobile
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        );
      setIsMobileDevice(mobile);

      // Check for camera
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(
          (device) => device.kind === "videoinput"
        );
        setHasCamera(hasVideoDevice);
      } catch (err) {
        console.warn("Could not enumerate devices:", err);
        setHasCamera(false);
      }
    };

    checkDeviceCapabilities();
  }, []);
  useEffect(() => {
    if (!id) return;

    // Load experience from API only
    const loadExperience = async () => {
      try {
        setStatus("Loading experience...");
        const response = await fetch(
          `/api/experiences/${encodeURIComponent(id)}`,
          {
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data: Experience = await response.json();

        if (!data.isActive) {
          throw new Error("Experience is not active");
        }

        setExp(data);
        setStatus("Experience loaded ✅");
        console.log("Using API experience:", data);
      } catch (err) {
        console.error("Error loading experience:", err);
        setError(err instanceof Error ? err.message : String(err));
        setStatus("Error loading experience ❌");
      }
    };

    loadExperience();
  }, [id]);

  // Mostrar errores
  if (scriptsError || error) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center flex-col p-4">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-center max-w-md">{scriptsError || error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Loading
  if (!scriptsReady || !exp) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-lg">{status}</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative bg-black text-white flex items-center justify-center flex-col">
      <div className="text-6xl mb-4">🎯</div>
      <h1 className="text-2xl font-bold mb-4">{exp.title}</h1>
      <p className="text-center max-w-md mb-6">
        AR Experience type: <strong>{exp.type}</strong>
      </p>
      <p className="text-sm text-gray-400 text-center max-w-md">
        This is a simplified version of the AR client. A-Frame scripts and
        MindAR would load here to display real AR content.
      </p>

      <div className="mt-8">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
