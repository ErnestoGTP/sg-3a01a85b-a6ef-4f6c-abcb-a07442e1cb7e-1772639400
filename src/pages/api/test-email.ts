import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail, testEmailConfig } from "@/lib/emailService";

/**
 * Test endpoint for email configuration
 * GET /api/test-email - Test email providers
 * POST /api/test-email - Send test email
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET: Test configuration
  if (req.method === "GET") {
    console.log("\n🔍 TESTING EMAIL CONFIGURATION VIA API...\n");
    
    await testEmailConfig();
    
    return res.status(200).json({
      message: "Email configuration test completed. Check server logs for details.",
      gmail: {
        configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
        user: process.env.SMTP_USER || "not configured",
      },
      resend: {
        configured: !!process.env.RESEND_API_KEY,
        key: process.env.RESEND_API_KEY ? "configured" : "not configured",
      },
    });
  }

  // POST: Send test email
  if (req.method === "POST") {
    try {
      const { to } = req.body;

      if (!to) {
        return res.status(400).json({ error: "Email address required" });
      }

      console.log("\n📧 SENDING TEST EMAIL TO:", to, "\n");

      const result = await sendEmail({
        to,
        subject: "Test Email - PNL Fundamental",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Test Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 40px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px;">
              <h1 style="color: #0B1C2D; margin-bottom: 20px;">✅ Email Test Successful</h1>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                This is a test email from your PNL Fundamental registration system.
              </p>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                If you received this email, your email configuration is working correctly! 🎉
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #718096; font-size: 14px;">
                <strong>Sent via:</strong> ${result.provider}<br>
                <strong>Message ID:</strong> ${result.messageId || "N/A"}<br>
                <strong>Timestamp:</strong> ${new Date().toISOString()}
              </p>
            </div>
          </body>
          </html>
        `,
      });

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: `Test email sent successfully via ${result.provider}`,
          provider: result.provider,
          messageId: result.messageId,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send test email",
          error: result.error,
        });
      }
    } catch (error) {
      console.error("❌ Test email error:", error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}