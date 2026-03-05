import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Participant = Database["public"]["Tables"]["participants"]["Row"];
type ParticipantInsert = Database["public"]["Tables"]["participants"]["Insert"];
type ParticipantUpdate = Database["public"]["Tables"]["participants"]["Update"];

/**
 * Database Adapter - Direct connection to Supabase
 * Simplified version without connection testing
 */

export class DatabaseAdapter {
  /**
   * Get all participants
   */
  static async getAllParticipants(): Promise<Participant[]> {
    try {
      console.log("📊 DatabaseAdapter: Fetching all participants...");
      
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ DatabaseAdapter: Error fetching participants:", error);
        return [];
      }

      console.log(`✅ DatabaseAdapter: Fetched ${data?.length || 0} participants`);
      return data || [];
    } catch (error) {
      console.error("❌ DatabaseAdapter: Exception fetching participants:", error);
      return [];
    }
  }

  /**
   * Create participant
   */
  static async createParticipant(participant: ParticipantInsert): Promise<Participant | null> {
    try {
      console.log("💾 DatabaseAdapter: Creating participant:", {
        name: participant.name,
        email: participant.email,
        phone: participant.phone
      });

      const { data, error } = await supabase
        .from("participants")
        .insert([participant])
        .select()
        .single();

      if (error) {
        console.error("❌ DatabaseAdapter: Error creating participant:", error);
        return null;
      }

      if (data) {
        console.log("✅ DatabaseAdapter: Participant created successfully:", data.id);
        return data;
      }

      console.log("⚠️ DatabaseAdapter: No data returned from insert");
      return null;
    } catch (error) {
      console.error("❌ DatabaseAdapter: Exception creating participant:", error);
      return null;
    }
  }

  /**
   * Update participant
   */
  static async updateParticipant(
    id: string,
    updates: ParticipantUpdate
  ): Promise<Participant | null> {
    try {
      console.log("🔄 DatabaseAdapter: Updating participant:", id);

      const { data, error } = await supabase
        .from("participants")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ DatabaseAdapter: Error updating participant:", error);
        return null;
      }

      if (data) {
        console.log("✅ DatabaseAdapter: Participant updated successfully:", data.id);
        return data;
      }

      return null;
    } catch (error) {
      console.error("❌ DatabaseAdapter: Exception updating participant:", error);
      return null;
    }
  }

  /**
   * Delete participant
   */
  static async deleteParticipant(id: string): Promise<boolean> {
    try {
      console.log("🗑️ DatabaseAdapter: Deleting participant:", id);

      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ DatabaseAdapter: Error deleting participant:", error);
        return false;
      }

      console.log("✅ DatabaseAdapter: Participant deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ DatabaseAdapter: Exception deleting participant:", error);
      return false;
    }
  }

  /**
   * Get participant by QR code
   */
  static async getParticipantByQRCode(qrCodeId: string): Promise<Participant | null> {
    try {
      console.log("🔍 DatabaseAdapter: Looking up participant by QR:", qrCodeId);

      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("qr_code_id", qrCodeId)
        .maybeSingle();

      if (error) {
        console.error("❌ DatabaseAdapter: Error fetching participant by QR:", error);
        return null;
      }

      if (data) {
        console.log("✅ DatabaseAdapter: Found participant:", data.name);
        return data;
      }

      console.log("⚠️ DatabaseAdapter: No participant found with QR:", qrCodeId);
      return null;
    } catch (error) {
      console.error("❌ DatabaseAdapter: Exception fetching participant by QR:", error);
      return null;
    }
  }

  /**
   * Get participant by email
   */
  static async getParticipantByEmail(email: string): Promise<Participant | null> {
    try {
      console.log("🔍 DatabaseAdapter: Looking up participant by email:", email);

      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("❌ DatabaseAdapter: Error fetching participant by email:", error);
        return null;
      }

      if (data) {
        console.log("✅ DatabaseAdapter: Found participant:", data.name);
        return data;
      }

      console.log("⚠️ DatabaseAdapter: No participant found with email:", email);
      return null;
    } catch (error) {
      console.error("❌ DatabaseAdapter: Exception fetching participant by email:", error);
      return null;
    }
  }
}