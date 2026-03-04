import type { NextApiRequest, NextApiResponse } from "next";
import { workshopConfig } from "@/config/workshop";
import { promises as fs } from "fs";
import path from "path";

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  paid?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "registrations.json");
    
    let registrations: RegistrationData[] = [];
    
    try {
      // Ensure data directory exists
      const dirPath = path.join(process.cwd(), "data");
      await fs.mkdir(dirPath, { recursive: true });
      
      // Try to read the file
      const fileContent = await fs.readFile(filePath, "utf-8");
      registrations = JSON.parse(fileContent);
      
      // Ensure it's an array
      if (!Array.isArray(registrations)) {
        registrations = [];
      }
    } catch (error) {
      // File doesn't exist or is corrupted, create it
      registrations = [];
      try {
        await fs.writeFile(filePath, JSON.stringify(registrations, null, 2), "utf-8");
      } catch (writeError) {
        console.error("Error creating registrations file:", writeError);
      }
    }

    const spotsLeft = Math.max(0, workshopConfig.event.maxSeats - registrations.length);

    return res.status(200).json({
      success: true,
      spotsLeft,
      totalSpots: workshopConfig.event.maxSeats,
      registrations: registrations.length,
      percentageFilled: Math.round((registrations.length / workshopConfig.event.maxSeats) * 100)
    });

  } catch (error) {
    console.error("Error fetching spots:", error);
    
    // Return default values even on error so the component still works
    return res.status(200).json({
      success: true,
      spotsLeft: workshopConfig.event.maxSeats,
      totalSpots: workshopConfig.event.maxSeats,
      registrations: 0,
      percentageFilled: 0
    });
  }
}