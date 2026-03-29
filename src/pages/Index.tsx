import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Leaf, Sparkles, Handshake, Target, ChevronDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getLocalBusinessSchema } from "@/components/SEO";
import OptimizedImage from "@/components/ui/optimized-image";
import heroImage from "@/assets/hero-home-new.webp";
import sectionInnovation from "@/assets/section-innovation.png";
import serviceReform from "@/assets/service-reform-new.png";
import serviceInvestment from "@/assets/service-investment-new.png";

const Index = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Heart,
      title: t("home.values.commitment"),
    },
    {
      icon: Leaf,
      title: t("home.values.sustainability"),
    },
    {
      icon: Sparkles,
      title: t("home.values.excellence"),
    },
    {
      icon: Handshake,
      title: t("home.values.transparency"),
    },
    {
      icon: Target,
      title: t("home.values.vision"),
    },
  ];
  const scrollingValues = [...values, ...values];


  return (
    <Layout>
      <SEO
        title="Reformas Sostenibles e Inversión Inmobiliaria en Madrid | Proyectos MRR"
        description="Especialistas en reformas sostenibles e inversión inmobiliaria en Madrid. Transformamos espacios con materiales ecológicos y diseño eficiente. Solicita presupuesto."
        keywords="proyectos mrr reformas Madrid, empresa de reformas Madrid, reformas integrales Madrid, inversión inmobiliaria Madrid 2026, proyectos de renovación de viviendas, gestión de proyectos de reformas, presupuestos reformas casa, eficiencia energética vivienda Madrid, sostenibilidad en reformas casa, flipping inmobiliario, rehabilitación viviendas, proyectos mrr gestión de proyectos, proyectos mrr inversión inmobiliaria"
        canonicalUrl="/"
        structuredData={getLocalBusinessSchema()}
      />
      
      {/* Hero Section */}
      <header className="relative min-h-[75vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={heroImage}
            alt="Reforma sostenible de espacios"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-forest/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-cream mb-6 animate-fade-up leading-tight tracking-wide">
            <span className="font-thin">{t("home.hero.title1")}</span>
            <span className="font-bold">{t("home.hero.opportunity")}</span>
            <span className="font-thin">{t("home.hero.title2")}</span>
            <span className="font-bold">{t("home.hero.transformation")}</span>
            <span className="font-thin">.</span>
          </h1>
          <p className="text-lg md:text-xl text-cream/90 font-extralight tracking-wide animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {t("home.hero.subtitle")}
            <br />
            {t("home.hero.subtitle2")}
          </p>
        </div>

        {/* Scroll Down Arrow */}
        <nav className="absolute bottom-8 left-0 right-0 flex justify-center z-10 animate-float" aria-label="Scroll hacia abajo">
          <ChevronDown className="w-8 h-8 text-cream/70 stroke-[1]" aria-hidden="true" />
        </nav>
      </header>

      <main>
        {/* Innovation & Sustainability Section */}
        <section className="py-20 bg-background" aria-labelledby="innovation-heading">
          <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h2 id="innovation-heading" className="text-2xl md:text-3xl font-light text-foreground uppercase tracking-widest mb-8">
                {t("home.innovation.title")}
              </h2>
              <p className="text-lg text-muted-foreground font-thin leading-relaxed mb-6">
                {t("home.innovation.text1")}
              </p>
              <p className="text-lg text-muted-foreground font-thin leading-relaxed mb-6">
                {t("home.innovation.text2")}
              </p>
              <p className="text-lg text-muted-foreground font-extralight leading-relaxed">
                {t("home.innovation.text3")}<span className="font-normal">{t("home.innovation.quality")}</span>, <span className="font-normal">{t("home.innovation.agility")}</span>{t("home.innovation.text4")}<span className="font-normal">{t("home.innovation.lastingValue")}</span>.
              </p>
            </div>
            {/* Image */}
            <div className="order-1 lg:order-2">
              <OptimizedImage
                src={sectionInnovation}
                alt="Arquitectura moderna e innovadora"
                className="w-full h-[280px] md:h-[500px] object-cover rounded-lg"
                containerClassName="rounded-lg shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

        {/* Values Section */}
      <section className="py-20 bg-forest overflow-hidden" aria-labelledby="values-heading">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="values-heading" className="text-2xl md:text-3xl font-light text-cream uppercase tracking-widest">
              {t("home.values.title")}
            </h2>
          </div>

          {/* Animated Marquee */}
          <div className="relative overflow-hidden -mx-4 px-4">
            <div className="flex w-max gap-6 animate-marquee-left motion-reduce:animate-none">
              {scrollingValues.map((value, index) => {
                const isDuplicate = index >= values.length;
                return (
                  <div
                    key={`${value.title}-${index}`}
                    className="shrink-0 w-72 bg-cream/10 backdrop-blur-sm p-6 rounded-lg border border-cream/20 hover:bg-cream/15 transition-all duration-300 group text-center"
                    aria-hidden={isDuplicate}
                  >
                    <div className="w-14 h-14 bg-cream/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-cream/30 transition-colors duration-300">
                      <value.icon className="w-7 h-7 text-cream" />
                    </div>
                    <h3
                      className="text-base font-light text-cream leading-snug"
                      dangerouslySetInnerHTML={{ __html: value.title }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link to="/quienes-somos">
              <Button variant="hero" size="lg">
                {t("home.values.cta")}
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>


        {/* Services Preview */}
      <section className="py-20 bg-background" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <header className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-medium">{t("home.services.title")}</span>
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              {t("home.services.subtitle")}
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reform Card */}
            <article className="group relative overflow-hidden rounded-xl shadow-card">
              <OptimizedImage
                src={serviceReform}
                alt={t("home.services.reforms.title")}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                containerClassName="w-full h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-cream mb-2">
                  {t("home.services.reforms.title")}
                </h3>
                <p className="text-cream/80 mb-4">
                  {t("home.services.reforms.description")}
                </p>
                <Link to="/servicios/reformas">
                  <Button variant="hero" size="lg" className="text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                    {t("home.services.moreInfo")}
                    <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </Button>
                </Link>
              </div>
            </article>

            {/* Investment Card */}
            <article className="group relative overflow-hidden rounded-xl shadow-card">
              <OptimizedImage
                src={serviceInvestment}
                alt={t("home.services.investment.title")}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                containerClassName="w-full h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-cream mb-2">
                  {t("home.services.investment.title")}
                </h3>
                <p className="text-cream/80 mb-4">
                  {t("home.services.investment.description")}
                </p>
                <Link to="/servicios/inversion">
                  <Button variant="hero" size="lg" className="text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                    {t("home.services.moreInfo")}
                    <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </div>
        </section>
      </main>

      {/* CTA Section */}
      <aside className="py-20 bg-secondary" aria-label="Llamada a la acción">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {t("home.cta.description")}
          </p>
          <Link to="/contacto">
            <Button variant="gold" size="xl">
              {t("home.cta.button")}
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </aside>
    </Layout>
  );
};

export default Index;
