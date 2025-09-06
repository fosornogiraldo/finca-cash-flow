-- Update RLS policies to allow public viewing but require authentication for modifications

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on facturas" ON public.facturas;
DROP POLICY IF EXISTS "Allow all operations on factura_archivos" ON public.factura_archivos;

-- Create new policies for facturas
CREATE POLICY "Anyone can view facturas" ON public.facturas 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert facturas" ON public.facturas 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update facturas" ON public.facturas 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete facturas" ON public.facturas 
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create new policies for factura_archivos
CREATE POLICY "Anyone can view factura_archivos" ON public.factura_archivos 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert factura_archivos" ON public.factura_archivos 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update factura_archivos" ON public.factura_archivos 
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete factura_archivos" ON public.factura_archivos 
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Update storage policies for authenticated users only
DROP POLICY IF EXISTS "Allow public access to facturas bucket" ON storage.objects;

CREATE POLICY "Anyone can view facturas files" ON storage.objects 
FOR SELECT USING (bucket_id = 'facturas');

CREATE POLICY "Authenticated users can upload facturas files" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update facturas files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete facturas files" ON storage.objects 
FOR DELETE USING (bucket_id = 'facturas' AND auth.uid() IS NOT NULL);