import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo_blanco.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const showRealEstateProjects = false;

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/quienes-somos", label: t("nav.about") },
    { path: "/blog", label: t("nav.blog") },
    ...(showRealEstateProjects ? [{ path: "/proyectos-inmobiliarios", label: "Proyectos inmobiliarios" }] : []),
  ];

  const serviceLinks = [
    { path: "/servicios/reformas", label: t("nav.sustainableReforms") },
    { path: "/servicios/inversion", label: t("nav.realEstateInvestment") },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = () => location.pathname.startsWith("/servicios");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20 md:h-28">
          <Link to="/" className="flex items-center py-2 md:py-4">
            <img 
              src={logo} 
              alt="Proyectos MRR" 
              className="h-12 md:h-20 w-auto" 
              width="117" 
              height="80"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[#f8f1de]/90 hover:text-gold font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 ${
                  isActive(link.path)
                    ? "text-gold after:w-full"
                    : "after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-[#f8f1de]/90 hover:text-gold font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 ${
                  isServiceActive()
                    ? "text-gold after:w-full"
                    : "after:w-0 hover:after:w-full"
                }`}
              >
                {t("nav.services")}
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="bg-forest border border-cream/20 rounded-lg shadow-lg py-2 min-w-[220px]">
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2 text-[#f8f1de]/90 hover:text-gold hover:bg-cream/10 transition-colors duration-200 ${
                          isActive(link.path) ? "text-gold bg-cream/10" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/contacto">
              <Button variant="headerOutline" size="sm">
                {t("nav.contact")}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#f8f1de] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-forest/98 backdrop-blur-md border-t border-[#f8f1de]/10 animate-fade-in">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium py-2 transition-colors duration-300 ${
                    isActive(link.path) ? "text-gold" : "text-[#f8f1de]/90 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Services Submenu */}
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`flex items-center justify-between w-full text-lg font-medium py-2 transition-colors duration-300 ${
                    isServiceActive() ? "text-gold" : "text-[#f8f1de]/90 hover:text-gold"
                  }`}
                >
                  {t("nav.services")}
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} 
                  />
                </button>
                {isServicesOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l border-cream/20">
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block text-base py-2 transition-colors duration-300 ${
                          isActive(link.path) ? "text-gold" : "text-[#f8f1de]/90 hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>
                <Button variant="headerOutline" size="sm" className="w-full mt-2">
                  {t("nav.contact")}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
