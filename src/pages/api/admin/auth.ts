import type { NextApiRequest, NextApiResponse } from "next";
import { createSession, verifySession, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      
      // Get admin credentials from environment variables
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Validate environment variables are set
      if (!adminEmail || !adminPassword) {
        console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.local");
        return res.status(500).json({ 
          success: false, 
          error: "Server configuration error - admin credentials not configured" 
        });
      }

      // Debug logging (remove in production)
      console.log("🔐 Login attempt:", {
        providedEmail: email,
        configuredEmail: adminEmail,
        emailMatch: email?.toLowerCase() === adminEmail?.toLowerCase(),
        passwordProvided: !!password,
        passwordConfigured: !!adminPassword,
        // CRITICAL DEBUG - Compare actual values
        providedPasswordLength: password?.length,
        configuredPasswordLength: adminPassword?.length,
        passwordsMatch: password === adminPassword,
        // Show first/last chars to verify (not full password for security)
        providedPasswordStart: password?.substring(0, 3),
        configuredPasswordStart: adminPassword?.substring(0, 3),
        providedPasswordEnd: password?.substring(password.length - 3),
        configuredPasswordEnd: adminPassword?.substring(adminPassword.length - 3)
      });

      // Validate credentials (case-insensitive email)
      if (
        email?.toLowerCase() === adminEmail.toLowerCase() && 
        password === adminPassword
      ) {
        // Create JWT session
        const token = await createSession(email);
        
        // Set HTTP-only cookie
        const cookie = serialize(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: COOKIE_MAX_AGE,
          path: "/",
        });

        res.setHeader("Set-Cookie", cookie);
        
        console.log("✅ Login successful for:", email);
        
        return res.status(200).json({ 
          success: true,
          message: "Authentication successful"
        });
      }

      // Invalid credentials
      console.log("❌ Login failed - invalid credentials");
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
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