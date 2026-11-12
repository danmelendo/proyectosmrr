import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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

        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select(
            "id, slug, title, excerpt, cover_image, categories, published_at, created_at"
          )
          .eq("published", true)
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(4);

        if (relatedData) {
          const postCategories = (postData as BlogPost).categories || [];

          const sorted = (relatedData as RelatedPost[]).sort((a, b) => {
            const aOverlap = a.categories.filter((c) =>
              postCategories.includes(c)
            ).length;

            const bOverlap = b.categories.filter((c) =>
              postCategories.includes(c)
            ).length;

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

  const getPostImage = (
    postData: BlogPost | { cover_image: string | null }
  ) => {
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
          <h1 className="text-2xl font-bold text-foreground">
            Artículo no encontrado
          </h1>

          <Link
            to="/blog"
            className="text-gold hover:underline mt-4 inline-block"
          >
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
        keywords={`${post.categories.join(
          ", "
        )}, reformas sostenibles, inversión inmobiliaria, ${post.title.toLowerCase()}`}
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

      {/* HERO IMAGE */}
      <figure className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <OptimizedImage
          src={getPostImage(post)}
          alt={post.title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />

        <div className="absolute inset-0 bg-black/40" />
      </figure>

      {/* ARTICLE */}
      <article className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* BACK BUTTON */}
            <nav aria-label="Navegación del blog">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                Volver al blog
              </Link>
            </nav>

            {/* CATEGORIES */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-block bg-gold/15 border border-gold/30 text-gold text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-sm"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* DATE */}
            <time
              className="flex items-center gap-2 text-muted-foreground mb-5"
              dateTime={post.published_at || post.created_at}
            >
              <Calendar size={16} />
              <span>
                {formatDate(post.published_at || post.created_at)}
              </span>
            </time>

            {/* TITLE */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-10">
              {post.title}
            </h1>

            {/* EXCERPT */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-14 border-l-4 border-gold pl-6 italic">
              {post.excerpt}
            </p>

            {/* MARKDOWN CONTENT */}
            <div
              className="
                prose prose-lg lg:prose-xl max-w-none
                prose-headings:text-foreground
                prose-headings:font-bold
                prose-headings:tracking-tight

                prose-h2:text-3xl
                prose-h2:mt-16
                prose-h2:mb-6
                prose-h2:border-b
                prose-h2:border-border
                prose-h2:pb-3

                prose-h3:text-2xl
                prose-h3:mt-12
                prose-h3:mb-4

                prose-p:text-muted-foreground
                prose-p:leading-relaxed
                prose-p:mb-7

                prose-strong:text-foreground
                prose-strong:font-semibold

                prose-em:text-muted-foreground

                prose-a:text-gold
                prose-a:no-underline
                hover:prose-a:text-gold/80

                prose-ul:my-6
                prose-ul:pl-6

                prose-ol:my-6
                prose-ol:pl-6

                prose-li:text-muted-foreground
                prose-li:mb-3

                prose-blockquote:border-l-4
                prose-blockquote:border-gold
                prose-blockquote:bg-card
                prose-blockquote:rounded-r-xl
                prose-blockquote:px-6
                prose-blockquote:py-4
                prose-blockquote:text-foreground
                prose-blockquote:italic
                prose-blockquote:shadow-sm

                prose-code:bg-card
                prose-code:px-2
                prose-code:py-1
                prose-code:rounded-md
                prose-code:text-gold
                prose-code:before:content-none
                prose-code:after:content-none

                prose-pre:bg-card
                prose-pre:border
                prose-pre:border-border
                prose-pre:rounded-2xl
                prose-pre:p-6

                prose-img:rounded-2xl
                prose-img:shadow-xl

                prose-hr:border-border
                prose-hr:my-14

                prose-table:w-full
                prose-table:border-collapse
                prose-th:border
                prose-th:border-border
                prose-th:bg-card
                prose-th:p-3
                prose-td:border
                prose-td:border-border
                prose-td:p-3
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <aside
          className="py-20 bg-card"
          aria-labelledby="related-heading"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">

              <h2
                id="related-heading"
                className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              >
                Artículos relacionados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="
                      bg-background
                      rounded-2xl
                      overflow-hidden
                      shadow-card
                      hover:shadow-2xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      group
                    "
                  >
                    <Link to={`/blog/${relatedPost.slug}`}>

                      <figure className="relative overflow-hidden">
                        <OptimizedImage
                          src={getPostImage(relatedPost)}
                          alt={relatedPost.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          containerClassName="w-full h-56"
                        />

                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {relatedPost.categories
                            .slice(0, 2)
                            .map((cat) => (
                              <span
                                key={cat}
                                className="bg-gold/90 text-dark text-xs font-semibold px-3 py-1 rounded-full"
                              >
                                {cat}
                              </span>
                            ))}
                        </div>
                      </figure>

                      <div className="p-6">

                        <time
                          className="flex items-center gap-2 text-sm text-muted-foreground mb-3"
                          dateTime={
                            relatedPost.published_at ||
                            relatedPost.created_at
                          }
                        >
                          <Calendar size={14} />

                          {formatDate(
                            relatedPost.published_at ||
                              relatedPost.created_at
                          )}
                        </time>

                        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-gold transition-colors">
                          {relatedPost.title}
                        </h3>

                        <p className="text-muted-foreground line-clamp-3 mb-5">
                          {relatedPost.excerpt}
                        </p>

                        <span className="text-gold font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                          Leer artículo
                          <ArrowRight size={18} />
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