import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO, { getArticleSchema, getBreadcrumbSchema } from "@/components/SEO";
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

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  categories: string[];
  author: string;
  published_at: string | null;
  created_at: string;
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  categories: string[];
  published_at: string | null;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the main post
        const { data: postData, error: postError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();

        if (postError) throw postError;

        if (!postData) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        setPost(postData as BlogPost);

        // Fetch related posts (same categories first, then others)
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("id, slug, title, excerpt, cover_image, categories, published_at, created_at")
          .eq("published", true)
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(4);

        if (relatedData) {
          // Sort to prioritize posts with overlapping categories
          const postCategories = (postData as BlogPost).categories || [];
          const sorted = (relatedData as RelatedPost[]).sort((a, b) => {
            const aOverlap = a.categories.filter(c => postCategories.includes(c)).length;
            const bOverlap = b.categories.filter(c => postCategories.includes(c)).length;
            return bOverlap - aOverlap;
          });
          setRelatedPosts(sorted.slice(0, 2));
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const getPostImage = (postData: BlogPost | { cover_image: string | null }) => {
    if (postData.cover_image && imageMap[postData.cover_image]) {
      return imageMap[postData.cover_image];
    }
    return postData.cover_image || blogCover01;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Check if it's a bold heading (starts with **)
      if (paragraph.startsWith('**') && paragraph.includes('**')) {
        const match = paragraph.match(/\*\*(.+?)\*\*/);
        if (match) {
          const heading = match[1];
          const rest = paragraph.replace(/\*\*.+?\*\*/, '').trim();
          return (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">{heading}</h3>
              {rest && <p className="text-muted-foreground leading-relaxed">{rest}</p>}
            </div>
          );
        }
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-6">
          {paragraph}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <SEO
          title="Cargando..."
          description="Cargando artículo del blog"
          canonicalUrl={`/blog/${slug}`}
        />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout>
        <SEO
          title="Artículo no encontrado"
          description="El artículo que buscas no existe o ha sido movido."
          canonicalUrl={`/blog/${slug}`}
        />
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Artículo no encontrado</h1>
          <Link to="/blog" className="text-gold hover:underline mt-4 inline-block">
            Volver al blog
          </Link>
        </div>
      </Layout>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getArticleSchema(
        post.title,
        post.excerpt,
        `/blog/${post.slug}`,
        getPostImage(post),
        post.published_at || post.created_at,
        post.author
      ),
      getBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ]),
    ],
  };

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.categories.join(", ")}, reformas sostenibles, inversión inmobiliaria, ${post.title.toLowerCase()}`}
        canonicalUrl={`/blog/${post.slug}`}
        ogType="article"
        article={{
          publishedTime: post.published_at || post.created_at,
          section: post.categories[0] || "General",
          tags: [...post.categories, "Reformas", "Sostenibilidad"],
          author: post.author,
        }}
        structuredData={structuredData}
      />

      {/* Hero Image */}
      <figure className="relative w-full h-[50vh] md:h-[60vh]">
        <OptimizedImage
          src={getPostImage(post)}
          alt={post.title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-dark/30" />
      </figure>

      {/* Content */}
      <article id="blog-content-start" className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <nav aria-label="Navegación del blog">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-6"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Volver al blog
              </Link>
            </nav>

            {/* Category badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <span key={cat} className="inline-block bg-gold/20 text-gold text-sm font-medium px-3 py-1 rounded-full">
                  {cat}
                </span>
              ))}
            </div>

            {/* Date */}
            <time className="flex items-center gap-2 text-muted-foreground mb-4" dateTime={post.published_at || post.created_at}>
              <Calendar size={16} aria-hidden="true" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </time>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
              {post.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <aside className="py-16 bg-card" aria-labelledby="related-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 id="related-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Artículos relacionados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="block bg-background rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <Link to={`/blog/${relatedPost.slug}`} className="block">
                      <figure className="relative overflow-hidden">
                        <OptimizedImage
                          src={getPostImage(relatedPost)}
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          containerClassName="w-full h-48"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1 z-10">
                          {relatedPost.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="bg-gold/90 text-dark text-xs font-medium px-3 py-1 rounded-full">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </figure>

                      <div className="p-5">
                        <time className="flex items-center gap-2 text-sm text-muted-foreground mb-2" dateTime={relatedPost.published_at || relatedPost.created_at}>
                          <Calendar size={14} aria-hidden="true" />
                          {formatDate(relatedPost.published_at || relatedPost.created_at)}
                        </time>

                        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <span className="text-gold font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300 text-sm">
                          Leer artículo
                          <ArrowRight size={16} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </Layout>
  );
};

export default BlogPost;
