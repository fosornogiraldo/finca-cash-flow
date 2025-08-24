import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Aporte {
  id: string;
  hermano: string;
  valor: number;
  concepto: string;
  fecha: string;
}

interface AporteFormProps {
  onAddAporte: (aporte: Omit<Aporte, 'id'>) => void;
}

const hermanos = [
  "Juan Carlos",
  "María Elena",
  "Pedro José",
  "Ana Lucía",
  "Luis Fernando"
];

export function AporteForm({ onAddAporte }: AporteFormProps) {
  const [hermano, setHermano] = useState("");
  const [valor, setValor] = useState("");
  const [concepto, setConcepto] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hermano || !valor || !concepto) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const aporte = {
      hermano,
      valor: parseFloat(valor),
      concepto,
      fecha: new Date().toISOString().split('T')[0],
    };

    onAddAporte(aporte);
    setHermano("");
    setValor("");
    setConcepto("");
    
    toast({
      title: "¡Éxito!",
      description: "Aporte registrado correctamente",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          👥 Registrar Aporte de Hermano
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="hermano">Hermano *</Label>
            <Select value={hermano} onValueChange={setHermano}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el hermano" />
              </SelectTrigger>
              <SelectContent>
                {hermanos.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="valor">Valor del Aporte (COP) *</Label>
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
            <Label htmlFor="concepto">Concepto *</Label>
            <Input
              id="concepto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Mejoras casa, Sistema de riego, Cercas..."
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Registrar Aporte
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}