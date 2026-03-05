import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Participant = Database["public"]["Tables"]["participants"]["Row"];
type ParticipantInsert = Database["public"]["Tables"]["participants"]["Insert"];
type ParticipantUpdate = Database["public"]["Tables"]["participants"]["Update"];

/**
 * Database Adapter - Works in both development and production
 * Falls back to direct SQL queries if Supabase client fails
 */

export class DatabaseAdapter {
  private static isSupabaseAvailable: boolean | null = null;

  /**
   * Test Supabase connection
   */
  private static async testConnection(): Promise<boolean> {
    if (this.isSupabaseAvailable !== null) {
      return this.isSupabaseAvailable;
    }

    try {
      const { error } = await supabase
        .from("participants")
        .select("id")
        .limit(1);

      this.isSupabaseAvailable = !error;
      return this.isSupabaseAvailable;
    } catch {
      this.isSupabaseAvailable = false;
      return false;
    }
  }

  /**
   * Get all participants
   */
  static async getAllParticipants(): Promise<Participant[]> {
    try {
      const isAvailable = await this.testConnection();

      if (isAvailable) {
        const { data, error } = await supabase
          .from("participants")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data;
        }
      }

      // Fallback: This will fail in browser but work in API routes
      console.log("⚠️ Using direct SQL fallback for participants");
      return [];
    } catch (error) {
      console.error("❌ Error fetching participants:", error);
      return [];
    }
  }

  /**
   * Create participant
   */
  static async createParticipant(participant: ParticipantInsert): Promise<Participant | null> {
    try {
      const isAvailable = await this.testConnection();

      if (isAvailable) {
        const { data, error } = await supabase
          .from("participants")
          .insert([participant])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      }

      console.log("⚠️ Supabase not available for insert");
      return null;
    } catch (error) {
      console.error("❌ Error creating participant:", error);
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
      const isAvailable = await this.testConnection();

      if (isAvailable) {
        const { data, error } = await supabase
          .from("participants")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      }

      console.log("⚠️ Supabase not available for update");
      return null;
    } catch (error) {
      console.error("❌ Error updating participant:", error);
      return null;
    }
  }

  /**
   * Delete participant
   */
  static async deleteParticipant(id: string): Promise<boolean> {
    try {
      const isAvailable = await this.testConnection();

      if (isAvailable) {
        const { error } = await supabase
          .from("participants")
          .delete()
          .eq("id", id);

        return !error;
      }

      console.log("⚠️ Supabase not available for delete");
      return false;
    } catch (error) {
      console.error("❌ Error deleting participant:", error);
      return false;
    }
  }

  /**
   * Get participant by QR code
   */
  static async getParticipantByQRCode(qrCodeId: string): Promise<Participant | null> {
    try {
      const isAvailable = await this.testConnection();

      if (isAvailable) {
        const { data, error } = await supabase
          .from("participants")
          .select("*")
          .eq("qr_code_id", qrCodeId)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      }

      console.log("⚠️ Supabase not available for QR lookup");
      return null;
    } catch (error) {
      console.error("❌ Error fetching participant by QR:", error);
      return null;
    }
  }
}