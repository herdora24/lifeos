'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GymRoutine } from '@/types';
import { mockGymRoutine } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

export default function GymRoutineCard() {
  const [routine, setRoutine] = useState<GymRoutine>(mockGymRoutine);
  const [cycleId, setCycleId] = useState<string | null>(null);

  // 1. Cargar datos desde Supabase al iniciar
  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      // Traemos tu registro de gimnasio (el que creamos con SQL hace un rato)
      const { data, error } = await supabase
        .from('gym_cycles')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setCycleId(data.id); // Guardamos el ID secreto para poder actualizarlo luego
        
        // Supabase nos devuelve un array con los IDs de los ejercicios que ya marcaste
        const completedIds = (data.completed_days as string[]) || [];
        
        // Actualizamos la pantalla con tus checks reales
        setRoutine(prev => ({
          ...prev,
          exercises: prev.exercises.map(ex => ({
            ...ex,
            completed: completedIds.includes(ex.id)
          }))
        }));
      }
    } catch (error) {
      console.error('Error cargando progreso de Supabase:', error);
    }
  };

  // 2. Función para marcar/desmarcar y guardar en Supabase
  const toggleExercise = async (exerciseId: string) => {
    // Actualización visual instantánea para que no se sienta lento
    const updatedExercises = routine.exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    );
    
    setRoutine(prev => ({ ...prev, exercises: updatedExercises }));

    // Si tenemos el ID del ciclo, guardamos en la base de datos
    if (cycleId) {
      try {
        // Extraemos solo los IDs de los ejercicios que quedaron con check
        const newCompletedIds = updatedExercises
          .filter(e => e.completed)
          .map(e => e.id);

        // Disparamos la actualización a Supabase
        const { error } = await supabase
          .from('gym_cycles')
          .update({ completed_days: newCompletedIds })
          .eq('id', cycleId);

        if (error) throw error;
      } catch (error) {
        console.error('Error guardando progreso:', error);
      }
    }
  };

  const completedCount = routine.exercises.filter(e => e.completed).length;
  const progress = Math.round((completedCount / routine.exercises.length) * 100) || 0;

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Gimnasio</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {routine.muscleGroup}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progreso</span>
          <span>{completedCount}/{routine.exercises.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {routine.exercises.map(exercise => (
          <div
            key={exercise.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-colors",
              exercise.completed 
                ? "bg-green-500/5 border-green-500/20" 
                : "bg-muted/30 border-transparent"
            )}
          >
            <button
              onClick={() => toggleExercise(exercise.id)}
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                exercise.completed
                  ? "bg-green-500 border-green-500"
                  : "border-muted-foreground hover:border-primary"
              )}
            >
              {exercise.completed && <Check className="w-3 h-3 text-white" />}
            </button>
            <div className="flex-1">
              <p className={cn("font-medium", exercise.completed && "line-through text-muted-foreground")}>
                {exercise.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {exercise.sets} series × {exercise.reps} reps
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}