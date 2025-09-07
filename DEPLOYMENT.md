# 🚀 Guía de Despliegue

## 📋 Opciones de Despliegue

### 1. Vercel (Recomendado)

#### Configuración Automática
1. Conectar repositorio a Vercel
2. Configurar variables de entorno:
   ```
   VITE_SUPABASE_URL=https://tu-project.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
3. Deploy automático en cada push

#### Configuración Manual
```bash
npm install -g vercel
vercel
# Seguir instrucciones
```

### 2. Netlify

1. Conectar repositorio
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Configurar variables de entorno en Site settings

### 3. GitHub Pages (Solo frontend estático)

```bash
npm run build
# Subir carpeta dist/ a rama gh-pages
```

## 🔧 Variables de Entorno en Producción

### Vercel
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify
- Site settings > Build & deploy > Environment variables

## 🌐 Configurar Dominio Personalizado

### En Supabase:
1. Authentication > URL Configuration
2. Agregar URL de producción a:
   - Site URL: `https://tu-dominio.com`
   - Redirect URLs: `https://tu-dominio.com/auth`

### SSL y HTTPS
- Vercel/Netlify configuran SSL automáticamente
- Para dominios personalizados, verificar certificados

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos Supabase funcionando
- [ ] Storage bucket creado y configurado
- [ ] Políticas RLS aplicadas
- [ ] URLs de redirección actualizadas
- [ ] Build local exitoso (`npm run build`)

## 🔍 Monitoreo Post-Deploy

### Logs de Aplicación
- Vercel: Dashboard > Functions > Logs  
- Netlify: Site overview > Functions

### Logs de Supabase
- Dashboard > Logs
- Monitoring de queries
- Auth events

## 🐛 Troubleshooting

### Error CORS
- Verificar URLs en Supabase Auth settings
- Confirmar que el dominio está en la lista permitida

### Error de Conexión DB
- Verificar variables de entorno
- Comprobar estado del proyecto Supabase

### Files no cargan
- Verificar políticas de Storage
- Confirmar que bucket es público

---

¡Deploy exitoso! 🎉