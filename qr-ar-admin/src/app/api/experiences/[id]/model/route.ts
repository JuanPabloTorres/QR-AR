import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5028";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiUrl = `${API_BASE_URL}/api/experiences/${id}/model`;

    console.log(`Proxying Model GET request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "3D model not found for this experience" },
          { status: 404 }
        );
      }
      console.error(
        `API responded with status: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the content type from the API response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition");

    // Get the binary data
    const buffer = await response.arrayBuffer();

    console.log(
      `Model served: ${buffer.byteLength} bytes, type: ${contentType}`
    );

    // Create response with proper headers
    const nextResponse = new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        ...(contentDisposition && {
          "Content-Disposition": contentDisposition,
        }),
      },
    });

    return nextResponse;
  } catch (error) {
    console.error("Model Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch 3D model from API server" },
      { status: 500 }
    );
  }
}
