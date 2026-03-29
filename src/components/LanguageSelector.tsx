import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors duration-300 text-sm"
      aria-label={t("footer.language")}
    >
      <Globe size={16} />
      <span className="uppercase font-medium">
        {i18n.language === "es" ? "EN" : "ES"}
      </span>
    </button>
  );
};

export default LanguageSelector;
