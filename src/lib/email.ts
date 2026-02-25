import { workshopConfig } from "@/config/workshop";

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

export const generateEmailHtml = (data: RegistrationData) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background-color: #0B1C2D; padding: 30px 20px; text-align: center; }
    .header h1 { color: #C6A75E; margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .details-box { background-color: #f8f9fa; border-left: 4px solid #C6A75E; padding: 20px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    .button { display: inline-block; padding: 12px 24px; background-color: #C6A75E; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
    .info-item { margin-bottom: 10px; }
    .label { font-weight: bold; color: #0B1C2D; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Registro Confirmado!</h1>
    </div>
    
    <div class="content">
      <p>Hola <strong>${data.name}</strong>,</p>
      
      <p>¡Felicidades! Has dado un gran paso para transformar tu comunicación y resultados. Tu lugar para el <strong>${workshopConfig.event.title}</strong> ha sido reservado correctamente.</p>
      
      <div class="details-box">
        <div class="info-item"><span class="label">📅 Fecha:</span> ${workshopConfig.event.date}</div>
        <div class="info-item"><span class="label">⏰ Horario:</span> ${workshopConfig.event.time}</div>
        <div class="info-item"><span class="label">📍 Ubicación:</span> ${workshopConfig.location.name}</div>
        <div class="info-item"><span class="label">🗺️ Dirección:</span> ${workshopConfig.location.fullAddress}</div>
        <div class="info-item"><span class="label">💰 Inversión:</span> ${workshopConfig.pricing.price}</div>
      </div>

      <h3>📌 Próximos pasos:</h3>
      <ol>
        <li>Agenda la fecha en tu calendario.</li>
        <li>Llega 15 minutos antes para el registro.</li>
        <li>Prepárate para aprender y practicar.</li>
      </ol>

      <p>Si tienes alguna duda urgente, puedes contactarnos directamente por WhatsApp:</p>
      
      <center>
        <a href="https://wa.me/${workshopConfig.contact.whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, tengo una duda sobre mi registro al taller.")}" class="button">
          Contactar por WhatsApp
        </a>
      </center>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} ${workshopConfig.brand.name}. Todos los derechos reservados.</p>
      <p>${workshopConfig.organizer.email} | ${workshopConfig.location.city}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}