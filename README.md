# 💎 Pipod Contabilidad

Sistema de gestión contable simple y eficiente para Pipod.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
npm run build
npm start
```

## 📋 Estructura del Proyecto

```
src/
├── app/              # Rutas y páginas
├── components/       # Componentes React
├── lib/             # Utilidades y configuración
├── hooks/           # Custom hooks
└── types/           # Tipos TypeScript
```

## 🔧 Configuración de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar las migraciones SQL del documento `proyecto.md`
3. Copiar credenciales a `.env.local`

## 📚 Documentación

Ver `proyecto.md` para documentación completa del proyecto.
