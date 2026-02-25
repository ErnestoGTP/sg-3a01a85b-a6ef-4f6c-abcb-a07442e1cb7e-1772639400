import { Logo } from "@/components/Logo";
import { workshopConfig } from "@/config/workshop";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1C2D] border-t border-[#C6A75E]/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-gray-400 text-sm max-w-xs">
              Transformamos vidas a través de la Programación Neurolingüística práctica y efectiva.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#C6A75E] font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Email: {workshopConfig.organizer.email}</p>
              <p>WhatsApp: {workshopConfig.contact.whatsappNumber}</p>
              <p>{workshopConfig.location.city}</p>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-[#C6A75E] font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-gray-400 text-sm hover:text-[#C6A75E] transition-colors">
                Aviso de Privacidad
              </Link>
              <Link href="#" className="block text-gray-400 text-sm hover:text-[#C6A75E] transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="#" className="block text-gray-400 text-sm hover:text-[#C6A75E] transition-colors">
                Política de Reembolso
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#C6A75E]/20 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {workshopConfig.brand.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}