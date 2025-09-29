import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5028";

// ✅ CONFIGURAR LÍMITES PARA ARCHIVOS 3D
export const maxDuration = 60; // 60 segundos para archivos grandes
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/api/experiences${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(`Proxying GET request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `API responded with status: ${response.status} ${response.statusText}`
      );

      // Try to get error details
      let errorDetails = "";
      try {
        const errorText = await response.text();
        errorDetails = errorText;
        console.error(`API Error Body: ${errorText}`);
      } catch (e) {
        console.error("Could not read error response body");
      }

      return NextResponse.json(
        {
          error: `API Error: ${response.status} ${response.statusText}`,
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to connect to API server. Make sure the API server is running on port 5028.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting POST request processing...");

    // ✅ Verificar tamaño del body antes de procesar
    const contentLength = request.headers.get("content-length");
    console.log(`Content-Length: ${contentLength} bytes`);

    if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
      // 100MB
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB." },
        { status: 413 }
      );
    }

    const body = await request.json();
    const apiUrl = `${API_BASE_URL}/api/experiences`;

    console.log(`Proxying POST request to: ${apiUrl}`);
    console.log(`Body type: ${body.type}`);
    console.log(`Has ModelData: ${!!body.modelData}`);
    if (body.modelData) {
      console.log(`ModelData length: ${body.modelData.length} bytes`);
      console.log(`ModelFormat: ${body.modelFormat}`);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // ✅ Agregar timeout más largo para archivos grandes
        Connection: "keep-alive",
      },
      body: JSON.stringify(body),
      // ✅ Timeout más largo para archivos grandes
      signal: AbortSignal.timeout(60000), // 60 segundos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API responded with status: ${response.status} ${response.statusText}`
      );
      console.error(`Error response body: ${errorText}`);

      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Experience created successfully");
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Proxy Error:", error);

    // ✅ Manejar diferentes tipos de errores
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout. File might be too large." },
        { status: 408 }
      );
    }

    if (error.message?.includes("body exceeds")) {
      return NextResponse.json(
        { error: "File too large for processing" },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { error: "Failed to connect to API server" },
      { status: 500 }
    );
  }
}
