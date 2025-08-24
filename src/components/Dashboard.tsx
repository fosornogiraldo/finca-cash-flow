import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Factura {
  id: string;
  concepto: string;
  valor: number;
  fecha: string;
  descripcion?: string;
}

interface Aporte {
  id: string;
  hermano: string;
  valor: number;
  concepto: string;
  fecha: string;
}

interface DashboardProps {
  facturas: Factura[];
  aportes: Aporte[];
}

export function Dashboard({ facturas, aportes }: DashboardProps) {
  const totalFacturas = facturas.reduce((sum, factura) => sum + factura.valor, 0);
  const totalAportes = aportes.reduce((sum, aporte) => sum + aporte.valor, 0);
  const balance = totalAportes - totalFacturas;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Obtener los últimos registros
  const ultimasFacturas = facturas
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  const ultimosAportes = aportes
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Bienvenida al Sistema de Gestión de la Finca
        </h2>
        <p className="text-muted-foreground">
          Aquí puedes registrar facturas y aportes familiares de manera sencilla
        </p>
      </div>

      {/* Resumen financiero */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Aportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalAportes)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              💰 Dinero disponible
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totalFacturas)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              📄 Gastos registrados
            </p>
          </CardContent>
        </Card>

        <Card className={`shadow-lg border-l-4 ${balance >= 0 ? 'border-l-farm-green' : 'border-l-destructive'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-farm-green' : 'text-destructive'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {balance >= 0 ? '✅ Superávit' : '⚠️ Déficit'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">📄 Últimas Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimasFacturas.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay facturas registradas
              </p>
            ) : (
              <div className="space-y-3">
                {ultimasFacturas.map((factura) => (
                  <div key={factura.id} className="flex justify-between items-center p-3 bg-farm-cream rounded">
                    <div>
                      <div className="font-medium">{factura.concepto}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(factura.fecha).toLocaleDateString('es-CO')}
                      </div>
                    </div>
                    <div className="font-bold text-destructive">
                      {formatCurrency(factura.valor)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">💰 Últimos Aportes</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimosAportes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay aportes registrados
              </p>
            ) : (
              <div className="space-y-3">
                {ultimosAportes.map((aporte) => (
                  <div key={aporte.id} className="flex justify-between items-center p-3 bg-farm-green-light rounded">
                    <div>
                      <div className="font-medium">{aporte.hermano}</div>
                      <div className="text-sm text-muted-foreground">
                        {aporte.concepto} • {new Date(aporte.fecha).toLocaleDateString('es-CO')}
                      </div>
                    </div>
                    <div className="font-bold text-farm-green">
                      {formatCurrency(aporte.valor)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card className="shadow-md bg-gradient-to-r from-farm-cream to-farm-green-light">
        <CardHeader>
          <CardTitle className="text-primary">🌱 ¿Cómo usar el sistema?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">📄 Para registrar facturas:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Ve a la pestaña "Facturas"</li>
                <li>• Completa el concepto y valor</li>
                <li>• Agrega una descripción si es necesario</li>
                <li>• Haz clic en "Agregar Factura"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💰 Para registrar aportes:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Ve a la pestaña "Aportes"</li>
                <li>• Selecciona el hermano</li>
                <li>• Ingresa el valor y concepto</li>
                <li>• Haz clic en "Registrar Aporte"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}