import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Image, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Factura {
  id: string;
  concepto: string;
  valor: number;
  fecha: string;
  descripcion?: string;
  archivos?: {
    id: string;
    nombre_archivo: string;
    tipo_archivo: string;
    url_archivo: string;
    tamano_bytes: number;
  }[];
}

interface FacturaListProps {
  refresh: boolean;
  onDeleteFactura: (id: string) => void;
}

export function FacturaList({ refresh, onDeleteFactura }: FacturaListProps) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFacturas = async () => {
    try {
      const { data: facturasData, error: facturasError } = await supabase
        .from('facturas')
        .select(`
          *,
          factura_archivos (
            id,
            nombre_archivo,
            tipo_archivo,
            url_archivo,
            tamano_bytes
          )
        `)
        .order('created_at', { ascending: false });

      if (facturasError) throw facturasError;

      const facturasWithFiles = facturasData.map(factura => ({
        ...factura,
        archivos: factura.factura_archivos || []
      }));

      setFacturas(facturasWithFiles);
    } catch (error) {
      console.error('Error fetching facturas:', error);
      toast({
        title: "Error",
        description: "Error al cargar las facturas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('facturas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFacturas(prev => prev.filter(f => f.id !== id));
      onDeleteFactura(id);
      
      toast({
        title: "¡Éxito!",
        description: "Factura eliminada correctamente",
      });
    } catch (error) {
      console.error('Error deleting factura:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la factura",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = facturas.reduce((sum, factura) => sum + factura.valor, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-primary flex items-center justify-between">
          <span>📋 Facturas Registradas</span>
          <span className="text-lg font-bold text-farm-brown">
            Total: {formatCurrency(total)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">
            Cargando facturas...
          </p>
        ) : facturas.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay facturas registradas aún
          </p>
        ) : (
          <div className="space-y-3">
            {facturas.map((factura) => (
              <div
                key={factura.id}
                className="p-4 bg-farm-cream rounded-lg border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-farm-brown">
                    {factura.concepto}
                  </h3>
                  <span className="font-bold text-primary">
                    {formatCurrency(factura.valor)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Fecha: {new Date(factura.fecha).toLocaleDateString('es-CO')}
                </p>
                
                {factura.descripcion && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {factura.descripcion}
                  </p>
                )}
                
                {factura.archivos && factura.archivos.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Archivos adjuntos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {factura.archivos.map((archivo) => (
                        <Button
                          key={archivo.id}
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(archivo.url_archivo, archivo.nombre_archivo)}
                          className="flex items-center gap-2 h-8 px-2"
                        >
                          {archivo.tipo_archivo.includes('image/') ? (
                            <Image size={14} className="text-blue-500" />
                          ) : (
                            <FileText size={14} className="text-red-500" />
                          )}
                          <span className="truncate max-w-20 text-xs">
                            {archivo.nombre_archivo}
                          </span>
                          <Download size={12} />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(factura.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}