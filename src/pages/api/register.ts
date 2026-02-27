import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendConfirmationEmail, RegistrationData } from "@/lib/email";

const registrationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8)
});

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;
const ipRequests = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    // Reset window
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate Limiting
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Demasiados intentos. Por favor intenta más tarde." });
  }

  try {
    const validatedData = registrationSchema.parse(req.body) as RegistrationData;

    console.log("📝 Registration attempt:", validatedData.email);

    // Try to send email
    const emailSent = await sendConfirmationEmail(validatedData);

    if (emailSent) {
      console.log(`✅ Registration successful with email sent: ${validatedData.email}`);
      return res.status(200).json({ 
        success: true, 
        message: "Registro exitoso. Revisa tu email para la confirmación.",
        emailSent: true
      });
    } else {
      console.log(`⚠️ Registration successful but email not sent: ${validatedData.email}`);
      return res.status(200).json({ 
        success: true, 
        message: "Registro exitoso. Te contactaremos pronto por WhatsApp.",
        emailSent: false
      });
    }

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