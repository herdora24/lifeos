'use client';

import { useState } from 'react';
import { Users, AlertTriangle, Calendar, DollarSign, Phone } from 'lucide-react';
import { cn, getDaysUntil } from '@/lib/utils';
import { Client } from '@/types';
import { mockClients } from '@/lib/mockData';

export default function ClientsCard() {
  const [clients] = useState<Client[]>(mockClients);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-500 bg-red-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-green-500 bg-green-500/10';
    }
  };

  const urgentClients = clients.filter(c => {
    const days = getDaysUntil(c.nextPaymentDate);
    return days <= 5 && c.status !== 'overdue';
  });

  const sortedClients = [...clients].sort((a, b) => 
    getDaysUntil(a.nextPaymentDate) - getDaysUntil(b.nextPaymentDate)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Clientes</h2>
      </div>

      {urgentClients.length > 0 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-400">Cobros próximos</span>
          </div>
          {urgentClients.map(client => (
            <div key={client.id} className="text-sm">
              <span className="font-medium">{client.name}</span>
              <span className="text-muted-foreground"> - {getDaysUntil(client.nextPaymentDate)} días</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {sortedClients.map(client => {
          const daysUntil = getDaysUntil(client.nextPaymentDate);
          return (
            <div
              key={client.id}
              className="p-3 rounded-lg bg-card border border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.project}</p>
                </div>
                <span className={cn("px-2 py-0.5 rounded text-xs", getStatusColor(client.status))}>
                  {client.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-3 h-3" />
                  <span>${client.amount}/{client.paymentType === 'annual' ? 'año' : 'mes'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(client.nextPaymentDate).toLocaleDateString('es-MX')}</span>
                </div>
              </div>
              
              {client.contact && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{client.contact}</span>
                </div>
              )}
              
              {daysUntil <= 5 && (
                <div className="mt-2 text-xs text-orange-400">
                  Cobro en {daysUntil} día{daysUntil !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
