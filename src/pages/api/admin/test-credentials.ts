import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Diagnostic endpoint to test admin credentials
 * This helps debug login issues
 * DELETE THIS FILE IN PRODUCTION
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || "ramitaptraining@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "RamitapAdmin2026!";

    const result = {
      timestamp: new Date().toISOString(),
      provided: {
        email: email,
        emailLength: email?.length || 0,
        emailLowerCase: email?.toLowerCase(),
        password: "***HIDDEN***",
        passwordLength: password?.length || 0,
        passwordFirstChar: password?.[0] || "",
        passwordLastChar: password?.[password?.length - 1] || "",
      },
      configured: {
        email: adminEmail,
        emailLength: adminEmail.length,
        emailLowerCase: adminEmail.toLowerCase(),
        password: "***HIDDEN***",
        passwordLength: adminPassword.length,
        passwordFirstChar: adminPassword[0],
        passwordLastChar: adminPassword[adminPassword.length - 1],
      },
      comparison: {
        emailMatch: email?.toLowerCase() === adminEmail.toLowerCase(),
        passwordMatch: password === adminPassword,
        passwordLengthMatch: password?.length === adminPassword.length,
      },
      diagnosis: "",
    };

    // Provide diagnosis
    if (!result.comparison.emailMatch) {
      result.diagnosis = "❌ Email no coincide con el configurado";
    } else if (!result.comparison.passwordLengthMatch) {
      result.diagnosis = `❌ Longitud de password incorrecta: esperado ${result.configured.passwordLength} chars, recibido ${result.provided.passwordLength} chars`;
    } else if (!result.comparison.passwordMatch) {
      result.diagnosis = "❌ Password incorrecto - caracteres no coinciden";
    } else {
      result.diagnosis = "✅ Credenciales correctas";
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Test credentials error:", error);
    return res.status(500).json({
      success: false,
      error: "Error al procesar la solicitud",
    });
  }
}