import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getBreadcrumbSchema } from "@/components/SEO";
import OptimizedImage from "@/components/ui/optimized-image";
import { supabase } from "@/integrations/supabase/client";

// Import static images for fallback
import blogCover01 from "@/assets/blog-01-cover.png";
import blogCover02 from "@/assets/blog-02-cover.png";
import blogCover03 from "@/assets/blog-03-cover.png";
import blogCover04 from "@/assets/blog-04-cover.png";

const imageMap: Record<string, string> = {
  "/blog-01-cover.png": blogCover01,
  "/blog-02-cover.png": blogCover02,
  "/blog-03-cover.png": blogCover03,
  "/blog-04-cover.png": blogCover04,
};

type BlogCategory = "Sostenibilidad" | "Inversión" | "Consejos" | "Normativa" | "General";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  categories: string[];
  published_at: string | null;
  created_at: string;
}

const categories: BlogCategory[] = ["Sostenibilidad", "Inversión", "Consejos", "Normativa"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "Todos">("Todos");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, slug, title, excerpt, cover_image, categories, published_at, created_at")
          .eq("published", true)
          .order("published_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === "Todos" 
    ? posts 
    : posts.filter(post => post.categories.includes(selectedCategory));

  const getPostImage = (post: BlogPost) => {
    if (post.cover_image && imageMap[post.cover_image]) {
      return imageMap[post.cover_image];
    }
    return post.cover_image || blogCover01;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://proyectosmrr.es/blog",
        name: "Blog de Proyectos MRR",
        description: "Noticias y conocimiento sobre reformas sostenibles, inversión inmobiliaria y eficiencia energética",
        url: "https://proyectosmrr.es/blog",
        publisher: {
          "@type": "Organization",
          name: "Proyectos MRR",
          logo: {
            "@type": "ImageObject",
            url: "https://proyectosmrr.es/logo.svg",
          },
        },
        blogPost: posts.map(post => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.published_at || post.created_at,
          url: `https://proyectosmrr.es/blog/${post.slug}`,
          author: {
            "@type": "Organization",
            name: "Proyectos MRR",
          },
        })),
      },
      getBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
      ]),
    ],
  };

  return (
    <Layout>
      <SEO
        title="Blog - Noticias sobre Reformas Sostenibles e Inversión Inmobiliaria"
        description="Mantente al día con las últimas tendencias en reformas sostenibles, inversión inmobiliaria y eficiencia energética. Consejos y noticias de expertos."
        keywords="blog reformas, noticias inmobiliarias, eficiencia energética, reformas sostenibles, inversión inmobiliaria, consejos reforma vivienda"
        canonicalUrl="/blog"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <header className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium mb-4">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">
              Noticias y <span className="text-gradient-gold">conocimiento</span>
            </h1>
            <p className="text-lg text-cream/80 leading-relaxed">
              Mantente al día con las últimas tendencias en reformas sostenibles, 
              inversión inmobiliaria y eficiencia energética.
            </p>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <nav className="py-8 bg-background border-b border-border" aria-label="Filtros de categoría">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3" role="tablist">
            <button
              onClick={() => setSelectedCategory("Todos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === "Todos"
                  ? "bg-gold text-dark"
                  : "bg-card text-muted-foreground hover:bg-gold/20 hover:text-gold"
              }`}
              role="tab"
              aria-selected={selectedCategory === "Todos"}
              aria-controls="blog-posts"
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gold text-dark"
                    : "bg-card text-muted-foreground hover:bg-gold/20 hover:text-gold"
                }`}
                role="tab"
                aria-selected={selectedCategory === category}
                aria-controls="blog-posts"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Blog Posts */}
      <main className="py-16 bg-background" id="blog-posts" role="tabpanel">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      <figure className="relative overflow-hidden">
                        <OptimizedImage
                          src={getPostImage(post)}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          containerClassName="w-full h-48"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1 z-10">
                          {post.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="bg-gold/90 text-dark text-xs font-medium px-3 py-1 rounded-full">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </figure>

                      <div className="p-5">
                        <time className="flex items-center gap-2 text-sm text-muted-foreground mb-2" dateTime={post.published_at || post.created_at}>
                          <Calendar size={14} aria-hidden="true" />
                          {formatDate(post.published_at || post.created_at)}
                        </time>

                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>

                        <span className="text-gold font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300 text-sm">
                          Leer artículo
                          <ArrowRight size={16} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No hay artículos en esta categoría.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Blog;
