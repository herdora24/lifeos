import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'high':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'low':
      return 'text-green-500 bg-green-500/10 border-green-500/30';
    default:
      return 'text-muted-foreground bg-muted/50 border-border';
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'wellness':
      return '🧘';
    case 'finance':
      return '💰';
    case 'crm':
      return '👥';
    default:
      return '📌';
  }
}
