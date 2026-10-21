import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://brainsharp-backend.onrender.com";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const backendUrl = new URL(
    `/${path.map((segment) => encodeURIComponent(segment)).join("/")}${request.nextUrl.search}`,
    BACKEND_URL,
  );
  const headers = new Headers();

  for (const header of ["accept", "authorization", "content-type"]) {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  }

  try {
    const upstreamResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const contentType = upstreamResponse.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);
    responseHeaders.set("cache-control", "no-store");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend proxy request failed:", error);
    return NextResponse.json(
      { error: "The backend service is currently unreachable. Please try again shortly." },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
