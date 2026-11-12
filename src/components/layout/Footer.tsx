import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo_blanco.svg";
import linkedinIcon from "@/assets/linkedin.svg";
import instagramIcon from "@/assets/instagram.svg";
import whatsappIcon from "@/assets/whatsapp.svg";
import LanguageSelector from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { t } = useTranslation();
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Hola, me gustaría obtener más información sobre vuestros servicios."
  );

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["whatsapp_number", "whatsapp_message", "whatsapp_enabled"])
      .then(({ data }) => {
        if (!data) return;
        data.forEach((row) => {
          if (row.key === "whatsapp_number") setWhatsappNumber(row.value);
          if (row.key === "whatsapp_message" && row.value) setWhatsappMessage(row.value);
          if (row.key === "whatsapp_enabled") setWhatsappEnabled(row.value !== "false");
        });
      });
  }, []);

  const whatsappLink = whatsappEnabled && whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <footer className="bg-gradient-hero text-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <img 
              src={logo} 
              alt="Proyectos MRR" 
              className="h-20 w-auto mb-4" 
              width="117" 
              height="80"
            />
            <p className="text-cream/70 text-sm leading-relaxed mt-4">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-cream/70 hover:text-gold transition-colors duration-300">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-cream/70 hover:text-gold transition-colors duration-300">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-cream/70 hover:text-gold transition-colors duration-300">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-cream/70 hover:text-gold transition-colors duration-300">
                  {t("nav.contact")}
                </Link>
              </li>
              <li className="mt-4">
                <LanguageSelector />
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold mb-4">{t("footer.services")}</h4>
            <ul className="space-y-3 text-cream/70">
              <li>{t("footer.sustainableReforms")}</li>
              <li>{t("footer.realEstateInvestment")}</li>
              <li>{t("footer.projectManagement")}</li>
              <li>{t("footer.consulting")}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-cream/70">
                <Phone size={18} className="text-gold" />
                <span>+34 711 25 33 61</span>
              </li>
              <li className="flex items-center gap-3 text-cream/70">
                <Mail size={18} className="text-gold" />
                <span>info@proyectosmrr.es</span>
              </li>
              <li className="flex items-start gap-3 text-cream/70">
                <MapPin size={18} className="text-gold mt-1" />
                <span>Calle Jose Calvo 6, 28039 Madrid</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.linkedin.com/company/proyectos-mrr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-300"
                aria-label="LinkedIn"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" width="24" height="24" />
              </a>
              <a
                href="https://www.instagram.com/proyectosmrr_/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-300"
                aria-label="Instagram"
              >
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6" width="24" height="24" />
              </a>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                  aria-label="WhatsApp"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" width="24" height="24" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/50 text-sm">
              © {new Date().getFullYear()} Proyectos MRR. {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <div className="text-cream/50 text-sm">
                <Link to="/aviso-legal" className="hover:text-gold transition-colors duration-300">
                  {t("footer.legalNotice")}
                </Link>
                {" · "}
                <Link to="/politica-privacidad" className="hover:text-gold transition-colors duration-300">
                  {t("footer.privacyPolicy")}
                </Link>
              </div>
            </div>
          </div>
          <p className="text-cream/50 text-sm text-center mt-4">
            MADRID REHABILIDAD RESIDENCIAL SL · CIF: B10971414
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
