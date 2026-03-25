'use client';

import { useState } from 'react';
import { BookOpen, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BibleStudy } from '@/types';
import { mockBibleStudy } from '@/lib/mockData';

export default function BibleStudyCard() {
  const [study, setStudy] = useState<BibleStudy>(mockBibleStudy);

  const toggleComplete = () => {
    setStudy(prev => ({ ...prev, completed: !prev.completed }));
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Estudio Bíblico</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{study.book}</p>
            <p className="text-xl font-bold">Capítulo {study.chapter}</p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm",
            study.completed ? "bg-green-500/20 text-green-500" : "bg-muted"
          )}>
            {study.completed ? "Completado" : "Pendiente"}
          </span>
        </div>

        <p className="text-sm font-medium">{study.title}</p>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground italic">"{study.reflection}"</p>
        </div>

        <button
          onClick={toggleComplete}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
            study.completed
              ? "bg-green-500/20 text-green-500"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          <Check className="w-4 h-4" />
          {study.completed ? "Completado" : "Marcar completado"}
        </button>
      </div>
    </div>
  );
}
