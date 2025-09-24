"use client";

import { useEffect, useRef, useState } from "react";

import { Experience } from "@/types/experience";

// type Experience = {
//   id: string;
//   title: string;
//   type: "Video" | "Model3D" | "Message";
//   mediaUrl: string;
//   thumbnailUrl?: string;
//   isActive: boolean;
// };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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
          console.error(`✗ Error loading CSS: ${href}`, error);
          reject(new Error(`Failed to load CSS: ${href}`));
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

        await addCss(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.css"
        );

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const targetSrc = "/targets/targets.mind";

  // Hardcoded test experiences
  const testExperiences: Record<string, Experience> = {
    "test-message": {
      id: "test-message",
      title: "¡Hola AR!",
      type: "Message",
      mediaUrl: "",
      isActive: true,
    },
    "test-video": {
      id: "test-video",
      title: "Video de prueba",
      type: "Video",
      mediaUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      isActive: true,
    },
    "test-model": {
      id: "test-model",
      title: "Modelo 3D de prueba",
      type: "Model3D",
      mediaUrl:
        "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb",
      isActive: true,
    },
  };

  // Fetch experience
  useEffect(() => {
    if (!id) return;

    // First check if it's a test experience
    if (testExperiences[id]) {
      setExp(testExperiences[id]);
      setStatus("Test experience loaded ✓");
      return;
    }

    // If not a test experience, try to load from API
    const url = `${API_BASE.replace(
      /\/$/,
      ""
    )}/api/experiences/${encodeURIComponent(id)}`;
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
      })
      .catch((e) => {
        console.error(e);
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
    else setStatus("Point to your target image");
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

  return (
    <>
      <Status text={status} error={!!error} />

      {!scriptsReady || !exp ? null : (
        <a-scene
          mindar-image={`imageTargetSrc: ${targetSrc}; filterMinCF:0.0001; filterBeta:0.001;`}
          vr-mode-ui="enabled: false"
          embedded
          renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true"
          device-orientation-permission-ui="enabled: true"
          className="w-screen h-screen"
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

          {/* Luz para modelos */}
          <a-entity light="type: ambient; intensity: 0.8"></a-entity>
          <a-entity
            light="type: directional; intensity: 0.7"
            position="1 1 1"
          ></a-entity>

          {/* Target #0 */}
          <a-entity mindar-image-target="targetIndex: 0">
            <a-entity id="targetRoot">
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
                    width="1" // ajusta al tamaño visual de tu target
                    height="0.5625" // 16:9
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
                  scale="0.25 0.25 0.25"
                />
              )}

              {exp.type === "Message" && (
                <a-text
                  value={exp.title ?? "Mensaje"}
                  color="#ffffff"
                  align="center"
                  position="0 0 0"
                  rotation="0 0 0"
                />
              )}
            </a-entity>
          </a-entity>
        </a-scene>
      )}
    </>
  );
}
