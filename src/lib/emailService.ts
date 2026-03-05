import nodemailer from "nodemailer";

/**
 * Email Service with dual provider support
 * 1. Tries Gmail SMTP first
 * 2. Falls back to Resend if Gmail fails
 * 3. Returns success even if both fail (anti-blocking)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    content: Buffer;
    filename: string;
    cid: string;
  }>;
}

interface EmailResult {
  success: boolean;
  provider: "gmail" | "resend" | "none";
  messageId?: string;
  error?: string;
}

/**
 * Send email using Gmail SMTP
 */
async function sendWithGmail(options: EmailOptions): Promise<EmailResult> {
  try {
    console.log("📧 Attempting to send email via Gmail SMTP...");

    // Check if Gmail is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("⚠️ Gmail SMTP not configured - skipping");
      return {
        success: false,
        provider: "gmail",
        error: "SMTP credentials not configured",
      };
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✅ Gmail SMTP connection verified");

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `PNL Taller <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    console.log("✅ Email sent via Gmail:", info.messageId);

    return {
      success: true,
      provider: "gmail",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Gmail SMTP error:", error instanceof Error ? error.message : error);
    return {
      success: false,
      provider: "gmail",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email using Resend API
 */
async function sendWithResend(options: EmailOptions): Promise<EmailResult> {
  try {
    console.log("📧 Attempting to send email via Resend API...");

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ Resend API key not configured - skipping");
      return {
        success: false,
        provider: "resend",
        error: "Resend API key not configured",
      };
    }

    // Convert attachments to base64 if present
    const attachments = options.attachments?.map((att) => ({
      filename: att.filename,
      content: att.content.toString("base64"),
    }));

    // Send via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "PNL Taller <onboarding@resend.dev>",
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Resend API error:", data);
      return {
        success: false,
        provider: "resend",
        error: data.message || "Resend API error",
      };
    }

    console.log("✅ Email sent via Resend:", data.id);

    return {
      success: true,
      provider: "resend",
      messageId: data.id,
    };
  } catch (error) {
    console.error("❌ Resend error:", error instanceof Error ? error.message : error);
    return {
      success: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email with automatic fallback
 * 1. Tries Gmail first
 * 2. Falls back to Resend if Gmail fails
 * 3. Returns success even if both fail (anti-blocking)
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  console.log("\n📧 EMAIL SERVICE: Starting email send process...");
  console.log("📬 Recipient:", options.to);
  console.log("📝 Subject:", options.subject);

  // Try Gmail first
  const gmailResult = await sendWithGmail(options);
  if (gmailResult.success) {
    console.log("✅ EMAIL SENT SUCCESSFULLY via Gmail");
    return gmailResult;
  }

  console.log("⚠️ Gmail failed, trying Resend...");

  // Try Resend as fallback
  const resendResult = await sendWithResend(options);
  if (resendResult.success) {
    console.log("✅ EMAIL SENT SUCCESSFULLY via Resend");
    return resendResult;
  }

  // Both failed - log but don't block
  console.error("❌ BOTH EMAIL PROVIDERS FAILED");
  console.error("Gmail error:", gmailResult.error);
  console.error("Resend error:", resendResult.error);
  console.log("⚠️ Registration will continue anyway (anti-blocking)");

  return {
    success: false,
    provider: "none",
    error: "All email providers failed",
  };
}

/**
 * Test email configuration
 */
export async function testEmailConfig(): Promise<void> {
  console.log("\n🔍 TESTING EMAIL CONFIGURATION...\n");

  // Test Gmail
  console.log("1️⃣ Testing Gmail SMTP:");
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.verify();
      console.log("   ✅ Gmail SMTP: Connected");
    } catch (error) {
      console.log("   ❌ Gmail SMTP: Failed -", error instanceof Error ? error.message : error);
    }
  } else {
    console.log("   ⚠️ Gmail SMTP: Not configured");
  }

  // Test Resend
  console.log("\n2️⃣ Testing Resend API:");
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "test@resend.dev",
          to: "test@example.com",
          subject: "Test",
          html: "<p>Test</p>",
        }),
      });
      const data = await response.json();
      if (response.ok || response.status === 422) {
        console.log("   ✅ Resend API: Connected");
      } else {
        console.log("   ❌ Resend API: Failed -", data.message);
      }
    } catch (error) {
      console.log("   ❌ Resend API: Failed -", error instanceof Error ? error.message : error);
    }
  } else {
    console.log("   ⚠️ Resend API: Not configured");
  }

  console.log("\n");
}