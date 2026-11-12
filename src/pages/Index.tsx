import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Leaf, Sparkles, Handshake, Target, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getLocalBusinessSchema } from "@/components/SEO";
import OptimizedImage from "@/components/ui/optimized-image";
import useRevealOnScroll from "@/hooks/useRevealOnScroll";
import heroImage from "@/assets/hero-home-new.webp";
import sectionInnovation from "@/assets/section-innovation.png";
import serviceReform from "@/assets/service-reform-new.png";
import serviceInvestment from "@/assets/service-investment-new.png";

// Extend window type for Habitissimo tracking
declare global {
  interface Window {
    habitissimoPhotosLoaded?: boolean;
    habitissimoProfileLoaded?: boolean;
  }
}

const CARD_W = 288; // w-72 = 288px
const GAP = 24;     // gap-6 = 24px
const STEP = CARD_W + GAP;
const SETS = 4;

// Component to load Habitissimo widgets dynamically
const HabitissimoSection = () => {
  const photosRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const photoScriptSrc = "https://api.habitissimo.es/widget/habitissimo_photos/proyectos-mrr.js";
    const profileScriptSrc = "https://api.habitissimo.es/widget/habitissimo_profile/proyectos-mrr.js";

    // Load Habitissimo photos widget when the container is present and the script is not already appended
    if (photosRef.current && !photosRef.current.querySelector(`script[src="${photoScriptSrc}"]`)) {
      const script1 = document.createElement("script");
      script1.src = photoScriptSrc;
      photosRef.current.appendChild(script1);
    }

    // Load Habitissimo profile widget when the container is present and the script is not already appended
    if (profileRef.current && !profileRef.current.querySelector(`script[src="${profileScriptSrc}"]`)) {
      const script2 = document.createElement("script");
      script2.src = profileScriptSrc;
      profileRef.current.appendChild(script2);
    }
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold font-medium">Habitissimo</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Resultados que nos avalan
          </h2>
          <p className="text-muted-foreground mt-3">
            Opiniones reales, proyectos verificados y reputación profesional
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">

          {/* PHOTOS WIDGET */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden hover:shadow-xl transition-shadow duration-300">

            <header className="mb-5">
              <h3 className="text-xl font-semibold text-foreground">
                Proyectos realizados
              </h3>
              <p className="text-sm text-muted-foreground">
                Galería de trabajos reales en reforma e inversión
              </p>
            </header>

            <div
              ref={photosRef}
              id="habitissimo-habitissimo_photos"
              className="w-full flex justify-center scale-[1.08] md:scale-[1.15] origin-top"
            >
              <a href="https://www.habitissimo.es/pro/proyectos-mrr">
              </a>
            </div>
          </div>

          {/* PROFILE WIDGET */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300">

            <header className="mb-5">
              <h3 className="text-lg font-semibold text-foreground">
                Perfil verificado
              </h3>
              <p className="text-sm text-muted-foreground">
                Opiniones y reputación profesional
              </p>
            </header>

            <div
              ref={profileRef}
              id="habitissimo-habitissimo_profile"
              className="w-full flex justify-center scale-110 md:scale-125 origin-top"
            >
              <a href="https://www.habitissimo.es/pro/proyectos-mrr">
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { t } = useTranslation();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);

  const innovationReveal = useRevealOnScroll(0.3);
  const servicesReveal = useRevealOnScroll(0.3);

  const values = [
    { icon: Heart,     title: t("home.values.commitment") },
    { icon: Leaf,      title: t("home.values.sustainability") },
    { icon: Sparkles,  title: t("home.values.excellence") },
    { icon: Handshake, title: t("home.values.transparency") },
    { icon: Target,    title: t("home.values.vision") },
  ];

  const SINGLE_SET_W = values.length * STEP;
  const valuesLoop = [...values, ...values, ...values, ...values];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    posRef.current = 0;
    track.style.transform = `translateX(${-posRef.current}px)`;

    const normalise = () => {
      if (posRef.current >= SINGLE_SET_W * (SETS - 1)) posRef.current -= SINGLE_SET_W * (SETS - 2);
      if (posRef.current < 0)                           posRef.current += SINGLE_SET_W * (SETS - 2);
    };

    let lastTs: number | null = null;
    const speed = -0.05; // negativo = derecha a izquierda

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (lastTs === null) { lastTs = ts; return; }
      const dt = Math.min(ts - lastTs, 32);
      lastTs = ts;
      if (!pausedRef.current) {
        posRef.current += dt * speed;
        normalise();
        track.style.transform = `translateX(${-posRef.current}px)`;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [SINGLE_SET_W]);

  const scrollValuesBy = (delta: number) => {
    const track = trackRef.current;
    if (!track) return;
    const start = posRef.current;
    const target = start + delta;
    const dur = 400;
    let t0: number | null = null;

    const ease = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      posRef.current = start + (target - start) * e;
      if (posRef.current >= SINGLE_SET_W * (SETS - 1)) posRef.current -= SINGLE_SET_W * (SETS - 2);
      if (posRef.current < 0)                           posRef.current += SINGLE_SET_W * (SETS - 2);
      track.style.transform = `translateX(${-posRef.current}px)`;
      if (p < 1) requestAnimationFrame(ease);
    };
    requestAnimationFrame(ease);
  };

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
        <section
          ref={innovationReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            innovationReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="innovation-heading"
        >
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

          {/* Título dentro de container */}
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="values-heading" className="text-2xl md:text-3xl font-light text-cream uppercase tracking-widest">
                {t("home.values.title")}
              </h2>
            </div>
          </div>

          {/* Carousel fuera del container — ancho completo de la sección */}
          <div className="relative">

              {/* Flechas — z-20, por encima de los degradados */}
              <button
                type="button"
                onClick={() => scrollValuesBy(-STEP * 2)}
                className="flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 items-center justify-center rounded-full border border-cream/25 bg-forest/70 backdrop-blur-sm text-cream hover:bg-forest/90 transition-colors"
                aria-label="Desplazar valores a la izquierda"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => scrollValuesBy(STEP * 2)}
                className="flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 items-center justify-center rounded-full border border-cream/25 bg-forest/70 backdrop-blur-sm text-cream hover:bg-forest/90 transition-colors"
                aria-label="Desplazar valores a la derecha"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Degradados laterales — z-10, enmascaran los bordes */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
                   style={{ background: "linear-gradient(to right, hsl(var(--forest)) 40%, transparent)" }} />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
                   style={{ background: "linear-gradient(to left, hsl(var(--forest)) 40%, transparent)" }} />

              {/* Track — px-6 para separar del borde, py-4/-my-4 dan espacio al hover:scale */}
              <div
                ref={trackRef}
                className="flex flex-nowrap gap-6 px-6 py-4 -my-4"
                style={{ willChange: "transform" }}
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
                aria-label="Carrusel de valores"
              >
                {valuesLoop.map((value, index) => (
                  <div
                    key={`${index}-${value.title}`}
                    className="flex-shrink-0 w-72 bg-cream/10 backdrop-blur-sm p-6 rounded-lg border border-cream/20
                               text-center cursor-default transition-all duration-300
                               hover:bg-cream/15 hover:border-cream/40 hover:scale-105 hover:relative hover:z-30"
                    onMouseEnter={() => { pausedRef.current = true; }}
                    onMouseLeave={() => { pausedRef.current = false; }}
                  >
                    <div className="w-14 h-14 bg-cream/20 rounded-lg flex items-center justify-center mb-4 mx-auto transition-colors duration-300">
                      <value.icon className="w-7 h-7 text-cream" />
                    </div>
                    <h3
                      className="text-base font-light text-cream leading-snug"
                      dangerouslySetInnerHTML={{ __html: value.title }}
                    />
                  </div>
                ))}
              </div>
            </div>

          {/* CTA dentro de container */}
          <div className="container mx-auto px-4">
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
        <section
          ref={servicesReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="services-heading"
        >
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

        {/* Habitissimo Section */}
        <HabitissimoSection />
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