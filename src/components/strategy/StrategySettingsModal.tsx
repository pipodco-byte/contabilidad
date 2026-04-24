'use client';

import * as React from 'react';
import { useStrategyData } from '@/hooks/useStrategyData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface StrategySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StrategySettingsModal({ isOpen, onClose }: StrategySettingsModalProps) {
  const { strategyData, updateManualInputs } = useStrategyData();

  const [fixedCosts, setFixedCosts] = React.useState(strategyData.manualInputs.fixedCosts);
  const [currentCash, setCurrentCash] = React.useState(strategyData.manualInputs.currentCash);
  const [targetMargin, setTargetMargin] = React.useState(strategyData.manualInputs.targetMargin);

  const [newCostLabel, setNewCostLabel] = React.useState('');
  const [newCostAmount, setNewCostAmount] = React.useState('');

  React.useEffect(() => {
    setFixedCosts(strategyData.manualInputs.fixedCosts);
    setCurrentCash(strategyData.manualInputs.currentCash);
    setTargetMargin(strategyData.manualInputs.targetMargin);
  }, [strategyData.manualInputs, isOpen]);

  const handleAddFixedCost = () => {
    if (!newCostLabel.trim() || !newCostAmount) return;

    setFixedCosts((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: newCostLabel.trim(),
        amount: parseFloat(newCostAmount),
      },
    ]);
    setNewCostLabel('');
    setNewCostAmount('');
  };

  const handleRemoveFixedCost = (id: string) => {
    setFixedCosts((prev) => prev.filter((fc) => fc.id !== id));
  };

  const handleSave = () => {
    updateManualInputs({
      fixedCosts,
      currentCash: parseFloat(currentCash.toString()) || 0,
      targetMargin: parseFloat(targetMargin.toString()) || 20,
    });
    toast.success('Configuración guardada');
    onClose();
  };

  const totalFixedCosts = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuración de Estrategia</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          <section className="space-y-3">
            <h3 className="text-sm font-medium">Costos Fijos Mensuales</h3>

            <div className="space-y-2">
              {fixedCosts.map((fc) => (
                <div
                  key={fc.id}
                  className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2"
                >
                  <span className="text-sm">{fc.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      ${fc.amount.toLocaleString('es-MX')}
                    </span>
                    <button
                      onClick={() => handleRemoveFixedCost(fc.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {fixedCosts.length > 0 && (
                <div className="flex justify-end text-sm font-medium pt-2 border-t">
                  <span>Total: ${totalFixedCosts.toLocaleString('es-MX')}/mes</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Nombre (ej: Arriendo)"
                value={newCostLabel}
                onChange={(e) => setNewCostLabel(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Monto"
                value={newCostAmount}
                onChange={(e) => setNewCostAmount(e.target.value)}
                className="w-32"
              />
              <Button type="button" variant="outline" onClick={handleAddFixedCost}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Cash Disponible</h3>
            <div className="space-y-1">
              <Label htmlFor="cash" className="text-xs text-muted-foreground">
                Efectivo disponible en bancos y cajas (MXN)
              </Label>
              <Input
                id="cash"
                type="number"
                min="0"
                step="100"
                value={currentCash}
                onChange={(e) => setCurrentCash(parseFloat(e.target.value) || 0)}
                placeholder="500,000"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Margen Objetivo</h3>
            <div className="space-y-1">
              <Label htmlFor="margin" className="text-xs text-muted-foreground">
                Margen de profit objetivo (%)
              </Label>
              <Input
                id="margin"
                type="number"
                min="0"
                max="100"
                value={targetMargin}
                onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 20)}
                placeholder="20"
              />
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
