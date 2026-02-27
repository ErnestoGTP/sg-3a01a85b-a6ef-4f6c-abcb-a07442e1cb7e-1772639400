import { workshopConfig } from "@/config/workshop";
import nodemailer from "nodemailer";

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

export function generateEmailHtml(data: RegistrationData): string {
  const { name, email, phone } = data;
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Registro - Taller PNL</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #0B1C2D 0%, #1a2f45 100%); text-align: center;">
              <h1 style="margin: 0; color: #C6A75E; font-size: 28px; font-weight: bold;">
                ${workshopConfig.brand.name}
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                ${workshopConfig.brand.tagline}
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #0B1C2D; font-size: 24px;">
                ¡Hola, ${name}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Confirmamos tu registro exitoso para el <strong>${workshopConfig.event.title}</strong>.
              </p>

              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Este taller será facilitado por <strong style="color: #C6A75E;">${workshopConfig.trainer.name}</strong>, ${workshopConfig.trainer.title}, instructor certificado en el Estándar de Competencia <strong>EC0217.01 "Impartición de cursos de formación del capital humano de manera presencial grupal"</strong>, avalado por SEP–CONOCER (Folio <strong>D-0000928026</strong>).
              </p>

              <!-- Event Details Box -->
              <div style="background-color: #f9fafb; border-left: 4px solid #C6A75E; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #0B1C2D; font-size: 18px;">
                  📋 Detalles del Taller
                </h3>
                <p style="margin: 5px 0; color: #333333; font-size: 15px;">
                  <strong>📅 Fecha:</strong> ${workshopConfig.event.date}
                </p>
                <p style="margin: 5px 0; color: #333333; font-size: 15px;">
                  <strong>🕐 Hora:</strong> ${workshopConfig.event.time}
                </p>
                <p style="margin: 5px 0; color: #333333; font-size: 15px;">
                  <strong>📍 Ciudad:</strong> ${workshopConfig.location.city}
                </p>
                <p style="margin: 5px 0; color: #333333; font-size: 15px;">
                  <strong>💰 Inversión:</strong> ${workshopConfig.pricing.price}
                </p>
              </div>

              <!-- Location Notice -->
              <div style="background-color: #fff3cd; border: 1px solid #C6A75E; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                  ⚠️ <strong>Ubicación exacta:</strong> La dirección específica del lugar te la enviaremos en un segundo correo o vía WhatsApp antes del evento.
                </p>
              </div>

              <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                <strong>Política de cancelación:</strong><br>
                ${workshopConfig.policies.cancellation}
              </p>

              <!-- WhatsApp Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/${workshopConfig.contact.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(workshopConfig.contact.whatsappMessage)}" 
                   style="display: inline-block; padding: 15px 30px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                  💬 Contactar por WhatsApp
                </a>
              </div>

              <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                ¡Nos vemos pronto!<br>
                <strong style="color: #C6A75E;">${workshopConfig.brand.name}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                ${workshopConfig.brand.name}
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                ${workshopConfig.organizer.email} | ${workshopConfig.location.city}
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

export async function sendConfirmationEmail(data: RegistrationData): Promise<boolean> {
  try {
    // Check if email is enabled
    if (process.env.EMAIL_ENABLED !== "true") {
      console.log("📧 Email is disabled (EMAIL_ENABLED !== true)");
      return false;
    }

    // Check if credentials are present
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ SMTP credentials missing");
      return false;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Ramitap Training" <Ramitaptraining@gmail.com>',
      to: data.email,
      subject: "Confirmación de registro – Taller Presencial de PNL (2 horas)",
      html: generateEmailHtml(data),
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}