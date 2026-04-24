# IA Strategy - User Scenarios

## 1. Escenarios de Usuario

### ESC-01: Abrir IA Strategy por primera vez

**Actor:** Felipe
**Precondición:** No ha abierto IA Strategy antes
**Flujo:**
1. Felipe hace click en botón "IA Strategy" del sidebar
2. Sidebar colapsa a 64px
3. Se abre StrategyPanel derecho
4. Felipe ve métricas vacías con mensaje "Configura tus datos"
5. Ve prompt para ir a Settings

**Postcondición:** IA Strategy abierto, esperando configuración

---

### ESC-02: Configurar Strategy Settings

**Actor:** Felipe
**Precondición:** IA Strategy abierto
**Flujo:**
1. Felipe click en ⚙️ Settings
2. Se abre StrategySettingsModal
3. Felipe ve:
   - Lista vacía de fixedCosts
   - Campo currentCash en $0
   - Campo targetMargin en 20%
4. Felipe añade "Arriendo local" = $12,000
5. Felipe añade "Nómina fija" = $20,000
6. Felipe añade "Servicios" = $3,000
7. Felipe ingresa "Cash disponible" = $500,000
8. Felipe click "Guardar"
9. Modal se cierra, métricas se actualizan

**Postcondición:** FixedCosts configurados, métricas calculadas

---

### ESC-03: Consultar Burn Rate

**Actor:** Felipe
**Precondición:** Settings configurado, transacciones existen
**Flujo:**
1. Felipe abre IA Strategy
2. Ve MetricsGrid con:
   - Burn Rate: $45,000/mes
   - Badge: 🟢 -2% (bajó vs mes anterior)
3. Felipe entiende que está gastando $45k mensuales en promedio

**Postcondición:** Felipe conoce su burn rate

---

### ESC-04: Consultar Runway

**Actor:** Felipe
**Precondición:** Cash configurado, burn rate calculado
**Flujo:**
1. Felipe abre IA Strategy
2. Ve MetricCard de Runway: "8.2 meses 🟢"
3. Felipe entiende que con $500k cash y $45k/mes burn, tiene ~8 meses de runway

**Postcondición:** Felipe conoce su runway y status (saludable)

---

### ESC-05: Hacer pregunta estratégica al Advisor

**Actor:** Felipe
**Precondición:** Métricas configuradas
**Flujo:**
1. Felipe abre IA Strategy
2. Scrolla a Strategy Advisor chat
3. Escribe: "¿Puedo comprar 5 iPhones hoy?"
4. DeepSeek responde: "Sí, pero tu runway bajaría de 8.2 a 7.8 meses. Te recomiendo máximo 3 considerando Q4."
5. Felipe toma decisión informada

**Postcondición:** Felipe tiene recomendación basada en datos reales

---

### ESC-06: Advisor no tiene datos suficientes

**Actor:** Felipe
**Precondición:** No hay transacciones en el sistema
**Flujo:**
1. Felipe abre IA Strategy
2. Escribe: "¿Cuál es mi profit margin?"
3. DeepSeek responde: "No tengo suficiente información. Necesito al menos 1 mes de transacciones para calcular tu profit margin."
4. Felipe ve mensaje claro de qué falta

**Postcondición:** Felipe sabe que necesita datos

---

### ESC-07: Crear una meta de ahorro

**Actor:** Felipe
**Precondición:** IA Strategy abierto
**Flujo:**
1. Felipe scrolla a Goals
2. Click en "+ Añadir Meta"
3. Se abre GoalForm modal
4. Felipe llena:
   - Título: "Fondo de Emergencia"
   - Target: $100,000
   - Current: $3,200
   - Category: savings
5. Click "Guardar"
6. Modal cierra, GoalCard aparece con progress 3.2%

**Postcondición:** Meta creada y visible en Goals

---

### ESC-08: Advisor analiza gasto que afecta break-even

**Actor:** Felipe
**Precondición:** Goals configurados
**Flujo:**
1. Felipe abre IA Strategy
2. Escribe: "¿Qué está afectando mi break-even?"
3. DeepSeek responde: "Veo que 'Publicidad' subió 20% este mes ($3,000 → $3,600). Esto subió tu break-even de $32,000 a $35,000/mes. Considera reducirlo si el ROI no justifica."
4. Felipe ve breakdown por fixed cost

**Postcondición:** Felipe sabe qué gasto ajustar

---

### ESC-09: Ver tendencia de márgenes

**Actor:** Felipe
**Precondición:** 6+ meses de transacciones
**Flujo:**
1. Felipe abre IA Strategy
2. Ve TrendChart con: 15%, 16%, 17%, 18%, 17.5%, 18.5%
3. Ve mensaje: "↑ +2.1% vs mes anterior"
4. Ve línea visual de tendencia

**Postcondición:** Felipe ve evolución de márgenes

---

### ESC-10: Runway crítico - Advisor alerta

**Actor:** Felipe
**Precondición:** runway < 3 meses
**Flujo:**
1. Felipe abre IA Strategy
2. Ve MetricCard Runway: "2.1 meses 🔴 CRÍTICO"
3. Strategy Advisor muestra alerta automática
4. Advisor sugiere: "Tu runway es crítico. Revisa gastos o inyecta capital."

**Postcondición:** Felipe alertado de situación crítica

---

### ESC-11: Eliminar chat de Strategy

**Actor:** Felipe
**Precondición:** Chat tiene mensajes
**Flujo:**
1. Felipe está en Strategy Advisor
2. Click en botón "🗑️" (delete chat)
3. Modal confirmación: "¿Eliminar conversación?"
4. Felipe click "Cancelar" o "Eliminar"
5. Si eliminó: chat limpia, toast "Chat eliminado"

**Postcondición:** Chat limpio o cancelado

---

### ESC-12: Editar fixed cost existente

**Actor:** Felipe
**Precondición:** Settings configurado
**Flujo:**
1. Felipe abre Settings
2. Ve lista: "Arriendo $12,000 [✕]"
3. Click en "Arriendo" (edición inline)
4. Cambia a $13,000
5. Click fuera o Enter
6. Click "Guardar"
7. Métricas recalculadas

**Postcondición:** Fixed cost actualizado

---

## 2. Edge Cases

### EC-01: Division por cero en runway

**Condición:** burnRate = 0
**Resultado:** Runway muestra "∞" o "N/A"

### EC-02: Cash = 0

**Condición:** currentCash = 0
**Resultado:** Runway = 0, badge 🔴 CRÍTICO

### EC-03: historicalMargins incompleto

**Condición:** Solo 2 meses de datos
**Resultado:** Muestra los 2 que tiene, mensaje "Más datoscoming soon"

### EC-04: Meta completada

**Condición:** currentAmount >= targetAmount
**Resultado:** Status = 'completed', badge ✅, progress 100%

### EC-05: Meta vencida sin completar

**Condición:** deadline < hoy AND status != completed
**Resultado:** Status = 'at_risk', badge 🟡

---

## 3. Negative Scenarios

### NS-01: Advisor alucina dato

**Precondición:** Prompt hardening no funciona
**Resultado esperado:** La regla "SOLO datos del strategyData" impide respuesta falsa

### NS-02: Usuario pide dato financiero preciso

**Precondición:** Usuario pregunta: "¿Cuánto gasté en febrero?"
**Resultado esperado:** "No tengo acceso a transacciones específicas. Puedo decirte el promedio de los últimos 3 meses."

### NS-03: Overflow en números grandes

**Condición:** currentCash = $999,999,999,999
**Resultado:** Formato con separadores de miles, sin overflow UI
