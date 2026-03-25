'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface GymRoutine {
  id: string;
  dayNumber: number;
  title: string;
  muscles: string;
  icon: string;
  exercises: string[];
}

const gymRoutines: GymRoutine[] = [
  {
    id: 'day1',
    dayNumber: 1,
    title: 'Empujes (Push)',
    muscles: 'Pecho, Hombro, Tríceps',
    icon: '💪',
    exercises: [
      'Press de Banca Inclinado',
      'Aperturas con Mancuernas',
      'Press Militar',
      'Elevaciones Laterales',
      'Extensiones de Tríceps en Polea',
      'Fondos'
    ]
  },
  {
    id: 'day2',
    dayNumber: 2,
    title: 'Tirones (Pull)',
    muscles: 'Espalda, Bíceps',
    icon: '🔙',
    exercises: [
      'Jalón al Pecho',
      'Remo con Barra',
      'Pullover',
      'Curl con Barra',
      'Curl Martillo'
    ]
  },
  {
    id: 'day3',
    dayNumber: 3,
    title: 'Pierna A (Cuádriceps)',
    muscles: 'Cuádriceps, Femoral, Gemelos',
    icon: '🦵',
    exercises: [
      'Sentadilla con Barra',
      'Prensa de Piernas',
      'Extensión de Piernas',
      'Curl Femoral',
      'Aductores',
      'Elevación de Talones'
    ]
  },
  {
    id: 'day4',
    dayNumber: 4,
    title: 'Torso (Completo)',
    muscles: 'Pecho, Espalda, Hombro',
    icon: '🔥',
    exercises: [
      'Press de Banca',
      'Cruces en Polea',
      'Remo con Mancuerna',
      'Jalón Frontal',
      'Press Militar',
      'Curl con Mancuernas',
      'Patada de Tríceps'
    ]
  },
  {
    id: 'day5',
    dayNumber: 5,
    title: 'Pierna B (Glúteo/Femoral)',
    muscles: 'Glúteos, Femoral, Gemelos',
    icon: '🍑',
    exercises: [
      'Peso Muerto Rumano',
      'Hip Thrust',
      'Curl Femoral Sentado',
      'Extensión de Piernas',
      'Elevación de Talones'
    ]
  }
];

interface ExerciseState {
  [dayId: string]: Set<number>;
}

interface GymCycle {
  id: string;
  current_day: number;
  completed_days: number[];
}

export default function GymWorkoutCard() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [exerciseState, setExerciseState] = useState<ExerciseState>({});
  const [loading, setLoading] = useState(true);
  const [cycleId, setCycleId] = useState<string | null>(null);

  const currentRoutine = gymRoutines.find(r => r.dayNumber === selectedDay)!;
  const currentExercises = exerciseState[currentRoutine.id] || new Set<number>();
  const completedCount = currentExercises.size;
  const progress = Math.round((completedCount / currentRoutine.exercises.length) * 100);
  const allCompleted = completedCount === currentRoutine.exercises.length;

  useEffect(() => {
    fetchOrCreateCycle();
  }, []);

  const fetchOrCreateCycle = async () => {
    try {
      const { data, error } = await supabase
        .from('gym_cycles')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setCycleId(data.id);
        setSelectedDay(data.current_day || 1);
        setCompletedDays(new Set(data.completed_days || []));
      } else {
        const { data: newCycle, error: insertError } = await supabase
          .from('gym_cycles')
          .insert({ current_day: 1, completed_days: [] })
          .select()
          .single();
        if (insertError) throw insertError;
        if (newCycle) {
          setCycleId(newCycle.id);
        }
      }
    } catch {
      console.log('Usando estado local para el ciclo');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (index: number) => {
    setExerciseState(prev => {
      const dayExercises = prev[currentRoutine.id] || new Set<number>();
      const newSet = new Set(dayExercises);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return { ...prev, [currentRoutine.id]: newSet };
    });
  };

  const handleFinishDay = async () => {
    const newCompletedDays = new Set(completedDays).add(selectedDay);
    setCompletedDays(newCompletedDays);
    setIsExpanded(false);
    
    try {
      await supabase
        .from('gym_cycles')
        .update({ completed_days: Array.from(newCompletedDays) })
        .eq('id', cycleId!);
    } catch { }
    console.log(`Día ${selectedDay} completado:`, currentRoutine.title);
  };

  const handleResetCycle = async () => {
    setCompletedDays(new Set());
    setExerciseState({});
    setSelectedDay(1);
    setIsExpanded(true);
    
    try {
      await supabase
        .from('gym_cycles')
        .update({ current_day: 1, completed_days: [] })
        .eq('id', cycleId!);
    } catch { }
    console.log('Ciclo reiniciado');
  };

  const isDayCompleted = (dayNumber: number) => completedDays.has(dayNumber);

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏋️</span>
            <h3 className="font-semibold">Ciclo de Entrenamiento</h3>
          </div>
          <button
            onClick={handleResetCycle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar Ciclo
          </button>
        </div>

        <div className="flex gap-2">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            gymRoutines.map((routine) => {
            const completed = isDayCompleted(routine.dayNumber);
            const isSelected = selectedDay === routine.dayNumber;
            return (
              <button
                key={routine.dayNumber}
                onClick={() => {
                  setSelectedDay(routine.dayNumber);
                  setIsExpanded(true);
                }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5",
                  isSelected && !completed && "bg-primary text-primary-foreground",
                  completed && "bg-green-500/20 text-green-400",
                  !isSelected && !completed && "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                <span>D{routine.dayNumber}</span>
                {completed && <Check className="w-3 h-3" />}
              </button>
            );
          })
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentRoutine.icon}</span>
                <h4 className="text-lg font-semibold">{currentRoutine.title}</h4>
                {isDayCompleted(selectedDay) && (
                  <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                    Completado
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentRoutine.muscles} • {currentRoutine.exercises.length} ejercicios
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso del día</span>
              <span className="text-muted-foreground">
                {completedCount}/{currentRoutine.exercises.length}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  allCompleted ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {currentRoutine.exercises.map((exercise, index) => (
              <button
                key={index}
                onClick={() => toggleExercise(index)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left",
                  currentExercises.has(index)
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-muted/30 border-transparent hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  currentExercises.has(index)
                    ? "bg-green-500 border-green-500"
                    : "border-muted-foreground/50"
                )}>
                  {currentExercises.has(index) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className={cn(
                  "flex-1",
                  currentExercises.has(index) && "text-muted-foreground line-through"
                )}>
                  {exercise}
                </span>
              </button>
            ))}
          </div>

          {!isDayCompleted(selectedDay) && (
            <button
              onClick={handleFinishDay}
              disabled={!allCompleted}
              className={cn(
                "w-full py-3 rounded-lg font-medium transition-colors",
                allCompleted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Finalizar Rutina del Día
            </button>
          )}
        </div>
      )}

      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentRoutine.icon}</span>
            <div className="text-left">
              <p className="font-medium">Día {selectedDay}: {currentRoutine.title}</p>
              <p className="text-sm text-muted-foreground">{currentRoutine.muscles}</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

export { gymRoutines };
