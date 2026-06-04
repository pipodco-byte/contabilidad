'use client';

import * as React from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface FixedCostItem {
  label: string;
  amount: number;
}

export interface StrategyConfigData {
  saldo_inicial: number;
  fecha_saldo: string;
  costos_fijos: FixedCostItem[];
  margen_objetivo: number;
}

interface StrategyConfigProps {
  saldoInicial: number;
  fechaSaldo: string;
  costosFijos: FixedCostItem[];
  margenObjetivo: number;
  onSave: (config: StrategyConfigData) => Promise<void>;
  loading: boolean;
}

const DEFAULT_FIXED_COSTS: FixedCostItem[] = [
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

function formatCurrency(value: number) {
  return value.toLocaleString('es-CO');
}

export function StrategyConfig({
  saldoInicial,
  fechaSaldo,
  costosFijos,
  margenObjetivo,
  onSave,
  loading,
}: StrategyConfigProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [localSaldo, setLocalSaldo] = React.useState(saldoInicial);
  const [localFecha, setLocalFecha] = React.useState(
    fechaSaldo ? fechaSaldo.split('T')[0] : ''
  );
  const [localMargen, setLocalMargen] = React.useState(margenObjetivo);
  const [localCostos, setLocalCostos] = React.useState<FixedCostItem[]>(
    costosFijos.length > 0 ? costosFijos : DEFAULT_FIXED_COSTS
  );

  React.useEffect(() => {
    setLocalSaldo(saldoInicial);
    setLocalFecha(fechaSaldo ? fechaSaldo.split('T')[0] : '');
    setLocalMargen(margenObjetivo);
    if (costosFijos.length > 0) {
      setLocalCostos(costosFijos);
    }
  }, [saldoInicial, fechaSaldo, margenObjetivo, costosFijos]);

  const isEmpty = saldoInicial === 0 && costosFijos.length === 0;

  React.useEffect(() => {
    if (isEmpty) setIsOpen(true);
  }, [isEmpty]);

  const totalCostosFijos = localCostos.reduce((sum, c) => sum + c.amount, 0);

  const handleAddCosto = () => {
    setLocalCostos([...localCostos, { label: '', amount: 0 }]);
  };

  const handleUpdateCosto = (index: number, field: 'label' | 'amount', value: string | number) => {
    const updated = [...localCostos];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCostos(updated);
  };

  const handleRemoveCosto = (index: number) => {
    setLocalCostos(localCostos.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        saldo_inicial: localSaldo || 0,
        fecha_saldo: localFecha || null as unknown as string,
        costos_fijos: localCostos.filter((c) => c.label.trim() && c.amount > 0),
        margen_objetivo: localMargen || 18,
      });
      toast.success('Configuración guardada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-muted/5 border border-border/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/10 transition-colors"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Configuración Operativa
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Saldo inicial en bancos
              </label>
              <Input
                type="number"
                value={localSaldo || ''}
                onChange={(e) => setLocalSaldo(Number(e.target.value))}
                placeholder="0"
                className="rounded-2xl bg-muted/30 border border-border/20 h-10 text-sm focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Fecha del saldo
              </label>
              <Input
                type="date"
                value={localFecha}
                onChange={(e) => setLocalFecha(e.target.value)}
                className="rounded-2xl bg-muted/30 border border-border/20 h-10 text-sm focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Margen objetivo (%)
              </label>
              <Input
                type="number"
                value={localMargen || ''}
                onChange={(e) => setLocalMargen(Number(e.target.value))}
                placeholder="18"
                className="rounded-2xl bg-muted/30 border border-border/20 h-10 text-sm focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">
                Costos fijos mensuales
              </label>
              <span className="text-[10px] text-muted-foreground">
                Total: ${formatCurrency(totalCostosFijos)}
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {localCostos.map((costo, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <Input
                    value={costo.label}
                    onChange={(e) => handleUpdateCosto(i, 'label', e.target.value)}
                    placeholder="Concepto"
                    className="flex-1 rounded-2xl bg-muted/30 border border-border/20 h-9 text-xs focus:ring-1 focus:ring-primary/20"
                  />
                  <Input
                    type="number"
                    value={costo.amount || ''}
                    onChange={(e) => handleUpdateCosto(i, 'amount', Number(e.target.value))}
                    placeholder="0"
                    className="w-24 rounded-2xl bg-muted/30 border border-border/20 h-9 text-xs focus:ring-1 focus:ring-primary/20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCosto(i)}
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddCosto}
              className="mt-2 w-full text-xs text-muted-foreground rounded-xl hover:bg-muted/20"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Añadir costo fijo
            </Button>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      )}
    </div>
  );
}
