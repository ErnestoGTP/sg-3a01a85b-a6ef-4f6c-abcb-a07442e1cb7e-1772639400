import { workshopConfig } from "@/config/workshop";

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

export function generateConfirmationEmail(data: RegistrationData): string {
  const { name, email, phone } = data;
  const { event, contact } = workshopConfig;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Registro - Taller PNL</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B1C2D 0%, #1a2f45 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #C6A75E; margin: 0; font-size: 28px; font-weight: bold;">
                ¡Registro Confirmado!
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">
                ${event.title}
              </p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #0B1C2D; font-size: 18px; margin: 0 0 20px 0;">
                Hola <strong>${name}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ¡Gracias por registrarte! Estamos emocionados de tenerte en nuestro taller de PNL. Este es el comienzo de tu transformación personal.
              </p>
            </td>
          </tr>

          <!-- Event Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; border-left: 4px solid #C6A75E;">
                <tr>
                  <td>
                    <h2 style="color: #0B1C2D; font-size: 20px; margin: 0 0 20px 0;">
                      📅 Detalles del Evento
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; width: 100px;">Fecha:</td>
                        <td style="color: #0B1C2D; font-size: 14px;">${event.date}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Hora:</td>
                        <td style="color: #0B1C2D; font-size: 14px;">${event.time}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Duración:</td>
                        <td style="color: #0B1C2D; font-size: 14px;">${event.duration}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Ubicación:</td>
                        <td style="color: #0B1C2D; font-size: 14px;">${event.location}<br/><span style="color: #666666;">${event.address}</span></td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Inversión:</td>
                        <td style="color: #0B1C2D; font-size: 14px;">${event.price}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Your Registration Info -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff9f0; border-radius: 12px; padding: 20px; border: 2px solid #C6A75E;">
                <tr>
                  <td>
                    <h3 style="color: #0B1C2D; font-size: 18px; margin: 0 0 15px 0;">
                      📋 Tus Datos de Registro
                    </h3>
                    <p style="color: #333333; font-size: 14px; margin: 0 0 8px 0;">
                      <strong>Nombre:</strong> ${name}
                    </p>
                    <p style="color: #333333; font-size: 14px; margin: 0 0 8px 0;">
                      <strong>Email:</strong> ${email}
                    </p>
                    <p style="color: #333333; font-size: 14px; margin: 0;">
                      <strong>Teléfono:</strong> ${phone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Bring -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="color: #0B1C2D; font-size: 18px; margin: 0 0 15px 0;">
                🎒 Qué traer al taller
              </h3>
              <ul style="color: #333333; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Actitud abierta y ganas de aprender</li>
                <li>Cuaderno y bolígrafo para tomar notas</li>
                <li>Llega 10 minutos antes para el registro</li>
              </ul>
            </td>
          </tr>

          <!-- Bonus Reminder -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0B1C2D 0%, #1a2f45 100%); border-radius: 12px; padding: 25px;">
                <tr>
                  <td>
                    <p style="color: #C6A75E; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                      🎁 Tu Regalo de Bienvenida
                    </p>
                    <p style="color: #ffffff; font-size: 14px; margin: 0;">
                      Recibirás tu plantilla PDF "Reencuadre en 3 Pasos" en un correo separado en las próximas 24 horas.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cancellation Policy -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="color: #0B1C2D; font-size: 16px; margin: 0 0 10px 0;">
                📋 Política de Cancelación
              </h3>
              <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0;">
                Puedes cancelar tu registro hasta 48 horas antes del evento sin penalización. Para cancelaciones, contacta directamente por WhatsApp o email.
              </p>
            </td>
          </tr>

          <!-- WhatsApp CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <p style="color: #333333; font-size: 14px; margin: 0 0 20px 0;">
                ¿Tienes preguntas? Contáctanos directamente:
              </p>
              <a href="https://wa.me/${contact.whatsapp.replace(/\+/g, "")}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20registro%20al%20taller%20de%20PNL" 
                 style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
                💬 Contactar por WhatsApp
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #0B1C2D; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                ${contact.organizerName}
              </p>
              <p style="color: #666666; font-size: 13px; margin: 0 0 15px 0;">
                Email: ${contact.email}
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${contact.organizerName}. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}