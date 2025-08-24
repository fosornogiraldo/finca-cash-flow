import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { FacturaForm } from "@/components/FacturaForm";
import { FacturaList } from "@/components/FacturaList";
import { AporteForm } from "@/components/AporteForm";
import { AporteList } from "@/components/AporteList";

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

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'facturas' | 'aportes'>('home');
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [aportes, setAportes] = useState<Aporte[]>([]);

  const addFactura = (factura: Omit<Factura, 'id'>) => {
    const newFactura = {
      ...factura,
      id: Date.now().toString(),
    };
    setFacturas(prev => [...prev, newFactura]);
  };

  const addAporte = (aporte: Omit<Aporte, 'id'>) => {
    const newAporte = {
      ...aporte,
      id: Date.now().toString(),
    };
    setAportes(prev => [...prev, newAporte]);
  };

  const deleteFactura = (id: string) => {
    setFacturas(prev => prev.filter(f => f.id !== id));
  };

  const deleteAporte = (id: string) => {
    setAportes(prev => prev.filter(a => a.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard facturas={facturas} aportes={aportes} />;
      case 'facturas':
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <FacturaForm onAddFactura={addFactura} />
            <FacturaList facturas={facturas} onDeleteFactura={deleteFactura} />
          </div>
        );
      case 'aportes':
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <AporteForm onAddAporte={addAporte} />
            <AporteList aportes={aportes} onDeleteAporte={deleteAporte} />
          </div>
        );
      default:
        return <Dashboard facturas={facturas} aportes={aportes} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
