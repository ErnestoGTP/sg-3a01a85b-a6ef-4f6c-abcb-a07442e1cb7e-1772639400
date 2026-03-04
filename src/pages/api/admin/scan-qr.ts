import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic auth check
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const [email, password] = Buffer.from(token, "base64").toString().split(":");

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  try {
    const { qrCodeData } = req.body;

    if (!qrCodeData) {
      return res.status(400).json({ error: "Missing QR code data" });
    }

    // Extract QR code ID from scanned data
    // Format: "QR:PNL-1234567890-abc123|Name:John|Email:john@example.com|Phone:1234567890"
    const qrCodeIdMatch = qrCodeData.match(/QR:([^|]+)/);
    
    if (!qrCodeIdMatch || !qrCodeIdMatch[1]) {
      return res.status(400).json({ error: "Invalid QR code format" });
    }

    const qrCodeId = qrCodeIdMatch[1];

    // Find participant by QR code ID
    const { data: participant, error: findError } = await supabase
      .from("participants")
      .select("*")
      .eq("qr_code_id", qrCodeId)
      .maybeSingle();

    if (findError) throw findError;

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    // Check if already marked as present
    if (participant.attendance_status === "present") {
      return res.status(200).json({
        participant,
        message: "Participante ya registrado como presente",
        alreadyPresent: true
      });
    }

    // Mark as present
    const { data: updatedParticipant, error: updateError } = await supabase
      .from("participants")
      .update({
        attendance_status: "present",
        updated_at: new Date().toISOString()
      })
      .eq("id", participant.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      participant: updatedParticipant,
      message: "Asistencia registrada exitosamente",
      alreadyPresent: false
    });

  } catch (error) {
    console.error("Error scanning QR code:", error);
    return res.status(500).json({ error: "Failed to process QR code" });
  }
}