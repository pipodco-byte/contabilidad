'use client';

import * as React from 'react';
import { Goal } from '@/lib/strategy-types';
import { GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoalsListProps {
  goals: Goal[];
}

export function GoalsList({ goals }: GoalsListProps) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Mis Metas</h3>
          <Button variant="ghost" size="sm" onClick={handleAddGoal}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>

        {goals.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Aún no tienes metas configuradas
            </p>
            <Button variant="outline" size="sm" onClick={handleAddGoal}>
              <Plus className="h-4 w-4 mr-1" />
              Crear tu primera meta
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
              />
            ))}
          </div>
        )}
      </div>

      <GoalForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initialGoal={editingGoal}
      />
    </>
  );
}
