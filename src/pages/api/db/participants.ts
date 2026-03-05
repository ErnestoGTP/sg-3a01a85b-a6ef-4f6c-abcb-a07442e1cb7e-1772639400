import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

/**
 * DATABASE PROXY API
 * Handles all participant operations using Supabase client
 * Used by registration form and admin dashboard
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET: Fetch all participants (public endpoint for now)
    if (req.method === "GET") {
      console.log("📊 Fetching all participants...");
      
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching participants:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log(`✅ Fetched ${data?.length || 0} participants`);
      
      return res.status(200).json({
        success: true,
        participants: data || []
      });
    }

    // POST: Create new participant (public for registration)
    if (req.method === "POST") {
      const { name, email, phone, qr_code_id, payment_status, attendance_status } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields"
        });
      }

      console.log("➕ Creating participant:", { name, email, phone });

      const { data, error } = await supabase
        .from("participants")
        .insert([{
          name,
          email,
          phone,
          qr_code_id: qr_code_id || `PNL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          payment_status: payment_status || "pending",
          attendance_status: attendance_status || "pending"
        }])
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating participant:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      if (data) {
        console.log("✅ Participant created:", data.id);
        return res.status(201).json({
          success: true,
          participant: data
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to create participant"
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