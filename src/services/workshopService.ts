import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type WorkshopConfig = Database["public"]["Tables"]["workshop_config"]["Row"];
type WorkshopConfigUpdate = Database["public"]["Tables"]["workshop_config"]["Update"];

/**
 * Get current workshop config
 */
export async function getWorkshopConfig(): Promise<WorkshopConfig | null> {
  const { data, error } = await supabase
    .from("workshop_config")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching workshop config:", error);
    return null;
  }

  return data;
}

/**
 * Update workshop config
 */
export async function updateWorkshopConfig(
  id: string,
  updates: WorkshopConfigUpdate
): Promise<WorkshopConfig> {
  const { data, error } = await supabase
    .from("workshop_config")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating workshop config:", error);
    throw error;
  }

  return data;
}