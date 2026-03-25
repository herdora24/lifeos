import { 
  Task, 
  Prayer, 
  BibleStudy, 
  GymRoutine, 
  Meditation, 
  MonthlyPayment, 
  Client,
  DashboardStats 
} from '@/types';

export const mockStats: DashboardStats = {
  totalTasks: 12,
  completedTasks: 4,
  pendingTasks: 8,
  urgentTasks: 3,
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Oración matutina',
    description: 'Oración de la mañana generada por IA',
    type: 'habit',
    category: 'wellness',
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Estudio bíblico - Salmo 23',
    description: 'Capítulo del día con reflexión',
    type: 'habit',
    category: 'wellness',
    completed: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Gimnasio - Pecho/Tríceps',
    description: 'Rutina del día con 6 ejercicios',
    type: 'habit',
    category: 'wellness',
    completed: false,
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Meditación - 15 min',
    description: 'Enfoque: Paz interior',
    type: 'habit',
    category: 'wellness',
    completed: false,
    priority: 'low',
  },
  {
    id: '5',
    title: 'Oración nocturna',
    description: 'Reflexión y agradecimiento del día',
    type: 'habit',
    category: 'wellness',
    completed: false,
    priority: 'high',
  },
  {
    id: '6',
    title: 'Pago Netflix',
    description: 'Suscripción mensual',
    type: 'payment',
    category: 'finance',
    completed: false,
    dueDate: new Date('2026-03-20'),
    priority: 'medium',
  },
  {
    id: '7',
    title: 'Pago Internet',
    description: 'Servicio mensual',
    type: 'payment',
    category: 'finance',
    completed: false,
    dueDate: new Date('2026-03-25'),
    priority: 'medium',
  },
  {
    id: '8',
    title: 'Renovación Cliente: Tienda María',
    description: 'Sistema de facturación - Cobro en 3 días',
    type: 'client_renewal',
    category: 'crm',
    completed: false,
    dueDate: new Date('2026-03-21'),
    priority: 'urgent',
  },
  {
    id: '9',
    title: 'Renovación Cliente: Restaurant El Güero',
    description: 'Punto de venta - Cobro en 5 días',
    type: 'client_renewal',
    category: 'crm',
    completed: false,
    dueDate: new Date('2026-03-23'),
    priority: 'high',
  },
];

export const mockPrayers: Prayer[] = [
  {
    id: '1',
    time: 'morning',
    title: 'Oración Matutina',
    content: 'Señor, gracias por este nuevo día. Guía mis pasos y bendice mis decisiones. Que tu luz ilumine mi camino y tu paz llene mi corazón. Amén.',
    completed: false,
    date: '2026-03-18',
  },
  {
    id: '2',
    time: 'night',
    title: 'Oración Nocturna',
    content: 'Gracias por las bendiciones de hoy. Perdona mis errores y ayúdame a crecer. Protege a mi familia y dame descanso peaceful. Amén.',
    completed: false,
    date: '2026-03-18',
  },
];

export const mockBibleStudy: BibleStudy = {
  id: '1',
  book: 'Salmos',
  chapter: 23,
  title: 'El Señor es mi pastor',
  reflection: 'Este capítulo nos recuerda que Dios nos guía por caminos de justicia y nos da descanso. Incluso cuando caminamos por valle de sombra de muerte, no debemos temer porque Él está con nosotros.',
  completed: false,
  date: '2026-03-18',
};

export const mockGymRoutine: GymRoutine = {
  id: '1',
  day: 'Martes',
  muscleGroup: 'Pecho / Tríceps',
  exercises: [
    { id: '1', name: 'Press de banca', sets: 4, reps: '10-12', completed: false },
    { id: '2', name: 'Press inclinado con mancuernas', sets: 3, reps: '10-12', completed: false },
    { id: '3', name: 'Cruces en polea', sets: 3, reps: '12-15', completed: false },
    { id: '4', name: 'Fondos en banco', sets: 3, reps: '10-15', completed: false },
    { id: '5', name: 'Extensiones de tríceps', sets: 3, reps: '12-15', completed: false },
    { id: '6', name: 'Press francés', sets: 3, reps: '10-12', completed: false },
  ],
  date: '2026-03-18',
};

export const mockMeditation: Meditation = {
  id: '1',
  focus: 'Paz interior y gratitud',
  duration: 15,
  completed: false,
  date: '2026-03-18',
};

export const mockMonthlyPayments: MonthlyPayment[] = [
  { id: '1', name: 'Netflix', amount: 299, dueDay: 15, category: 'subscription', completed: false },
  { id: '2', name: 'Spotify', amount: 129, dueDay: 18, category: 'subscription', completed: false },
  { id: '3', name: 'Internet', amount: 399, dueDay: 25, category: 'services', completed: false },
  { id: '4', name: 'Luz', amount: 450, dueDay: 28, category: 'services', completed: false },
  { id: '5', name: 'Agua', amount: 180, dueDay: 30, category: 'services', completed: false },
  { id: '6', name: 'Telmex', amount: 349, dueDay: 5, category: 'services', completed: false },
  { id: '7', name: 'GitHub Pro', amount: 4, dueDay: 12, category: 'subscription', completed: true, lastPaid: '2026-03-12' },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Tienda María',
    project: 'Sistema de Facturación',
    paymentType: 'monthly',
    amount: 1500,
    nextPaymentDate: '2026-03-21',
    status: 'active',
    contact: 'María González - 55 1234 5678',
  },
  {
    id: '2',
    name: 'Restaurant El Güero',
    project: 'Punto de Venta',
    paymentType: 'monthly',
    amount: 1200,
    nextPaymentDate: '2026-03-23',
    status: 'active',
    contact: 'Roberto Güero - 55 8765 4321',
  },
  {
    id: '3',
    name: 'Ferretería López',
    project: 'Gestión de Inventarios',
    paymentType: 'annual',
    amount: 12000,
    nextPaymentDate: '2026-04-15',
    status: 'active',
    contact: 'Carlos López - 55 1111 2222',
  },
  {
    id: '4',
    name: 'Clinica Dental Sonrisa',
    project: 'Sistema de Citas',
    paymentType: 'monthly',
    amount: 1800,
    nextPaymentDate: '2026-03-30',
    status: 'active',
    contact: 'Dra. Ana - 55 3333 4444',
  },
  {
    id: '5',
    name: 'Taller Mecánico Express',
    project: 'Sistema de Control',
    paymentType: 'monthly',
    amount: 1000,
    nextPaymentDate: '2026-02-28',
    status: 'overdue',
    contact: 'Juan - 55 5555 6666',
  },
];
