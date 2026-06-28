import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.method === "POST" && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/ingest";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
