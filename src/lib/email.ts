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
  const { event, location, pricing, organizer, contact, trainer } = workshopConfig;

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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Registro Confirmado! ✅</h1>
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
                Confirmamos tu registro exitoso para el <strong>${event.title}</strong>. Estamos emocionados de acompañarte en esta experiencia transformadora.
              </p>

              <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Este taller será facilitado por <strong>${trainer.name}</strong>, ${trainer.title}, instructor certificado en el <strong>Estándar de Competencia EC0217.01 "Impartición de cursos de formación del capital humano de manera presencial grupal"</strong>, avalado por SEP–CONOCER (Folio <strong>D-0000928026</strong>).
              </p>

              <!-- Event Details Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; border: 2px solid #C6A75E;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; color: #0B1C2D; font-size: 20px; font-weight: bold; border-bottom: 2px solid #C6A75E; padding-bottom: 12px;">📋 Detalles del Taller</h2>
                    
                    <p style="margin: 0 0 12px 0; color: #2d3748; font-size: 15px;">
                      <strong style="color: #0B1C2D;">📅 Fecha:</strong> ${event.date}
                    </p>
                    
                    <p style="margin: 0 0 12px 0; color: #2d3748; font-size: 15px;">
                      <strong style="color: #0B1C2D;">🕐 Horario:</strong> ${event.time}
                    </p>
                    
                    <p style="margin: 0 0 12px 0; color: #2d3748; font-size: 15px;">
                      <strong style="color: #0B1C2D;">📍 Ciudad:</strong> ${location.city}
                    </p>
                    
                    <p style="margin: 0 0 12px 0; color: #2d3748; font-size: 15px;">
                      <strong style="color: #0B1C2D;">⏱️ Duración:</strong> ${event.duration}
                    </p>
                    
                    <p style="margin: 0; color: #2d3748; font-size: 15px;">
                      <strong style="color: #0B1C2D;">💰 Inversión:</strong> ${pricing.price}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Registration Info Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #fffbeb; border-radius: 12px; border-left: 4px solid #C6A75E;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; color: #0B1C2D; font-size: 15px; font-weight: 600;">
                      📧 Tus datos de registro:
                    </p>
                    <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">
                      <strong>Nombre:</strong> ${name}
                    </p>
                    <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">
                      <strong>Email:</strong> ${email}
                    </p>
                    <p style="margin: 0; color: #4a5568; font-size: 14px;">
                      <strong>Teléfono:</strong> ${phone}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Important Info -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #f0fdf4; border-radius: 12px; border-left: 4px solid #10b981;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #065f46; font-size: 15px; font-weight: 600;">
                      ℹ️ Información Importante:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
                      <li>La <strong>ubicación exacta</strong> se confirmará 48 horas antes del evento</li>
                      <li>Te recomendamos llegar <strong>10 minutos antes</strong> del inicio</li>
                      <li>Trae libreta y bolígrafo para tomar notas</li>
                      <li>Recibirás material de apoyo durante el taller</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Cancellation Policy -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #fef2f2; border-radius: 12px; border-left: 4px solid #ef4444;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #991b1b; font-size: 15px; font-weight: 600;">
                      ⚠️ Política de Cancelación:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                      <li><strong>+48 horas:</strong> Reembolso 100% o cambio de fecha</li>
                      <li><strong>24-48 horas:</strong> Solo cambio de fecha o transferencia</li>
                      <li><strong>-24 horas:</strong> No hay reembolso</li>
                    </ul>
                    <p style="margin: 15px 0 0 0; color: #7f1d1d; font-size: 13px;">
                      Para cancelaciones, contacta con 48h de anticipación.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Contact Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${contact.whatsappNumber}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20registro%20al%20Taller%20de%20PNL" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                      💬 Contactar por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Si tienes alguna pregunta, no dudes en contactarnos:
              </p>
              
              <p style="margin: 10px 0 0 0; color: #2d3748; font-size: 14px;">
                📧 <a href="mailto:${organizer.email}" style="color: #C6A75E; text-decoration: none;">${organizer.email}</a><br>
                📱 <a href="https://wa.me/${contact.whatsappNumber}" style="color: #25D366; text-decoration: none;">WhatsApp: ${contact.whatsappNumber}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B1C2D; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #C6A75E; font-size: 18px; font-weight: bold;">
                Ramitap Training
              </p>
              <p style="margin: 0 0 15px 0; color: #94a3b8; font-size: 13px;">
                Transformando vidas a través de la PNL
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
export async function sendConfirmationEmail(data: EmailData): Promise<boolean> {
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

    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Ramitap Training <onboarding@resend.dev>",
      to: data.email,
      subject: `Confirmación de registro – ${workshopConfig.event.title}`,
      html: emailHtml,
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