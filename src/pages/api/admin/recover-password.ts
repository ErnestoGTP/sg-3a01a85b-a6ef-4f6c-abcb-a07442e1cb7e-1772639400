import type { NextApiRequest, NextApiResponse } from "next";

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
      return res.status(400).json({ 
        success: false, 
        error: "Email es requerido" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: "Email inválido" 
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if admin email is configured
    if (!adminEmail) {
      console.error("ADMIN_EMAIL not configured in environment variables");
      return res.status(500).json({ 
        success: false, 
        error: "Sistema de recuperación no configurado" 
      });
    }

    // For security, always return success even if email doesn't match
    // But only send email if it matches the admin email
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      // Check if Resend is configured
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (!resendApiKey) {
        console.error("RESEND_API_KEY not configured");
        // Return success to not reveal configuration issues
        return res.status(200).json({ 
          success: true,
          message: "Si el email es correcto, recibirás instrucciones"
        });
      }

      // Try to send recovery email
      try {
        const Resend = (await import("resend")).Resend;
        const resend = new Resend(resendApiKey);

        const emailFrom = process.env.EMAIL_FROM || "Ramitap Training <onboarding@resend.dev>";

        await resend.emails.send({
          from: emailFrom,
          to: email,
          subject: "🔐 Recuperación de Contraseña - Admin Dashboard",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #0B1C2D 0%, #1a3a52 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                  .password-box { background: white; border: 2px solid #C6A75E; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
                  .password { font-size: 24px; font-weight: bold; color: #0B1C2D; font-family: monospace; }
                  .button { display: inline-block; background: #C6A75E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                  .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                  .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🔐 Recuperación de Contraseña</h1>
                  </div>
                  <div class="content">
                    <p>Hola Admin,</p>
                    <p>Recibimos una solicitud para recuperar la contraseña de acceso al dashboard de administración del Taller de PNL.</p>
                    
                    <div class="password-box">
                      <p style="margin: 0 0 10px 0; color: #666;">Tu contraseña actual es:</p>
                      <div class="password">${adminPassword || "No configurada"}</div>
                    </div>

                    <p><strong>Para cambiar tu contraseña:</strong></p>
                    <ol>
                      <li>Edita el archivo <code>.env.local</code> en tu proyecto</li>
                      <li>Actualiza la variable: <code>ADMIN_PASSWORD=TuNuevaContraseña</code></li>
                      <li>Reinicia el servidor</li>
                    </ol>

                    <div style="text-align: center;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/login" class="button">
                        Acceder al Dashboard
                      </a>
                    </div>

                    <div class="warning">
                      <strong>⚠️ Seguridad:</strong><br>
                      Si no solicitaste esta recuperación, alguien podría estar intentando acceder a tu cuenta. Te recomendamos cambiar tu contraseña inmediatamente.
                    </div>

                    <div class="footer">
                      <p><strong>Ramitap Training</strong></p>
                      <p>Transformando vidas a través de PNL</p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `
        });

        console.log(`Recovery email sent successfully to: ${email}`);
      } catch (emailError) {
        console.error("Error sending recovery email:", emailError);
        // Don't reveal email send failure to user
      }
    }

    // Always return success for security (don't reveal if email exists)
    return res.status(200).json({ 
      success: true,
      message: "Si el email es correcto, recibirás instrucciones" 
    });

  } catch (error) {
    console.error("Error in recover-password endpoint:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Error al procesar la solicitud" 
    });
  }
}