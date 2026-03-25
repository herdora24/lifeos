export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  type: 'habit' | 'business_task';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  is_completed?: boolean;
  created_at?: string;
  // Campos de recurrencia
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  last_completed_date?: string;
  next_due_date?: string;
  is_habit?: boolean;
  category?: 'wellness' | 'finance' | 'crm' | 'general';
  // Campo calculado para UI
  completed?: boolean;
}

export interface Habit {
  id?: number;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  recurrence_type?: 'daily' | 'weekly';
  last_completed_date?: string;
  current_streak?: number;
  created_at?: string;
  // Campo calculado para UI
  completed?: boolean;
}

export interface Prayer {
  id: string;
  time: 'morning' | 'night';
  title: string;
  content: string;
  completed: boolean;
  date: string;
}

export interface BibleStudy {
  id: string;
  book: string;
  chapter: number;
  verse?: number;
  title: string;
  reflection?: string;
  completed: boolean;
  date: string;
}

export interface GymExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
}

export interface GymRoutine {
  id: string;
  day: string;
  muscleGroup: string;
  exercises: GymExercise[];
  date: string;
}

export interface Meditation {
  id: string;
  focus: string;
  duration: number;
  completed: boolean;
  date: string;
}

export interface MonthlyPayment {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: 'services' | 'subscription' | 'rent' | 'other';
  completed: boolean;
  lastPaid?: string;
}

export interface Client {
  id: string;
  name: string;
  project: string;
  paymentType: 'monthly' | 'annual';
  amount: number;
  nextPaymentDate: string;
  status: 'active' | 'pending' | 'overdue';
  contact?: string;
  notes?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  urgentTasks: number;
}
