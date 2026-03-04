"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { workshopConfig } from "@/config/workshop";

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

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const menuItems = [
    { label: "Inicio", id: "hero" },
    { label: "¿Qué es PNL?", id: "que-es-pnl" },
    { label: "Aprenderás", id: "aprenderas" },
    { label: "Detalles", id: "detalles" },
    { label: "Registro", id: "registro" },
    { label: "FAQ", id: "faq" },
  ];

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
            {/* Logo and Brand - Mobile */}
            <Link href="/" className="flex items-center space-x-3 lg:hidden">
              <Logo className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">
                  Ramitap Training
                </span>
                <span className="text-xs text-gold-light">
                  {workshopConfig.brand.tagline}
                </span>
              </div>
            </Link>

            {/* Logo and Brand - Desktop/Tablet */}
            <Link href="/" className="hidden lg:flex items-center space-x-3">
              <Logo className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white">
                  Ramitap Training
                </span>
                <span className="text-sm text-gold-light">
                  {workshopConfig.brand.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white/80 hover:text-[#C6A75E] transition-colors text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("registro")}
                className="bg-[#C6A75E] hover:bg-[#C6A75E]/90 text-[#0B1C2D] font-semibold"
              >
                Inscríbete
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <Logo variant="light" size="sm" />
              <span className="text-white font-semibold">
                {workshopConfig.brand.name}
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col py-6 px-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all transform hover:translate-x-1"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}

            <div className="pt-4">
              <Button
                onClick={() => scrollToSection("registro")}
                className="w-full bg-[#C6A75E] hover:bg-[#C6A75E]/90 text-[#0B1C2D] font-semibold py-3 text-lg"
              >
                Inscríbete Ahora
              </Button>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">
                {workshopConfig.event.name}
              </p>
              <p className="text-[#C6A75E] font-semibold text-sm">
                {workshopConfig.event.date}
              </p>
              <p className="text-white/60 text-sm">
                {workshopConfig.event.time}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}