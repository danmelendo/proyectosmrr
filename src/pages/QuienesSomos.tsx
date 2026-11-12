import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Target, Heart, Mail, Linkedin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getOrganizationSchema, getBreadcrumbSchema } from "@/components/SEO";
import OptimizedImage from "@/components/ui/optimized-image";
import useRevealOnScroll from "@/hooks/useRevealOnScroll";
import aboutTeam from "@/assets/about-team-new.png";
import teamReza from "@/assets/team-reza.png";
import teamLucas from "@/assets/team-lucas.png";

const QuienesSomos = () => {
  const values = [
    {
      icon: Target,
      title: "Compromiso",
      description: "Nos comprometemos con cada proyecto como si fuera propio, garantizando resultados excepcionales.",
    },
    {
      icon: Heart,
      title: "Sostenibilidad",
      description: "Cada decisión que tomamos considera su impacto ambiental y social a largo plazo.",
    },
    {
      icon: Award,
      title: "Excelencia",
      description: "Buscamos la perfección en cada detalle, desde el diseño hasta la ejecución final.",
    },
    {
      icon: Users,
      title: "Transparencia",
      description: "Mantenemos una comunicación clara y honesta durante todo el proceso.",
    },
  ];

  const storyReveal = useRevealOnScroll(0.3);
  const valuesReveal = useRevealOnScroll(0.3);
  const teamReveal = useRevealOnScroll(0.3);
  const ctaReveal = useRevealOnScroll(0.3);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      getBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Quiénes Somos", url: "/quienes-somos" },
      ]),
    ],
  };

  return (
    <Layout>
      <SEO
        title="Quiénes Somos - Empresa de Reformas Sostenibles en Madrid"
        description="Conoce a MRR, empresa de reformas sostenibles en Madrid desde 2022. Transformamos viviendas con propósito, apostando por sostenibilidad, calidad y criterios de excelencia."
        keywords="empresa de reformas Madrid, reformas sostenibles, equipo profesional reformas, rehabilitación viviendas Madrid, criterios de calidad en proyectos de reformas, cómo elegir empresa de reformas en Madrid, proyectos mrr reformas Madrid, proyectos mrr gestión de proyectos, sostenibilidad en reformas casa"
        canonicalUrl="/quienes-somos"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <header className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium mb-4">
              Quiénes Somos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">
              Construyendo el futuro con{" "}
              <span className="text-gradient-gold">responsabilidad</span>
            </h1>
            <p className="text-lg text-cream/80 leading-relaxed">
              Somos un equipo apasionado por la arquitectura sostenible y la inversión 
              inmobiliaria responsable. Más de dos décadas transformando espacios y 
              creando valor para nuestros clientes y comunidades.
            </p>
          </div>
        </div>
      </header>

      <main>
        {/* Story Section */}
        <section
          ref={storyReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            storyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="story-heading"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <figure className="relative">
                <OptimizedImage
                  src={aboutTeam}
                  alt="Equipo de Proyectos MRR trabajando en reformas sostenibles"
                  className="w-full h-72 md:h-80 object-cover rounded-xl"
                  containerClassName="rounded-xl shadow-card"
                />
              </figure>

              <article>
                <span className="text-gold font-medium">Nuestra Historia</span>
                <h2 id="story-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Reformar con visión.<br />Nace MRR.
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    En 2022, nació una idea sencilla pero poderosa: transformar viviendas no 
                    solo para que se vean mejor, sino para que sean más valiosas, habitables 
                    y sostenibles en el tiempo. Así empezó MRR. Una marca que no entiende las 
                    reformas como un trámite, sino como una oportunidad para crear valor real.
                  </p>
                  <p>
                    Desde el principio, supimos que no queríamos ser una empresa de reformas más. 
                    Queríamos ser un proyecto con propósito. Con visión de futuro. Con compromiso 
                    con el presente.
                  </p>
                  <p>
                    Por eso, en MRR lo que hacemos va mucho más allá de renovar espacios. 
                    Apostamos por la sostenibilidad como estrategia, no como tendencia. Por la 
                    rentabilidad a largo plazo, no por el beneficio inmediato. Y por la calidad, 
                    no como un eslogan, sino como una promesa que cumplimos cada día.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section
          ref={valuesReveal.ref}
          className={`py-20 bg-secondary transition-all duration-500 ${
            valuesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="values-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold font-medium">Nuestros Valores</span>
              <h2 id="values-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Lo que nos define
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="bg-card p-6 rounded-lg text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section
          ref={teamReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            teamReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="team-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold font-medium">Nuestro Equipo</span>
              <h2 id="team-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Quiénes lideran MRR
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Reza Rezaei */}
              <article className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <OptimizedImage
                    src={teamReza}
                    alt="Reza Rezaei - CEO & Founder de Proyectos MRR"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground">Reza Rezaei</h3>
                  <p className="text-gold font-medium mt-1">CEO & Founder</p>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                    Como fundador de Proyectos MRR, Reza lidera la visión estratégica de la compañía, especializándose en identificar oportunidades de inversión con alto potencial de rentabilidad. Su enfoque combina análisis riguroso del mercado con gestión patrimonial orientada a maximizar el valor de cada activo.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <a
                      href="mailto:r.rezaei@proyectosmrr.es"
                      className="text-muted-foreground hover:text-gold transition-colors"
                      aria-label="Email de Reza Rezaei"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/mohammadreza-rezaei/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-gold transition-colors"
                      aria-label="LinkedIn de Reza Rezaei"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </article>

              {/* Lucas Arriola */}
              <article className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <OptimizedImage
                    src={teamLucas}
                    alt="Lucas Arriola - CFO & Partner de Proyectos MRR"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground">Lucas Arriola</h3>
                  <p className="text-gold font-medium mt-1">CFO & Partner</p>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                    Especialista en optimización de procesos y gestión de proyectos inmobiliarios. Con trayectoria en eficiencia operativa, Lucas aporta una visión analítica orientada a resultados, escalando modelos de negocio con estructuras sólidas y ejecución impecable.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <a
                      href="mailto:l.arriola@proyectosmrr.es"
                      className="text-muted-foreground hover:text-gold transition-colors"
                      aria-label="Email de Lucas Arriola"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/lucas-arriola-829bb91a2/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-gold transition-colors"
                      aria-label="LinkedIn de Lucas Arriola"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <aside
        ref={ctaReveal.ref}
        className={`py-20 bg-gradient-hero transition-all duration-500 ${
          ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
        }`}
        aria-label="Llamada a la acción"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            ¿Listo para empezar tu proyecto?
          </h2>
          <p className="text-cream/70 text-lg mb-8 max-w-2xl mx-auto">
            Estamos aquí para ayudarte a hacer realidad tus ideas de forma sostenible.
          </p>
          <Link to="/contacto">
            <Button variant="hero" size="xl">
              Contáctanos
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </aside>
    </Layout>
  );
};

export default QuienesSomos;
