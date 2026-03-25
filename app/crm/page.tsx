'use client';

import AppLayout from '@/components/AppLayout';
import ClientsCard from '@/components/crm/ClientsCard';

export default function CrmPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">CRM - Clientes</h1>
          <p className="text-muted-foreground">Gestión de suscripciones y cobros a clientes</p>
        </div>

        <div className="max-w-2xl">
          <ClientsCard />
        </div>
      </div>
    </AppLayout>
  );
}
