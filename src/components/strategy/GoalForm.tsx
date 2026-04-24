'use client';

import * as React from 'react';
import { Goal } from '@/lib/strategy-types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: Goal | null;
}

export function GoalForm({ isOpen, onClose, initialGoal }: GoalFormProps) {
  const { addGoal, updateGoal } = useStrategyData();
  const [title, setTitle] = React.useState('');
  const [targetAmount, setTargetAmount] = React.useState('');
  const [currentAmount, setCurrentAmount] = React.useState('0');
  const [deadline, setDeadline] = React.useState('');
  const [category, setCategory] = React.useState<Goal['category']>('savings');

  React.useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setTargetAmount(initialGoal.targetAmount.toString());
      setCurrentAmount(initialGoal.currentAmount.toString());
      setDeadline(initialGoal.deadline || '');
      setCategory(initialGoal.category);
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
      setCategory('savings');
    }
  }, [initialGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !targetAmount) return;

    const goalData = {
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: deadline || undefined,
      category,
      status: parseFloat(currentAmount) >= parseFloat(targetAmount)
        ? 'completed' as const
        : 'on_track' as const,
    };

    if (initialGoal) {
      updateGoal(initialGoal.id, goalData);
    } else {
      addGoal(goalData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialGoal ? 'Editar Meta' : 'Nueva Meta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la meta</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Fondo de Emergencia"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Cantidad objetivo ($)</Label>
              <Input
                id="target"
                type="number"
                min="0"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="100,000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Cantidad actual ($)</Label>
              <Input
                id="current"
                type="number"
                min="0"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Goal['category'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">💰 Ahorro</SelectItem>
                <SelectItem value="investment">📈 Inversión</SelectItem>
                <SelectItem value="debt_payment">💳 Pago de Deuda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Fecha límite (opcional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialGoal ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
