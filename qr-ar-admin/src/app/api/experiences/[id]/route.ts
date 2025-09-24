import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5028";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiUrl = `${API_BASE_URL}/api/experiences/${id}`;

    console.log(`Proxying GET request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Experience not found" },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const apiUrl = `${API_BASE_URL}/api/experiences/${id}`;

    console.log(`Proxying PUT request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "PUT",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiUrl = `${API_BASE_URL}/api/experiences/${id}`;

    console.log(`Proxying DELETE request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "DELETE",
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

    // DELETE typically returns 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
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
