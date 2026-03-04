import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - Public endpoint for reading workshop config
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("workshop_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      return res.status(200).json({ config: data });
    } catch (error) {
      console.error("Error fetching workshop config:", error);
      return res.status(500).json({ error: "Failed to fetch config" });
    }
  }

  // POST/PATCH - Protected endpoints for updating config
  if (req.method === "POST" || req.method === "PATCH") {
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
      const { title, date, time, location, price } = req.body;

      if (!title || !date || !time || !location || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get current config
      const { data: currentConfig } = await supabase
        .from("workshop_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let result;

      if (currentConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from("workshop_config")
          .update({
            title,
            date,
            time,
            location,
            price,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentConfig.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new config
        const { data, error } = await supabase
          .from("workshop_config")
          .insert({
            title,
            date,
            time,
            location,
            price
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return res.status(200).json({ config: result });
    } catch (error) {
      console.error("Error updating workshop config:", error);
      return res.status(500).json({ error: "Failed to update config" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}