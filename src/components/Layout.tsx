import { useState } from "react";
import { Receipt, Users, Home, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'facturas' | 'aportes';
  onTabChange: (tab: 'home' | 'facturas' | 'aportes') => void;
  user: SupabaseUser | null;
  loading: boolean;
}

export function Layout({ children, activeTab, onTabChange, user, loading }: LayoutProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-cream to-farm-green-light">
      <header className="bg-gradient-to-r from-primary to-accent p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary-foreground text-center flex-1">
              🌱 Gestión Financiera - Finca Familiar 🌱
            </h1>
            
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="text-primary-foreground/70">Cargando...</div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-primary-foreground/90 text-sm">
                    <User size={16} />
                    {user.email}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-primary-foreground hover:text-primary"
                  >
                    <LogOut size={16} />
                    Salir
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-primary">
                    <LogIn size={16} />
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
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