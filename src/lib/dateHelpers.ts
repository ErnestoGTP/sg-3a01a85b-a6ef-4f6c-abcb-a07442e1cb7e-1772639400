/**
 * Date formatting helpers with safe fallbacks
 * Prevents "Invalid Date" errors in production
 */

/**
 * Safely formats a date string to Spanish locale
 * @param dateString - Date string from database (e.g., "Domingo 22 de Marzo, 2026")
 * @param fallback - Fallback text if date is invalid
 * @returns Formatted date string or fallback
 */
export function getFormattedDate(
  dateString: string | Date | undefined | null,
  fallback: string = "Fecha por definir"
): string {
  try {
    // Handle null/undefined
    if (!dateString) return fallback;

    // If it's already a formatted string (contains Spanish words), return as-is
    if (typeof dateString === "string" && /^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/i.test(dateString)) {
      return dateString;
    }

    // Try to parse as Date
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateString);
      return fallback;
    }

    // Format to Spanish locale
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallback;
  }
}

/**
 * Safely formats a time string
 * @param timeString - Time string from database (e.g., "10:00 AM - 12:00 PM")
 * @param fallback - Fallback text if time is invalid
 * @returns Time string or fallback
 */
export function getFormattedTime(
  timeString: string | undefined | null,
  fallback: string = "Hora por definir"
): string {
  try {
    if (!timeString) return fallback;
    return timeString;
  } catch (error) {
    console.error("Error formatting time:", error);
    return fallback;
  }
}

/**
 * Safely formats a price string
 * @param priceString - Price string from database (e.g., "$800 MXN")
 * @param fallback - Fallback text if price is invalid
 * @returns Price string or fallback
 */
export function getFormattedPrice(
  priceString: string | undefined | null,
  fallback: string = "Precio por definir"
): string {
  try {
    if (!priceString) return fallback;
    return priceString;
  } catch (error) {
    console.error("Error formatting price:", error);
    return fallback;
  }
}

/**
 * Safely formats a location string
 * @param locationString - Location string from database
 * @param fallback - Fallback text if location is invalid
 * @returns Location string or fallback
 */
export function getFormattedLocation(
  locationString: string | undefined | null,
  fallback: string = "Ubicación por definir"
): string {
  try {
    if (!locationString) return fallback;
    return locationString;
  } catch (error) {
    console.error("Error formatting location:", error);
    return fallback;
  }
}