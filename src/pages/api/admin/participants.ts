import type { NextApiRequest, NextApiResponse } from "next";
import { DatabaseAdapter } from "@/lib/dbAdapter";

/**
 * ADMIN API: Manage participants
 * GET: Fetch all participants
 * POST: Create new participant
 * PATCH: Update participant status
 * DELETE: Delete participant
 */

// Simple auth check using environment variables
function isAuthenticated(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  const adminEmail = process.env.ADMIN_EMAIL || "ramitaptraining@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Ramitap2025!";
  
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email, password] = decoded.split(":");
    return email === adminEmail && password === adminPassword;
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // GET: Fetch all participants
    if (req.method === "GET") {
      console.log("📊 Fetching all participants from database...");
      
      const participants = await DatabaseAdapter.getAllParticipants();

      console.log(`✅ Fetched ${participants.length} participants`);
      
      return res.status(200).json({
        success: true,
        participants
      });
    }

    // POST: Create new participant
    if (req.method === "POST") {
      const { name, email, phone, payment_status } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields"
        });
      }

      console.log("➕ Creating new participant:", { name, email, phone });

      // Generate QR code ID
      const qrCodeId = `PNL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const participant = await DatabaseAdapter.createParticipant({
        name,
        email,
        phone,
        qr_code_id: qrCodeId,
        payment_status: payment_status || "paid",
        attendance_status: "pending"
      });

      if (!participant) {
        throw new Error("Failed to create participant");
      }

      console.log("✅ Participant created:", participant.id);

      return res.status(201).json({
        success: true,
        participant
      });
    }

    // PATCH: Update participant
    if (req.method === "PATCH") {
      const { id, payment_status, attendance_status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Participant ID is required"
        });
      }

      console.log("🔄 Updating participant:", { id, payment_status, attendance_status });

      const updates: any = {};
      if (payment_status) updates.payment_status = payment_status;
      if (attendance_status) updates.attendance_status = attendance_status;

      const participant = await DatabaseAdapter.updateParticipant(id, updates);

      if (!participant) {
        throw new Error("Failed to update participant");
      }

      console.log("✅ Participant updated:", participant.id);

      return res.status(200).json({
        success: true,
        participant
      });
    }

    // DELETE: Delete participant
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          error: "Participant ID is required"
        });
      }

      console.log("🗑️ Deleting participant:", id);

      const success = await DatabaseAdapter.deleteParticipant(id);

      if (!success) {
        throw new Error("Failed to delete participant");
      }

      console.log("✅ Participant deleted:", id);

      return res.status(200).json({
        success: true,
        message: "Participant deleted successfully"
      });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    console.error("❌ API error:", error);
    
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}