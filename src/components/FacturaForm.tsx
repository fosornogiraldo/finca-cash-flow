import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, FileText, Image } from "lucide-react";

export interface Factura {
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

interface FacturaFormProps {
  onAddFactura: () => void;
}

export function FacturaForm({ onAddFactura }: FacturaFormProps) {
  const [concepto, setConcepto] = useState("");
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.includes('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      
      if (!isValidType) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten imágenes (PNG, JPG) y PDFs",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo debe ser menor a 10MB",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concepto || !valor) {
      toast({
        title: "Error",
        description: "Por favor completa el concepto y el valor",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Create factura record
      const { data: factura, error: facturaError } = await supabase
        .from('facturas')
        .insert({
          concepto,
          valor: parseFloat(valor),
          fecha: new Date().toISOString().split('T')[0],
          descripcion: descripcion || null,
        })
        .select()
        .single();

      if (facturaError) throw facturaError;

      // Upload files and create file records
      for (const file of files) {
        const uploadResult = await uploadFile(file);
        if (uploadResult) {
          const { error: fileError } = await supabase
            .from('factura_archivos')
            .insert({
              factura_id: factura.id,
              nombre_archivo: uploadResult.fileName,
              tipo_archivo: uploadResult.fileType,
              url_archivo: uploadResult.fileUrl,
              tamano_bytes: uploadResult.fileSize,
            });

          if (fileError) throw fileError;
        }
      }

      // Reset form
      setConcepto("");
      setValor("");
      setDescripcion("");
      setFiles([]);
      
      toast({
        title: "¡Éxito!",
        description: "Factura agregada correctamente",
      });

      onAddFactura();
    } catch (error) {
      console.error('Error creating factura:', error);
      toast({
        title: "Error",
        description: "Error al crear la factura",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          📄 Agregar Nueva Factura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="concepto">Concepto *</Label>
            <Input
              id="concepto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Fertilizante, Semillas, Herramientas..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="valor">Valor (COP) *</Label>
            <Input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles adicionales..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="archivos">Adjuntar Archivos (PNG, JPG, PDF)</Label>
            <div className="mt-2">
              <Input
                id="archivos"
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Máximo 10MB por archivo
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      {file.type.includes('image/') ? (
                        <Image size={16} className="text-blue-500" />
                      ) : (
                        <FileText size={16} className="text-red-500" />
                      )}
                      <span className="text-sm truncate max-w-48">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Agregar Factura"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}