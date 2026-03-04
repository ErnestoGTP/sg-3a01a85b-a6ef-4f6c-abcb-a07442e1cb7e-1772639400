import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "admin-session";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "your-secret-key-change-in-production-min-32-chars"
);

export interface SessionPayload {
  email: string;
  isAdmin: boolean;
  expiresAt: number;
}

export async function createSession(email: string): Promise<string> {
  const expiresAt = Date.now() + COOKIE_MAX_AGE * 1000;
  
  return new SignJWT({
    email,
    isAdmin: true,
    expiresAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(SECRET_KEY);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    if (!payload.email || !payload.isAdmin) {
      return null;
    }

    return {
      email: payload.email as string,
      isAdmin: payload.isAdmin as boolean,
      expiresAt: payload.expiresAt as number,
    };
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}