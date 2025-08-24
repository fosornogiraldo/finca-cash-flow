import { useState } from "react";
import { Receipt, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'facturas' | 'aportes';
  onTabChange: (tab: 'home' | 'facturas' | 'aportes') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-cream to-farm-green-light">
      <header className="bg-gradient-to-r from-primary to-accent p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground mb-4 text-center">
            🌱 Gestión Financiera - Finca Familiar 🌱
          </h1>
          <nav className="flex justify-center gap-2">
            <Button
              variant={activeTab === 'home' ? 'default' : 'secondary'}
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2"
            >
              <Home size={18} />
              Inicio
            </Button>
            <Button
              variant={activeTab === 'facturas' ? 'default' : 'secondary'}
              onClick={() => onTabChange('facturas')}
              className="flex items-center gap-2"
            >
              <Receipt size={18} />
              Facturas
            </Button>
            <Button
              variant={activeTab === 'aportes' ? 'default' : 'secondary'}
              onClick={() => onTabChange('aportes')}
              className="flex items-center gap-2"
            >
              <Users size={18} />
              Aportes
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}