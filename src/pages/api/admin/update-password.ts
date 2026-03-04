import type { NextApiRequest, NextApiResponse } from "next";
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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: "Contraseña actual y nueva son requeridas" 
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: "La nueva contraseña debe tener al menos 8 caracteres" 
      });
    }

    // Verify current password matches
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (currentPassword !== adminPassword) {
      return res.status(401).json({ 
        error: "La contraseña actual es incorrecta" 
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
      console.log("✅ Password updated successfully in .env.local");

    } catch (fileError) {
      console.error("⚠️ Failed to update .env.local:", fileError);
      return res.status(500).json({ 
        error: "Error al actualizar el archivo de configuración" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente"
    });

  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      error: "Error al actualizar la contraseña"
    });
  }
}