import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function buildTargetUrl(pathParts, searchParams) {
  const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendBase) {
    throw new Error("Missing BACKEND_URL or NEXT_PUBLIC_BACKEND_URL");
  }

  const normalizedBase = backendBase.replace(/\/+$/, "");
  const cleanPath = pathParts.map((p) => encodeURIComponent(p)).join("/");
  const query = searchParams.toString();
  return `${normalizedBase}/api/${cleanPath}${query ? `?${query}` : ""}`;
}

async function forward(request, context) {
  try {
    const token = (await cookies()).get("authtoken")?.value;
    const resolvedParams = await context.params;
    const targetUrl = buildTargetUrl(resolvedParams?.path || [], request.nextUrl.searchParams);
    const method = request.method.toUpperCase();
    const isMutation = !["GET", "HEAD", "OPTIONS"].includes(method);
    const origin = request.headers.get("origin");

    if (isMutation && origin && origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    if (token) headers.set("authorization", `Bearer ${token}`);

    const hasBody = !["GET", "HEAD"].includes(method);
    const body = hasBody ? request.body : undefined;

    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      duplex: hasBody ? "half" : undefined,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) responseHeaders.set("content-type", upstreamType);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Backend proxy failed", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  return forward(request, context);
}

export async function POST(request, context) {
  return forward(request, context);
}

export async function PUT(request, context) {
  return forward(request, context);
}

export async function PATCH(request, context) {
  return forward(request, context);
}

export async function DELETE(request, context) {
  return forward(request, context);
}
