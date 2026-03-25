'use client';

import { useState } from 'react';
import { Sparkles, Sun, Moon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prayer } from '@/types';
import { mockPrayers } from '@/lib/mockData';

export default function PrayerCard() {
  const [prayers, setPrayers] = useState<Prayer[]>(mockPrayers);

  const togglePrayer = (id: string) => {
    setPrayers(prev => prev.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    ));
  };

  const morningPrayer = prayers.find(p => p.time === 'morning');
  const nightPrayer = prayers.find(p => p.time === 'night');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Oración</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Morning Prayer */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-muted-foreground">Mañana</span>
          </div>
          {morningPrayer && (
            <>
              <p className="text-sm mb-4">{morningPrayer.content}</p>
              <button
                onClick={() => togglePrayer(morningPrayer.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
                  morningPrayer.completed
                    ? "bg-green-500/20 text-green-500"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <Check className="w-4 h-4" />
                {morningPrayer.completed ? "Completada" : "Marcar completada"}
              </button>
            </>
          )}
        </div>

        {/* Night Prayer */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Noche</span>
          </div>
          {nightPrayer && (
            <>
              <p className="text-sm mb-4">{nightPrayer.content}</p>
              <button
                onClick={() => togglePrayer(nightPrayer.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
                  nightPrayer.completed
                    ? "bg-green-500/20 text-green-500"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <Check className="w-4 h-4" />
                {nightPrayer.completed ? "Completada" : "Marcar completada"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
