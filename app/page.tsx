'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, Clock, Sparkles, Loader2, Plus, X, Heart, BookOpen, Wind, Dumbbell, Flame, ChevronDown, ChevronUp, Brain, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Habit } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import GymWorkoutCard from '@/components/wellness/GymWorkoutCard';
import SpiritualAIBrain from '@/components/wellness/SpiritualAIBrain';
import MonthlyObligationsCard from '@/components/finance/MonthlyObligationsCard';
import SoftwareClientsCRM from '@/components/crm/SoftwareClientsCRM';
import { supabase } from '@/lib/supabase';

const habitIcons: Record<string, React.ElementType> = {
  Heart, BookOpen, Wind, Dumbbell
};

const habitColors: Record<string, string> = {
  Heart: 'text-red-500 bg-red-500/10',
  BookOpen: 'text-orange-500 bg-orange-500/10',
  Wind: 'text-purple-500 bg-purple-500/10',
  Dumbbell: 'text-green-500 bg-green-500/10',
};

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    habits: true,
    spiritual: false,
    gym: false,
    finance: false,
  });
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    type: 'business_task' as 'habit' | 'business_task', 
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent', 
    recurrence_type: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none',
    next_due_date: ''
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchHabits(), fetchTasks()]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('id');

      if (error) throw error;

      if (data && data.length > 0) {
        const processed = data.map(habit => ({
          ...habit,
          completed: habit.last_completed_date === today
        }));
        setHabits(processed);
      } else {
        await seedHabits();
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const seedHabits = async () => {
    const defaultHabits = [
      { title: 'Oración matutina', description: 'Oración de gratitud y petición', icon: 'Heart', color: '#ef4444', recurrence_type: 'daily' },
      { title: 'Estudio bíblico', description: 'Lectura y reflexión de las Escrituras', icon: 'BookOpen', color: '#f97316', recurrence_type: 'daily' },
      { title: 'Meditación', description: 'Respiración y declaraciones de fe', icon: 'Wind', color: '#8b5cf6', recurrence_type: 'daily' },
      { title: 'Gimnasio', description: 'Entrenamiento del día', icon: 'Dumbbell', color: '#22c55e', recurrence_type: 'weekly' },
    ];

    for (const habit of defaultHabits) {
      await supabase.from('habits').insert(habit);
    }
    fetchHabits();
  };

  const toggleHabit = async (id: number) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newCompletedState = !habit.completed;
    const newStreak = newCompletedState ? (habit.current_streak || 0) + 1 : Math.max(0, (habit.current_streak || 1) - 1);

    try {
      await supabase
        .from('habits')
        .update({ 
          last_completed_date: newCompletedState ? today : null,
          current_streak: newStreak
        })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating habit:', error);
    }

    setHabits(prev => prev.map(h => 
      h.id === id ? { 
        ...h, 
        completed: newCompletedState,
        last_completed_date: newCompletedState ? today : undefined,
        current_streak: newStreak
      } : h
    ));
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;

      const processed = (data || []).map(task => ({
        ...task,
        completed: task.is_completed ?? false
      }));
      
      const visibleTasks = processed.filter(task => {
        if (task.recurrence_type === 'none' || !task.recurrence_type) {
          return !task.is_completed;
        }
        if (task.next_due_date) {
          return task.next_due_date <= today;
        }
        return !task.is_completed;
      });

      setTasks(visibleTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const { error } = await supabase.from('tasks').insert({
        title: newTask.title,
        description: newTask.description || null,
        type: newTask.type,
        priority: newTask.priority,
        recurrence_type: newTask.recurrence_type,
        next_due_date: newTask.recurrence_type !== 'none' ? newTask.next_due_date || today : null,
        is_completed: false,
        is_habit: false,
        category: 'finance',
      });

      if (error) throw error;

      setNewTask({ title: '', description: '', type: 'business_task', priority: 'medium', recurrence_type: 'monthly', next_due_date: '' });
      setShowAddForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompletedState = !task.completed;

    if (newCompletedState && task.recurrence_type && task.recurrence_type !== 'none') {
      const nextDate = advanceTaskDate(today, task.recurrence_type);
      try {
        await supabase
          .from('tasks')
          .update({ 
            is_completed: false,
            next_due_date: nextDate
          })
          .eq('id', id);
        setTasks(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error advancing task date:', error);
      }
      return;
    }

    try {
      await supabase
        .from('tasks')
        .update({ is_completed: newCompletedState })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating task:', error);
    }

    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: newCompletedState, is_completed: newCompletedState } : t
    ));
  };

  const deleteTask = async (id: number) => {
    try {
      await supabase.from('tasks').delete().eq('id', id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const advanceTaskDate = (currentDate: string, recurrenceType: string): string => {
    const date = new Date(currentDate);
    switch (recurrenceType) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');

  const completedHabits = habits.filter(h => h.completed).length;
  const progress = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return dueDate < today;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Centro de Notificaciones</h1>
          <p className="text-muted-foreground">Tu objetivo: Inbox Zero</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Circle className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingTasks.length}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{urgentTasks.length}</p>
              <p className="text-xs text-muted-foreground">Urgentes</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress}%</p>
              <p className="text-xs text-muted-foreground">Progreso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Limpieza diaria</span>
          <span className="text-sm text-muted-foreground">{completedTasks.length} / {tasks.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && tasks.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-green-500 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>¡Inbox Zero alcanzado! Excelente trabajo.</span>
          </div>
        )}
      </div>

      {/* Habits Section - Always visible */}
      {!loading && habits.length > 0 && (
        <div className="p-4 rounded-lg bg-card border border-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Hábitos diarios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {habits.map(habit => {
              const IconComponent = habitIcons[habit.icon || 'Heart'] || Heart;
              const colorClass = habitColors[habit.icon || 'Heart'] || 'text-gray-500 bg-gray-500/10';
              
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id!)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                    habit.completed 
                      ? "border-green-500 bg-green-500/10" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {habit.completed && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn("p-2 rounded-lg", colorClass)}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-center">{habit.title}</span>
                  {habit.current_streak && habit.current_streak > 0 && (
                    <span className="text-xs text-orange-500 font-bold">🔥 {habit.current_streak}</span>
                  )}
                </button>
              );
            })}
          </div>
          {progress === 100 && habits.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-green-500 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>¡Todos los hábitos completados! Excelente trabajo.</span>
            </div>
          )}
        </div>
      )}

      {/* Wellness Section - Accordion */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('gym')}
          className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="font-semibold">🏋️ Rutina de Gimnasio</span>
          </div>
          {expandedSections.gym ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {expandedSections.gym && (
          <div className="p-4 border-t border-border">
            <GymWorkoutCard />
          </div>
        )}
      </div>

      {/* Spiritual AI Section - Accordion */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('spiritual')}
          className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="font-semibold">🧠 Cerebro Espiritual IA</span>
          </div>
          {expandedSections.spiritual ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {expandedSections.spiritual && (
          <div className="p-4 border-t border-border">
            <SpiritualAIBrain />
          </div>
        )}
      </div>

      {/* Finance & CRM Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyObligationsCard />
        <SoftwareClientsCRM />
      </div>

      {/* Financial Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Cuentas por cobrar/pagar
          </h2>
          <div className="space-y-2">
            {pendingTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={() => toggleTask(task.id!)}
                isOverdue={isOverdue(task.next_due_date)}
                onDelete={() => deleteTask(task.id!)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? 'Cancelar' : '+ Nuevo Cobro / Gasto / Tarea'}
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={addTask} className="p-6 rounded-xl bg-card border border-border space-y-4 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold">Nueva obligación</h3>
          <input
            type="text"
            placeholder="Nombre del cliente o gasto (ej. Tienda María)"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-4 flex-wrap">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
            <select
              value={newTask.recurrence_type}
              onChange={(e) => setNewTask({ ...newTask, recurrence_type: e.target.value as any })}
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
              <option value="none">Una vez</option>
            </select>
            <input
              type="date"
              value={newTask.next_due_date}
              onChange={(e) => setNewTask({ ...newTask, next_due_date: e.target.value })}
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Crear obligación
          </button>
        </form>
      )}

    </div>
  );
}
