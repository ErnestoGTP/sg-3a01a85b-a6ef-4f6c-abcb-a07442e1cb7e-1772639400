import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "RamitapAdmin2026!";

    if (password === adminPassword) {
      res.setHeader(
        "Set-Cookie",
        `admin_token=authenticated; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`
      );
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ success: false, error: "Invalid password" });
  }

  if (req.method === "GET") {
    const token = req.cookies.admin_token;
    
    if (token === "authenticated") {
      return res.status(200).json({ authenticated: true });
    }

    return res.status(401).json({ authenticated: false });
  }

  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      `admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
    );
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}