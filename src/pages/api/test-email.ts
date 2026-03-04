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
    console.log("🧪 Testing email configuration with Nodemailer...");

    // Check if email is enabled
    if (process.env.EMAIL_ENABLED !== "true") {
      console.error("❌ EMAIL_ENABLED is not set to 'true'");
      return res.status(500).json({
        success: false,
        error: "Email system is disabled",
        hint: "Set EMAIL_ENABLED=true in your .env.local file"
      });
    }

    // Check if SMTP credentials exist
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ SMTP credentials are missing");
      return res.status(500).json({
        success: false,
        error: "SMTP credentials not configured",
        hint: "Add SMTP_HOST, SMTP_USER, and SMTP_PASS to your .env.local file"
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
    console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`📧 SMTP Port: ${process.env.SMTP_PORT || 465}`);
    console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
    console.log(`📧 Sending test email from: ${process.env.EMAIL_FROM}`);

    // Extract email from EMAIL_FROM
    const emailMatch = process.env.EMAIL_FROM.match(/<(.+)>/);
    const testRecipient = emailMatch ? emailMatch[1] : process.env.SMTP_USER;

    // Send test email
    const testData = {
      name: "Usuario de Prueba",
      email: testRecipient || "test@example.com",
      phone: "1234567890"
    };

    console.log(`📬 Test recipient: ${testData.email}`);

    const emailSent = await sendConfirmationEmail(testData);

    if (emailSent) {
      console.log("✅ Test email sent successfully via Nodemailer!");
      return res.status(200).json({
        success: true,
        message: "Test email sent successfully via Nodemailer! Check your inbox.",
        recipient: testData.email,
        smtp_host: process.env.SMTP_HOST,
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
      hint: "Check your SMTP credentials and EMAIL_FROM configuration"
    });
  }
}