import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect workspace routes
  if (pathname.startsWith("/workspace")) {
    const session = req.cookies.get("hourly_session");
    if (!session) {
      return NextResponse.redirect(new URL("/activate", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*"],
};
