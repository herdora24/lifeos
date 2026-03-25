'use client';

import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onClick?: (task: Task) => void;
  isOverdue?: boolean;
  onDelete?: (id: number) => void;
}

export function TaskCard({ task, onToggle, onClick, isOverdue, onDelete }: TaskCardProps) {
  const priorityStyles: Record<string, string> = {
    urgent: 'border-l-red-500 bg-red-500/5',
    high: 'border-l-orange-500 bg-orange-500/5',
    medium: 'border-l-yellow-500 bg-yellow-500/5',
    low: 'border-l-green-500 bg-green-500/5',
  };

  const priorityBadge: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
  };

  const priority = task.priority || 'medium';
  const taskId = task.id ?? 0;

  return (
    <div
      onClick={() => onClick?.(task)}
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-lg border border-border bg-card transition-all duration-200 hover:bg-card/80 cursor-pointer",
        priorityStyles[priority],
        task.completed && "opacity-50",
        isOverdue && !task.completed && "border-red-500/50 bg-red-500/10 animate-pulse"
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(taskId);
        }}
        className={cn(
          "flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
          task.completed
            ? "bg-green-500 border-green-500 scale-110"
            : "border-muted-foreground hover:border-primary hover:scale-110"
        )}
      >
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn("font-medium truncate", task.completed && "line-through")}>
            {task.title}
          </h3>
          <span className={cn("text-xs px-2 py-0.5 rounded-full", priorityBadge[priority])}>
            {task.priority}
          </span>
          {isOverdue && !task.completed && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 animate-pulse">
              Vencido
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <p className={cn("text-xs text-muted-foreground mt-2", isOverdue && !task.completed && "text-red-400")}>
            Vence: {new Date(task.due_date).toLocaleDateString('es-MX')}
          </p>
        )}
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(taskId);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all"
          title="Eliminar tarea"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
