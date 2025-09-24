import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5028";

export async function GET(request: NextRequest) {
  try {
    const apiUrl = `${API_BASE_URL}/api/health`;

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
      return NextResponse.json(
        {
          status: "error",
          message: `API server responded with ${response.status}`,
          timestamp: new Date().toISOString(),
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Health Check Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          "Failed to connect to API server. Make sure the API server is running on port 5028.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
