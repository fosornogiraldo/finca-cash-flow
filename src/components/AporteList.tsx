import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Aporte {
  id: string;
  hermano: string;
  valor: number;
  concepto: string;
  fecha: string;
}

interface AporteListProps {
  aportes: Aporte[];
  onDeleteAporte: (id: string) => void;
}

export function AporteList({ aportes, onDeleteAporte }: AporteListProps) {
  const total = aportes.reduce((sum, aporte) => sum + aporte.valor, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Agrupar aportes por hermano
  const aportesPorHermano = aportes.reduce((acc, aporte) => {
    if (!acc[aporte.hermano]) {
      acc[aporte.hermano] = 0;
    }
    acc[aporte.hermano] += aporte.valor;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-primary flex items-center justify-between">
            <span>💰 Aportes por Hermano</span>
            <span className="text-lg font-bold text-farm-brown">
              Total: {formatCurrency(total)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(aportesPorHermano).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay aportes registrados aún
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(aportesPorHermano).map(([hermano, total]) => (
                <div
                  key={hermano}
                  className="p-3 bg-farm-green-light rounded-lg border"
                >
                  <div className="font-semibold text-farm-brown">{hermano}</div>
                  <div className="font-bold text-primary">
                    {formatCurrency(total)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-primary">📝 Historial de Aportes</CardTitle>
        </CardHeader>
        <CardContent>
          {aportes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay aportes registrados aún
            </p>
          ) : (
            <div className="space-y-3">
              {aportes.map((aporte) => (
                <div
                  key={aporte.id}
                  className="flex items-center justify-between p-4 bg-farm-cream rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-farm-brown">
                          {aporte.hermano}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {aporte.concepto}
                        </p>
                      </div>
                      <span className="font-bold text-primary">
                        {formatCurrency(aporte.valor)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fecha: {new Date(aporte.fecha).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteAporte(aporte.id)}
                    className="ml-4"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}