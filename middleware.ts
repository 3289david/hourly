import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("hourly_session");

  // Auto-redirect home → workspace when session is active
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  // Protect workspace — redirect to activate if no session
  if (pathname.startsWith("/workspace") && !session) {
    return NextResponse.redirect(new URL("/activate", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/workspace/:path*"],
};
