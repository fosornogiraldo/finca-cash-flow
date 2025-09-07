# 🌱 Sistema de Gestión Financiera - Finca Familiar

Una aplicación web para gestionar las finanzas familiares de la finca, permitiendo registrar facturas y aportes de los miembros de la familia.

## 🚀 Características

- **Dashboard** con resumen financiero y balance
- **Gestión de Facturas** con posibilidad de adjuntar archivos
- **Registro de Aportes** por miembro familiar
- **Autenticación** - Solo usuarios autenticados pueden crear/editar, todos pueden ver
- **Almacenamiento de archivos** en Supabase Storage
- **Diseño responsivo** con tema personalizado

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **Routing**: React Router DOM

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🔧 Instalación y Configuración

### 1. Clonar y configurar el proyecto

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
```

### 2. Configurar Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Obtener las credenciales:
   - Project URL
   - Anon key
3. Actualizar el archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Configurar la Base de Datos

Ejecuta las siguientes migraciones SQL en el SQL Editor de Supabase:

#### 3.1 Crear tablas principales

```sql
-- Crear tabla de facturas
CREATE TABLE public.facturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concepto TEXT NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para archivos de facturas
CREATE TABLE public.factura_archivos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  factura_id UUID REFERENCES public.facturas(id) ON DELETE CASCADE,
  nombre_archivo TEXT NOT NULL,
  tipo_archivo TEXT NOT NULL,
  url_archivo TEXT NOT NULL,
  tamano_bytes BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### 3.2 Habilitar Row Level Security (RLS)

```sql
-- Habilitar RLS en las tablas
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factura_archivos ENABLE ROW LEVEL SECURITY;

-- Políticas para facturas
CREATE POLICY "Anyone can view facturas" ON public.facturas 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert facturas" ON public.facturas 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update facturas" ON public.facturas 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete facturas" ON public.facturas 
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para archivos de facturas
CREATE POLICY "Anyone can view factura_archivos" ON public.factura_archivos 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert factura_archivos" ON public.factura_archivos 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update factura_archivos" ON public.factura_archivos 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete factura_archivos" ON public.factura_archivos 
FOR DELETE USING (auth.uid() IS NOT NULL);
```

#### 3.3 Crear función de actualización de timestamps

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para facturas
CREATE TRIGGER update_facturas_updated_at
BEFORE UPDATE ON public.facturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

### 4. Configurar Storage

1. En el panel de Supabase, ir a Storage
2. Crear un bucket llamado `facturas`
3. Hacer el bucket público
4. Ejecutar las políticas de storage:

```sql
-- Políticas para Storage
CREATE POLICY "Anyone can view facturas files" ON storage.objects 
FOR SELECT USING (bucket_id = 'facturas');

CREATE POLICY "Authenticated users can upload facturas files" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update facturas files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete facturas files" ON storage.objects 
FOR DELETE USING (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);
```

### 5. Actualizar configuración del cliente Supabase

Editar `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tu-project-ref.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "tu-anon-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

## 🏃‍♂️ Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── AporteForm.tsx   # Formulario de aportes
│   ├── AporteList.tsx   # Lista de aportes
│   ├── Dashboard.tsx    # Panel principal
│   ├── FacturaForm.tsx  # Formulario de facturas
│   ├── FacturaList.tsx  # Lista de facturas
│   └── Layout.tsx       # Layout principal
├── hooks/               # Hooks personalizados
│   ├── useAuth.ts       # Hook de autenticación
│   ├── useFileUpload.ts # Hook para subir archivos
│   └── use-toast.ts     # Hook para notificaciones
├── integrations/        # Integración con Supabase
│   └── supabase/
├── lib/                # Utilidades
├── pages/              # Páginas de la aplicación
│   ├── Auth.tsx        # Página de login/registro
│   ├── Index.tsx       # Página principal
│   └── NotFound.tsx    # Página 404
└── styles/             # Estilos globales
```

## 🔐 Funcionalidades de Seguridad

- **RLS habilitado**: Solo usuarios autenticados pueden crear/editar
- **Visualización pública**: Cualquiera puede ver facturas y aportes
- **Autenticación por email**: Registro y login con Supabase Auth
- **Storage protegido**: Solo usuarios autenticados pueden subir archivos

## 🎨 Personalización del Tema

El tema se define en `src/index.css` con variables CSS:

```css
:root {
  --farm-green: 140 45% 35%;
  --farm-green-light: 140 40% 85%;
  --farm-brown: 25 35% 45%;
  --farm-cream: 45 25% 95%;
  --farm-gold: 45 80% 70%;
}
```

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verificar que las URLs y keys en `.env` son correctas
- Confirmar que el proyecto de Supabase está activo

### Error de permisos RLS
- Verificar que las políticas RLS están creadas correctamente
- Confirmar que el usuario está autenticado para operaciones de escritura

### Problemas con archivos
- Verificar que el bucket `facturas` existe y es público
- Confirmar que las políticas de storage están configuradas

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para la feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

✨ **¡Listo para usar!** La aplicación estará disponible en `http://localhost:5173`
