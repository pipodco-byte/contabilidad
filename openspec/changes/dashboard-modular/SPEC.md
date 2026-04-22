# Spec: Dashboard Modular (App Router)

## Goal

Refactorizar el dashboard de Pipod Contabilidad de una SPA con anclas (#) a estructura modular App Router con sub-rutas reales.

## Requirements

### RQ1: Estructura de Rutas
- `/dashboard` → Página principal con KPIs + quick access
- `/dashboard/transacciones` → Tabla de transacciones
- `/dashboard/graficas` → Gráficas financieras
- `/dashboard/informes` → Reportes mensuales y anuales
- `/dashboard/config` → Configuración y Gema

### RQ2: Layout Wrapper
- Sidebar fijo a la izquierda
- Header con glassmorphism en la parte superior
- Contenido principal a la derecha
- Máximo ancho 7xl centrado

### RQ3: Navegación
- Sidebar actualizado con links a rutas reales
- Estado activo basado en pathname
- Tooltips cuando sidebar colapsado

### RQ4: Loading States
- Skeleton violeta sutil cargando
- Diferentes skeletons por sección

### RQ5: Persistencia Visual
- Mantener tema Obsidian (violet/emerald/rose)
- Glassmorphism del header
- Bordes y espaciado consistentes

## User Interactions

1. **Click en nav item** → Navega a ruta, sidebar actualiza estado activo
2. **Sidebar colapsado** → Muestra solo iconos con tooltips
3. **Cambio de ruta** → Muestra skeleton mientras carga

## Edge Cases

- Usuario accede a `/dashboard` sin sub-ruta → Muestra overview
- Refresh en sub-ruta → Mantiene ubicación
- URL directa a sub-ruta → Funciona correctamente

## Dependencies

- next/navigation (usePathname)
- framer-motion (opcional, transiciones)
- Lucide icons (navegación)