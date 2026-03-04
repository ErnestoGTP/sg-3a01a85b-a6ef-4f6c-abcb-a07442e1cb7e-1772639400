import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Participant = Database["public"]["Tables"]["participants"]["Row"];
type ParticipantInsert = Database["public"]["Tables"]["participants"]["Insert"];
type ParticipantUpdate = Database["public"]["Tables"]["participants"]["Update"];

/**
 * Get all participants
 */
export async function getAllParticipants(): Promise<Participant[]> {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get participant by QR code ID
 */
export async function getParticipantByQRCode(qrCodeId: string): Promise<Participant | null> {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("qr_code_id", qrCodeId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching participant by QR:", error);
    throw error;
  }

  return data;
}

/**
 * Create new participant
 */
export async function createParticipant(participant: ParticipantInsert): Promise<Participant> {
  const { data, error } = await supabase
    .from("participants")
    .insert(participant)
    .select()
    .single();

  if (error) {
    console.error("Error creating participant:", error);
    throw error;
  }

  return data;
}

/**
 * Update participant
 */
export async function updateParticipant(
  id: string,
  updates: ParticipantUpdate
): Promise<Participant> {
  const { data, error } = await supabase
    .from("participants")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating participant:", error);
    throw error;
  }

  return data;
}

/**
 * Delete participant
 */
export async function deleteParticipant(id: string): Promise<void> {
  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting participant:", error);
    throw error;
  }
}

/**
 * Mark participant as present
 */
export async function markParticipantPresent(qrCodeId: string): Promise<Participant> {
  const participant = await getParticipantByQRCode(qrCodeId);
  
  if (!participant) {
    throw new Error("Participant not found");
  }

  return updateParticipant(participant.id, {
    attendance_status: "present"
  });
}