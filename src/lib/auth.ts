import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "gf_admin";
const ISSUER = "gujju-forex";

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short (min 16 chars)");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(username: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

async function readToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER });
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string | undefined) {
  return (await readToken(token)) !== null;
}

/** The username stored in the session, for display in the admin UI. */
export async function getAdminUsername(token: string | undefined) {
  const payload = await readToken(token);
  return typeof payload?.sub === "string" ? payload.sub : null;
}
