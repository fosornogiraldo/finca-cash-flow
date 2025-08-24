import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Factura {
  id: string;
  concepto: string;
  valor: number;
  fecha: string;
  descripcion?: string;
}

interface FacturaFormProps {
  onAddFactura: (factura: Omit<Factura, 'id'>) => void;
}

export function FacturaForm({ onAddFactura }: FacturaFormProps) {
  const [concepto, setConcepto] = useState("");
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concepto || !valor) {
      toast({
        title: "Error",
        description: "Por favor completa el concepto y el valor",
        variant: "destructive",
      });
      return;
    }

    const factura = {
      concepto,
      valor: parseFloat(valor),
      fecha: new Date().toISOString().split('T')[0],
      descripcion: descripcion || undefined,
    };

    onAddFactura(factura);
    setConcepto("");
    setValor("");
    setDescripcion("");
    
    toast({
      title: "¡Éxito!",
      description: "Factura agregada correctamente",
    });
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
          
          <Button type="submit" className="w-full">
            Agregar Factura
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}