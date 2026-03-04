import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import crypto from "crypto";
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email es requerido" });
    }

    // Verify this is the admin email
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error("❌ ADMIN_EMAIL not configured in .env.local");
      return res.status(500).json({ error: "Server configuration error" });
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      // Return success anyway to prevent email enumeration
      console.log("⚠️ Recovery attempt for non-admin email:", email);
      return res.status(200).json({
        success: true,
        message: "Si el email existe, recibirás un link de recuperación"
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Try to save token to database (may fail if Supabase is down)
    let tokenSavedToDB = false;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: dbError } = await supabase
        .from("password_reset_tokens")
        .insert({
          email: email.toLowerCase(),
          token,
          expires_at: expiresAt.toISOString()
        });

      if (!dbError) {
        tokenSavedToDB = true;
        console.log("✅ Password reset token saved to database");
      } else {
        console.error("⚠️ Database unavailable, using fallback method");
      }
    } catch (dbError) {
      console.error("⚠️ Database connection failed, using fallback method");
    }

    // Fallback: Save token to local file if DB is unavailable
    if (!tokenSavedToDB) {
      try {
        const tokensDir = path.join(process.cwd(), ".tokens");
        if (!fs.existsSync(tokensDir)) {
          fs.mkdirSync(tokensDir, { recursive: true });
        }
        
        const tokenData = {
          email: email.toLowerCase(),
          token,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        };
        
        fs.writeFileSync(
          path.join(tokensDir, `${token}.json`),
          JSON.stringify(tokenData, null, 2)
        );
        
        console.log("✅ Password reset token saved to local file (fallback)");
      } catch (fileError) {
        console.error("❌ Failed to save token to file:", fileError);
        return res.status(500).json({ error: "Error al procesar la solicitud" });
      }
    }

    // Send email with reset link
    const emailEnabled = process.env.EMAIL_ENABLED === "true";
    
    if (emailEnabled) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "465"),
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                        `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;
        const resetLink = `${baseUrl}/admin/reset-password?token=${token}`;

        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: email,
          subject: "Recuperación de Contraseña - Admin Dashboard",
          html: generateRecoveryEmail(resetLink, email),
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Recovery email sent to:", email);
      } catch (emailError) {
        console.error("⚠️ Email sending failed:", emailError);
        // Continue anyway - token is saved
      }
    } else {
      console.log("ℹ️ Email disabled - token generated but not sent:", token);
      console.log("ℹ️ Reset link:", `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${token}`);
    }

    return res.status(200).json({
      success: true,
      message: "Si el email existe, recibirás un link de recuperación"
    });

  } catch (error) {
    console.error("❌ Recovery error:", error);
    return res.status(500).json({
      error: "Error al procesar la solicitud"
    });
  }
}

function generateRecoveryEmail(resetLink: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0B1C2D;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B1C2D 0%, #1a3a52 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #C6A75E; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                🔐 Recuperación de Contraseña
              </h1>
              <p style="margin: 10px 0 0 0; color: #e2e8f0; font-size: 14px;">
                Admin Dashboard - Ramitap Training
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hola,
              </p>
              <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta de administrador asociada a:
              </p>
              <p style="margin: 0 0 30px 0; color: #C6A75E; font-size: 18px; font-weight: 600; text-align: center; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                ${email}
              </p>

              <p style="margin: 0 0 30px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Haz clic en el siguiente botón para restablecer tu contraseña:
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #C6A75E 0%, #b8975a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(198, 167, 94, 0.3);">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  ⚠️ Importante:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <li>Este link expirará en <strong>1 hora</strong></li>
                  <li>Solo puede usarse una vez</li>
                  <li>Si no solicitaste este cambio, ignora este correo</li>
                </ul>
              </div>

              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin: 0; padding: 12px; background-color: #f1f5f9; border-radius: 6px; color: #475569; font-size: 12px; word-break: break-all; font-family: monospace;">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                <strong>Ramitap Training</strong>
              </p>
              <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px;">
                Transforma tu Mente
              </p>
              <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                © ${new Date().getFullYear()} Todos los derechos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}