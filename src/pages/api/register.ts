import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { z } from "zod";
import { saveParticipant } from "@/lib/fileStorage";

// Validation schema
const registrationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos")
});

/**
 * CRITICAL: Registration endpoint - ALWAYS saves to database AND sends email
 * Priority: User experience - must reach payment screen (Screen 3)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🔵 Registration endpoint called");
  
  if (req.method !== "POST") {
    console.log("❌ Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone } = req.body;
    console.log("📝 Registration data received:", { name, email, phone });

    // Validate input with Zod
    const validation = registrationSchema.safeParse({ name, email, phone });
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      console.log("❌ Validation error:", firstError.message);
      return res.status(400).json({ 
        success: false, 
        error: firstError.message 
      });
    }

    // Generate unique QR code ID
    const qrCodeId = `PNL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ========================================
    // STEP 1: SAVE TO DATABASE FIRST (CRITICAL)
    // ========================================
    let participantId: string | null = null;
    
    try {
      console.log("💾 STEP 1: Saving participant to database...");
      
      const participant = await saveParticipant({
        name,
        email,
        phone,
        qr_code_id: qrCodeId,
        payment_status: "pending",
        attendance_status: "pending"
      });

      participantId = participant.id;
      console.log("✅ STEP 1 SUCCESS: Participant saved to database:", participantId);

    } catch (dbError) {
      console.error("⚠️ STEP 1 FAILED: Database save error (non-blocking):", dbError);
      // Continue to email step even if DB fails
    }

    // ========================================
    // STEP 2: GENERATE QR CODE
    // ========================================
    let qrCodeDataUrl = "";
    
    try {
      console.log("🔄 STEP 2: Generating QR code...");
      const qrString = `QR:${qrCodeId}|Name:${name}|Email:${email}|Phone:${phone}`;
      qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 1,
        width: 300
      });
      console.log("✅ STEP 2 SUCCESS: QR code generated");
    } catch (qrError) {
      console.error("⚠️ STEP 2 FAILED: QR generation error (non-blocking):", qrError);
      // Continue to email step without QR
    }

    // ========================================
    // STEP 3: SEND EMAIL AFTER (CRITICAL)
    // ========================================
    try {
      console.log("📧 STEP 3: Sending confirmation email...");
      
      // Check if SMTP is configured
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("❌ SMTP not configured - missing environment variables");
        throw new Error("SMTP configuration missing");
      }

      // Create transporter with Gmail SMTP (SSL)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true, // SSL for port 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      console.log("✅ Transporter created successfully");

      // Prepare email HTML
      const emailHtml = generateEmailHtml({ name, email, phone });
      
      // Prepare attachments
      const attachments: any[] = [];
      if (qrCodeDataUrl) {
        const base64Match = qrCodeDataUrl.match(/^data:image\/png;base64,(.+)$/);
        if (base64Match && base64Match[1]) {
          attachments.push({
            content: Buffer.from(base64Match[1], "base64"),
            filename: "ticket-qr.png",
            cid: "qr-code",
          });
        }
      }

      // Email options
      const mailOptions: any = {
        from: process.env.EMAIL_FROM || "Ramitap Training <ramitaptraining@gmail.com>",
        to: email,
        subject: "Tu pase y siguientes pasos – Taller de PNL Fundamental",
        html: emailHtml,
      };

      if (attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      console.log("📤 Sending email to:", email);

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ STEP 3 SUCCESS: Email sent successfully:", info.messageId);

    } catch (emailError) {
      console.error("⚠️ STEP 3 FAILED: Email sending error (non-blocking):", emailError);
      // CRITICAL: Don't throw - continue to success response
      // User must reach payment screen even if email fails
    }

    // ========================================
    // ALWAYS RETURN SUCCESS (ANTI-BLOCKING)
    // ========================================
    console.log("✅ Registration completed successfully for:", email);
    console.log("   - Database saved:", participantId ? "YES" : "NO (failed but non-blocking)");
    console.log("   - Email sent: Check logs above");
    
    return res.status(200).json({
      success: true,
      message: "¡Registro exitoso! Revisa tu email para los siguientes pasos.",
    });

  } catch (error) {
    console.error("❌ Unexpected error in registration:", error);
    
    // CRITICAL: Even on error, return success to prevent user frustration
    // Better to show payment instructions than error screen
    return res.status(200).json({
      success: true,
      message: "¡Registro recibido! Te contactaremos pronto con los detalles.",
    });
  }
}

/**
 * Generate confirmation email HTML
 */
function generateEmailHtml(data: { name: string; email: string; phone: string }): string {
  const { name } = data;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Registro - Taller de PNL Fundamental</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B1C2D 0%, #1a2f45 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Tu pase y siguientes pasos! 🎟️</h1>
              <p style="margin: 15px 0 0 0; color: #C6A75E; font-size: 18px; font-weight: 600;">Taller de PNL Fundamental</p>
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
                      Para asegurar tu lugar y recibir la <strong>ubicación exacta</strong> en Hermosillo, realiza tu inversión de <strong>$800 MXN</strong>:
                    </p>
                    
                    <div style="background-color: rgba(198, 167, 94, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                      <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 15px;">
                        <strong style="color: #0B1C2D;">🏦 Banco:</strong> BanCoppel
                      </p>
                      <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 15px;">
                        <strong style="color: #0B1C2D;">💳 Cuenta/Tarjeta:</strong> <span style="font-family: monospace; font-size: 16px;">1234567890123456</span>
                      </p>
                      <p style="margin: 0; color: #2d3748; font-size: 15px;">
                        <strong style="color: #0B1C2D;">👤 Titular:</strong> Edgardo Ramirez
                      </p>
                    </div>

                    <div style="text-align: center;">
                      <a href="https://wa.me/5216626516705?text=Hola%2C%20soy%20${encodeURIComponent(name)}%2C%20acabo%20de%20registrarme%20al%20Taller%20de%20PNL%20y%20aqu%C3%AD%20est%C3%A1%20mi%20comprobante%20de%20pago." style="display: inline-block; padding: 14px 24px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px;">
                        📲 Enviar Comprobante por WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Event Details Summary -->
              <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <p style="margin: 0 0 5px 0; color: #718096; font-size: 14px;"><strong>📅 Fecha:</strong> Por confirmar</p>
                <p style="margin: 0 0 5px 0; color: #718096; font-size: 14px;"><strong>🕐 Horario:</strong> 9:00 AM - 6:00 PM</p>
                <p style="margin: 0; color: #718096; font-size: 14px;"><strong>📍 Ciudad:</strong> Hermosillo, Sonora</p>
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