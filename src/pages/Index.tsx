import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { FacturaForm } from "@/components/FacturaForm";
import { FacturaList } from "@/components/FacturaList";
import { AporteForm } from "@/components/AporteForm";
import { AporteList } from "@/components/AporteList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Aporte {
  id: string;
  hermano: string;
  valor: number;
  concepto: string;
  fecha: string;
}

interface Factura {
  id: string;
  concepto: string;
  valor: number;
  fecha: string;
  descripcion?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'facturas' | 'aportes'>('home');
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [refreshFacturas, setRefreshFacturas] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch facturas from database
  const fetchFacturas = async () => {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching facturas:', error);
        return;
      }
      
      const formattedFacturas: Factura[] = data?.map(factura => ({
        id: factura.id,
        concepto: factura.concepto,
        valor: Number(factura.valor),
        fecha: factura.fecha,
        descripcion: factura.descripcion || undefined,
      })) || [];
      
      setFacturas(formattedFacturas);
    } catch (error) {
      console.error('Error fetching facturas:', error);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, [refreshFacturas]);

  const addAporte = (aporte: Omit<Aporte, 'id'>) => {
    if (!user) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para agregar aportes",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const newAporte = {
      ...aporte,
      id: Date.now().toString(),
    };
    setAportes(prev => [...prev, newAporte]);
  };

  const deleteAporte = (id: string) => {
    if (!user) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para eliminar aportes",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setAportes(prev => prev.filter(a => a.id !== id));
  };

  const handleFacturaAdded = () => {
    if (!user) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para agregar facturas",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setRefreshFacturas(prev => !prev);
  };

  const handleFacturaDeleted = (id: string) => {
    if (!user) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para eliminar facturas",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    console.log('Factura deleted:', id);
    fetchFacturas(); // Refresh facturas after deletion
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard facturas={facturas} aportes={aportes} />;
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
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} loading={loading}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
