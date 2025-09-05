-- Create facturas table
CREATE TABLE public.facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create factura_archivos table for file attachments
CREATE TABLE public.factura_archivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID REFERENCES public.facturas(id) ON DELETE CASCADE,
  nombre_archivo TEXT NOT NULL,
  tipo_archivo TEXT NOT NULL,
  url_archivo TEXT NOT NULL,
  tamano_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factura_archivos ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing public access for now - you can add authentication later)
CREATE POLICY "Allow all operations on facturas" ON public.facturas FOR ALL USING (true);
CREATE POLICY "Allow all operations on factura_archivos" ON public.factura_archivos FOR ALL USING (true);

-- Create storage bucket for invoice files
INSERT INTO storage.buckets (id, name, public) VALUES ('facturas', 'facturas', true);

-- Create storage policies
CREATE POLICY "Allow public access to facturas bucket" ON storage.objects FOR ALL USING (bucket_id = 'facturas');

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_facturas_updated_at 
    BEFORE UPDATE ON public.facturas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();