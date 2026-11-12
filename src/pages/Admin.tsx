import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  FileText,
  LogOut,
  Loader2,
  Home,
  Plus,
  Users,
  Menu,
  Settings
} from "lucide-react";
import BlogPostsList from "@/components/admin/BlogPostsList";
import ClientsList from "@/components/admin/ClientsList";
import AdminSettings from "@/components/admin/AdminSettings";
import logoPrincipal from "@/assets/logo_principal.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get active tab from URL hash or default to "blog"
  const getTabFromHash = () => {
    const hash = location.hash.replace("#", "");
    if (hash === "clientes") return "clientes";
    if (hash === "configuracion") return "configuracion";
    return "blog";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromHash);

  useEffect(() => {
    setActiveTab(getTabFromHash());
  }, [location.hash]);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin#${tab}`, { replace: true });
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <img 
          src={logoPrincipal} 
          alt="Proyectos MRR" 
          className="h-12 lg:h-16 mx-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <button
            onClick={() => handleTabChange("blog")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "blog"
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileText className="w-5 h-5" />
            Blog
          </button>
          <button
            onClick={() => handleTabChange("clientes")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "clientes"
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Users className="w-5 h-5" />
            Clientes
          </button>
          <button
            onClick={() => handleTabChange("configuracion")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "configuracion"
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Settings className="w-5 h-5" />
            Configuración
          </button>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link to="/" className="block" onClick={() => setMobileMenuOpen(false)}>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Home className="w-4 h-4 mr-2" />
            Ver sitio
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <img 
            src={logoPrincipal} 
            alt="Proyectos MRR" 
            className="h-8"
          />
          
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col fixed h-full">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "blog" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Publicaciones del Blog</h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Gestiona las publicaciones del blog
                  </p>
                </div>
                <Link to="/admin/blog/new" className="w-full sm:w-auto">
                  <Button variant="gold" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva publicación
                  </Button>
                </Link>
              </div>
              <BlogPostsList />
            </>
          )}

          {activeTab === "clientes" && (
            <>
              <div className="flex flex-col gap-4 mb-6 lg:mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Base de Datos de Clientes</h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Contactos recibidos desde el formulario web
                  </p>
                </div>
              </div>
              <ClientsList />
            </>
          )}

          {activeTab === "configuracion" && (
            <>
              <div className="flex flex-col gap-4 mb-6 lg:mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Configuración</h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Gestiona el email de notificaciones y el botón de WhatsApp
                  </p>
                </div>
              </div>
              <AdminSettings />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
