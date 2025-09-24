import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5028";

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
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
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
    const body = await request.json();
    const apiUrl = `${API_BASE_URL}/api/experiences`;

    console.log(`Proxying POST request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `API responded with status: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to API server" },
      { status: 500 }
    );
  }
}
