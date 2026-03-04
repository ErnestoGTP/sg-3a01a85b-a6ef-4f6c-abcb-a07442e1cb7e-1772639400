import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Default fallback, should be set in env

  if (password === adminPassword) {
    // Set a simple cookie for auth
    res.setHeader(
      "Set-Cookie",
      `admin_token=authenticated; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}` // 24 hours
    );
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, error: "Invalid password" });
}