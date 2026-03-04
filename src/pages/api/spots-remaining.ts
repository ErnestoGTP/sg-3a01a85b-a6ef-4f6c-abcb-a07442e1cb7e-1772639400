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
      const fileContent = await fs.readFile(filePath, "utf-8");
      registrations = JSON.parse(fileContent);
    } catch (error) {
      registrations = [];
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
    
    return res.status(200).json({
      success: true,
      spotsLeft: workshopConfig.event.maxSeats,
      totalSpots: workshopConfig.event.maxSeats,
      registrations: 0,
      percentageFilled: 0
    });
  }
}