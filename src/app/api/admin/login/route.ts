import crypto from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminToken } from "@/lib/auth";

export const runtime = "nodejs";

// Small in-memory throttle to blunt credential guessing.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

/** Length-independent constant-time comparison. */
function matches(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now - record.first < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return NextResponse.json(
      {
        error:
          "ADMIN_USERNAME and ADMIN_PASSWORD must both be set on the server.",
      },
      { status: 500 },
    );
  }

  // Compare both fields every time so a wrong username and a wrong password
  // cost the same, and the response never reveals which one was wrong.
  const username = (body?.username ?? "").trim();
  const userOk = matches(username.toLowerCase(), expectedUser.toLowerCase());
  const passOk = matches(body?.password ?? "", expectedPassword);

  if (!userOk || !passOk) {
    if (!record || now - record.first > WINDOW_MS) {
      attempts.set(ip, { count: 1, first: now });
    } else {
      record.count += 1;
    }
    return NextResponse.json(
      { error: "Incorrect username or password" },
      { status: 401 },
    );
  }

  attempts.delete(ip);
  const token = await createAdminToken(expectedUser);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
