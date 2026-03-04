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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: "Email inválido" 
      });
    }

    // Verificar que el email sea del administrador autorizado
    const adminEmail = process.env.ADMIN_EMAIL || "ramitaptraining@gmail.com";
    
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      // Por seguridad, no revelamos si el email existe o no
      // Siempre decimos que el email fue enviado
      return res.status(200).json({ 
        success: true,
        message: "Si este email está registrado, recibirás instrucciones"
      });
    }

    // Enviar email de recuperación
    const emailSent = await sendPasswordRecoveryEmail(email);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        error: "Error al enviar el email. Por favor, contacta al soporte." 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "Email de recuperación enviado exitosamente"
    });

  } catch (error) {
    console.error("Error in password recovery:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Error al procesar la solicitud" 
    });
  }
}