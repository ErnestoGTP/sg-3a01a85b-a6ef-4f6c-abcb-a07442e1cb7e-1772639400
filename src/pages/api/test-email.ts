import type { NextApiRequest, NextApiResponse } from "next";
import { sendConfirmationEmail } from "@/lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      error: "Method not allowed. Use POST." 
    });
  }

  try {
    console.log("🧪 Testing Resend email configuration...");

    // Check if email is enabled
    if (process.env.EMAIL_ENABLED !== "true") {
      console.error("❌ EMAIL_ENABLED is not set to 'true'");
      return res.status(500).json({
        success: false,
        error: "Email system is disabled",
        hint: "Set EMAIL_ENABLED=true in your .env.local file"
      });
    }

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing");
      return res.status(500).json({
        success: false,
        error: "RESEND_API_KEY is not configured",
        hint: "Add RESEND_API_KEY=re_your_key to your .env.local file"
      });
    }

    // Check if EMAIL_FROM exists
    if (!process.env.EMAIL_FROM) {
      console.error("❌ EMAIL_FROM is missing");
      return res.status(500).json({
        success: false,
        error: "EMAIL_FROM is not configured",
        hint: "Add EMAIL_FROM=Your Name <email@example.com> to your .env.local file"
      });
    }

    console.log("✅ Environment variables configured correctly");
    console.log(`📧 Sending test email from: ${process.env.EMAIL_FROM}`);

    // Send test email
    const testData = {
      name: "Usuario de Prueba",
      email: process.env.EMAIL_FROM.match(/<(.+)>/)?.[1] || "test@example.com",
      phone: "1234567890"
    };

    console.log(`📬 Test recipient: ${testData.email}`);

    const emailSent = await sendConfirmationEmail(testData);

    if (emailSent) {
      console.log("✅ Test email sent successfully!");
      return res.status(200).json({
        success: true,
        message: "Test email sent successfully! Check your inbox.",
        recipient: testData.email,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error("❌ Failed to send test email");
      return res.status(500).json({
        success: false,
        error: "Failed to send test email. Check server logs for details."
      });
    }

  } catch (error: any) {
    console.error("❌ Error testing email configuration:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error occurred",
      details: error.toString(),
      hint: "Check your RESEND_API_KEY and EMAIL_FROM configuration"
    });
  }
}