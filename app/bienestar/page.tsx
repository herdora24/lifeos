'use client';

import AppLayout from '@/components/AppLayout';
import PrayerCard from '@/components/wellness/PrayerCard';
import BibleStudyCard from '@/components/wellness/BibleStudyCard';
import GymRoutineCard from '@/components/wellness/GymRoutineCard';
import MeditationCard from '@/components/wellness/MeditationCard';

export default function BienestarPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bienestar y Espiritualidad</h1>
          <p className="text-muted-foreground">Tu rutina diaria de crecimiento personal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PrayerCard />
          <BibleStudyCard />
          <GymRoutineCard />
          <MeditationCard />
        </div>
      </div>
    </AppLayout>
  );
}
