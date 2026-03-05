import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface ParticipantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  qr_code_id: string;
  payment_status: "pending" | "confirmed";
  attendance_status: "pending" | "confirmed" | "absent";
  created_at: string;
}

/**
 * Save participant to JSON file (temporary storage until Supabase is reconnected)
 */
export async function saveParticipant(data: Omit<ParticipantData, "id" | "created_at">): Promise<ParticipantData> {
  try {
    // Read existing data
    let participants: ParticipantData[] = [];
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const fileContent = fs.readFileSync(REGISTRATIONS_FILE, "utf8");
      participants = JSON.parse(fileContent);
    }

    // Create new participant
    const newParticipant: ParticipantData = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      created_at: new Date().toISOString(),
    };

    // Add to array
    participants.push(newParticipant);

    // Save to file
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(participants, null, 2), "utf8");

    console.log("✅ Participant saved to file storage:", newParticipant.id);
    return newParticipant;
  } catch (error) {
    console.error("❌ Error saving participant to file:", error);
    throw error;
  }
}

/**
 * Get all participants from file storage
 */
export async function getAllParticipants(): Promise<ParticipantData[]> {
  try {
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
      return [];
    }

    const fileContent = fs.readFileSync(REGISTRATIONS_FILE, "utf8");
    const participants = JSON.parse(fileContent);
    return participants;
  } catch (error) {
    console.error("❌ Error reading participants from file:", error);
    return [];
  }
}

/**
 * Get participant by email
 */
export async function getParticipantByEmail(email: string): Promise<ParticipantData | null> {
  try {
    const participants = await getAllParticipants();
    return participants.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error("❌ Error finding participant:", error);
    return null;
  }
}

/**
 * Update participant
 */
export async function updateParticipant(id: string, updates: Partial<ParticipantData>): Promise<ParticipantData | null> {
  try {
    const participants = await getAllParticipants();
    const index = participants.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    participants[index] = { ...participants[index], ...updates };
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(participants, null, 2), "utf8");

    console.log("✅ Participant updated in file storage:", id);
    return participants[index];
  } catch (error) {
    console.error("❌ Error updating participant:", error);
    return null;
  }
}