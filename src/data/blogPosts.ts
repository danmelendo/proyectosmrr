import blogCover01 from "@/assets/blog-01-cover.png";
import blogCover02 from "@/assets/blog-02-cover.png";
import blogCover03 from "@/assets/blog-03-cover.png";
import blogCover04 from "@/assets/blog-04-cover.png";

export type BlogCategory = "Sostenibilidad" | "Inversión" | "Consejos" | "Normativa";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
  category: BlogCategory;
}

export const categories: BlogCategory[] = ["Sostenibilidad", "Inversión", "Consejos", "Normativa"];

export const blogPosts: BlogPost[] = [
  {
    id: 4,
    slug: "futuro-vivienda-2030",
    title: "El futuro de la vivienda ya tiene fecha: ¿está tu casa preparada para 2030?",
    excerpt: "La Unión Europea ya ha puesto fecha: en 2030, todas las viviendas que se vendan o alquilen deberán contar con una calificación energética mínima de clase E.",
    date: "Septiembre 28, 2025",
    image: blogCover04,
    category: "Normativa",
    content: `La vivienda está en el centro de uno de los grandes cambios que marcarán los próximos años. La Unión Europea ya ha puesto fecha: en 2030, todas las viviendas que se vendan o alquilen deberán contar con una calificación energética mínima de clase E.

Esto significa que millones de hogares tendrán que adaptarse. Pero lejos de ser un problema, es también una gran oportunidad: la de mejorar nuestros espacios, hacerlos más habitables, más eficientes y, además, más atractivos en el mercado.

**El valor de una reforma sostenible**

Reformar no es sólo cambiar la estética de una vivienda. Es replantear cómo funciona cada espacio y cómo impacta en quienes lo habitan.

Una reforma sostenible aporta tres beneficios clave:

• Más confort: mejor aislamiento, mejor iluminación y una distribución pensada para la vida real.

• Más eficiencia: ahorro en agua y energía gracias a instalaciones actualizadas y materiales responsables.

• Más durabilidad: acabados que resisten el paso del tiempo, cuidando tanto el espacio como la inversión.

**Problemas reales, soluciones reales**

En MRR lo vemos cada día. La decisión de reformar suele llegar por situaciones muy concretas:

• Cocinas pequeñas que no aprovechan bien el espacio.

• Baños incómodos o inseguros, con bañeras que ya no se usan.

• Salones oscuros o mal conectados con el resto de la casa.

• Viviendas con un alto consumo energético por falta de aislamiento.

Son problemas cotidianos, pero con la reforma adecuada se convierten en oportunidades para mejorar la vida diaria y, al mismo tiempo, revalorizar el inmueble.

**Cómo lo hacemos en MRR**

Nuestro método se basa en una idea sencilla: cada espacio cuenta.

Analizamos cada vivienda con detalle, proponemos soluciones reales y ejecutamos con un equipo propio que controla todo el proceso. Así garantizamos plazos, calidad y un acompañamiento cercano en cada fase.

El resultado son reformas responsables, rentables y con visión. Proyectos que cuidan del presente, pero también preparan para el futuro.

**Mirar hacia adelante**

La vivienda del mañana empieza a construirse hoy. Apostar por reformas sostenibles no es solo una cuestión de normativa: es una decisión inteligente para vivir mejor y generar valor duradero.

En MRR trabajamos con un propósito claro: transformar cada espacio en un lugar más habitable, más eficiente y más preparado para lo que viene.`,
  },
  {
    id: 3,
    slug: "5-preguntas-antes-de-reformar",
    title: "Las 5 preguntas que deberías hacerte antes de reformar tu vivienda",
    excerpt: "Reformar una vivienda es una decisión importante que implica tiempo, esfuerzo y recursos. Acertar desde el principio es fundamental para evitar sorpresas.",
    date: "Septiembre 14, 2025",
    image: blogCover03,
    category: "Consejos",
    content: `Reformar una vivienda es una decisión importante que implica tiempo, esfuerzo y recursos. Acertar desde el principio es fundamental para evitar sorpresas y conseguir resultados que realmente aporten valor.

**1. ¿Cuál es el objetivo real de la reforma?**

¿Quieres mejorar el espacio para vivir, ponerlo en alquiler o prepararlo para la venta? Cada propósito requiere soluciones específicas, por eso definirlo claramente te ayudará a tomar mejores decisiones durante el proceso.

**2. ¿Cuál es tu presupuesto real?**

Es importante planificar incluyendo una partida para imprevistos (alrededor del 10–15 %). Además, divide el presupuesto en categorías: honorarios técnicos, materiales, ejecución y otros gastos asociados.

**3. ¿Necesitas una reforma integral o parcial?**

Las viviendas antiguas o con problemas estructurales pueden requerir una reforma completa. En otros casos, puede bastar con actualizar espacios concretos como cocina, baño o pintura para renovar el ambiente.

**4. ¿Con quién vas a reformar?**

Selecciona profesionales con experiencia demostrable, buenas referencias y compromiso con la calidad. Asegúrate de tener contratos claros que especifiquen plazos, costes y nivel de detalle en la ejecución.

**5. ¿Cómo medirás el éxito de la reforma?**

Define indicadores claros según tu objetivo: revalorización en precio por metro cuadrado, mejora en eficiencia energética, funcionalidad del espacio o demanda en el mercado. Esto te permitirá evaluar resultados de forma objetiva.

Responder estas preguntas te dará una hoja de ruta más segura para encarar la reforma con confianza y visión. En MRR acompañamos cada paso para convertir tu proyecto en una transformación real y sostenible.`,
  },
  {
    id: 2,
    slug: "reformar-para-revalorizar",
    title: "¿Sabías que una reforma bien pensada puede aumentar hasta un 20 % el valor de una vivienda?",
    excerpt: "En MRR creemos que reformar no es solo estética: es estrategia, sostenibilidad y retorno.",
    date: "Agosto 24, 2025",
    image: blogCover02,
    category: "Inversión",
    content: `En MRR creemos que reformar no es solo estética: es estrategia, sostenibilidad y retorno.

**1. Distribución inteligente = mayor funcionalidad**

Replantear espacios puede multiplicar su utilidad: salones más amplios, cocinas abiertas o zonas polivalentes hacen que la vivienda encaje mejor en el mercado.

**2. Luz y ventilación: activos invisibles, impacto real**

Espacios bien iluminados y ventilados generan sensaciones de amplitud, confort y se valoran más por los compradores o inquilinos.

**3. Acabados y materiales con criterio**

Invertir en materiales de calidad no solo embellece: mejora la durabilidad y añade valor tangible.

**4. Eficiencia energética como factor de revalorización**

Modernizar ventanas, aislar paredes o incluir iluminación LED reduce costes y suma méritos medioambientales, cada vez más demandados.

**5. Casos prácticos**

Vivienda en Madrid, 80 m²: Reformamos cocina, abrimos salón, mejoramos iluminación y cambiamos suelos. Inversión: 25 000 €. Incremento estimado de valor: 40 000 €.

Reformar bien es invertir con cabeza. Si quieres que tu vivienda destaque por valor y bienestar, en MRR estamos listos para hablar.`,
  },
  {
    id: 1,
    slug: "reformar-con-vision-nace-mrr",
    title: "Reformar con visión. Nace MRR.",
    excerpt: "En 2022, nació una idea sencilla pero poderosa: transformar viviendas no solo para que se vean mejor, sino para que sean más valiosas, habitables y sostenibles en el tiempo.",
    date: "Agosto 10, 2025",
    image: blogCover01,
    category: "Sostenibilidad",
    content: `En 2022, nació una idea sencilla pero poderosa: transformar viviendas no solo para que se vean mejor, sino para que sean más valiosas, habitables y sostenibles en el tiempo. Así empezó MRR. Una marca que no entiende las reformas como un trámite, sino como una oportunidad para crear valor real.

Desde el principio, supimos que no queríamos ser una empresa de reformas más. Queríamos ser un proyecto con propósito. Con visión de futuro. Con compromiso con el presente.

Por eso, en MRR lo que hacemos va mucho más allá de renovar espacios. Apostamos por la sostenibilidad como estrategia, no como tendencia. Por la rentabilidad a largo plazo, no por el beneficio inmediato. Y por la calidad, no como un eslogan, sino como una promesa que cumplimos cada día.

Nos mueve una convicción: la forma en la que transformamos los espacios dice mucho de cómo entendemos el mundo. Por eso nuestras reformas son responsables, rentables y reales. Responsables con el entorno y con quienes vivirán allí. Rentables porque cuidamos el valor del activo desde el principio hasta el final. Reales porque trabajamos con los pies en la tierra, cumpliendo lo que prometemos y entregando en los plazos acordados.

Empezamos desde cero, como todos los proyectos valientes. Vivienda a vivienda. Reforma a reforma. Con un equipo comprometido, ágil y profesional. En cada proyecto aplicamos estrategia, análisis, experiencia técnica y mucha atención al detalle. Porque sabemos que cuando todo eso se alinea, se genera valor.

Hoy damos un paso más y lanzamos este espacio como una nueva puerta de entrada para conocernos. Aquí encontrarás inspiración, información y una idea clara: en MRR reformamos con visión.

Y esto es solo el comienzo.`,
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getRelatedPosts = (currentSlug: string, limit: number = 2): BlogPost[] => {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  // First try to get posts from same category
  const sameCategoryPosts = blogPosts.filter(
    (post) => post.slug !== currentSlug && post.category === currentPost.category
  );
  
  // If not enough, add other posts
  const otherPosts = blogPosts.filter(
    (post) => post.slug !== currentSlug && post.category !== currentPost.category
  );
  
  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
};
