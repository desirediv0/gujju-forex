import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  return handleProxy(request);
}

export default async function handleProxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const authed = await verifyAdminToken(
    request.cookies.get(ADMIN_COOKIE)?.value,
  );

  if (!authed && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (authed && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

