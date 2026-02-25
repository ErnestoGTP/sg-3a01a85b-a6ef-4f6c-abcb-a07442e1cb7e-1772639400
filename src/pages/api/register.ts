import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { generateConfirmationEmail } from "@/lib/email";
import nodemailer from "nodemailer";
import { workshopConfig } from "@/config/workshop";

const registrationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8)
});

const requestTracker = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestTracker.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  requestTracker.set(ip, recentRequests);
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || 
              req.socket.remoteAddress || 
              "unknown";

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." });
  }

  try {
    const validatedData = registrationSchema.parse(req.body);

    const emailEnabled = process.env.EMAIL_ENABLED === "true";
    
    if (emailEnabled) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const emailHtml = generateConfirmationEmail(validatedData);

      await transporter.sendMail({
        from: {
          name: workshopConfig.email.fromName,
          address: process.env.SMTP_USER || workshopConfig.email.fromEmail
        },
        to: validatedData.email,
        replyTo: workshopConfig.email.replyTo,
        subject: `Confirmación de Registro - ${workshopConfig.event.title}`,
        html: emailHtml
      });

      console.log(`✅ Registration email sent to: ${validatedData.email}`);
    } else {
      console.log("📧 Email disabled - Registration data:", validatedData);
    }

    res.status(200).json({ 
      success: true, 
      message: "Registro exitoso. Revisa tu email para la confirmación.",
      emailSent: emailEnabled
    });

  } catch (error) {
    console.error("❌ Registration error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        details: error.errors 
      });
    }

    res.status(500).json({ 
      error: "Error al procesar el registro. Por favor intenta de nuevo." 
    });
  }
}