'use client';

import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthlyPayment } from '@/types';
import { mockMonthlyPayments } from '@/lib/mockData';

export default function MonthlyPaymentsCard() {
  const [payments, setPayments] = useState<MonthlyPayment[]>(mockMonthlyPayments);

  const togglePayment = (id: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    ));
  };

  const pendingPayments = payments.filter(p => !p.completed);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Pagos Mensuales</h2>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${totalPending.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Pendiente</p>
        </div>
      </div>

      <div className="space-y-2">
        {payments.map(payment => (
          <div
            key={payment.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-colors",
              payment.completed 
                ? "bg-green-500/5 border-green-500/20 opacity-60" 
                : "bg-card border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePayment(payment.id)}
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  payment.completed
                    ? "bg-green-500 border-green-500"
                    : "border-muted-foreground hover:border-primary"
                )}
              >
                {payment.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <div>
                <p className={cn("font-medium", payment.completed && "line-through")}>
                  {payment.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Día {payment.dueDay} • {payment.category}
                </p>
              </div>
            </div>
            <span className="font-medium">${payment.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
