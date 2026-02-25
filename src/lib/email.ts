import { workshopConfig } from "@/config/workshop";

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

export function generateEmailHtml(data: RegistrationData): string {
  const { name, email, phone } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0B1C2D; padding: 20px; text-align: center; }
    .header h1 { color: #C6A75E; margin: 0; }
    .content { padding: 20px; background-color: #ffffff; }
    .details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #C6A75E; }
    .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmación de Registro</h1>
    </div>
    <div class="content">
      <p>Hola <strong>${name}</strong>,</p>
      
      <p>¡Te has registrado exitosamente al <strong>${workshopConfig.event.title}</strong>!</p>
      
      <p>Estamos emocionados de que nos acompañes en esta experiencia de transformación.</p>
      
      <div class="details">
        <h3>Detalles del Evento:</h3>
        <p><strong>📅 Fecha:</strong> ${workshopConfig.event.date}</p>
        <p><strong>⏰ Hora:</strong> ${workshopConfig.event.time}</p>
        <p><strong>📍 Ciudad:</strong> ${workshopConfig.location.city}</p>
        <p><strong>💰 Inversión:</strong> ${workshopConfig.pricing.price} (Pago único)</p>
        
        <p style="margin-top: 15px; font-style: italic; color: #555;">
          ℹ️ <strong>Importante:</strong> La ubicación exacta del lugar te la enviaremos en un segundo correo o vía WhatsApp antes del evento.
        </p>
      </div>

      <p><strong>Tus datos registrados:</strong></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Teléfono: ${phone}</li>
      </ul>

      <div style="margin-top: 30px; text-align: center;">
        <p>¿Tienes alguna duda o necesitas realizar tu pago?</p>
        <a href="https://wa.me/${workshopConfig.contact.whatsappNumber.replace('+', '')}?text=Hola,%20recibí%20mi%20confirmación%20del%20taller%20de%20PNL.%20Tengo%20una%20duda." class="button">
          Contactar por WhatsApp
        </a>
      </div>
      
      <p style="margin-top: 30px;">
        <strong>Política de Cancelación:</strong><br>
        Puedes cancelar tu asistencia hasta 48 horas antes del evento.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${workshopConfig.organizer.name}</p>
      <p>Este correo fue enviado a ${email}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}