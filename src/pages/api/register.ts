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

    // Validate required fields
    if (!name || !email || !phone) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        success: false, 
        error: "Todos los campos son obligatorios" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email);
      return res.status(400).json({
        success: false,
        error: "El formato del correo electrónico no es válido"
      });
    }

    // Validate phone format (at least 8 digits)
    if (phone.length < 8) {
      console.log("❌ Invalid phone format:", phone);
      return res.status(400).json({
        success: false,
        error: "El teléfono debe tener al menos 8 dígitos"
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

    // Check for duplicate email
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

    // Check if workshop is full
    if (registrations.length >= workshopConfig.event.maxSeats) {
      console.log("❌ Workshop full:", registrations.length, ">=", workshopConfig.event.maxSeats);
      return res.status(400).json({
        success: false,
        error: "Lo sentimos, el taller está lleno"
      });
    }

    // Create new registration
    const newRegistration: RegistrationData = {
      name,
      email,
      phone,
      timestamp: new Date().toISOString(),
      paid: false
    };

    registrations.push(newRegistration);
    
    // Save to file
    try {
      await fs.writeFile(filePath, JSON.stringify(registrations, null, 2));
      console.log("✅ Registration saved to file");
    } catch (error) {
      console.error("❌ Error saving registration:", error);
      throw new Error("Error al guardar el registro");
    }

    // Generate QR code
    let qrCodeDataUrl = "";
    try {
      console.log("🔄 Generating QR code...");
      const qrString = `Registro Taller PNL | Nombre: ${name} | Email: ${email} | Tel: ${phone}`;
      qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 1,
        width: 300
      });
      console.log("✅ QR code generated successfully");
    } catch (error) {
      console.error("⚠️ Error generating QR code:", error);
      // Continue without QR - not critical
      qrCodeDataUrl = "";
    }

    // Send confirmation email
    let emailSent = false;
    try {
      console.log("📧 Attempting to send confirmation email...");
      emailSent = await sendConfirmationEmail(
        { name, email, phone },
        qrCodeDataUrl
      );
      console.log("📧 Email sent result:", emailSent);
    } catch (error) {
      console.error("⚠️ Error sending email:", error);
      // Email failure is not critical - user is registered
      emailSent = false;
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: emailSent 
        ? "¡Registro exitoso! Revisa tu email para los siguientes pasos."
        : "¡Registro exitoso! Te contactaremos pronto con los detalles.",
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("❌ Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return res.status(500).json({
      success: false,
      error: "Error al procesar el registro. Por favor, intenta de nuevo.",
    });
  }
}