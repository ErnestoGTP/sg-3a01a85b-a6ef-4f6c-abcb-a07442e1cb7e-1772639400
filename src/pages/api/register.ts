import type { NextApiRequest, NextApiResponse } from "next";
import { sendConfirmationEmail } from "@/lib/email";
import { workshopConfig } from "@/config/workshop";
import { promises as fs } from "fs";
import path from "path";
import QRCode from "qrcode";

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  paid?: boolean;
}

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

    if (!name || !email || !phone) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }

    const filePath = path.join(process.cwd(), "data", "registrations.json");
    console.log("📁 File path:", filePath);
    
    let registrations: RegistrationData[] = [];
    
    try {
      await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
      const fileContent = await fs.readFile(filePath, "utf-8");
      registrations = JSON.parse(fileContent);
      console.log("✅ Existing registrations loaded:", registrations.length);
    } catch (error) {
      console.log("ℹ️ No existing registrations file, starting fresh");
      registrations = [];
    }

    const existingRegistration = registrations.find(
      (reg) => reg.email.toLowerCase() === email.toLowerCase()
    );

    if (existingRegistration) {
      console.log("❌ Duplicate email:", email);
      return res.status(400).json({
        success: false,
        error: "Este email ya está registrado"
      });
    }

    if (registrations.length >= workshopConfig.event.maxSeats) {
      console.log("❌ Workshop full:", registrations.length, ">=", workshopConfig.event.maxSeats);
      return res.status(400).json({
        success: false,
        error: "Lo sentimos, el taller está lleno"
      });
    }

    const newRegistration: RegistrationData = {
      name,
      email,
      phone,
      timestamp: new Date().toISOString(),
      paid: false
    };

    registrations.push(newRegistration);
    await fs.writeFile(filePath, JSON.stringify(registrations, null, 2));
    console.log("✅ Registration saved to file");

    // Generar QR
    console.log("🔄 Generating QR code...");
    const qrString = `Registro Taller PNL | Nombre: ${name} | Email: ${email} | Tel: ${phone}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrString);
    console.log("✅ QR code generated");

    // Enviar email con QR
    console.log("📧 Attempting to send confirmation email...");
    const emailSent = await sendConfirmationEmail({ name, email, phone }, qrCodeDataUrl);
    console.log("📧 Email sent result:", emailSent);

    if (!emailSent) {
      console.warn("⚠️ Registration saved but email failed:", email);
    }

    return res.status(200).json({
      success: true,
      message: emailSent 
        ? "¡Registro exitoso! Revisa tu email para confirmar tu asistencia."
        : "Registro exitoso. Te contactaremos pronto.",
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "Unknown error");
    return res.status(500).json({
      success: false,
      error: "Error al procesar el registro. Por favor, intenta de nuevo.",
    });
  }
}