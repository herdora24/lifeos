'use client';

import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Calendar, DollarSign, MessageCircle, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn, getDaysUntil } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/ui/Modal';

interface Client {
  id: string;
  name: string;
  system: string;
  payment_type: 'monthly' | 'annual';
  amount: number;
  next_payment_date: string;
}

const mockClients: Client[] = [
  { id: '1', name: 'Billar A&L Premium', system: 'Control de Tiempos', payment_type: 'monthly', amount: 800, next_payment_date: '2026-03-22' },
  { id: '2', name: 'Heladería Central', system: 'POS e Inventario', payment_type: 'annual', amount: 6000, next_payment_date: '2026-05-04' },
  { id: '3', name: 'Ferretería', system: 'App de Conteo Móvil', payment_type: 'monthly', amount: 500, next_payment_date: '2026-03-20' },
];

export default function SoftwareClientsCRM() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '', system: '', paymentType: 'monthly', amount: '', nextPaymentDate: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_clients')
        .select('*')
        .order('next_payment_date', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setClients(data);
      } else {
        setClients(mockClients);
      }
    } catch (error) {
      console.log('Usando datos locales:', error);
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };

  const urgentClients = clients.filter(c => getDaysUntil(c.next_payment_date) <= 5);
  const normalClients = clients.filter(c => getDaysUntil(c.next_payment_date) > 5);

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({ name: '', system: '', paymentType: 'monthly', amount: '', nextPaymentDate: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({ name: client.name, system: client.system, paymentType: client.payment_type, amount: client.amount.toString(), nextPaymentDate: client.next_payment_date });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.system || !formData.nextPaymentDate) return;
    
    const clientData = {
      name: formData.name,
      system: formData.system,
      payment_type: formData.paymentType as 'monthly' | 'annual', // <-- Aquí está la corrección
      amount: parseFloat(formData.amount) || 0,
      next_payment_date: formData.nextPaymentDate,
    };

    try {
      if (editingClient) {
        const { error } = await supabase
          .from('crm_clients')
          .update(clientData)
          .eq('id', editingClient.id);
        if (error) throw error;
        setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
      } else {
        const { data, error } = await supabase
          .from('crm_clients')
          .insert(clientData)
          .select()
          .single();
        if (error) throw error;
        if (data) setClients(prev => [...prev, data]);
      }
    } catch (error) {
      console.log('Guardando localmente:', error);
      const localClient = { id: Date.now().toString(), ...clientData };
      if (editingClient) {
        setClients(prev => prev.map(c => c.id === editingClient.id ? localClient : c));
      } else {
        setClients(prev => [...prev, localClient]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_clients')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.log('Eliminando localmente:', error);
    }
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Clientes - Cobros</h3>
          <button onClick={openAddModal} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div>
            {urgentClients.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="font-medium text-red-400">Requiere atención</span>
                </div>
                {urgentClients.map(client => {
                  const daysUntil = getDaysUntil(client.next_payment_date);
                  const isToday = daysUntil === 0;
                  return (
                    <div key={client.id} className="group p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{client.name}</h4>
                            <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                              {isToday ? 'Hoy' : `${daysUntil} días`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{client.system}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => console.log('WhatsApp a', client.name)} className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(client)} className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => handleDelete(client.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span>${client.amount}/{client.payment_type === 'annual' ? 'año' : 'mes'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(client.next_payment_date).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {normalClients.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Próximos</p>
                {normalClients.map(client => {
                  const daysUntil = getDaysUntil(client.next_payment_date);
                  return (
                    <div key={client.id} className="group p-3 rounded-lg border border-border bg-muted/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{client.name}</h4>
                          <p className="text-sm text-muted-foreground">{client.system}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditModal(client)} className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => handleDelete(client.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>${client.amount}/{client.payment_type === 'annual' ? 'año' : 'mes'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(client.next_payment_date).toLocaleDateString('es-MX')} ({daysUntil} días)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Nombre del Cliente</label><input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: Billar A&L" /></div>
          <div><label className="block text-sm font-medium mb-2">Proyecto/Sistema</label><input type="text" value={formData.system} onChange={(e) => setFormData(prev => ({ ...prev, system: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: Control de Tiempos" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Tipo de Pago</label><select value={formData.paymentType} onChange={(e) => setFormData(prev => ({ ...prev, paymentType: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"><option value="monthly">Mensual</option><option value="annual">Anual</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Monto ($)</label><input type="number" min="0" value={formData.amount} onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-2">Próximo Cobro</label><input type="date" value={formData.nextPaymentDate} onChange={(e) => setFormData(prev => ({ ...prev, nextPaymentDate: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">Cancelar</button>
            <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}