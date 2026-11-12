import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import SEO, { getLocalBusinessSchema, getBreadcrumbSchema } from "@/components/SEO";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { trackAdsConversion } from "@/lib/ads-conversion";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100, "El nombre es demasiado largo"),
  email: z.string().trim().email("Email inválido").max(255, "El email es demasiado largo"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "El asunto es requerido").max(200, "El asunto es demasiado largo"),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000, "El mensaje es demasiado largo"),
});

const Contacto = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRedirectingWhatsapp, setIsRedirectingWhatsapp] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
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
  // Al confirmarse el envío: dispara la conversión de Google Ads y redirige al
  // inicio en cuanto la conversión se ha registrado (event_callback), con una
  // red de seguridad por si el callback no llega (p.ej. bloqueadores).
  useEffect(() => {
    if (!isSubmitted) return;

    let cancelled = false;
    trackAdsConversion({
      timeoutMs: 2500,
      onComplete: () => {
        if (!cancelled) navigate("/");
      },
    });

    return () => {
      cancelled = true;
    };
  }, [isSubmitted, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!acceptPrivacy) {
      setErrors((prev) => ({ ...prev, privacy: "Debes aceptar la política de privacidad" }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Get honeypot value
      const honeypotField = document.getElementById('website') as HTMLInputElement;
      const honeypotValue = honeypotField?.value || '';

      // Send through edge function (handles both DB save and email)
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject,
          message: formData.message,
          honeypot: honeypotValue,
        },
      });

      if (error) {
        // Check if it's a rate limit error
        if (error.message?.includes("429") || error.message?.includes("Too many")) {
          throw new Error("Has enviado demasiados mensajes. Por favor, inténtalo más tarde.");
        }
        throw error;
      }

      // Check for rate limit in response
      if (data?.error?.includes("Too many")) {
        throw new Error("Has enviado demasiados mensajes. Por favor, inténtalo más tarde.");
      }

      setIsSubmitted(true);
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "Hubo un problema al enviar tu mensaje.";
      toast({
        title: "Error al enviar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = whatsappEnabled && whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  // Al pulsar WhatsApp: dispara la conversión, muestra un aviso 2s y continúa
  // hacia el enlace del botón (no redirige al inicio).
  const handleWhatsappClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!whatsappLink) return;
    e.preventDefault();

    setIsRedirectingWhatsapp(true);

    // Dispara la conversión y continúa a WhatsApp cuando se ha registrado
    // (event_callback). Navegamos en la misma pestaña, como el snippet oficial:
    // window.open en pestaña nueva se bloquearía al salir del gesto de clic.
    trackAdsConversion({
      timeoutMs: 2500,
      onComplete: () => {
        window.location.href = whatsappLink;
      },
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      value: "+34 711 25 33 61",
      link: "tel:+34711253361",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@proyectosmrr.es",
      link: "mailto:info@proyectosmrr.es",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      value: "Calle Jose Calvo 6, 28039 Madrid",
      link: "https://maps.google.com/?q=Calle+Jose+Calvo+6+28039+Madrid",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getLocalBusinessSchema(),
      getBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Contacto", url: "/contacto" },
      ]),
    ],
  };

  return (
    <Layout>
      <SEO
        title="Contacto - Solicita Presupuesto para tu Reforma en Madrid"
        description="Contacta con Proyectos MRR para solicitar presupuesto de reformas sostenibles en Madrid. Teléfono: +34 711 25 33 61. Email: info@proyectosmrr.es. Reformas en Las Rozas, Majadahonda, Alcobendas."
        keywords="contacto reformas Madrid, presupuesto reforma, consulta gratuita reformas, asesoramiento inmobiliario Madrid, proyectos de reformas en la sierra de Madrid, reformas en Las Rozas, reformas en Majadahonda, reformas en Alcobendas, presupuestos reformas casa, cómo comparar presupuestos de reformas, proyectos mrr reformas Madrid"
        canonicalUrl="/contacto"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <header className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium mb-4">
              Contacto
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">
              Hablemos de tu <span className="text-gradient-gold">proyecto</span>
            </h1>
            <p className="text-lg text-cream/80 leading-relaxed">
              Estamos construyendo algo más que una empresa. Una nueva manera de entender 
              el valor inmobiliario: más consciente, más exigente, más alineada con el 
              mundo que viene. Y esto es solo el principio.
            </p>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <main className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <aside className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Información de contacto
              </h2>
              <p className="text-muted-foreground mb-8">
                No dudes en contactarnos. Estaremos encantados de atenderte.
              </p>

              <address className="space-y-6 not-italic">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.link}
                    className="flex items-start gap-4 group"
                    aria-label={`${info.title}: ${info.value}`}
                  >
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors duration-300">
                      <info.icon className="w-5 h-5 text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{info.title}</h3>
                      <p className="text-muted-foreground group-hover:text-gold transition-colors duration-300">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </address>

              {whatsappLink && (
                <div className="mt-8">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsappClick}
                    className="inline-flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-300"
                    aria-label="Contactar por WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                    Contactar por WhatsApp
                  </a>
                </div>
              )}
            </aside>

            {/* Contact Form */}
            <section className="lg:col-span-2" aria-labelledby="form-heading">
              <div className="bg-card p-8 rounded-xl shadow-card">
                <h2 id="form-heading" className="text-2xl font-bold text-foreground mb-6">
                  Envíanos un mensaje
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      {/* Honeypot field - hidden from users, bots will fill it */}
                      <div className="absolute left-[-9999px]" aria-hidden="true">
                        <label htmlFor="website">Website</label>
                        <input
                          type="text"
                          id="website"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Nombre *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            className={errors.name ? "border-destructive" : ""}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            aria-invalid={!!errors.name}
                          />
                          {errors.name && (
                            <p id="name-error" className="text-destructive text-sm mt-1" role="alert">{errors.name}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            className={errors.email ? "border-destructive" : ""}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            aria-invalid={!!errors.email}
                          />
                          {errors.email && (
                            <p id="email-error" className="text-destructive text-sm mt-1" role="alert">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                            Teléfono
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+34 600 000 000"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                            Asunto *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="¿En qué podemos ayudarte?"
                            className={errors.subject ? "border-destructive" : ""}
                            aria-describedby={errors.subject ? "subject-error" : undefined}
                            aria-invalid={!!errors.subject}
                          />
                          {errors.subject && (
                            <p id="subject-error" className="text-destructive text-sm mt-1" role="alert">{errors.subject}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          Mensaje *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Cuéntanos los detalles de tu proyecto..."
                          rows={6}
                          className={errors.message ? "border-destructive" : ""}
                          aria-describedby={errors.message ? "message-error" : undefined}
                          aria-invalid={!!errors.message}
                        />
                        {errors.message && (
                          <p id="message-error" className="text-destructive text-sm mt-1" role="alert">{errors.message}</p>
                        )}
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="privacy"
                          checked={acceptPrivacy}
                          onCheckedChange={(checked) => {
                            setAcceptPrivacy(checked === true);
                            if (errors.privacy) {
                              setErrors((prev) => ({ ...prev, privacy: "" }));
                            }
                          }}
                          aria-describedby={errors.privacy ? "privacy-error" : undefined}
                          aria-invalid={!!errors.privacy}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="privacy"
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            He leído y acepto la{" "}
                            <Link
                              to="/politica-privacidad"
                              className="text-gold hover:underline"
                              target="_blank"
                            >
                              Política de Privacidad
                            </Link>{" "}
                            *
                          </label>
                          {errors.privacy && (
                            <p id="privacy-error" className="text-destructive text-sm" role="alert">
                              {errors.privacy}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="gold"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full md:w-auto"
                      >
                        {isSubmitting ? (
                          "Enviando..."
                        ) : (
                          <>
                            Enviar mensaje
                            <Send size={18} />
                          </>
                        )}
                      </Button>
                    </form>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Popup de agradecimiento + conversión. Redirige al inicio automáticamente. */}
      <Dialog open={isSubmitted}>
        <DialogContent
          className="sm:max-w-md text-center"
          hideClose
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-gold" aria-hidden="true" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground mb-3 text-center">
              ¡Gracias por tu interés!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Contactaremos contigo a la mayor brevedad posible.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup de redirección a WhatsApp + conversión. Continúa al enlace del botón. */}
      <Dialog open={isRedirectingWhatsapp}>
        <DialogContent
          className="sm:max-w-md text-center"
          hideClose
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-green-500" aria-hidden="true" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              Te estamos redirigiendo
            </DialogTitle>
            <DialogDescription className="sr-only">
              Te estamos redirigiendo a WhatsApp.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Contacto;
