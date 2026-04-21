# Proposal: Mobile Responsiveness for Dashboard-Pipod

## Intent

El dashboard actual de Pipod está optimizado únicamente para vistas de escritorio. Con más del 60% del tráfico web proveniente de dispositivos móviles, necesitamos adaptar la interfaz para proporcionar una experiencia de usuario óptima en smartphones y tablets. Este cambio implementará patrones probados de Astro-Ecommerce para crear un dashboard completamente responsive.

## Scope

### In Scope
- Implementar Sheet/Drawer para el Sidebar en mobile (< 1024px)
- Agregar botón hamburger en el Header para móviles
- Adaptar tablas del Inventario con scroll horizontal y cards alternativas
- Hacer responsive el layout principal (grid → stack vertical)
- Implementar breakpoints: 480px, 768px, 1024px
- Optimizar tipografía y espaciado para mobile
- Adaptar formularios y controles de filtrado

### Out of Scope
- Rediseño completo de la UI (mantener identidad actual)
- Optimización de performance (carga diferida de imágenes)
- PWA o instalación como app
- Soporte para tablets en landscape (fase 2)

## Approach

### Patrones de Astro-Ecommerce a implementar:

1. **Hamburger Menu Pattern** (desde `pipodNavbar.tsx`)
   - Botón hamburger con animación de 3 líneas → X
   - Breakpoint: 1024px para switch desktop/mobile
   - Transición suave: `cubic-bezier(0.16, 1, 0.3, 1)`

2. **Sheet/Drawer Pattern** (desde `CartDrawer.tsx`)
   - Drawer lateral deslizable desde la izquierda (para Sidebar)
   - Overlay oscuro semitransparente `rgba(0,0,0,0.5)`
   - Ancho: 100% en mobile, 320px en desktop
   - Cierre al hacer click fuera o swipe

3. **CSS Mobile-First**
   - Mobile-first approach con Tailwind
   - Flex-direction: column para stacks verticales
   - Padding reducido: `px-4` mobile → `px-8` desktop
   - Font sizes escalonados con `text-sm md:text-base`

### Estrategia de breakpoints:
- **480px**: Optimizaciones para móviles pequeños
- **768px**: Ajustes de layout y tipografía  
- **1024px**: Switch a navegación desktop completa

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Header.tsx` | New | Agregar botón hamburger y lógica de toggle |
| `src/components/Sidebar.tsx` | Modified | Convertir a Drawer para mobile |
| `src/app/dashboard/layout.tsx` | Modified | Agregar estado de drawer y overlay |
| `src/components/ListaTransacciones.tsx` | Modified | Tabla responsive con scroll/card view |
| `src/components/Graficas.tsx` | Modified | Charts adaptables a ancho de contenedor |
| `src/components/FilterSelectors.tsx` | Modified | Layout horizontal → vertical en mobile |
| `src/app/globals.css` | Modified | Agregar custom utilities para mobile |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tables con muchas columnas se vean mal en mobile | High | Implementar card view alternativa para < 768px |
| Charts de Recharts no sean responsive | Medium | Usar ResponsiveContainer con height fijo por breakpoint |
| Touch targets muy pequeños | Medium | Asegurar mínimo 44x44px para todos los botones interactivos |
| Sidebar drawer bloquee scroll del body | Medium | Implementar `overflow-hidden` en body cuando drawer esté abierto |

## Rollback Plan

1. **Pre-deployment**: Crear branch `feature/mobile-responsiveness`
2. **Feature flags**: Usar variable de entorno `ENABLE_MOBILE_UI` para activar/desactivar
3. **Revert**: Si hay problemas críticos, hacer revert del merge y volver a rama anterior
4. **Backup**: Mantener copia de componentes originales en `src/components/backup/`

## Dependencies

- Ninguna dependencia externa adicional (usar Tailwind CSS nativo)
- Lucide React ya incluido para iconos (hamburger, X, menu)
- shadcn/ui Sheet component (opcional) o implementación custom con Tailwind

## Success Criteria

- [ ] Sidebar se convierte en drawer en viewports < 1024px
- [ ] Header muestra botón hamburger en mobile
- [ ] Tablas se visualizan correctamente con scroll horizontal o card view
- [ ] Todos los formularios son usables en pantallas de 375px+
- [ ] Touch targets cumplen con estándar de 44x44px mínimo
- [ ] No hay regresión en funcionalidad desktop
- [ ] Lighthouse Mobile score > 80

## Code Examples

### Ejemplo 1: Header con Hamburger
```tsx
// src/components/Header.tsx
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Hamburger - solo visible en mobile */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            onMenuToggle();
          }}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div className="relative w-6 h-5">
            <span className={`absolute left-0 block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "top-2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-2 block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "top-2 -rotate-45" : "top-4"}`} />
          </div>
        </button>

        <h1 className="text-xl font-bold lg:text-2xl">Dashboard Pipod</h1>
        
        {/* User menu - visible en todos los tamaños */}
        <div className="flex items-center gap-4">
          {/* ... */}
        </div>
      </div>
    </header>
  );
}
```

### Ejemplo 2: Sidebar como Drawer
```tsx
// src/components/Sidebar.tsx
"use client";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Bloquear scroll del body cuando drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:transform-none lg:w-64 lg:shadow-none lg:block ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="mb-8 lg:hidden">
            <h2 className="text-lg font-bold">Pipod</h2>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <NavItem href="/dashboard" icon={Home}>Inicio</NavItem>
            <NavItem href="/dashboard/transacciones" icon={List}>Transacciones</NavItem>
            <NavItem href="/dashboard/inventario" icon={Package}>Inventario</NavItem>
            {/* ... */}
          </nav>
        </div>
      </aside>
    </>
  );
}
```

### Ejemplo 3: Tabla Responsive
```tsx
// src/components/ListaTransacciones.tsx

// Vista de tabla para desktop
const TableView = () => (
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full">
      <thead>{/* ... */}</thead>
      <tbody>{/* ... */}</tbody>
    </table>
  </div>
);

// Vista de cards para mobile
const CardView = () => (
  <div className="md:hidden space-y-4">
    {transacciones.map((t) => (
      <div key={t.id} className="bg-white rounded-lg shadow p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t.descripcion}</span>
          <span className={`px-2 py-1 rounded text-sm ${t.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {t.tipo}
          </span>
        </div>
        <div className="text-2xl font-bold">${t.monto.toLocaleString()}</div>
        <div className="text-sm text-gray-500">{formatDate(t.fecha)}</div>
      </div>
    ))}
  </div>
);
```

### Ejemplo 4: Layout Principal Responsive
```tsx
// src/app/dashboard/layout.tsx
"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## CSS Custom Utilities
```css
/* src/app/globals.css */

/* Animación del hamburger */
.hamburger-line {
  @apply absolute left-0 block w-6 h-0.5 bg-gray-700 transition-all duration-300;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Touch target mínimo */
.touch-target {
  @apply min-w-[44px] min-h-[44px] flex items-center justify-center;
}

/* Scrollbar styling para mobile */
.mobile-scroll::-webkit-scrollbar {
  height: 4px;
}

.mobile-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.mobile-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
```

## Timeline Estimado

| Fase | Duración | Tareas |
|------|----------|--------|
| 1. Infraestructura | 2h | Setup, utilidades CSS, tipos |
| 2. Navegación | 4h | Header hamburger + Sidebar drawer |
| 3. Tablas | 3h | Responsive tables + card view |
| 4. Forms | 2h | Formularios y filtros |
| 5. Testing | 2h | Validación en dispositivos reales |
| **Total** | **13h** | |

---

**Propuesta creada**: 2026-04-15  
**Basada en análisis de**: Astro-Ecommerce patterns  
**Prioridad**: Alta (impacto directo en UX)
