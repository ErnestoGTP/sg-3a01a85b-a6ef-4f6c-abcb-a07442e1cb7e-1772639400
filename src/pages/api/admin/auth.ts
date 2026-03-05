import type { NextApiRequest, NextApiResponse } from "next";
import { createSession, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email y contraseña son requeridos",
        });
      }

      // Read admin credentials from environment variables ONLY
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Validate environment variables are set
      if (!adminEmail || !adminPassword) {
        console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.local");
        return res.status(500).json({
          success: false,
          error: "Server configuration error - admin credentials not configured",
        });
      }

      // Simple credential validation (case-insensitive email)
      if (
        email?.toLowerCase() === adminEmail.toLowerCase() &&
        password === adminPassword
      ) {
        // Create session token
        const token = await createSession(email);

        // Set cookie
        res.setHeader(
          "Set-Cookie",
          serialize(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: COOKIE_MAX_AGE,
            path: "/",
          })
        );

        return res.status(200).json({
          success: true,
          message: "Login successful",
        });
      }

      // Invalid credentials
      return res.status(401).json({
        success: false,
        error: "Credenciales incorrectas",
      });
    } catch (error) {
      console.error("❌ Authentication error:", error);
      return res.status(500).json({
        success: false,
        error: "Error al procesar la solicitud",
      });
    }
  }

  if (req.method === "DELETE") {
    // Logout - clear cookie
    res.setHeader(
      "Set-Cookie",
      serialize(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}