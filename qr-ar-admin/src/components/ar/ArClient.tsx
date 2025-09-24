"use client";

import { useEffect, useRef, useState } from "react";
import { Experience } from "@/types/experience";
import { useMindArScripts } from "@/hooks/useMindAR";
import { getTestExperience } from "@/data/testExperiences";

interface ArClientProps {
  id: string;
}

export default function ArClient({ id }: ArClientProps) {
  const { ready: scriptsReady, error: scriptsError } = useMindArScripts();
  const [status, setStatus] = useState("Inicializando...");
  const [error, setError] = useState<string>("");
  const [exp, setExp] = useState<Experience | null>(null);

  // Load experience
  useEffect(() => {
    if (!id) return;

    const testExp = getTestExperience(id);
    if (testExp) {
      setExp(testExp);
      setStatus("Experience loaded ✅");
      return;
    }

    setError("Experience not found");
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
