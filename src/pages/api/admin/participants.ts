import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Basic auth check (use the same admin credentials)
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

  // GET - List all participants
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return res.status(200).json({ participants: data || [] });
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({ error: "Failed to fetch participants" });
    }
  }

  // POST - Create new participant manually
  if (req.method === "POST") {
    try {
      const { name, email, phone, payment_status } = req.body;

      if (!name || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate unique QR code ID
      const qrCodeId = `PNL-MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await supabase
        .from("participants")
        .insert({
          name,
          email,
          phone,
          qr_code_id: qrCodeId,
          payment_status: payment_status || "paid",
          attendance_status: "pending"
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ participant: data });
    } catch (error) {
      console.error("Error creating participant:", error);
      return res.status(500).json({ error: "Failed to create participant" });
    }
  }

  // PATCH - Update participant
  if (req.method === "PATCH") {
    try {
      const { id, payment_status, attendance_status } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing participant ID" });
      }

      const updates: any = { updated_at: new Date().toISOString() };
      if (payment_status) updates.payment_status = payment_status;
      if (attendance_status) updates.attendance_status = attendance_status;

      const { data, error } = await supabase
        .from("participants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ participant: data });
    } catch (error) {
      console.error("Error updating participant:", error);
      return res.status(500).json({ error: "Failed to update participant" });
    }
  }

  // DELETE - Remove participant
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing participant ID" });
      }

      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return res.status(200).json({ message: "Participant deleted successfully" });
    } catch (error) {
      console.error("Error deleting participant:", error);
      return res.status(500).json({ error: "Failed to delete participant" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}