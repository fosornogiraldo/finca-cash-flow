import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Factura {
  id: string;
  concepto: string;
  valor: number;
  fecha: string;
  descripcion?: string;
}

interface FacturaListProps {
  facturas: Factura[];
  onDeleteFactura: (id: string) => void;
}

export function FacturaList({ facturas, onDeleteFactura }: FacturaListProps) {
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
        {facturas.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay facturas registradas aún
          </p>
        ) : (
          <div className="space-y-3">
            {facturas.map((factura) => (
              <div
                key={factura.id}
                className="flex items-center justify-between p-4 bg-farm-cream rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
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
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteFactura(factura.id)}
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
  );
}