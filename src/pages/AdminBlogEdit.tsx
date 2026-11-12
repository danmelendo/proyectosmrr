import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Save, Upload, X, Plus, Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().trim().min(1, "El título es requerido").max(200, "Máximo 200 caracteres"),
  slug: z.string().trim().min(1, "El slug es requerido").max(100, "Máximo 100 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  excerpt: z.string().trim().min(1, "El extracto es requerido").max(500, "Máximo 500 caracteres"),
  content: z.string().trim().min(10, "El contenido debe tener al menos 10 caracteres"),
  author: z.string().trim().min(1, "El autor es requerido"),
});

type BlogPostForm = z.infer<typeof postSchema>;

const defaultCategories = ["Sostenibilidad", "Inversión", "Consejos", "Normativa", "General"];

const AdminBlogEdit = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [published, setPublished] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>(defaultCategories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["General"]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [formData, setFormData] = useState<BlogPostForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Proyectos MRR",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    // Fetch existing categories from database
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("categories");
      
      if (data) {
        const dbCategories = data.flatMap(p => p.categories || []);
        const allCategories = [...new Set([...defaultCategories, ...dbCategories])];
        setAvailableCategories(allCategories.sort());
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isNew && id) {
      fetchPost(id);
    }
  }, [id, isNew]);

  const fetchPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Error",
          description: "Publicación no encontrada",
          variant: "destructive",
        });
        navigate("/admin");
        return;
      }

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
      });
      setPublished(data.published);
      setSelectedCategories(data.categories || ["General"]);
      if (data.cover_image) {
        setCoverImageUrl(data.cover_image);
        setCoverImagePreview(data.cover_image);
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      toast({
        title: "Error",
        description: "No se pudo cargar la publicación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede superar los 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setCoverImageUrl(urlData.publicUrl);

      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente",
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      });
      setCoverImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setCoverImageUrl(null);
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !availableCategories.includes(trimmed)) {
      setAvailableCategories((prev) => [...prev, trimmed].sort());
    }
    if (trimmed && !selectedCategories.includes(trimmed)) {
      setSelectedCategories((prev) => [...prev, trimmed]);
    }
    setNewCategory("");
    setShowNewCategoryInput(false);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = postSchema.safeParse(formData);
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

    setIsSaving(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        categories: selectedCategories,
        author: formData.author,
        cover_image: coverImageUrl,
        published,
        published_at: published ? new Date().toISOString() : null,
      };

      if (isNew) {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast({
          title: "Publicación creada",
          description: "La publicación se ha creado correctamente",
        });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);
        if (error) throw error;
        toast({
          title: "Publicación actualizada",
          description: "Los cambios se han guardado correctamente",
        });
      }

      navigate("/admin");
    } catch (err: unknown) {
      console.error("Error saving post:", err);
      const errorMessage = err instanceof Error ? err.message : "No se pudo guardar la publicación";
      
      if (errorMessage.includes("duplicate key") || errorMessage.includes("unique")) {
        setErrors({ slug: "Este slug ya existe, elige otro diferente" });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
                {isNew ? "Nueva publicación" : "Editar publicación"}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode((p) => !p)}
              >
                {previewMode ? (
                  <>
                    <EyeOff className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Editar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Vista previa</span>
                  </>
                )}
              </Button>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Publicado</span>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
              <Button variant="gold" onClick={handleSubmit} disabled={isSaving} size="sm" className="sm:size-default">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Guardar</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Imagen de portada
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {coverImagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                <img
                  src={coverImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-gold hover:text-gold transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Haz clic para subir una imagen</span>
                    <span className="text-xs">PNG, JPG, WEBP hasta 5MB</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Título *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título de la publicación"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
                Slug (URL) *
              </label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-de-la-publicacion"
                  className={errors.slug ? "border-destructive" : ""}
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generar
                </Button>
              </div>
              {errors.slug && <p className="text-destructive text-sm mt-1">{errors.slug}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Categorías * (selecciona una o más)
              </label>
              
              {/* Selected categories display */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-sm"
                  >
                    {cat}
                    {selectedCategories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Available categories to add */}
              <div className="flex flex-wrap gap-2 mb-3">
                {availableCategories
                  .filter((cat) => !selectedCategories.includes(cat))
                  .map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="px-3 py-1 text-sm bg-muted hover:bg-gold/10 hover:text-gold border border-transparent hover:border-gold/20 rounded-full transition-colors"
                    >
                      + {cat}
                    </button>
                  ))}
              </div>

              {/* Add new category */}
              {showNewCategoryInput ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nueva categoría"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddCategory}>
                    Añadir
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCategoryInput(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva categoría
                </Button>
              )}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
                Autor *
              </label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Nombre del autor"
                className={errors.author ? "border-destructive" : ""}
              />
              {errors.author && <p className="text-destructive text-sm mt-1">{errors.author}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
                Extracto *
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Breve descripción de la publicación..."
                rows={3}
                className={errors.excerpt ? "border-destructive" : ""}
              />
              {errors.excerpt && <p className="text-destructive text-sm mt-1">{errors.excerpt}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-foreground">
                  Contenido * (Markdown)
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode((p) => !p)}
                  className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1"
                >
                  {previewMode ? (
                    <><EyeOff className="w-3.5 h-3.5" /> Editar</>
                  ) : (
                    <><Eye className="w-3.5 h-3.5" /> Vista previa</>
                  )}
                </button>
              </div>
              {previewMode ? (
                <div className="min-h-[480px] border border-border rounded-md p-4 prose prose-sm dark:prose-invert max-w-none bg-card overflow-auto">
                  {formData.content ? (
                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">Sin contenido todavía...</p>
                  )}
                </div>
              ) : (
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Escribe el contenido de la publicación en Markdown...&#10;&#10;# Título&#10;## Subtítulo&#10;**negrita**, *cursiva*&#10;- lista"
                  rows={20}
                  className={`font-mono text-sm ${errors.content ? "border-destructive" : ""}`}
                />
              )}
              {errors.content && <p className="text-destructive text-sm mt-1">{errors.content}</p>}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminBlogEdit;
