import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const PoliticaPrivacidad = () => {
  return (
    <Layout>
      <SEO
        title="Política de Privacidad | Proyectos MRR"
        description="Política de privacidad y protección de datos personales de Proyectos MRR - Madrid Rehabilidad Residencial SL"
        canonicalUrl="/politica-privacidad"
      />
      
      <div className="bg-cream min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display text-forest mb-12">
            Política de Privacidad
          </h1>

          <div className="prose prose-lg max-w-none text-forest/80 space-y-8">
            <section>
              <h2 className="text-2xl font-display text-forest mb-4">1. Responsable del Tratamiento</h2>
              <ul className="list-none space-y-2">
                <li><strong>Identidad:</strong> MADRID REHABILIDAD RESIDENCIAL SL</li>
                <li><strong>CIF:</strong> B10971414</li>
                <li><strong>Dirección:</strong> Calle Jose Calvo 6, 28039 Madrid</li>
                <li><strong>Correo electrónico:</strong> info@proyectosmrr.es</li>
                <li><strong>Teléfono:</strong> +34 711 25 33 61</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">2. Normativa Aplicable</h2>
              <p>Nuestra Política de Privacidad se ha diseñado de acuerdo con:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD)</li>
                <li>Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)</li>
                <li>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">3. Finalidad del Tratamiento</h2>
              <p>En MADRID REHABILIDAD RESIDENCIAL SL tratamos la información que nos facilitan las personas interesadas con las siguientes finalidades:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Gestión de consultas:</strong> Atender las solicitudes de información recibidas a través del formulario de contacto.</li>
                <li><strong>Comunicaciones comerciales:</strong> Envío de información sobre nuestros servicios, siempre que el usuario haya dado su consentimiento expreso.</li>
                <li><strong>Gestión de presupuestos:</strong> Elaboración y seguimiento de presupuestos solicitados por los usuarios.</li>
                <li><strong>Relación contractual:</strong> Gestión de la relación comercial con clientes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">4. Legitimación del Tratamiento</h2>
              <p>La base legal para el tratamiento de sus datos es:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentimiento del interesado:</strong> El usuario consiente el tratamiento de sus datos al enviar el formulario de contacto.</li>
                <li><strong>Ejecución de un contrato:</strong> El tratamiento es necesario para la ejecución de un contrato en el que el interesado es parte.</li>
                <li><strong>Interés legítimo:</strong> En determinados casos, para la gestión de la relación comercial.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">5. Categorías de Datos</h2>
              <p>Las categorías de datos que se tratan son:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Datos identificativos: nombre, apellidos</li>
                <li>Datos de contacto: dirección de correo electrónico, teléfono</li>
                <li>Otros datos: información proporcionada en el mensaje de contacto</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">6. Conservación de los Datos</h2>
              <p>Los datos personales proporcionados se conservarán:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mientras se mantenga la relación comercial o el usuario no solicite su supresión.</li>
                <li>Durante los plazos legalmente establecidos para atender posibles responsabilidades.</li>
                <li>Los datos de consultas se conservarán durante un máximo de 2 años desde la última comunicación.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">7. Destinatarios de los Datos</h2>
              <p>No se cederán datos a terceros, salvo obligación legal. En caso de ser necesario para la prestación del servicio, se comunicarán datos a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Administraciones Públicas competentes, en los casos previstos por la ley.</li>
                <li>Proveedores de servicios necesarios para la gestión (hosting, email, etc.), con los que se han firmado los correspondientes contratos de encargado del tratamiento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">8. Derechos de los Usuarios</h2>
              <p>Los usuarios pueden ejercer los siguientes derechos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Derecho de acceso:</strong> Conocer qué datos personales estamos tratando.</li>
                <li><strong>Derecho de rectificación:</strong> Solicitar la modificación de datos inexactos.</li>
                <li><strong>Derecho de supresión:</strong> Solicitar la eliminación de sus datos.</li>
                <li><strong>Derecho de oposición:</strong> Oponerse al tratamiento de sus datos.</li>
                <li><strong>Derecho de limitación:</strong> Solicitar la limitación del tratamiento.</li>
                <li><strong>Derecho de portabilidad:</strong> Recibir sus datos en un formato estructurado.</li>
                <li><strong>Derecho a retirar el consentimiento:</strong> Retirar el consentimiento prestado en cualquier momento.</li>
              </ul>
              <p className="mt-4">Para ejercer estos derechos, puede enviar un correo electrónico a <strong>info@proyectosmrr.es</strong> indicando en el asunto "Protección de Datos" y adjuntando copia de su DNI o documento identificativo.</p>
              <p>También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) - <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.aepd.es</a></p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">9. Medidas de Seguridad</h2>
              <p>MADRID REHABILIDAD RESIDENCIAL SL ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos de carácter personal y evitar su alteración, pérdida, tratamiento o acceso no autorizado, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-forest mb-4">10. Modificaciones de la Política de Privacidad</h2>
              <p>MADRID REHABILIDAD RESIDENCIAL SL se reserva el derecho a modificar la presente política para adaptarla a novedades legislativas o jurisprudenciales, así como a prácticas de la industria. En dichos supuestos, se anunciará en esta página los cambios introducidos con razonable antelación a su puesta en práctica.</p>
            </section>

            <section className="bg-forest/5 p-6 rounded-lg">
              <p className="text-sm"><strong>Última actualización:</strong> Diciembre 2025</p>
              <p className="text-sm mt-2">Para cualquier consulta sobre esta política, puede contactar con nosotros en <strong>info@proyectosmrr.es</strong></p>
            </section>
          </div>

          <div className="mt-12">
            <Link to="/aviso-legal" className="text-gold hover:underline">
              ← Ver Aviso Legal
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PoliticaPrivacidad;
