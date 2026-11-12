import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, Briefcase, Lightbulb, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getServiceSchema, getBreadcrumbSchema } from "@/components/SEO";
import OptimizedImage from "@/components/ui/optimized-image";
import useRevealOnScroll from "@/hooks/useRevealOnScroll";
import ReformBudgetCalculator from "@/components/ReformBudgetCalculator";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import serviceReform from "@/assets/service-reform-new.png";
import reformBefore from "@/assets/reform-before.jpg";
import reformAfter from "@/assets/reform-after.png";
const ServiciosReformas = () => {
  const features = [
    "Materiales certificados y sostenibles",
    "Eficiencia energética optimizada",
    "Diseño bioclimático",
    "Gestión de residuos responsable",
    "Certificaciones ambientales",
  ];

  const additionalServices = [
    {
      icon: Briefcase,
      title: "Gestión de Proyectos",
      description: "Coordinación integral desde el diseño hasta la entrega, asegurando plazos y presupuestos.",
    },
    {
      icon: Lightbulb,
      title: "Consultoría Energética",
      description: "Auditorías y planes de mejora para optimizar el consumo energético de tu propiedad.",
    },
  ];

  const mainServiceReveal = useRevealOnScroll(0.3);
  const additionalServicesReveal = useRevealOnScroll(0.3);
  const processReveal = useRevealOnScroll(0.3);
  const ctaReveal = useRevealOnScroll(0.3);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getServiceSchema(
        "Reformas Sostenibles",
        "Transformamos espacios con materiales ecológicos y técnicas respetuosas con el medio ambiente para crear hogares eficientes y saludables.",
        "/servicios/reformas"
      ),
      getBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Servicios", url: "/" },
        { name: "Reformas Sostenibles", url: "/servicios/reformas" },
      ]),
    ],
  };

  return (
    <Layout>
      <SEO
        title="Reformas Sostenibles en Madrid - Materiales Ecológicos y Eficiencia Energética"
        description="Reformas sostenibles en Madrid con materiales ecológicos certificados. Mejoramos la eficiencia energética de tu vivienda. Presupuesto reforma cocina Madrid. Solicita sin compromiso."
        keywords="empresa de reformas Madrid, reformas integrales Madrid, presupuestos reformas casa, planificación obras casa, cómo planificar una reforma integral, pasos para gestionar una obra de construcción, permisos de obra en Madrid, control de costos obra, coste medio de reforma vivienda Madrid, presupuesto reforma cocina Madrid, calendario de obra paso a paso, gestión de proveedores para reformas, plantilla presupuesto reforma excel, checklist inicio de obra, guía de materiales para reformas de baño, errores comunes en reformas y cómo evitarlos, cómo elegir empresa de reformas en Madrid, criterios de calidad en proyectos de reformas, eficiencia energética vivienda Madrid, interiorismo y reformas 2026, vivienda pasiva presupuestos, sostenibilidad en reformas casa, cuánto cuesta una reforma integral de vivienda en Madrid, cuánto tiempo dura una reforma de cocina, qué incluye un proyecto de reforma, cómo comparar presupuestos de reformas, qué permisos hacen falta para una obra en Madrid, proyectos de reformas en la sierra de Madrid, reformas en Las Rozas, reformas en Majadahonda, reformas en Alcobendas, proyectos mrr reformas Madrid, proyectos mrr gestión de proyectos, proyectos mrr presupuestos reformas, contratación de obras reforma, seguros para obras de construcción España"
        canonicalUrl="/servicios/reformas"
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
              Reformas <span className="text-gradient-gold">Sostenibles</span>
            </h1>
            <p className="text-lg text-cream/80 leading-relaxed">
              Transformamos espacios con materiales ecológicos y técnicas respetuosas 
              con el medio ambiente para crear hogares eficientes y saludables.
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
          aria-labelledby="service-heading"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <figure>
                <OptimizedImage
                  src={serviceReform}
                  alt="Reforma sostenible de vivienda con materiales ecológicos"
                  className="w-full h-96 object-cover rounded-xl"
                  containerClassName="rounded-xl shadow-card"
                />
              </figure>

              <article>
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-6">
                  <Hammer className="w-7 h-7 text-gold" aria-hidden="true" />
                </div>
                <h2 id="service-heading" className="text-3xl font-bold text-foreground mb-4">
                  Reformas Sostenibles
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Transformamos espacios con materiales ecológicos y técnicas respetuosas con el medio ambiente. 
                  Nuestro enfoque integral garantiza reformas que no solo mejoran la estética de tu hogar, 
                  sino que también optimizan su eficiencia energética y reducen su impacto ambiental.
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

        {/* Before After Slider */}
        <BeforeAfterSlider 
          beforeImage={reformBefore} 
          afterImage={reformAfter}
          beforeLabel="Antes"
          afterLabel="Después"
        />

        {/* Additional Services */}
        <section
          ref={additionalServicesReveal.ref}
          className={`py-20 bg-secondary transition-all duration-500 ${
            additionalServicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="additional-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-gold font-medium">Servicios Adicionales</span>
              <h2 id="additional-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Más formas de ayudarte
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {additionalServices.map((service) => (
                <article
                  key={service.title}
                  className="bg-card p-8 rounded-xl shadow-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section
          ref={processReveal.ref}
          className={`py-20 bg-background transition-all duration-500 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
          }`}
          aria-labelledby="process-heading"
        >
          <div className="container mx-auto px-4">
            <header className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold font-medium">Nuestro Proceso</span>
              <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Cómo trabajamos
              </h2>
            </header>

            <ol className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Consulta", description: "Analizamos en detalle tus necesidades, objetivos y expectativas para entender a fondo tu proyecto." },
                { step: "02", title: "Diseño", description: "Desarrollamos un plan personalizado que integra funcionalidad, estética y sostenibilidad." },
                { step: "03", title: "Ejecución", description: "Nuestro equipo profesional implementa cada fase con precisión y control de calidad." },
                { step: "04", title: "Entrega", description: "Finalizamos con un resultado que supera expectativas, garantizando tu satisfacción." },
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

        {/* Budget Calculator */}
        <ReformBudgetCalculator />
      </main>

      {/* CTA Section */}
      <aside
        ref={ctaReveal.ref}
        className={`py-20 bg-gradient-hero transition-all duration-500 ${
          ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 will-change-[opacity,transform]'
        }`}
        aria-label="Solicitar presupuesto"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            ¿Listo para transformar tu espacio?
          </h2>
          <p className="text-cream/70 text-lg mb-8 max-w-2xl mx-auto">
            Contacta con nosotros y descubre cómo podemos ayudarte con tu reforma sostenible.
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

export default ServiciosReformas;
