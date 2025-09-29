"use client";

import React, { useEffect, useRef, useState } from "react";

import { Experience } from "@/types/experience";

import { ApiResponse } from "@/types/api";

function useMindArScripts() {
  const [ready, setReady] = useState(false);

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
        s.onload = () => {
          console.log(`✓ Script loaded: ${src}`);
          resolve();
        };
        s.onerror = (error) => {
          console.error(`✗ Error loading script: ${src}`, error);
          reject(new Error(`Failed to load script: ${src}`));
        };
        document.head.appendChild(s);
      });

    const addCss = (href: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) return resolve();
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        l.onload = () => {
          console.log(`✓ CSS loaded: ${href}`);
          resolve();
        };
        l.onerror = (error) => {
          console.warn(`⚠️ Error loading CSS: ${href}`, error);
          // Don't reject, just resolve to continue without blocking
          resolve();
        };
        document.head.appendChild(l);
      });

    (async () => {
      try {
        console.log("Starting MindAR scripts loading...");

        await addScript("https://aframe.io/releases/1.4.2/aframe.min.js");

        // Wait briefly for AFRAME to be available
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!(window as any).AFRAME) {
          throw new Error("AFRAME failed to load");
        }

        await addCss("/ar-styles.css");

        await addScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
        );

        // Wait briefly for MINDAR to be available
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!(window as any).MINDAR) {
          throw new Error("MINDAR failed to load");
        }

        console.log("✓ All MindAR scripts loaded successfully");
        setReady(true);
      } catch (e) {
        console.error("Error loading MindAR scripts:", e);
      }
    })();
  }, []);

  return ready;
}

function Status({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <div
      className={`fixed top-3 left-3 z-50 px-3 py-1 rounded-full text-sm ${
        error ? "bg-red-100 text-red-800" : "bg-black bg-opacity-65 text-white"
      }`}
    >
      {text}
    </div>
  );
}

export default function ArClient({ id }: { id: string }) {
  const scriptsReady = useMindArScripts();
  const [status, setStatus] = useState("Cargando…");
  const [error, setError] = useState<string>("");
  const [exp, setExp] = useState<Experience | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Helper function to convert base64 to blob URL
  const createBlobUrl = (base64Data: string, mimeType: string): string => {
    try {
      console.log(
        "[AR] Creating blob URL, data length:",
        base64Data.length,
        "MIME:",
        mimeType
      );

      // Clean base64 data - remove any data URL prefix if present
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
      console.log("[AR] Cleaned base64 length:", cleanBase64.length);

      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      console.log("[AR] Blob created:", {
        size: blob.size,
        type: blob.type,
        url: blobUrl,
      });

      return blobUrl;
    } catch (error) {
      console.error("[AR] Error creating blob URL:", error);
      return "";
    }
  };

  // Fetch experience
  useEffect(() => {
    if (!id) return;

    // Get experience from API only
    const url = `/api/experiences/${encodeURIComponent(id)}`;

    setStatus("Loading experience…");

    fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);

        const ct = r.headers.get("content-type") ?? "";

        if (!ct.includes("application/json"))
          throw new Error("Non-JSON response");

        return r.json();
      })
      .then((data: ApiResponse<Experience>) => {
        if (!data.data?.isActive) throw new Error("Inactive experience");

        setExp(data.data);

        console.log("Using API experience:", data);
      })
      .catch((e) => {
        console.error("Error loading experience from API:", e);
        setError(e?.message || String(e));
      });
  }, [id]);

  // Process experience data and create media URL
  useEffect(() => {
    if (!exp) {
      setMediaUrl("");
      return;
    }

    console.log("Processing experience data:", exp);
    console.log("Model data available:", !!exp.modelData);
    console.log("Media URL:", exp.mediaUrl);

    // If we have modelData (base64), convert it to blob URL
    if (exp.modelData) {
      let mimeType = "";

      // Determine MIME type based on experience type and format
      if (exp.type === "Model3D") {
        if (exp.modelFormat?.toLowerCase() === "glb") {
          mimeType = "model/gltf-binary";
        } else if (exp.modelFormat?.toLowerCase() === "gltf") {
          mimeType = "model/gltf+json";
        } else {
          mimeType = "application/octet-stream";
        }
      } else if (exp.type === "Image") {
        mimeType = "image/jpeg"; // Default, could be improved
      } else if (exp.type === "Video") {
        mimeType = "video/mp4"; // Default, could be improved
      }

      if (mimeType) {
        const blobUrl = createBlobUrl(exp.modelData, mimeType);
        if (blobUrl) {
          setMediaUrl(blobUrl);
          console.log("Created blob URL for AR:", blobUrl);
          console.log("Model format:", exp.modelFormat, "MIME type:", mimeType);
        } else {
          console.warn("Failed to create blob URL, falling back to mediaUrl");
          setMediaUrl(exp.mediaUrl || "");
        }
      } else {
        console.log("No MIME type determined, using mediaUrl:", exp.mediaUrl);
        setMediaUrl(exp.mediaUrl || "");
      }
    } else {
      // No base64 data, use regular mediaUrl
      console.log("No model data, using mediaUrl:", exp.mediaUrl);
      setMediaUrl(exp.mediaUrl || "");
    }

    // Cleanup function to revoke blob URLs
    return () => {
      if (mediaUrl && mediaUrl.startsWith("blob:")) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [exp]);

  // Autoplay helper
  useEffect(() => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const tryPlay = () => v.play().catch(() => {});
    document.body.addEventListener("click", tryPlay, { once: true });
    const t = setTimeout(tryPlay, 200);
    return () => {
      clearTimeout(t);
      document.body.removeEventListener("click", tryPlay);
    };
  }, [videoRef.current]);

  useEffect(() => {
    if (error) setStatus(`Error: ${error}`);
    else if (!scriptsReady) setStatus("Loading AR engine…");
    else if (!exp) setStatus("Waiting for data…");
    else setStatus("AR Ready - Move your device to explore!");
  }, [scriptsReady, exp, error]);

  // MindAR logs
  useEffect(() => {
    if (!scriptsReady) return;
    const scene = document.querySelector("a-scene");
    if (!scene) return;
    const onInit = (e: any) => console.log("[AR] scene loaded", e);
    const onCamInit = (e: any) => console.log("[AR] camera-init", e);
    const onCamError = (e: any) =>
      console.error("[AR] camera-error", e?.detail?.error);
    scene.addEventListener("loaded", onInit);
    scene.addEventListener("camera-init", onCamInit);
    scene.addEventListener("camera-error", onCamError);
    return () => {
      scene.removeEventListener("loaded", onInit);
      scene.removeEventListener("camera-init", onCamInit);
      scene.removeEventListener("camera-error", onCamError);
    };
  }, [scriptsReady]);

  // Manejo básico de modelos 3D
  useEffect(() => {
    if (!scriptsReady || !exp || exp.type !== "Model3D") return;

    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const onModelLoaded = (e: any) => {
      console.log("[AR] Model loaded successfully");
      setModelLoaded(true);
      setModelError("");
      setStatus("🎯 Modelo 3D cargado - ¡Explora en AR!");
    };

    const onModelError = (e: any) => {
      console.error("[AR] Model loading error", e);
      console.error("[AR] Model URL:", mediaUrl);
      console.error("[AR] Model URL type:", typeof mediaUrl);
      console.error(
        "[AR] Model URL starts with blob:",
        mediaUrl?.startsWith("blob:")
      );
      console.error("[AR] Experience data:", exp);
      console.error("[AR] Model format:", exp?.modelFormat);
      console.error("[AR] Model size:", exp?.modelSize);
      console.error("[AR] Error details:", e?.detail || e?.error || e);

      // Try to get more specific error information
      let errorMsg = "Unknown error";
      if (e?.detail?.message) {
        errorMsg = e.detail.message;
      } else if (e?.error?.message) {
        errorMsg = e.error.message;
      } else if (e?.message) {
        errorMsg = e.message;
      } else if (typeof e === "string") {
        errorMsg = e;
      }

      console.error("[AR] Final error message:", errorMsg);
      setModelError(`Error cargando modelo: ${errorMsg}`);
      setStatus("❌ Error cargando modelo 3D - Check console for details");
    };

    const model = scene.querySelector("[gltf-model]");
    if (model) {
      model.addEventListener("model-loaded", onModelLoaded);
      model.addEventListener("model-error", onModelError);
    }

    return () => {
      if (model) {
        model.removeEventListener("model-loaded", onModelLoaded);
        model.removeEventListener("model-error", onModelError);
      }
    };
  }, [scriptsReady, exp]);

  return (
    <>
      <Status text={status} error={!!error || !!modelError} />

      {!scriptsReady || !exp ? null : (
        <a-scene
          vr-mode-ui="enabled: false"
          embedded
          renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true"
          device-orientation-permission-ui="enabled: true"
          className="w-screen h-screen"
        >
          <a-camera
            position="0 1.6 0"
            look-controls="enabled: true"
            wasd-controls="enabled: true"
          ></a-camera>

          {/* Luz para modelos */}
          <a-entity light="type: ambient; intensity: 1.0"></a-entity>
          <a-entity
            light="type: directional; intensity: 1.0"
            position="2 4 5"
          ></a-entity>

          {/* Contenido AR directo - posicionado para mejor visualización */}
          <a-entity id="arContent" position="0 1.6 -2">
            {exp.type === "Video" && (
              <>
                <a-assets>
                  <video
                    id="dynVideo"
                    ref={videoRef}
                    src={exp.mediaUrl}
                    crossOrigin="anonymous"
                    preload="auto"
                    muted
                    playsInline
                    loop
                  />
                </a-assets>

                <a-video
                  src="#dynVideo"
                  width="3"
                  height="1.6875"
                  position="0 0 0"
                  rotation="0 0 0"
                />
                <a-text
                  value={`🎬 ${exp.title}`}
                  position="0 -1.2 0"
                  align="center"
                  color="#ffffff"
                  scale="1.2 1.2 1.2"
                ></a-text>
              </>
            )}

            {exp.type === "Image" && (
              <>
                <a-image
                  src={exp.mediaUrl}
                  width="3"
                  height="3"
                  position="0 0 0"
                  rotation="0 0 0"
                  transparent="true"
                ></a-image>
                <a-text
                  value={`🖼️ ${exp.title}`}
                  position="0 -2 0"
                  align="center"
                  color="#ffffff"
                  scale="1.2 1.2 1.2"
                ></a-text>
              </>
            )}

            {exp.type === "Model3D" && (
              <>
                {/* Verificar URL válida antes de cargar */}
                {mediaUrl && mediaUrl.trim() !== "" ? (
                  <>
                    {/* Debug info */}
                    <a-text
                      value={`Debug: ${
                        mediaUrl.startsWith("blob:")
                          ? "BLOB URL"
                          : "REGULAR URL"
                      }`}
                      position="0 2 0"
                      align="center"
                      color="#00ff00"
                      scale="0.5 0.5 0.5"
                    ></a-text>

                    {/* Modelo 3D con configuración específica */}
                    {console.log("[AR] Rendering model with URL:", mediaUrl)}
                    <a-entity
                      gltf-model={mediaUrl}
                      position="0 -0.2 0"
                      rotation="0 0 0"
                      scale="1.5 1.5 1.5"
                      animation="property: rotation; to: 0 360 0; loop: true; dur: 30000; easing: linear"
                      shadow="cast: true; receive: true"
                      className="clickable"
                      cursor="rayOrigin: mouse"
                    >
                      {/* Animaciones específicas para Ti-pche */}
                      <a-animation
                        attribute="scale"
                        from="1.5 1.5 1.5"
                        to="1.8 1.8 1.8"
                        begin="mouseenter"
                        dur="500"
                        direction="normal"
                      ></a-animation>
                      <a-animation
                        attribute="scale"
                        from="1.8 1.8 1.8"
                        to="1.5 1.5 1.5"
                        begin="mouseleave"
                        dur="500"
                        direction="normal"
                      ></a-animation>
                    </a-entity>

                    {/* Superficie para sombras */}
                    <a-plane
                      position="0 -0.8 0"
                      rotation="-90 0 0"
                      width="4"
                      height="4"
                      color="#333333"
                      opacity="0.2"
                      shadow="receive: true"
                      material="transparent: true"
                    ></a-plane>
                  </>
                ) : (
                  /* Mensaje de error si no hay URL válida */
                  <>
                    <a-text
                      value="❌ URL de modelo no válida"
                      position="0 0 0"
                      align="center"
                      color="#ff4444"
                      scale="1.2 1.2 1.2"
                    ></a-text>

                    {/* Cubo de fallback - usando createElement para evitar TypeScript */}
                    {React.createElement("a-box", {
                      position: "0 0 0",
                      rotation: "0 45 0",
                      scale: "0.5 0.5 0.5",
                      color: "#ff6600",
                      animation:
                        "property: rotation; to: 0 405 0; loop: true; dur: 5000",
                    })}
                  </>
                )}

                {/* Información del modelo */}
                <a-text
                  value={`� ${exp.title}`}
                  position="0 -1.5 0"
                  align="center"
                  color="#ffffff"
                  scale="1.2 1.2 1.2"
                  geometry="primitive: plane; width: auto"
                  material="color: #8B4513; opacity: 0.8"
                ></a-text>

                {/* Mensaje de error específico */}
                {modelError && (
                  <a-text
                    value={`⚠️ ${modelError}`}
                    position="0 -1.8 0"
                    align="center"
                    color="#ff6666"
                    scale="0.9 0.9 0.9"
                  ></a-text>
                )}
              </>
            )}

            {exp.type === "Message" && (
              <>
                <a-text
                  value={exp.title ?? "Mensaje AR"}
                  color="#ffffff"
                  align="center"
                  position="0 0.3 0"
                  rotation="0 0 0"
                  scale="2.5 2.5 2.5"
                  shader="msdf"
                  font="dejavu"
                ></a-text>
                <a-text
                  value="💫 ¡Experiencia AR Activada!"
                  color="#00ff88"
                  align="center"
                  position="0 -0.5 0"
                  rotation="0 0 0"
                  scale="1.3 1.3 1.3"
                ></a-text>
              </>
            )}
          </a-entity>
        </a-scene>
      )}
    </>
  );
}
