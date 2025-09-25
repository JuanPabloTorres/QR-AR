"use client";

import { useEffect, useRef, useState } from "react";

import { Experience } from "@/types/experience";

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

        // Wait for AFRAME to be available
        let attempts = 0;
        while (!(window as any).AFRAME && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!(window as any).AFRAME) {
          throw new Error("AFRAME failed to load correctly");
        }

        await addCss("/ar-styles.css");

        await addScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
        );

        // Wait for MINDAR to be available
        attempts = 0;
        while (!(window as any).MINDAR && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!(window as any).MINDAR) {
          throw new Error("MINDAR failed to load correctly");
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      .then((data: Experience) => {
        if (!data.isActive) throw new Error("Inactive experience");
        setExp(data);
        console.log("Using API experience:", data);
      })
      .catch((e) => {
        console.error("Error loading experience from API:", e);
        setError(e?.message || String(e));
      });
  }, [id]);

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

  // Manejo específico de modelos 3D
  useEffect(() => {
    if (!scriptsReady || !exp || exp.type !== "Model3D") return;

    const scene = document.querySelector("a-scene");
    if (!scene) return;

    // Interceptar y silenciar errores de THREE.js de NaN
    const originalConsoleError = console.error;
    const filteredConsoleError = (...args: any[]) => {
      const message = args.join(" ");
      // Filtrar errores conocidos de geometría que no afectan la funcionalidad
      if (
        message.includes("computeBoundingSphere") &&
        message.includes("NaN")
      ) {
        console.warn(
          "[AR] Geometría con valores NaN detectada, pero el modelo puede seguir funcionando:",
          ...args
        );
        return;
      }
      originalConsoleError.apply(console, args);
    };
    console.error = filteredConsoleError;

    const onModelLoaded = (e: any) => {
      console.log("[AR] Model loaded successfully", e);

      try {
        // Validar el modelo cargado de manera más tolerante
        const model = e.target;
        const object3D = model.getObject3D("mesh");

        if (object3D) {
          // Reparar geometría si es posible
          object3D.traverse((child: any) => {
            if (child.geometry) {
              try {
                // Intentar computar bounding box y sphere de manera segura
                if (
                  child.geometry.attributes &&
                  child.geometry.attributes.position
                ) {
                  const positions = child.geometry.attributes.position.array;

                  // Verificar si hay valores válidos
                  let hasValidPositions = false;
                  for (let i = 0; i < positions.length; i += 3) {
                    if (
                      isFinite(positions[i]) &&
                      isFinite(positions[i + 1]) &&
                      isFinite(positions[i + 2])
                    ) {
                      hasValidPositions = true;
                      break;
                    }
                  }

                  if (hasValidPositions) {
                    child.geometry.computeBoundingBox();
                    child.geometry.computeBoundingSphere();
                  } else {
                    console.warn(
                      "[AR] Geometría con posiciones inválidas, usando valores por defecto"
                    );
                    // Crear bounding sphere por defecto
                    child.geometry.boundingSphere = {
                      center: { x: 0, y: 0, z: 0 },
                      radius: 1,
                    };
                  }
                }
              } catch (geomError) {
                console.warn(
                  "[AR] Error al procesar geometría, continuando:",
                  geomError
                );
              }
            }
          });
        }

        setModelLoaded(true);
        setModelError("");
        setStatus("🎯 Ti-pche cargado - ¡Explora en AR!");

        // Ocultar indicador de carga
        const loadingIndicator = scene.querySelector("#loadingIndicator");
        if (loadingIndicator) {
          loadingIndicator.setAttribute("visible", "false");
        }
      } catch (error) {
        console.warn(
          "[AR] Error durante la validación, pero el modelo puede funcionar:",
          error
        );
        // No marcar como error crítico si el modelo se cargó visualmente
        setModelLoaded(true);
        setStatus("🎯 Ti-pche cargado (con advertencias)");

        const loadingIndicator = scene.querySelector("#loadingIndicator");
        if (loadingIndicator) {
          loadingIndicator.setAttribute("visible", "false");
        }
      }
    };

    const onModelError = (e: any) => {
      console.error("[AR] Model loading error", e);
      setModelError("Error cargando el modelo Ti-pche");
      setStatus("❌ Error cargando modelo Ti-pche");

      // Ocultar indicador de carga
      const loadingIndicator = scene.querySelector("#loadingIndicator");
      if (loadingIndicator) {
        loadingIndicator.setAttribute("visible", "false");
      }
    };

    // Mostrar indicador de carga para modelos
    setTimeout(() => {
      const loadingIndicator = scene.querySelector("#loadingIndicator");
      if (loadingIndicator && !modelLoaded) {
        loadingIndicator.setAttribute("visible", "true");
      }
    }, 1000);

    const model = scene.querySelector("[gltf-model]");
    if (model) {
      model.addEventListener("model-loaded", onModelLoaded);
      model.addEventListener("model-error", onModelError);
    }

    return () => {
      // Restaurar console.error original
      console.error = originalConsoleError;

      if (model) {
        model.removeEventListener("model-loaded", onModelLoaded);
        model.removeEventListener("model-error", onModelError);
      }
    };
  }, [scriptsReady, exp, modelLoaded]);

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
                {exp.mediaUrl && exp.mediaUrl.trim() !== "" ? (
                  <>
                    {/* Modelo Ti-pche con configuración específica */}
                    <a-entity
                      gltf-model={exp.mediaUrl}
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
                  <a-text
                    value="❌ URL de modelo no válida"
                    position="0 0 0"
                    align="center"
                    color="#ff4444"
                    scale="1.2 1.2 1.2"
                  ></a-text>
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

                {/* Controles de interacción específicos para Ti-pche */}
                <a-text
                  value="🏺 Explora la vasija Ti-pche • � Toca para ver detalles"
                  position="0 -2.2 0"
                  align="center"
                  color="#DAA520"
                  scale="0.8 0.8 0.8"
                ></a-text>

                {/* Indicador de carga mejorado */}
                <a-ring
                  position="0 1.5 0"
                  radius-inner="0.1"
                  radius-outer="0.15"
                  color="#ffaa00"
                  animation="property: rotation; to: 0 0 360; loop: true; dur: 1000"
                  visible="false"
                  id="loadingIndicator"
                ></a-ring>

                {/* Información de debug (solo en desarrollo) */}
                {process.env.NODE_ENV === "development" && (
                  <a-text
                    value={`Debug: ${exp.mediaUrl}`}
                    position="0 -2.8 0"
                    align="center"
                    color="#666666"
                    scale="0.6 0.6 0.6"
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
