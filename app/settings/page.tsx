'use client';

import AppLayout from '@/components/AppLayout';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Ajustes</h1>
          <p className="text-muted-foreground">Configura tu experiencia en LifeOS</p>
        </div>

        <div className="max-w-2xl space-y-4">
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Perfil</h3>
                <p className="text-sm text-muted-foreground">Información personal</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Notificaciones</h3>
                <p className="text-sm text-muted-foreground">Configurar alertas</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Privacidad y Seguridad</h3>
                <p className="text-sm text-muted-foreground">Autenticación y datos</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Apariencia</h3>
                <p className="text-sm text-muted-foreground">Tema y diseño</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
