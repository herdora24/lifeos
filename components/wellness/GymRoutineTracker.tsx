'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Check, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  completed: boolean;
}

interface DayRoutine {
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: Omit<Exercise, 'completed'>[];
}

const WEEK_ROUTINE: DayRoutine[] = [
  { dayNumber: 1, dayName: 'Día 1', focus: 'Empujes (Push)', exercises: [
    { id: '1-1', name: 'Press de banca', muscleGroup: 'Pecho' },
    { id: '1-2', name: 'Press inclinado con mancuernas', muscleGroup: 'Pecho' },
    { id: '1-3', name: 'Press militar', muscleGroup: 'Hombro' },
    { id: '1-4', name: 'Elevaciones laterales', muscleGroup: 'Hombro' },
    { id: '1-5', name: 'Fondos en banco', muscleGroup: 'Tríceps' },
    { id: '1-6', name: 'Extensiones de tríceps', muscleGroup: 'Tríceps' },
  ]},
  { dayNumber: 2, dayName: 'Día 2', focus: 'Tirones (Pull)', exercises: [
    { id: '2-1', name: 'Jalón al pecho', muscleGroup: 'Espalda' },
    { id: '2-2', name: 'Remo con barra', muscleGroup: 'Espalda' },
    { id: '2-3', name: 'Pullover', muscleGroup: 'Espalda' },
    { id: '2-4', name: 'Curl con barra', muscleGroup: 'Bíceps' },
    { id: '2-5', name: 'Curl martillo', muscleGroup: 'Bíceps' },
  ]},
  { dayNumber: 3, dayName: 'Día 3', focus: 'Pierna A (Cuádriceps)', exercises: [
    { id: '3-1', name: 'Sentadilla con barra', muscleGroup: 'Patrón sentadilla' },
    { id: '3-2', name: 'Prensa de piernas', muscleGroup: 'Patrón sentadilla' },
    { id: '3-3', name: 'Extensión de piernas', muscleGroup: 'Cuádriceps' },
    { id: '3-4', name: 'Curl femoral', muscleGroup: 'Femoral' },
    { id: '3-5', name: 'Aductores', muscleGroup: 'Aductor' },
    { id: '3-6', name: 'Elevación de talones', muscleGroup: 'Gemelo' },
  ]},
  { dayNumber: 4, dayName: 'Día 4', focus: 'Torso (Completo)', exercises: [
    { id: '4-1', name: 'Press de banca', muscleGroup: 'Pecho' },
    { id: '4-2', name: 'Cruces en polea', muscleGroup: 'Pecho' },
    { id: '4-3', name: 'Remo con mancuerna', muscleGroup: 'Espalda' },
    { id: '4-4', name: 'Jalón frontal', muscleGroup: 'Espalda' },
    { id: '4-5', name: 'Press militar', muscleGroup: 'Hombro' },
    { id: '4-6', name: 'Curl con mancuernas', muscleGroup: 'Bíceps' },
    { id: '4-7', name: 'Patada de tríceps', muscleGroup: 'Tríceps' },
  ]},
  { dayNumber: 5, dayName: 'Día 5', focus: 'Pierna B (Glúteo/Femoral)', exercises: [
    { id: '5-1', name: 'Peso muerto rumano', muscleGroup: 'Patrón peso muerto' },
    { id: '5-2', name: 'Hip thrust', muscleGroup: 'Glúteo' },
    { id: '5-3', name: 'Curl femoral sentado', muscleGroup: 'Femoral' },
    { id: '5-4', name: 'Extensión de piernas', muscleGroup: 'Cuádriceps' },
    { id: '5-5', name: 'Elevación de talones', muscleGroup: 'Gemelo' },
  ]},
];

export default function GymRoutineTracker() {
  const [cycleData, setCycleData] = useState<{id: string, current_day: number, completed_days: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCycle();
  }, []);

  const fetchCycle = async () => {
    try {
      const { data, error } = await supabase.from('gym_cycles').select('*').limit(1).single();
      if (error) throw error;
      if (data) setCycleData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentDayNum = cycleData?.current_day || 1;
  const completedExerciseIds = cycleData?.completed_days || [];
  const todayRoutine = WEEK_ROUTINE[currentDayNum - 1] || WEEK_ROUTINE[0];

  const toggleExercise = async (id: string) => {
    if (!cycleData) return;
    
    const isCompleted = completedExerciseIds.includes(id);
    const newCompletedIds = isCompleted 
      ? completedExerciseIds.filter(eId => eId !== id)
      : [...completedExerciseIds, id];

    // Actualización local inmediata
    setCycleData({ ...cycleData, completed_days: newCompletedIds });

    try {
      await supabase.from('gym_cycles').update({ completed_days: newCompletedIds }).eq('id', cycleData.id);
    } catch (error) {
      console.error('Error guardando:', error);
    }
  };

  const handleCompleteDay = async () => {
    if (!cycleData) return;
    setSaving(true);
    const nextDay = currentDayNum >= 5 ? 1 : currentDayNum + 1;
    
    try {
      const { data, error } = await supabase
        .from('gym_cycles')
        .update({ current_day: nextDay, completed_days: [] })
        .eq('id', cycleData.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setCycleData(data);
    } catch (error) {
      console.error('Error al avanzar de día:', error);
    } finally {
      setSaving(false);
    }
  };

  const progress = Math.round((completedExerciseIds.length / todayRoutine.exercises.length) * 100) || 0;

  if (loading) return (
    <div className="p-4 rounded-lg bg-card border border-border flex justify-center items-center h-48">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Gimnasio</h2>
        </div>
        {saving && <RefreshCw className="w-4 h-4 animate-spin text-primary" />}
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Ciclo Flexible</p>
        <p className="text-xl font-black text-primary">
          Día {currentDayNum}: {todayRoutine.focus}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2 font-medium">
          <span className="text-muted-foreground font-bold italic">PROGRESO</span>
          <span>{completedExerciseIds.length}/{todayRoutine.exercises.length}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
          <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {todayRoutine.exercises.map((exercise) => {
          const isDone = completedExerciseIds.includes(exercise.id);
          return (
            <div key={exercise.id} className={cn("flex items-center gap-3 p-3 rounded-lg border transition-all duration-200", isDone ? "bg-green-500/10 border-green-500/40 shadow-inner" : "bg-muted/30 border-transparent")}>
              <button onClick={() => toggleExercise(exercise.id)} className={cn("flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all", isDone ? "bg-green-500 border-green-500 scale-110" : "border-muted-foreground hover:border-primary")}>
                {isDone && <Check className="w-4 h-4 text-white" />}
              </button>
              <div className="flex-1">
                <p className={cn("font-bold text-sm", isDone && "line-through text-muted-foreground opacity-70")}>{exercise.name}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{exercise.muscleGroup}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={handleCompleteDay} disabled={saving} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg border-b-4 border-primary-foreground/20">
        {saving ? 'Guardando...' : 'Completar y avanzar'}
      </button>
    </div>
  );
}