import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    { status: 303 },
  );
  response.cookies.set(ADMIN_COOKIE, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
