"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById("registro");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0B1C2D]/95 backdrop-blur-md shadow-lg"
            : "bg-[#0B1C2D]"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo variant="light" />

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold rounded-full shadow-lg shadow-[#C6A75E]/20 hover:shadow-xl hover:shadow-[#C6A75E]/30 transition-all duration-300 hover:scale-105"
              >
                Reservar mi lugar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0B1C2D] border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold rounded-full shadow-lg"
              >
                Reservar mi lugar
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Sticky Mobile CTA Bar - Shows when scrolled past hero */}
      {isScrolled && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1C2D]/95 backdrop-blur-md border-t-2 border-[#C6A75E]/30 p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <Button
            onClick={scrollToForm}
            size="lg"
            className="w-full bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300"
          >
            Reservar mi lugar ahora
          </Button>
        </div>
      )}
    </>
  );
}