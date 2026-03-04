import type { NextApiRequest, NextApiResponse } from "next";
import { createSession, verifySession, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || "ramitaptraining@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "RamitapAdmin2026!";

    if (email === adminEmail && password === adminPassword) {
      const token = await createSession(email);
      
      const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);
      
      return res.status(200).json({ 
        success: true,
        message: "Authentication successful"
      });
    }

    return res.status(401).json({ 
      success: false, 
      error: "Invalid credentials" 
    });
  }

  if (req.method === "GET") {
    const token = req.cookies[COOKIE_NAME];
    
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const session = await verifySession(token);
    
    if (!session) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({ 
      authenticated: true,
      email: session.email
    });
  }

  if (req.method === "DELETE") {
    const cookie = serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ 
      success: true,
      message: "Logged out successfully"
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}