import { NextRequest, NextResponse } from "next/server";

function publicUrl(req: NextRequest, path: string): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "hourly.krl.kr";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}${path}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("hourly_session");

  // Auto-redirect home → workspace when session is active
  if (pathname === "/" && session) {
    return NextResponse.redirect(publicUrl(req, "/workspace"));
  }

  // Protect workspace — redirect to activate if no session
  if (pathname.startsWith("/workspace") && !session) {
    return NextResponse.redirect(publicUrl(req, "/activate"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/workspace/:path*"],
};
