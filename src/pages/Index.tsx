import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { FacturaForm } from "@/components/FacturaForm";
import { FacturaList } from "@/components/FacturaList";
import { AporteForm } from "@/components/AporteForm";
import { AporteList } from "@/components/AporteList";

interface Aporte {
  id: string;
  hermano: string;
  valor: number;
  concepto: string;
  fecha: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'facturas' | 'aportes'>('home');
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [refreshFacturas, setRefreshFacturas] = useState(false);

  const addAporte = (aporte: Omit<Aporte, 'id'>) => {
    const newAporte = {
      ...aporte,
      id: Date.now().toString(),
    };
    setAportes(prev => [...prev, newAporte]);
  };

  const deleteAporte = (id: string) => {
    setAportes(prev => prev.filter(a => a.id !== id));
  };

  const handleFacturaAdded = () => {
    setRefreshFacturas(prev => !prev);
  };

  const handleFacturaDeleted = (id: string) => {
    // This callback can be used for additional logic if needed
    console.log('Factura deleted:', id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard facturas={[]} aportes={aportes} />;
      case 'facturas':
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <FacturaForm onAddFactura={handleFacturaAdded} />
            <FacturaList refresh={refreshFacturas} onDeleteFactura={handleFacturaDeleted} />
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
        return <Dashboard facturas={[]} aportes={aportes} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
