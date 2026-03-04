import type { NextApiRequest, NextApiResponse } from "next";
import { sendPasswordRecoveryEmail } from "@/lib/email";

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
      try {
        const emailSent = await sendPasswordRecoveryEmail(email);
        
        if (!emailSent) {
          console.error("Failed to send recovery email");
          // Don't reveal email send failure to user for security
        } else {
          console.log(`Recovery email sent successfully to: ${email}`);
        }
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