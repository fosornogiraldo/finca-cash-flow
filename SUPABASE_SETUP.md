# 🗄️ Configuración Completa de Supabase

Este documento contiene todas las migraciones SQL necesarias para configurar la base de datos de la aplicación.

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Esperar a que se complete la configuración
4. Copiar las credenciales del proyecto

### 2. Ejecutar Migraciones SQL

Copiar y ejecutar cada bloque SQL en el SQL Editor de Supabase:

#### 2.1 Crear Tablas Principales

```sql
-- Tabla de facturas
CREATE TABLE public.facturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concepto TEXT NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  valor DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de archivos asociados a facturas
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

#### 2.2 Crear Función de Timestamps

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
```

#### 2.3 Crear Triggers

```sql
-- Trigger para actualizar updated_at en facturas
CREATE TRIGGER update_facturas_updated_at
BEFORE UPDATE ON public.facturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

#### 2.4 Habilitar Row Level Security

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factura_archivos ENABLE ROW LEVEL SECURITY;
```

#### 2.5 Crear Políticas RLS para Facturas

```sql
-- Políticas para la tabla facturas
CREATE POLICY "Anyone can view facturas" ON public.facturas 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert facturas" ON public.facturas 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update facturas" ON public.facturas 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete facturas" ON public.facturas 
FOR DELETE USING (auth.uid() IS NOT NULL);
```

#### 2.6 Crear Políticas RLS para Archivos

```sql
-- Políticas para la tabla factura_archivos
CREATE POLICY "Anyone can view factura_archivos" ON public.factura_archivos 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert factura_archivos" ON public.factura_archivos 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update factura_archivos" ON public.factura_archivos 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete factura_archivos" ON public.factura_archivos 
FOR DELETE USING (auth.uid() IS NOT NULL);
```

### 3. Configurar Storage

#### 3.1 Crear Bucket

1. Ir a Storage en el panel de Supabase
2. Crear un nuevo bucket llamado `facturas`
3. Marcar como público: ✅ Public bucket

#### 3.2 Crear Políticas de Storage

```sql
-- Políticas para el bucket de archivos
CREATE POLICY "Anyone can view facturas files" ON storage.objects 
FOR SELECT USING (bucket_id = 'facturas');

CREATE POLICY "Authenticated users can upload facturas files" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update facturas files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete facturas files" ON storage.objects 
FOR DELETE USING (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);
```

## 🔧 Configuración de Autenticación

### Proveedores de Auth

En la sección Authentication > Providers:

1. **Email**: ✅ Habilitado (por defecto)
2. **Confirm email**: ❌ Deshabilitado (para pruebas rápidas)
3. **Enable email confirmations**: ❌ Deshabilitado (para desarrollo)

### URLs de Redirección

En Authentication > URL Configuration:

- **Site URL**: `http://localhost:5173`
- **Redirect URLs**: 
  - `http://localhost:5173`
  - `http://localhost:5173/auth`

## 🚀 Datos de Prueba (Opcional)

### Insertar Facturas de Ejemplo

```sql
INSERT INTO public.facturas (concepto, descripcion, fecha, valor) VALUES
('Semillas de Maíz', 'Compra de semillas para la siembra de temporada', '2024-01-15', 150000),
('Fertilizantes', 'Abono orgánico para cultivos', '2024-01-20', 80000),
('Herramientas', 'Pala y azadón nuevos', '2024-02-01', 45000),
('Combustible', 'Gasolina para maquinaria agrícola', '2024-02-10', 120000);
```

## ✅ Verificación de Configuración

Para verificar que todo está configurado correctamente:

1. **Tablas creadas**:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

2. **Políticas RLS**:
   ```sql
   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
   ```

3. **Storage bucket**:
   - Verificar en Storage > Buckets que existe `facturas`

4. **Conectividad**:
   - Probar conexión desde la app con las credenciales

## 🔑 Variables de Entorno Necesarias

Después de completar la configuración, actualizar `.env`:

```env
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON_KEY]
VITE_SUPABASE_PROJECT_ID=[PROJECT_ID]
```

---

**¡Configuración completa!** Tu base de datos está lista para la aplicación de gestión financiera.