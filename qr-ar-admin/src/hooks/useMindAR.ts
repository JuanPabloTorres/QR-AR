"use client";

import { useEffect, useState } from "react";

export function useMindArScripts() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Already loaded?
    if (
      (window as unknown as Record<string, unknown>).AFRAME &&
      (window as unknown as Record<string, unknown>).MINDAR
    ) {
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
        console.log("🚀 Loading AR scripts...");

        // Local CSS first
        await addCss("/ar-styles.css");

        // A-Frame
        await addScript("https://aframe.io/releases/1.4.2/aframe.min.js");
        console.log("✅ A-Frame loaded");

        // MindAR
        await addScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
        );
        console.log("✅ MindAR loaded");

        // Verify everything loaded correctly
        await new Promise<void>((resolve) => {
          const checkLoaded = () => {
            if (
              (window as unknown as Record<string, unknown>).AFRAME &&
              (window as unknown as Record<string, unknown>).MINDAR
            ) {
              console.log("✅ AR scripts ready");
              resolve();
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        });

        setReady(true);
      } catch (err) {
        console.error("❌ Error loading AR scripts:", err);
        setError(String(err));
      }
    })();
  }, []);

  return { ready, error };
}
