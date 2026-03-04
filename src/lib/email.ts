import { workshopConfig } from "@/config/workshop";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

type EmailData = RegistrationData;

/**
 * Generates the HTML content for confirmation email
 */
export function generateEmailHtml(data: EmailData): string {
  const { name, email, phone } = data;
  const { event, location, pricing, organizer, contact, trainer, payment } = workshopConfig;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Registro - ${event.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B1C2D 0%, #1a2f45 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Tu pase y siguientes pasos! 🎟️</h1>
              <p style="margin: 15px 0 0 0; color: #C6A75E; font-size: 18px; font-weight: 600;">${event.title}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #0B1C2D; font-size: 16px; line-height: 1.6;">
                Hola <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Este es tu pase de acceso pre-registrado. Muéstralo en tu celular el día del evento para agilizar tu entrada.
              </p>

              <!-- QR Code Section -->
              <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 12px; border: 1px dashed #cbd5e0;">
                <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Tu Código de Acceso</p>
                <img src="cid:qr-code" alt="Tu Boleto QR" style="width: 200px; height: 200px; display: inline-block;" />
              </div>

              <!-- Payment Instructions -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background: linear-gradient(to right bottom, #fffbeb, #fff); border-radius: 12px; border: 2px solid #C6A75E;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 15px 0; color: #0B1C2D; font-size: 20px; font-weight: bold; border-bottom: 2px solid #C6A75E; padding-bottom: 12px;">💰 Confirmación de Pago</h2>
                    
                    <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                      Recuerda que para asegurar tu lugar y recibir la <strong>ubicación exacta</strong> en Hermosillo, es necesario realizar tu inversión de <strong>${payment.amount}</strong> a la siguiente cuenta:
                    </p>
                    
                    <div style="background-color: rgba(198, 167, 94, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                      <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 15px;">
                        <strong style="color: #0B1C2D;">🏦 Banco:</strong> ${payment.bank}
                      </p>
                      <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 15px;">
                        <strong style="color: #0B1C2D;">💳 Cuenta/Tarjeta:</strong> <span style="font-family: monospace; font-size: 16px;">${payment.account}</span>
                      </p>
                      <p style="margin: 0; color: #2d3748; font-size: 15px;">
                        <strong style="color: #0B1C2D;">👤 Titular:</strong> ${payment.accountHolder}
                      </p>
                    </div>

                    <div style="text-align: center;">
                       <a href="https://wa.me/${contact.whatsappNumber}?text=Hola%2C%20soy%20${encodeURIComponent(name)}%2C%20acabo%20de%20registrarme%20al%20Taller%20de%20PNL%20y%20aqu%C3%AD%20est%C3%A1%20mi%20comprobante%20de%20pago." style="display: inline-block; padding: 14px 24px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px;">
                        📲 Haz clic aquí para enviar comprobante
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Event Details Summary -->
              <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                 <p style="margin: 0 0 5px 0; color: #718096; font-size: 14px;"><strong>📅 Fecha:</strong> ${event.date}</p>
                 <p style="margin: 0 0 5px 0; color: #718096; font-size: 14px;"><strong>🕐 Horario:</strong> ${event.time}</p>
                 <p style="margin: 0; color: #718096; font-size: 14px;"><strong>📍 Ciudad:</strong> ${location.city}</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B1C2D; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #C6A75E; font-size: 18px; font-weight: bold;">
                Ramitap Training
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                © ${new Date().getFullYear()} Ramitap Training. Todos los derechos reservados.
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

/**
 * Sends confirmation email using Resend
 */
export async function sendConfirmationEmail(data: EmailData, qrCodeDataUrl?: string): Promise<boolean> {
  try {
    // Check if Resend is enabled
    if (process.env.EMAIL_ENABLED !== "true") {
      console.log("📧 Email is disabled (EMAIL_ENABLED=false)");
      return false;
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not configured");
      return false;
    }

    console.log("📧 Sending confirmation email to:", data.email);

    const emailHtml = generateEmailHtml(data);
    
    // Prepare attachments
    const attachments = [];
    if (qrCodeDataUrl) {
      // Convert data URL to buffer for attachment
      // Data URL format: data:image/png;base64,iVBORw0KGgo...
      const base64Data = qrCodeDataUrl.split(';base64,').pop();
      
      if (base64Data) {
        attachments.push({
          content: Buffer.from(base64Data, 'base64'),
          filename: 'ticket-qr.png',
          content_id: 'qr-code', // This matches the cid:qr-code in HTML
          disposition: 'inline', // Display inline
        });
      }
    }

    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Ramitap Training <onboarding@resend.dev>",
      to: data.email,
      subject: `Tu pase y siguientes pasos – ${workshopConfig.event.title}`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (result.error) {
      console.error("❌ Error sending email via Resend:", result.error);
      return false;
    }

    console.log("✅ Confirmation email sent successfully via Resend:", result.data?.id);
    return true;

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

// Keep existing recovery email function
export async function sendPasswordRecoveryEmail(email: string): Promise<boolean> {
  const emailEnabled = process.env.EMAIL_ENABLED === "true";
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!emailEnabled || !resendApiKey) {
    console.log("Email system disabled or not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Ramitap Training <onboarding@resend.dev>",
        to: email,
        subject: "🔐 Recuperación de Contraseña - Admin Dashboard",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #0B1C2D 0%, #1a2332 100%); padding: 40px 30px; text-align: center;">
                          <h1 style="margin: 0; color: #C6A75E; font-size: 28px; font-weight: bold;">
                            🔐 Recuperación de Contraseña
                          </h1>
                          <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px;">
                            Admin Dashboard - Ramitap Training
                          </p>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                            Hola Admin,
                          </p>
                          
                          <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                            Recibimos una solicitud para recuperar la contraseña de acceso al dashboard de administración del <strong>Taller de PNL</strong>.
                          </p>

                          <!-- Password Box -->
                          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                            <tr>
                              <td style="background-color: #f8f9fa; border-left: 4px solid #C6A75E; padding: 20px; border-radius: 4px;">
                                <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                                  <strong>Tu contraseña actual es:</strong>
                                </p>
                                <p style="margin: 0; color: #0B1C2D; font-size: 20px; font-family: 'Courier New', monospace; font-weight: bold;">
                                  ${process.env.ADMIN_PASSWORD || "RamitapAdmin2026!"}
                                </p>
                              </td>
                            </tr>
                          </table>

                          <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                            Si deseas cambiar tu contraseña, debes actualizar la variable de entorno <code style="background-color: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace;">ADMIN_PASSWORD</code> en tu archivo <code style="background-color: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace;">.env.local</code> o en la configuración de tu hosting (Vercel).
                          </p>

                          <!-- Access Button -->
                          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                            <tr>
                              <td align="center">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/login" 
                                   style="display: inline-block; background-color: #C6A75E; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                  Acceder al Dashboard
                                </a>
                              </td>
                            </tr>
                          </table>

                          <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                              <strong>⚠️ Seguridad:</strong> Si no solicitaste esta recuperación, alguien podría estar intentando acceder a tu cuenta. Te recomendamos cambiar tu contraseña inmediatamente.
                            </p>
                          </div>

                          <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                            Si tienes alguna duda, responde este email o contacta a soporte.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                          <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                            <strong>Ramitap Training</strong><br>
                            Transformando vidas a través de PNL
                          </p>
                          <p style="margin: 0; color: #999999; font-size: 12px;">
                            Este es un email automático del sistema de administración.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return false;
    }

    console.log("Password recovery email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending password recovery email:", error);
    return false;
  }
}