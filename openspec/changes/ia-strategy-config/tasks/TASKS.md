# Tasks: IA Strategy Configuration Panel + Trend Fix

## Change: `ia-strategy-config`

---

## Phase: Apply

---

## T1: Fix de Tendencia Repetida (MetricsGrid.tsx)

**Archivo:** `src/components/strategy/MetricsGrid.tsx`

**Cambios:**
1. Quitar `trend={metrics.marginTrend}` de "Burn Rate"
2. Quitar `trend={metrics.marginTrend}` de "Runway"
3. Quitar `trend={metrics.marginTrend}` de "Break-even"
4. Mantener `trend={metrics.marginTrend}` solo en "Profit Margin"

**Antes:**
```tsx
<<MetricCard title="Burn Rate" trend={metrics.marginTrend} ... />
<<MetricCard title="Runway" trend={metrics.marginTrend} ... />
<<MetricCard title="Break-even" trend={metrics.marginTrend} ... />
<<MetricCard title="Profit Margin" trend={metrics.marginTrend} ... />
```

**Después:**
```tsx
<<MetricCard title="Burn Rate" ... />     // sin trend
<<MetricCard title="Runway" ... />         // sin trend
<<MetricCard title="Break-even" ... />     // sin trend
<<MetricCard title="Profit Margin" trend={metrics.marginTrend} ... />
```

**Verificación:** Solo Profit Margin muestra flecha.

---

## T2: Crear API de Configuración (route.ts)

**Archivo:** `src/app/api/config/route.ts` **(NUEVO)**

**GET:** Lee `cont_configuracion` por `user_id`
```typescript
const { data: { user } } = await supabaseServer.auth.getUser();
const contUsuarioId = user.user_metadata.cont_usuario_id;

const { data } = await supabase
  .from('cont_configuracion')
  .select('*')
  .eq('user_id', contUsuarioId)
  .single();
```

**PUT:** Upsert en `cont_configuracion`
```typescript
const supabaseServer = createServerClient();
const { data: { user } } = await supabaseServer.auth.getUser();
const contUsuarioId = user.user_metadata.cont_usuario_id;

await supabase
  .from('cont_configuracion')
  .upsert({ user_id: contUsuarioId, ...body });
```

**Verificación:** `curl GET /api/config` retorna datos del usuario actual.

---

## T3: Crear StrategyConfig Component

**Archivo:** `src/components/strategy/StrategyConfig.tsx` **(NUEVO)**

**Estado:**
- Collapsible con toggle (abierto por defecto)
- usa `useState(false)` para `isOpen`

**Estructura:**
```
⚙️ Configuración Operativa        [▼/▶]
─────────────────────────────────────────
Saldo inicial en bancos
[ $45.000.000                   ]

Fecha del saldo
[ 01/05/2026                    ]

Margen objetivo (%)
[ 18                            ]

Costos fijos mensuales       Total: $18.079.400
┌─────────────────────────────────────────┐
│ Honorarios Felipe     [5.000.000]   🗑  │
│ Honorarios Josua      [2.000.000]   🗑  │
│ ...                                     │
└─────────────────────────────────────────┘
[ + Añadir costo fijo                    ]

[ 💾 Guardar Configuración               ]
```

**Datos precargados (del reporte):**
```typescript
const DEFAULT_FIXED_COSTS = [
  { label: 'Honorarios Felipe', amount: 5000000 },
  { label: 'Honorarios Josua', amount: 2000000 },
  { label: 'Honorarios Auxiliar Admin', amount: 2000000 },
  { label: 'Honorarios Samuel', amount: 2600000 },
  { label: 'Seguridad Social (3 trab.)', amount: 1500000 },
  { label: 'Honorarios Contador', amount: 1100000 },
  { label: 'Provisión Prestaciones (3 trab.)', amount: 900000 },
  { label: 'Arriendo y servicios', amount: 1650000 },
  { label: 'Cafetería y Aseo', amount: 400000 },
  { label: 'Marketing (Google Ads)', amount: 500000 },
  { label: 'Aplicativo Banco', amount: 150000 },
  { label: 'Software Contable', amount: 130000 },
  { label: 'VPS + Gemini + WhatsApp API', amount: 60000 },
  { label: 'Instagram Certified', amount: 45900 },
  { label: 'WhatsApp Certified', amount: 33500 },
  { label: 'SpaceChip & Hosting', amount: 10000 },
];
```

**Estilo visual (consistente con chat):**
- Inputs: `rounded-2xl bg-muted/30 border border-border/20`
- Botones: `rounded-full bg-primary text-primary-foreground`
- Labels: `text-xs text-muted-foreground`
- Costo fijo row: `flex gap-2 items-center`
- Total: `text-xs text-muted-foreground text-right`

**Props:**
```typescript
interface StrategyConfigProps {
  saldoInicial: number;
  fechaSaldo: string;
  costosFijos: Array<{ label: string; amount: number }>;
  margenObjetivo: number;
  onSave: (config: StrategyConfigData) => Promise<void>;
  loading: boolean;
}
```

**Verificación:** Formulario se renderiza con costos precargados. Inputs funcionales.

---

## T4: Calcular Cash Estimado en useStrategyData

**Archivo:** `src/hooks/useStrategyData.ts`

**Cambios:**
1. Agregar estado `configuracion` y fetch al montar
2. Agregar `fetchConfig` que llama `GET /api/config`
3. Calcular `cashEstimado`:
```typescript
const cashEstimado = useMemo(() => {
  if (!configuracion || !configuracion.saldo_inicial) return 0;
  
  const desde = configuracion.fecha_saldo;
  const ingresosDesde = transactions
    .filter(t => t.tipo === 'Ingreso' && t.fecha >= desde)
    .reduce((sum, t) => sum + t.monto, 0);
  const egresosDesde = transactions
    .filter(t => t.tipo === 'Egreso' && t.fecha >= desde)
    .reduce((sum, t) => sum + t.monto, 0);
  
  return configuracion.saldo_inicial + ingresosDesde - egresosDesde;
}, [configuracion, transactions]);
```
4. Pasar `cashEstimado` y `configuracion` en el hook return
5. Usar `cashEstimado` en lugar de `manualInputs.currentCash` para Runway

**Verificación:** Runway muestra valor calculado con cash estimado.

---

## T5: Integrar StrategyConfig en DataPanel

**Archivo:** `src/components/strategy/DataPanel.tsx`

**Cambios:**
1. Agregar StrategyConfig al final del panel (antes del cierre)
2. Pasar props desde el padre

```tsx
<div className="p-4 space-y-6">
  <MetricsGrid metrics={metrics} />
  <TrendChart data={historicalMargins} />
  <GoalsList goals={goals} />
  <StrategyConfig
    saldoInicial={saldoInicial}
    fechaSaldo={fechaSaldo}
    costosFijos={costosFijos}
    margenObjetivo={margenObjetivo}
    onSave={onSaveConfig}
    loading={configLoading}
  />
</div>
```

---

## T6: Conectar page.tsx con API de Config

**Archivo:** `src/app/dashboard/ia-strategy/page.tsx`

**Cambios:**
1. Importar tipos de config
2. Agregar estado para config + loading
3. `useEffect` para fetch config al montar
4. `handleSaveConfig` que llama PUT /api/config
5. Pasar a DataPanel

```tsx
const [config, setConfig] = useState<StrategyConfig | null>(null);
const [configLoading, setConfigLoading] = useState(true);

useEffect(() => {
  fetch('/api/config')
    .then(r => r.json())
    .then(data => {
      setConfig(data);
      setConfigLoading(false);
    });
}, []);

const handleSaveConfig = async (newConfig: StrategyConfig) => {
  await fetch('/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newConfig),
  });
  setConfig(newConfig);
};
```

---

## T7: Advertencia de Cash Estimado

**Archivo:** `src/components/strategy/DataPanel.tsx` o `StrategyConfig.tsx`

**Implementar advertencia:**
```tsx
{saldoInicial > 0 && (
  <p className="text-[10px] text-muted-foreground px-1">
    ⚠️ Cash estimado basado en saldo inicial + transacciones registradas.
    Verifica que todas las transacciones estén cargadas.
  </p>
)}
```

**En Runway card:**
- Si `saldo_inicial` no configurado → mostrar "—" en lugar de badge CRÍTICO
- Si configurado → mostrar valor calculado + advertencia pequeña

---

## T8: Build y Verificación

**Comandos:**
```bash
npm run build
```

**Verificaciones manuales:**
1. Solo Profit Margin tiene flecha de tendencia
2. Configuración Operativa es collapsible
3. Costos fijos precargados del reporte (~$18M)
4. Se pueden añadir/editar/eliminar costos
5. Saldo inicial y fecha editables
6. Cash estimado se calcula correctamente
7. Runway usa cash estimado (no $0 si hay saldo)
8. Break-even calculado con costos fijos reales
9. Advertencia visible cuando saldo > 0
10. Config persiste en Supabase
11. Build exitoso

---

## Files Summary

| Archivo | Cambio |
|---------|--------|
| `src/components/strategy/MetricsGrid.tsx` | Quitar trend de 3 tarjetas |
| `src/app/api/config/route.ts` | **NUEVO**: GET/PUT para cont_configuracion |
| `src/components/strategy/StrategyConfig.tsx` | **NUEVO**: formulario collapsible |
| `src/hooks/useStrategyData.ts` | Calcular cash estimado |
| `src/components/strategy/DataPanel.tsx` | Integrar StrategyConfig + advertencia |
| `src/app/dashboard/ia-strategy/page.tsx` | Fetch/save config desde API |

---

## Checklist

- [ ] T1: Trend solo en Profit Margin
- [ ] T2: API config creada (GET + PUT)
- [ ] T3: StrategyConfig creado (collapsible, costos precargados)
- [ ] T4: Cash estimado calculado en hook
- [ ] T5: StrategyConfig integrado en DataPanel
- [ ] T6: Page conectado con API config
- [ ] T7: Advertencia cash estimado visible
- [ ] T8: Build exitoso + verificación manual
