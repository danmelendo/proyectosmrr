import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Mail, MessageCircle, Info } from "lucide-react";

interface Settings {
  contact_email: string;
  whatsapp_number: string;
  whatsapp_message: string;
  whatsapp_enabled: string;
}

const SETTING_KEYS: (keyof Settings)[] = [
  "contact_email",
  "whatsapp_number",
  "whatsapp_message",
  "whatsapp_enabled",
];

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    contact_email: "",
    whatsapp_number: "",
    whatsapp_message: "",
    whatsapp_enabled: "true",
  });

  // WhatsApp está activo salvo que se haya guardado explícitamente "false".
  const whatsappEnabled = settings.whatsapp_enabled !== "false";

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", SETTING_KEYS);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar la configuración",
          variant: "destructive",
        });
      } else if (data) {
        const mapped = data.reduce((acc, row) => {
          acc[row.key as keyof Settings] = row.value;
          return acc;
        }, {} as Settings);
        setSettings((prev) => ({ ...prev, ...mapped }));
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const upserts = SETTING_KEYS.map((key) => ({
        key,
        value: settings[key],
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("site_settings")
        .upsert(upserts, { onConflict: "key" });

      if (error) throw error;

      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado correctamente",
      });
    } catch (err) {
      console.error("Error saving settings:", err);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Email de contacto */}
      <section className="bg-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Email de notificaciones</h2>
            <p className="text-sm text-muted-foreground">
              Dirección que recibe los mensajes del formulario de contacto
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email destino
          </label>
          <Input
            type="email"
            value={settings.contact_email}
            onChange={(e) => handleChange("contact_email", e.target.value)}
            placeholder="info@tudominio.es"
          />
        </div>
      </section>

      {/* WhatsApp */}
      <section className="bg-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">WhatsApp</h2>
            <p className="text-sm text-muted-foreground">
              Número y mensaje para el botón de WhatsApp en la página de contacto
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Mostrar contacto por WhatsApp
            </p>
            <p className="text-xs text-muted-foreground">
              {whatsappEnabled
                ? "El botón de WhatsApp es visible en la web"
                : "El botón de WhatsApp está oculto en la web"}
            </p>
          </div>
          <Switch
            checked={whatsappEnabled}
            onCheckedChange={(checked) =>
              handleChange("whatsapp_enabled", checked ? "true" : "false")
            }
            aria-label="Mostrar u ocultar el contacto por WhatsApp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Número de WhatsApp
          </label>
          <Input
            type="tel"
            value={settings.whatsapp_number}
            onChange={(e) => handleChange("whatsapp_number", e.target.value)}
            placeholder="+34600000000"
          />
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Incluye el prefijo internacional, ej: +34711253361
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mensaje predeterminado
          </label>
          <Input
            value={settings.whatsapp_message}
            onChange={(e) => handleChange("whatsapp_message", e.target.value)}
            placeholder="Hola, me gustaría obtener información..."
          />
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Aparece pre-escrito al abrir el chat de WhatsApp
          </p>
        </div>

        {settings.whatsapp_number && (
          <a
            href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsapp_message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 underline underline-offset-2"
          >
            <MessageCircle className="w-4 h-4" />
            Probar enlace de WhatsApp
          </a>
        )}
      </section>

      <Button variant="gold" onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Guardar configuración
          </>
        )}
      </Button>
    </div>
  );
};

export default AdminSettings;
