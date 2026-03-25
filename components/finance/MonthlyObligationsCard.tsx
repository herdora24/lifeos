'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Calendar, CheckCircle2, Circle, Plus, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Expense {
  id: string;
  name: string;
  due_day: number;
  amount: number;
  is_completed: boolean;
}

export default function MonthlyObligationsCard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDay, setNewDay] = useState(new Date().getDate().toString());

  // 1. Cargar gastos desde Supabase
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_expenses')
        .select('*')
        .order('due_day', { ascending: true });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error cargando gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Agregar nuevo gasto
  const addExpense = async () => {
    if (!newName || !newAmount) return;

    const newEntry = {
      name: newName,
      amount: parseFloat(newAmount),
      due_day: parseInt(newDay),
      is_completed: false
    };

    try {
      const { data, error } = await supabase
        .from('monthly_expenses')
        .insert(newEntry)
        .select()
        .single();

      if (error) throw error;
      if (data) setExpenses(prev => [...prev, data].sort((a, b) => a.due_day - b.due_day));
      
      // Limpiar formulario
      setNewName('');
      setNewAmount('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error al agregar:', error);
    }
  };

  // 3. Marcar como pagado/pendiente
  const toggleExpense = async (id: string, currentState: boolean) => {
    try {
      // Cambio visual rápido
      setExpenses(prev => prev.map(ex => ex.id === id ? { ...ex, is_completed: !currentState } : ex));

      const { error } = await supabase
        .from('monthly_expenses')
        .update({ is_completed: !currentState })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error actualizando:', error);
    }
  };

  // 4. Eliminar gasto
  const deleteExpense = async (id: string) => {
    try {
      setExpenses(prev => prev.filter(ex => ex.id !== id));
      const { error } = await supabase.from('monthly_expenses').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = expenses.filter(e => e.is_completed).reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) return (
    <div className="p-6 rounded-xl bg-card border border-border flex justify-center"><Loader2 className="animate-spin" /></div>
  );

  return (
    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Pagos del Mes</h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Plus className={cn("w-5 h-5 transition-transform", isAdding && "rotate-45")} />
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 rounded-lg bg-muted/50 space-y-3 border border-border/50">
          <input type="text" placeholder="Nombre (Ej: Internet)" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-2 rounded bg-background border border-border text-sm" />
          <div className="flex gap-2">
            <input type="number" placeholder="Monto $" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="flex-1 p-2 rounded bg-background border border-border text-sm" />
            <input type="number" placeholder="Día" value={newDay} onChange={(e) => setNewDay(e.target.value)} className="w-20 p-2 rounded bg-background border border-border text-sm" />
          </div>
          <button onClick={addExpense} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">Guardar Pago</button>
        </div>
      )}

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className={cn(
              "group flex items-center justify-between p-3 rounded-lg border transition-all",
              expense.is_completed ? "bg-muted/20 border-transparent opacity-60" : "bg-card border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => toggleExpense(expense.id, expense.is_completed)}>
                {expense.is_completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
              </button>
              <div>
                <p className={cn("font-bold text-sm", expense.is_completed && "line-through")}>{expense.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Día {expense.due_day}</span>
                  <span>${expense.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button onClick={() => deleteExpense(expense.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pagado</p>
          <p className="text-lg font-black text-green-500">${paidAmount.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Mes</p>
          <p className="text-lg font-black text-primary">${totalAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}