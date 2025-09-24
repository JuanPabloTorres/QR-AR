"use client";

import { useEffect, useRef, useState } from "react";
import { Experience } from "@/types/experience";
import "./ar-styles.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function useMindArScripts() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Already loaded?
    if ((window as any).AFRAME && (window as any).MINDAR) {
      setReady(true);
      return;
    }

    const addScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(s);
      });

    const addCss = (href: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) return resolve();
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        l.onload = () => {
          console.log(`✅ CSS loaded: ${href}`);
          resolve();
        };
        l.onerror = (error) => {
          console.warn(`⚠️ Error loading CSS: ${href}`, error);
          reject(new Error(`Failed to load CSS: ${href}`));
        };
        document.head.appendChild(l);
      });

    (async () => {
      try {
        console.log("🚀 Cargando scripts AR...");

        // Cargar A-Frame
        await addScript("https://aframe.io/releases/1.4.2/aframe.min.js");

        // Esperar A-Frame
        let attempts = 0;
        while (!(window as any).AFRAME && attempts < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          attempts++;
        }

        if (!(window as any).AFRAME) {
          throw new Error("A-Frame no se cargó");
        }

        // CSS local ya incluido via import - no necesitamos CDN

        // Cargar MindAR
        await addScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
        );

        // Esperar MindAR
        attempts = 0;
        while (!(window as any).MINDAR && attempts < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          attempts++;
        }

        if (!(window as any).MINDAR) {
          throw new Error("MindAR failed to load");
        }

        console.log("✅ AR scripts loaded successfully");
        setReady(true);
      } catch (e) {
        console.error("❌ Error loading AR:", e);
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    })();
  }, []);

  return { ready, error };
}

function Status({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <div
      className={`fixed top-4 left-4 z-50 px-4 py-2 rounded-lg text-sm font-medium ${
        error
          ? "bg-red-100 text-red-800 border border-red-200"
          : "bg-black bg-opacity-75 text-white"
      }`}
    >
      {text}
    </div>
  );
}

export default function ArClient({ id }: { id: string }) {
  const { ready: scriptsReady, error: scriptsError } = useMindArScripts();
  const [status, setStatus] = useState("Inicializando...");
  const [error, setError] = useState<string>("");
  const [exp, setExp] = useState<Experience | null>(null);
  const [arStarted, setArStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<any>(null);

  // Test experiences
  const testExperiences: Record<string, Experience> = {
    "test-message": {
      id: "test-message",
      title: "¡Hola Mundo AR!",
      type: "Message",
      mediaUrl: "",
      isActive: true,
    },
    "test-video": {
      id: "test-video",
      title: "Video AR",
      type: "Video",
      mediaUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      isActive: true,
    },
    "test-model": {
      id: "test-model",
      title: "Astronauta 3D",
      type: "Model3D",
      mediaUrl:
        "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb",
      isActive: true,
    },
  };

  // Load experience
  useEffect(() => {
    if (!id) return;

    if (testExperiences[id]) {
      setExp(testExperiences[id]);
      setStatus("Experience loaded ✅");
      return;
    }

    // Try to load from API
    setStatus("Loading experience...");
    const url = `${API_BASE}/api/experiences/${encodeURIComponent(id)}`;

    fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        const data = await r.json();
        setExp(data);
        setStatus("Experience loaded from API ✅");
      })
      .catch((err) => {
        console.error("Error loading experience:", err);
        setError(`Could not load experience: ${err.message}`);
        setStatus("Error loading experience ❌");
      });
  }, [id]);

  // Inicializar AR cuando todo esté listo
  useEffect(() => {
    if (!scriptsReady || !exp || arStarted) return;

    const initAR = async () => {
      try {
        setStatus("Starting AR...");

        // Give time for DOM to update
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (sceneRef.current) {
          setStatus("AR ready! Point to marker 🎯");
          setArStarted(true);
        }
      } catch (e) {
        console.error("Error starting AR:", e);
        setError(
          `AR Error: ${e instanceof Error ? e.message : "Unknown error"}`
        );
      }
    };

    initAR();
  }, [scriptsReady, exp, arStarted]);

  // Manejar eventos de video
  useEffect(() => {
    if (exp?.type !== "Video" || !videoRef.current) return;

    const video = videoRef.current;

    const handleTargetFound = () => {
      video.play().catch(console.error);
    };

    const handleTargetLost = () => {
      video.pause();
    };

    // Escuchar eventos de MindAR
    if ((window as any).MINDAR) {
      document.addEventListener("targetFound", handleTargetFound);
      document.addEventListener("targetLost", handleTargetLost);
    }

    return () => {
      document.removeEventListener("targetFound", handleTargetFound);
      document.removeEventListener("targetLost", handleTargetLost);
    };
  }, [exp]);

  if (scriptsError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">
            Error cargando AR
          </h1>
          <p className="text-red-600 mb-4">{scriptsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">Error</h1>
          <p className="text-yellow-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <Status text={status} error={!!error} />

      {/* Botones de navegación flotantes */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => window.history.back()}
          className="bg-black bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-90 transition-all shadow-lg"
          title="Back"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-black bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-90 transition-all shadow-lg"
          title="Inicio"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
      </div>

      {!scriptsReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cargando AR...</p>
          </div>
        </div>
      )}

      {scriptsReady && exp && (
        <a-scene
          ref={sceneRef}
          mindar-image="imageTargetSrc: /targets/targets.mind; filterMinCF:0.0001; filterBeta:0.001;"
          vr-mode-ui="enabled: false"
          embedded
          renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true;"
          device-orientation-permission-ui="enabled: true"
          className="w-full h-full"
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

          {/* Luces */}
          <a-entity light="type: ambient; intensity: 0.6"></a-entity>
          <a-entity
            light="type: directional; intensity: 0.8"
            position="1 1 1"
          ></a-entity>

          {/* Target AR */}
          <a-entity mindar-image-target="targetIndex: 0">
            {exp.type === "Message" && (
              <a-text
                value={exp.title}
                color="#ffffff"
                align="center"
                position="0 0 0"
                scale="2 2 2"
                geometry="primitive: plane; width: auto"
                material="color: #1e40af; opacity: 0.8"
              />
            )}

            {exp.type === "Video" && (
              <>
                <a-assets>
                  <video
                    ref={videoRef}
                    id="arVideo"
                    src={exp.mediaUrl}
                    crossOrigin="anonymous"
                    preload="auto"
                    muted
                    playsInline
                    loop
                  />
                </a-assets>
                <a-video
                  src="#arVideo"
                  width="1.6"
                  height="0.9"
                  position="0 0 0"
                  rotation="0 0 0"
                />
              </>
            )}

            {exp.type === "Model3D" && (
              <a-entity
                gltf-model={exp.mediaUrl}
                position="0 0 0"
                rotation="0 0 0"
                scale="0.3 0.3 0.3"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
              />
            )}
          </a-entity>
        </a-scene>
      )}

      {/* Ayuda para el usuario */}
      {scriptsReady && exp && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="bg-black bg-opacity-75 text-white p-3 rounded-lg">
            <p className="text-sm">
              📱 Point the camera at the AR marker to see:{" "}
              <strong>{exp.title}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
