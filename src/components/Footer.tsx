"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LegalModal } from "@/components/LegalModal";
import { privacyPolicyContent, termsConditionsContent, refundPolicyContent } from "@/lib/legalContent";

type LegalSection = "privacy" | "terms" | "refund" | null;

export function Footer() {
  const [openModal, setOpenModal] = useState<LegalSection>(null);
  const currentYear = new Date().getFullYear();

  const openLegalModal = (section: LegalSection) => {
    setOpenModal(section);
  };

  const closeLegalModal = () => {
    setOpenModal(null);
  };

  const legalLinks = [
    { id: "privacy" as LegalSection, label: "Aviso de Privacidad", title: "Aviso de Privacidad", content: privacyPolicyContent },
    { id: "terms" as LegalSection, label: "Términos y Condiciones", title: "Términos y Condiciones", content: termsConditionsContent },
    { id: "refund" as LegalSection, label: "Política de Reembolso", title: "Política de Reembolso", content: refundPolicyContent }
  ];

  const currentModal = legalLinks.find(link => link.id === openModal);

  return (
    <>
      <footer className="bg-gradient-to-b from-[#0B1C2D] to-[#051220] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo & Description */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo variant="light" />
              </div>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                Transformando vidas a través de la Programación Neurolingüística en Hermosillo, Sonora
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 pb-8 border-b border-white/10">
              {legalLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => openLegalModal(link.id)}
                  className="text-sm text-gray-300 hover:text-[#C6A75E] transition-colors underline underline-offset-4 hover:underline-offset-8"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center text-sm text-gray-400">
              <p>© {currentYear} Ramitap Training. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {currentModal && (
        <LegalModal
          isOpen={openModal !== null}
          onClose={closeLegalModal}
          title={currentModal.title}
          content={currentModal.content}
        />
      )}
    </>
  );
}