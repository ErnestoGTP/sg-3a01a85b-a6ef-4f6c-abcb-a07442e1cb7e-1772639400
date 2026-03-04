import type { NextApiRequest, NextApiResponse } from "next";
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
  // Simple auth check via cookie
  const { cookie } = req.headers;
  if (!cookie?.includes("admin_token=authenticated")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const filePath = path.join(process.cwd(), "data", "registrations.json");

  // GET: Fetch all registrations
  if (req.method === "GET") {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const registrations: RegistrationData[] = JSON.parse(fileContent);
      return res.status(200).json(registrations);
    } catch (error) {
      return res.status(200).json([]); // Return empty array if file doesn't exist
    }
  }

  // PATCH: Update payment status
  if (req.method === "PATCH") {
    try {
      const { email, paid } = req.body;
      const fileContent = await fs.readFile(filePath, "utf-8");
      const registrations: RegistrationData[] = JSON.parse(fileContent);

      const updatedRegistrations = registrations.map((reg) =>
        reg.email === email ? { ...reg, paid } : reg
      );

      await fs.writeFile(filePath, JSON.stringify(updatedRegistrations, null, 2));
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update registration" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}