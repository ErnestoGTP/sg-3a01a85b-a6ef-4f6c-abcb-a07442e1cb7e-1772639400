import type { NextApiRequest, NextApiResponse } from "next";
import { sendConfirmationEmail } from "@/lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Test data
    const testData = {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890"
    };

    console.log("🧪 Testing email configuration...");
    console.log("EMAIL_ENABLED:", process.env.EMAIL_ENABLED);
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER ? "✅ Set" : "❌ Not set");
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Set" : "❌ Not set");

    if (process.env.EMAIL_ENABLED !== "true") {
      return res.status(400).json({
        success: false,
        message: "Email is disabled. Set EMAIL_ENABLED=true in .env.local"
      });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({
        success: false,
        message: "SMTP credentials missing. Check SMTP_USER and SMTP_PASS in .env.local"
      });
    }

    const emailSent = await sendConfirmationEmail(testData);

    if (emailSent) {
      console.log("✅ Test email sent successfully!");
      return res.status(200).json({
        success: true,
        message: "Test email sent successfully! Check your inbox."
      });
    } else {
      console.log("❌ Email failed to send");
      return res.status(500).json({
        success: false,
        message: "Email failed to send. Check server logs for details."
      });
    }
  } catch (error: any) {
    console.error("❌ Email test error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error testing email configuration",
      error: error.toString()
    });
  }
}