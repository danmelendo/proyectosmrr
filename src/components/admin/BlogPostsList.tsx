import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Trash2, 
  Loader2, 
  Eye, 
  EyeOff,
  FileText,
  Calendar,
  MoreVertical
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  categories: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

const BlogPostsList = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, categories, published, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast({
        title: "Error",
        description: "No se pudieron cargar las publicaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast({
        title: "Publicación eliminada",
        description: "La publicación se ha eliminado correctamente",
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la publicación",
        variant: "destructive",
      });
    } finally {
      setDeletePostId(null);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ 
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq("id", id);

      if (error) throw error;

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, published: !currentStatus } : post
        )
      );

      toast({
        title: currentStatus ? "Publicación despublicada" : "Publicación publicada",
        description: currentStatus
          ? "La publicación ya no es visible públicamente"
          : "La publicación ahora es visible públicamente",
      });
    } catch (err) {
      console.error("Error toggling published:", err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No hay publicaciones
        </h3>
        <p className="text-muted-foreground mb-6">
          Crea tu primera publicación del blog
        </p>
        <Link to="/admin/blog/new">
          <Button variant="gold">Crear publicación</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-card rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  /blog/{post.slug}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem asChild>
                    <Link to={`/admin/blog/${post.id}`} className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => togglePublished(post.id, post.published)}
                    className="flex items-center gap-2"
                  >
                    {post.published ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Despublicar
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Publicar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeletePostId(post.id)}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {post.categories.map((cat) => (
                <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                  {cat}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.created_at)}
              </div>
              <button
                onClick={() => togglePublished(post.id, post.published)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  post.published
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {post.published ? (
                  <>
                    <Eye className="w-3 h-3" />
                    Publicado
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Borrador
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                  Título
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                  Categorías
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                  Estado
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                  Fecha
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map((cat) => (
                        <span key={cat} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(post.id, post.published)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        post.published
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Publicado
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Borrador
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletePostId(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDelete(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogPostsList;
