import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Check, Users, TrendingUp, PiggyBank, Home, RefreshCw } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getServiceSchema, getBreadcrumbSchema } from "@/components/SEO";
import OptimizedImage from "@/components/ui/optimized-image";
import useRevealOnScroll from "@/hooks/useRevealOnScroll";
import serviceInvestment from "@/assets/service-investment-new.png";

const ServiciosInversion = () => {
  const features = [
    "Análisis de mercado detallado",
    "Identificación de oportunidades de flipping",
    "Compra, reforma y venta estratégica",
    "Due diligence completa",
    "Gestión de cartera inmobiliaria",
    "Maximización del retorno de inversión",
  ];

  const financingOptions = [
    {
      icon: Users,
      title: "Crowdfunding Inmobiliario",
      description: "Inversión colaborativa que permite participar en proyectos inmobiliarios con aportaciones desde cantidades reducidas. Múltiples inversores financian conjuntamente la adquisición y reforma de propiedades, compartiendo los beneficios de forma proporcional.",
      benefits: [
        "Acceso a inversiones inmobiliarias desde pequeñas cantidades",
        "Diversificación del riesgo entre múltiples inversores",
        "Rentabilidades atractivas sin gestión directa",
        "Transparencia total en cada proyecto",
      ],
    },
    {
      icon: RefreshCw,
      title: "Inversiones Flipping",
      description: "Estrategia de inversión que consiste en comprar propiedades infravaloradas, reformarlas estratégicamente y venderlas a un precio superior en un plazo corto. Maximiza el retorno mediante la creación activa de valor.",
      benefits: [
        "Rentabilidades superiores en plazos cortos",
        "Control total sobre el proceso de inversión",
        "Creación de valor mediante reformas estratégicas",
        "Liquidez más rápida que inversiones tradicionales",
      ],
    },
    {
      icon: PiggyBank,
      title: "Fondos de Inversión Inmobiliaria",
      description: "Vehículos de inversión colectiva que permiten participar en carteras diversificadas de activos inmobiliarios. Gestionados por profesionales, ofrecen exposición al mercado inmobiliario sin necesidad de adquirir propiedades directamente.",
      benefits: [
        "Gestión profesional de la cartera",
        "Alta diversificación geográfica y por tipo de activo",
        "Liquidez superior a la inversión directa",
        "Acceso a grandes proyectos inmobiliarios",
      ],
    },
  ];

  const mainServiceReveal = useRevealOnScroll(0.3);
  const financingReveal = useRevealOnScroll(0.3);
  const crowdfundingReveal = useRevealOnScroll(0.3);
  const flippingReveal = useRevealOnScroll(0.3);
  const fundsReveal = useRevealOnScroll(0.3);
  const advantagesReveal = useRevealOnScroll(0.3);
  const processReveal = useRevealOnScroll(0.3);
  const ctaReveal = useRevealOnScroll(0.3);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getServiceSchema(
        "Asesoramiento fiscal y consultoría inmobiliaria",
        "Asesoramiento fiscal y consultoría inmobiliaria para maximizar tu rentabilidad: crowdfunding, flipping y fondos de inversión.",
        "/servicios/inversion"
      ),
      getBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Servicios", url: "/" },
        { name: "Inversión Inmobiliaria", url: "/servicios/inversion" },
      ]),
    ],
  };

  return (
    <Layout>
      <SEO
        title="Asesoramiento fiscal y consultoría inmobiliaria en Madrid 2026"
        description="Asesoramiento fiscal y consultoría inmobiliaria Madrid 2026: crowdfunding, flipping y fondos de inversión. Estrategias para maximizar tu rentabilidad."
        keywords="mejores zonas para invertir en Madrid 2026, inversión inmobiliaria Madrid 2026, rentabilidad alquiler Madrid, comprar para alquilar Madrid, zonas rentables Madrid, inversión inmobiliaria Chamartín Madrid, inversión Tetuán Madrid revalorización, Mirasierra inversión familiar Madrid, inversión centro Madrid alquiler, zonas emergentes inversión Madrid, rentabilidad inmobiliaria Salamanca Madrid, precio alquiler Madrid 2026 tendencias, comprar vivienda Madrid 2026, rentabilidad inversión Usera Arganzuela, crowdfunding inmobiliario, flipping inmobiliario, fondos inversión inmobiliaria, financiación alternativa, proyectos mrr inversión inmobiliaria, proyectos mrr inversión inmobiliaria Madrid"
        canonicalUrl="/servicios/inversion"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <header className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium mb-4">
              Nuestros Servicios
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">
              Asesoramiento <span className="text-gradient-gold">fiscal</span>
            </h1>
            <p className="text-gold/90 font-medium mb-3">
              Consultoría y asesoramiento inmobiliario
            </p>
            <p className="text-lg text-cream/80 leading-relaxed">
              Te acompañamos con enfoque fiscal y estrategia inmobiliaria: desde crowdfunding colaborativo
              hasta operaciones de flipping y fondos especializados, con análisis y planificación para
              maximizar la rentabilidad de cada decisión.
            </p>
          </div>
        </div>
      </header>

      <main>
        {/* Main Service */}
        <section
          ref={mainServiceReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            mainServiceReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="investment-heading"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <figure className="lg:order-2">
                <OptimizedImage
                  src={serviceInvestment}
                  alt="Inversión inmobiliaria y asesoramiento financiero"
                  className="w-full h-96 object-cover rounded-xl"
                  containerClassName="rounded-xl shadow-card"
                />
              </figure>

              <article className="lg:order-1">
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-6">
                  <Building className="w-7 h-7 text-gold" aria-hidden="true" />
                </div>
                <h2 id="investment-heading" className="text-3xl font-bold text-foreground mb-4">
                  Consultoría inmobiliaria con enfoque fiscal
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Asesoramiento experto para identificar oportunidades de inversión rentables y sostenibles.
                  Nuestro equipo te acompaña en todo el proceso, desde la búsqueda de propiedades con potencial 
                  hasta la ejecución de reformas estratégicas que maximizan el valor de tu inversión.
                </p>
                <ul className="space-y-3 mb-8" role="list">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contacto">
                  <Button variant="gold" size="lg">
                    Solicitar información
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Financing Options Section */}
        <section
          ref={financingReveal.ref}
          className={`py-20 bg-secondary transition-all duration-500 ${
            financingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="financing-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold font-medium">Opciones de Financiación</span>
              <h2 id="financing-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Financiación Alternativa e Inversión Colaborativa
              </h2>
              <p className="text-muted-foreground text-lg">
                Descubre las diferentes modalidades de inversión y financiación inmobiliaria 
                que ponemos a tu disposición para maximizar tu rentabilidad.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {financingOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <article
                    key={option.title}
                    className="bg-card p-8 rounded-xl shadow-card hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-gold" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {option.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {option.description}
                    </p>
                    <ul className="space-y-2">
                      {option.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-gold flex-shrink-0 mt-1" aria-hidden="true" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Crowdfunding Detail Section */}
        <section
          ref={crowdfundingReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            crowdfundingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="crowdfunding-heading"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <article>
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-gold" aria-hidden="true" />
                </div>
                <h2 id="crowdfunding-heading" className="text-3xl font-bold text-foreground mb-4">
                  Crowdfunding Inmobiliario: Inversión Colaborativa
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  El crowdfunding inmobiliario democratiza el acceso a la inversión en bienes raíces. 
                  Esta modalidad permite que múltiples inversores participen en proyectos inmobiliarios 
                  con aportaciones accesibles, compartiendo tanto los riesgos como los beneficios.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="bg-secondary p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">¿Cómo funciona?</h4>
                    <p className="text-muted-foreground text-sm">
                      Seleccionamos proyectos con alto potencial, los analizamos exhaustivamente y 
                      los presentamos a nuestra red de inversores. Cada participante aporta según 
                      sus posibilidades y recibe beneficios proporcionales a su inversión.
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Rentabilidad esperada</h4>
                    <p className="text-muted-foreground text-sm">
                      Los proyectos de crowdfunding inmobiliario suelen ofrecer rentabilidades 
                      anuales entre el 8% y el 15%, dependiendo del tipo de proyecto y su duración.
                    </p>
                  </div>
                </div>
                <Link to="/contacto">
                  <Button variant="gold" size="lg">
                    Información sobre Crowdfunding
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </article>
              
              <div className="bg-gradient-hero p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-cream mb-6">Ventajas del Crowdfunding</h3>
                <ul className="space-y-4">
                  {[
                    { title: "Accesibilidad", desc: "Invierte desde cantidades reducidas en el mercado inmobiliario" },
                    { title: "Diversificación", desc: "Distribuye tu inversión entre múltiples proyectos" },
                    { title: "Transparencia", desc: "Información detallada de cada proyecto y su evolución" },
                    { title: "Gestión profesional", desc: "Expertos gestionan todo el proceso por ti" },
                    { title: "Sin preocupaciones", desc: "No tienes que ocuparte de inquilinos ni mantenimiento" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <span className="font-semibold text-cream">{item.title}: </span>
                        <span className="text-cream/80">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Flipping Detail Section */}
        <section
          ref={flippingReveal.ref}
          className={`py-20 bg-secondary transition-all duration-500 ${
            flippingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="flipping-heading"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-gold" aria-hidden="true" />
                </div>
                <h2 id="flipping-heading" className="text-3xl font-bold text-foreground mb-4">
                  Flipping Inmobiliario: Comprar, Reformar, Vender
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  El flipping es una estrategia de inversión activa que consiste en adquirir propiedades 
                  por debajo de su valor de mercado, ejecutar reformas estratégicas y venderlas en un 
                  plazo corto obteniendo plusvalías significativas.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Claves del éxito</h4>
                    <p className="text-muted-foreground text-sm">
                      El éxito del flipping depende de tres factores: comprar bien (precio por debajo 
                      de mercado), reformar inteligentemente (mejoras que aporten valor) y vender 
                      rápido (timing de mercado).
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Nuestro valor añadido</h4>
                    <p className="text-muted-foreground text-sm">
                      Aportamos conocimiento del mercado local, red de contactos para encontrar 
                      oportunidades off-market, experiencia en reformas eficientes y estrategia 
                      de comercialización optimizada.
                    </p>
                  </div>
                </div>
                <Link to="/contacto">
                  <Button variant="gold" size="lg">
                    Consultar proyectos Flipping
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
              
              <div className="lg:order-1">
                <div className="bg-card p-8 rounded-xl shadow-card">
                  <h3 className="text-xl font-bold text-foreground mb-6">Proceso de Flipping</h3>
                  <ol className="space-y-6">
                    {[
                      { step: "1", title: "Búsqueda", desc: "Identificamos propiedades infravaloradas con potencial de revalorización." },
                      { step: "2", title: "Análisis", desc: "Evaluamos costes de reforma, valor post-reforma y margen esperado." },
                      { step: "3", title: "Adquisición", desc: "Negociamos la compra al mejor precio posible." },
                      { step: "4", title: "Reforma", desc: "Ejecutamos mejoras estratégicas que maximizan el valor." },
                      { step: "5", title: "Venta", desc: "Comercializamos el inmueble para obtener la máxima rentabilidad." },
                    ].map((item) => (
                      <li key={item.step} className="flex gap-4">
                        <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold flex-shrink-0">
                          {item.step}
                        </span>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Funds Section */}
        <section
          ref={fundsReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            fundsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="funds-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-gold font-medium">Inversión Institucional</span>
              <h2 id="funds-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Fondos de Inversión Inmobiliaria
              </h2>
              <p className="text-muted-foreground text-lg">
                Los fondos de inversión inmobiliaria ofrecen una forma profesionalizada y diversificada 
                de participar en el mercado inmobiliario sin necesidad de adquirir propiedades directamente.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Home,
                  title: "Fondos de Renta",
                  description: "Invierten en propiedades para alquiler, generando ingresos recurrentes a través de rentas. Ideales para inversores que buscan flujo de caja estable.",
                },
                {
                  icon: TrendingUp,
                  title: "Fondos de Plusvalía",
                  description: "Focalizados en la revalorización del capital mediante la compra, mejora y venta de activos. Mayor potencial de rentabilidad con horizonte temporal definido.",
                },
                {
                  icon: Building,
                  title: "Fondos Mixtos",
                  description: "Combinan estrategias de renta y plusvalía para equilibrar ingresos recurrentes con potencial de apreciación del capital.",
                },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <article
                    key={item.title}
                    className="bg-card p-8 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-7 h-7 text-gold" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-12 max-w-3xl mx-auto bg-secondary p-8 rounded-xl">
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                ¿Por qué elegir fondos de inversión inmobiliaria?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Gestión profesional por expertos del sector",
                  "Diversificación entre múltiples activos",
                  "Mayor liquidez que la inversión directa",
                  "Acceso a proyectos de gran envergadura",
                  "Fiscalidad optimizada según estructura",
                  "Menor implicación en la gestión diaria",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Loans Section */}
        {/* Why Invest Section */}
        <section
          ref={advantagesReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            advantagesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="advantages-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-gold font-medium">¿Por qué invertir con nosotros?</span>
              <h2 id="advantages-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Ventajas de nuestra estrategia
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Análisis Experto",
                  description: "Identificamos propiedades infravaloradas con alto potencial de revalorización mediante análisis detallado del mercado.",
                },
                {
                  title: "Reformas Estratégicas",
                  description: "Ejecutamos reformas que maximizan el valor añadido, optimizando cada euro invertido en mejoras.",
                },
                {
                  title: "Rentabilidad Garantizada",
                  description: "Nuestro track record demuestra retornos consistentes gracias a una gestión profesional del proceso completo.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="bg-card p-8 rounded-xl shadow-card hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section
          ref={processReveal.ref}
          className={`py-20 bg-secondary transition-all duration-500 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="process-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold font-medium">Nuestro Proceso</span>
              <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Cómo invertimos
              </h2>
            </header>

            <ol className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Búsqueda", description: "Identificamos propiedades con potencial de revalorización en ubicaciones estratégicas." },
                { step: "02", title: "Análisis", description: "Due diligence completa y estudio de viabilidad económica del proyecto." },
                { step: "03", title: "Reforma", description: "Ejecutamos reformas estratégicas que maximizan el valor de la propiedad." },
                { step: "04", title: "Venta", description: "Gestionamos la comercialización para obtener el máximo retorno de inversión." },
              ].map((item) => (
                <li key={item.step} className="text-center group">
                  <div className="relative mb-6">
                    <span className="text-6xl font-bold text-gold/20 group-hover:text-gold/40 transition-colors duration-300" aria-hidden="true">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <aside
        ref={ctaReveal.ref}
        className={`py-20 bg-gradient-hero transition-all duration-500 ${
          ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
        }`}
        aria-label="Solicitar información"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            ¿Listo para invertir?
          </h2>
          <p className="text-cream/70 text-lg mb-8 max-w-2xl mx-auto">
            Contacta con nosotros y descubre las oportunidades de inversión inmobiliaria que tenemos para ti: 
            crowdfunding, flipping, fondos o financiación para tu proyecto de reforma.
          </p>
          <Link to="/contacto">
            <Button variant="hero" size="xl">
              Solicitar Información
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </aside>
    </Layout>
  );
};

export default ServiciosInversion;
