import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, 
  Loader2, 
  Mail,
  Phone,
  User,
  Calendar,
  Search,
  Eye,
  EyeOff,
  MessageSquare,
  Download,
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Client {
  id: string;
  name: string;
  surname: string | null;
  phone: string | null;
  email: string;
  subject: string | null;
  message: string | null;
  interest_reason: string | null;
  created_at: string;
  read: boolean;
  notes: string | null;
}

const ClientsList = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState("");
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setClients((prev) => prev.filter((client) => client.id !== id));
      toast({
        title: "Cliente eliminado",
        description: "El registro se ha eliminado correctamente",
      });
    } catch (err) {
      console.error("Error deleting client:", err);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    } finally {
      setDeleteClientId(null);
    }
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update({ read: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setClients((prev) =>
        prev.map((client) =>
          client.id === id ? { ...client, read: !currentStatus } : client
        )
      );
    } catch (err) {
      console.error("Error toggling read:", err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedClient) return;

    try {
      const { error } = await supabase
        .from("clients")
        .update({ notes })
        .eq("id", selectedClient.id);

      if (error) throw error;

      setClients((prev) =>
        prev.map((client) =>
          client.id === selectedClient.id ? { ...client, notes } : client
        )
      );

      toast({
        title: "Notas guardadas",
        description: "Las notas se han guardado correctamente",
      });

      setSelectedClient(null);
    } catch (err) {
      console.error("Error saving notes:", err);
      toast({
        title: "Error",
        description: "No se pudieron guardar las notas",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const filteredClients = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      (client.surname?.toLowerCase().includes(searchLower)) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.phone?.includes(searchTerm)) ||
      (client.subject?.toLowerCase().includes(searchLower))
    );
  });

  const unreadCount = clients.filter((c) => !c.read).length;

  const handleExportCSV = () => {
    const headers = [
      "Nombre",
      "Apellidos",
      "Email",
      "Teléfono",
      "Asunto",
      "Mensaje",
      "Motivo de interés",
      "Fecha",
      "Leído",
      "Notas"
    ];

    const csvRows = [
      headers.join(";"),
      ...clients.map((client) =>
        [
          client.name,
          client.surname || "",
          client.email,
          client.phone || "",
          client.subject || "",
          (client.message || "").replace(/[\n\r;]/g, " "),
          client.interest_reason || "",
          formatDate(client.created_at),
          client.read ? "Sí" : "No",
          (client.notes || "").replace(/[\n\r;]/g, " ")
        ]
          .map((field) => `"${field}"`)
          .join(";")
      )
    ];

    const csvContent = "\uFEFF" + csvRows.join("\n"); // BOM for Excel
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportación completada",
      description: `Se han exportado ${clients.length} clientes`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats, Search and Export */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="bg-card px-3 sm:px-4 py-2 rounded-lg">
            <span className="text-xs sm:text-sm text-muted-foreground">Total: </span>
            <span className="font-semibold text-foreground">{clients.length}</span>
          </div>
          {unreadCount > 0 && (
            <div className="bg-gold/10 text-gold px-3 sm:px-4 py-2 rounded-lg">
              <span className="text-xs sm:text-sm">Sin leer: </span>
              <span className="font-semibold">{unreadCount}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={clients.length === 0}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm ? "No se encontraron resultados" : "No hay clientes"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Prueba con otros términos de búsqueda"
              : "Los contactos del formulario aparecerán aquí"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`bg-card rounded-xl p-4 space-y-3 ${
                  !client.read ? "ring-1 ring-gold/30" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {client.name} {client.surname}
                      </div>
                      {client.notes && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Tiene notas
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem 
                        onClick={() => toggleRead(client.id, client.read)}
                        className="flex items-center gap-2"
                      >
                        {client.read ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Marcar como no leído
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Marcar como leído
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedClient(client);
                          setNotes(client.notes || "");
                        }}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Ver/Añadir notas
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteClientId(client.id)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5">
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </a>
                  {client.phone && (
                    <a
                      href={`tel:${client.phone}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      {client.phone}
                    </a>
                  )}
                </div>

                {client.subject && (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{client.subject}</span>
                    {client.message && (
                      <p className="text-muted-foreground line-clamp-2 mt-0.5">
                        {client.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateShort(client.created_at)}
                  </div>
                  <button
                    onClick={() => toggleRead(client.id, client.read)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      client.read
                        ? "bg-muted text-muted-foreground"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {client.read ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Leído
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Nuevo
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
                      Cliente
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                      Contacto
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                      Asunto
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                      Fecha
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                      Estado
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className={`hover:bg-secondary/50 transition-colors ${
                        !client.read ? "bg-gold/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {client.name} {client.surname}
                            </div>
                            {client.notes && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                Tiene notas
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <a
                            href={`mailto:${client.email}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {client.email}
                          </a>
                          {client.phone && (
                            <a
                              href={`tel:${client.phone}`}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {client.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-foreground text-sm line-clamp-1">
                            {client.subject || "-"}
                          </div>
                          {client.message && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {client.message}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(client.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRead(client.id, client.read)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            client.read
                              ? "bg-muted text-muted-foreground hover:bg-muted/80"
                              : "bg-gold/10 text-gold hover:bg-gold/20"
                          }`}
                        >
                          {client.read ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Leído
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Nuevo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client);
                              setNotes(client.notes || "");
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteClientId(client.id)}
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
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteClientId} onOpenChange={() => setDeleteClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteClientId && handleDelete(deleteClientId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notes Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Notas - {selectedClient?.name} {selectedClient?.surname}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-lg space-y-2 text-sm">
              <p>
                <strong>Email:</strong> {selectedClient?.email}
              </p>
              {selectedClient?.phone && (
                <p>
                  <strong>Teléfono:</strong> {selectedClient.phone}
                </p>
              )}
              {selectedClient?.subject && (
                <p>
                  <strong>Asunto:</strong> {selectedClient.subject}
                </p>
              )}
              {selectedClient?.message && (
                <p>
                  <strong>Mensaje:</strong> {selectedClient.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas internas
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Añade notas sobre este cliente..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedClient(null)}>
                Cancelar
              </Button>
              <Button variant="gold" onClick={handleSaveNotes}>
                Guardar notas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsList;
