"use client";
import { useEffect, useRef, useState } from "react";

interface Model3DViewerProps {
  modelData?: string; // Base64 encoded model data from backend
  modelFormat?: string;
  className?: string;
  experienceId?: string; // For fallback API endpoint
  mediaUrl?: string; // Direct URL to model file (alternative to base64)
}

export default function Model3DViewer({
  modelData,
  modelFormat = "gltf",
  className = "",
  experienceId,
  mediaUrl,
}: Model3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState("Initializing...");
  const [mounted, setMounted] = useState(false);

  // Debug: Log all props when component receives them
  useEffect(() => {
    console.log("[Model3DViewer] Props received:", {
      modelData: modelData
        ? `${typeof modelData} (${modelData.length} chars)`
        : "none",
      modelFormat,
      experienceId,
      mediaUrl,
      hasModelData: !!modelData,
      modelDataStart: modelData?.substring(0, 50) + "...",
    });
  }, [modelData, modelFormat, experienceId, mediaUrl]);

  // Track mount state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let scene: any = null;
    let camera: any = null;
    let renderer: any = null;
    let animationId: number;
    let model: any = null;

    const initViewer = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo("Loading Three.js...");

        // Wait for container with retry logic - más tiempo de espera
        let retries = 0;
        const maxRetries = 20;
        while (!mountRef.current && retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          retries++;
        }

        if (!mountRef.current) {
          console.warn("Container not found, component might be unmounting");
          setLoading(false);
          setError("No se pudo inicializar el visor 3D");
          return;
        }

        const container = mountRef.current;
        setDebugInfo("Setting up 3D scene...");

        // Dynamic imports to avoid SSR issues
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );

        // Clear container
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        // Setup scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2a2a2a);

        // Setup camera
        const width = container.clientWidth || 400;
        const height = container.clientHeight || 300;

        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);

        // Setup renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(renderer.domElement);

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        setDebugInfo("Loading model...");

        // Load model
        const loader = new GLTFLoader();

        if (
          mediaUrl &&
          (mediaUrl.startsWith("http") || mediaUrl.startsWith("/"))
        ) {
          // Load from URL
          setDebugInfo(`Loading from URL: ${mediaUrl}`);
          loader.load(
            mediaUrl,
            (gltf) => handleModelLoad(gltf),
            (progress) => {
              if (progress.lengthComputable) {
                const percent = Math.round(
                  (progress.loaded / progress.total) * 100
                );
                setDebugInfo(`Loading... ${percent}%`);
              }
            },
            (loadError) => {
              console.error("Error loading model from URL:", loadError);
              setError(
                `Failed to load model: ${
                  loadError instanceof Error
                    ? loadError.message
                    : String(loadError)
                }`
              );
              setLoading(false);
            }
          );
        } else if (modelData && modelData.trim()) {
          // Load from base64 data
          setDebugInfo("Processing base64 data...");

          try {
            // Clean and validate base64
            const cleanBase64 = modelData.trim().replace(/\s/g, "");

            console.log("[Model3DViewer] Processing base64:", {
              originalLength: modelData.length,
              cleanedLength: cleanBase64.length,
              firstChars: cleanBase64.substring(0, 50),
            });

            const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;

            if (!base64Pattern.test(cleanBase64)) {
              throw new Error(
                `Invalid base64 format. First 100 chars: ${cleanBase64.substring(
                  0,
                  100
                )}`
              );
            }

            // Decode base64
            const binaryString = atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            const arrayBuffer = bytes.buffer;

            // Check file header
            const fileHeader = new Uint8Array(arrayBuffer.slice(0, 4));
            const headerString = String.fromCharCode(...fileHeader);

            console.log("[Model3DViewer] File info:", {
              base64Length: cleanBase64.length,
              decodedSize: bytes.length,
              header: headerString,
            });

            setDebugInfo(`Parsing model (${bytes.length} bytes)...`);

            loader.parse(
              arrayBuffer,
              "",
              (gltf) => handleModelLoad(gltf),
              (parseError) => {
                console.error("Error parsing model:", parseError);
                setError(
                  `Failed to parse model: ${
                    parseError instanceof Error
                      ? parseError.message
                      : String(parseError)
                  }`
                );
                setLoading(false);
              }
            );
          } catch (decodeError) {
            console.error("Error decoding base64:", decodeError);
            setError(
              `Failed to decode model data: ${
                decodeError instanceof Error
                  ? decodeError.message
                  : String(decodeError)
              }`
            );
            setLoading(false);
          }
        } else if (experienceId) {
          // Load from API endpoint
          setDebugInfo("Loading from API...");

          try {
            console.log(
              `[Model3DViewer] Fetching model for experience: ${experienceId}`
            );

            const response = await fetch(
              `/api/experiences/${experienceId}/model`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                `[Model3DViewer] API error: ${response.status} - ${errorText}`
              );
              throw new Error(
                `API error: ${response.status} - ${response.statusText}`
              );
            }

            const contentType = response.headers.get("content-type");
            console.log(
              `[Model3DViewer] Received content-type: ${contentType}`
            );

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            console.log(
              `[Model3DViewer] Model downloaded: ${arrayBuffer.byteLength} bytes`
            );
            setDebugInfo(
              `Parsing API model (${arrayBuffer.byteLength} bytes)...`
            );

            loader.parse(
              arrayBuffer,
              "",
              (gltf) => handleModelLoad(gltf),
              (apiError) => {
                console.error("Error parsing API model:", apiError);
                setError(
                  `Failed to parse API model: ${
                    apiError instanceof Error
                      ? apiError.message
                      : String(apiError)
                  }`
                );
                setLoading(false);
              }
            );
          } catch (fetchError) {
            console.error("Error fetching from API:", fetchError);
            setError(
              `Failed to fetch from API: ${
                fetchError instanceof Error
                  ? fetchError.message
                  : String(fetchError)
              }`
            );
            setLoading(false);
          }
        } else {
          setError("No model data, URL, or experience ID provided");
          setLoading(false);
          return;
        }

        function handleModelLoad(gltf: any) {
          if (!mounted) return;

          console.log("[Model3DViewer] Model loaded successfully");

          model = gltf.scene;

          // Center and scale model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          model.position.sub(center);

          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 2 / maxDim;
            model.scale.setScalar(scale);
          }

          scene.add(model);
          setLoading(false);
          setDebugInfo(`Model loaded (${gltf.scene.children.length} objects)`);

          // Start animation loop
          const animate = () => {
            if (!mounted) return;

            animationId = requestAnimationFrame(animate);

            if (model) {
              model.rotation.y += 0.005;
            }

            if (renderer && scene && camera) {
              renderer.render(scene, camera);
            }
          };

          animate();
        }

        // Handle resize
        const handleResize = () => {
          if (!container || !renderer || !camera) return;

          const width = container.clientWidth;
          const height = container.clientHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener("resize", handleResize);
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          if (renderer) {
            renderer.dispose();
          }
          if (scene) {
            scene.clear();
          }
        };
      } catch (initError) {
        console.error("Viewer initialization error:", initError);
        setError(
          `Initialization failed: ${
            initError instanceof Error ? initError.message : String(initError)
          }`
        );
        setLoading(false);
      }
    };

    const cleanupPromise = initViewer();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.clear();
      }
    };
  }, [mounted, modelData, modelFormat, mediaUrl, experienceId]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Loading 3D Model...
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {debugInfo}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <div>
              Model Data:{" "}
              {modelData ? `✓ (${modelData.length} chars)` : "✗ None"}
            </div>
            <div>Media URL: {mediaUrl ? "✓ Present" : "✗ None"}</div>
            <div>Experience ID: {experienceId || "✗ None"}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900 rounded-lg border-2 border-red-200 dark:border-red-700 ${className}`}
      >
        <div className="text-red-600 dark:text-red-400 text-3xl mb-2">⚠️</div>
        <p className="text-sm text-red-700 dark:text-red-300 mb-2 text-center px-4">
          {error}
        </p>
        <p className="text-xs text-red-500 dark:text-red-400 text-center px-4">
          Debug: {debugInfo}
        </p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            setDebugInfo("Retrying...");
          }}
          className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
        >
          🔄 Retry
        </button>
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <div>
            Model Data: {modelData ? `✓ (${modelData.length} chars)` : "✗ None"}
          </div>
          <div>Media URL: {mediaUrl ? "✓ Present" : "✗ None"}</div>
          <div>Experience ID: {experienceId || "✗ None"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-64 min-h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
      />
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
        🎯 3D Model
      </div>
      {debugInfo && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 bg-opacity-80 text-white text-xs rounded">
          {debugInfo}
        </div>
      )}
    </div>
  );
}
