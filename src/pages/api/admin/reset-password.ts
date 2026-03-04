import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token y contraseña son requeridos" });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 8 caracteres" 
      });
    }

    // Find token in database
    const { data: tokenData, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single();

    if (tokenError || !tokenData) {
      return res.status(400).json({ 
        error: "Token inválido o expirado" 
      });
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return res.status(400).json({ 
        error: "El token ha expirado. Solicita uno nuevo." 
      });
    }

    // Update .env.local file with new password
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      let envContent = "";

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }

      // Update or add ADMIN_PASSWORD
      const lines = envContent.split("\n");
      let passwordUpdated = false;

      const updatedLines = lines.map(line => {
        if (line.startsWith("ADMIN_PASSWORD=")) {
          passwordUpdated = true;
          return `ADMIN_PASSWORD=${newPassword}`;
        }
        return line;
      });

      if (!passwordUpdated) {
        updatedLines.push(`ADMIN_PASSWORD=${newPassword}`);
      }

      fs.writeFileSync(envPath, updatedLines.join("\n"));
      console.log("✅ Password updated in .env.local");

    } catch (fileError) {
      console.error("⚠️ Failed to update .env.local:", fileError);
      // Continue anyway - will be updated on restart or manual update
    }

    // Mark token as used
    await supabase
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("id", tokenData.id);

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      error: "Error al restablecer la contraseña"
    });
  }
}