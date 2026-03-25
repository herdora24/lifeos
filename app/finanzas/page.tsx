'use client';

import AppLayout from '@/components/AppLayout';
import MonthlyPaymentsCard from '@/components/finance/MonthlyPaymentsCard';

export default function FinanzasPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Finanzas</h1>
          <p className="text-muted-foreground">Gestión de pagos y obligaciones mensuales</p>
        </div>

        <div className="max-w-2xl">
          <MonthlyPaymentsCard />
        </div>
      </div>
    </AppLayout>
  );
}
