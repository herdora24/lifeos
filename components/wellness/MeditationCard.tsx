'use client';

import { useState, useEffect } from 'react';
import { Brain, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Meditation } from '@/types';
import { mockMeditation } from '@/lib/mockData';

export default function MeditationCard() {
  const [meditation, setMeditation] = useState<Meditation>(mockMeditation);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(meditation.duration * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setMeditation(prev => ({ ...prev, completed: true }));
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(meditation.duration * 60);
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Meditación</h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">Enfoque del día</p>
        <p className="font-medium">{meditation.focus}</p>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-primary/30 mb-4">
          <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-3 rounded-full bg-primary hover:bg-primary/90 transition-colors"
          >
            {isRunning ? (
              <Pause className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Play className="w-6 h-6 text-primary-foreground" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={() => setMeditation(prev => ({ ...prev, completed: !prev.completed }))}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
          meditation.completed
            ? "bg-green-500/20 text-green-500"
            : "bg-muted hover:bg-muted/80"
        )}
      >
        <Check className="w-4 h-4" />
        {meditation.completed ? "Completada" : "Marcar completada"}
      </button>
    </div>
  );
}
