export type Role = 'admin' | 'doctor' | 'director';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: Specialty;
  role: Role;
  photoUrl?: string;
  licenseNumber?: string;
  university?: string;
  signatureUrl?: string;
  officeNumber?: string;
  officeHours?: string;
}

export type Specialty = 'Psicología' | 'Nutrición' | 'Ortopedia' | 'Ginecología' | 'Fisioterapia' | 'Cirugía General' | 'Médico General';

export const SPECIALTY_COLORS: Record<Specialty, string> = {
  'Psicología': 'text-purple-600 bg-purple-50 border-purple-100',
  'Nutrición': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'Ortopedia': 'text-orange-600 bg-orange-50 border-orange-100',
  'Ginecología': 'text-pink-600 bg-pink-50 border-pink-100',
  'Fisioterapia': 'text-cyan-600 bg-cyan-50 border-cyan-100',
  'Cirugía General': 'text-blue-600 bg-blue-50 border-blue-100',
  'Médico General': 'text-zinc-600 bg-zinc-50 border-zinc-100',
};

export const SPECIALTY_THEME: Record<Specialty, string> = {
  'Psicología': 'purple',
  'Nutrición': 'emerald',
  'Ortopedia': 'orange',
  'Ginecología': 'pink',
  'Fisioterapia': 'cyan',
  'Cirugía General': 'blue',
  'Médico General': 'zinc',
};

export interface MedicalRecord {
  id: string;
  date: string;
  weight?: number;
  height?: number;
  painLevel?: number;
  specialty: Specialty;
  diagnosis: string;
  data: SpecialtyFields;
  prescriptions?: Prescription[];
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  specialty: Specialty;
  items: PrescriptionItem[];
}

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia';

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  specialistFee: number;
  clinicCommission: number;
  discount?: number;
  packageName?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  contact: string;
  email?: string;
  history?: MedicalRecord[];
  fiscalData?: {
    rfc: string;
    razonSocial: string;
    cp: string;
    regimen: string;
  };
}

export interface AdminMetrics {
  totalRevenue: number;
  newPatients: number;
  recurrentPatients: number;
  mostProfitableSpecialty: Specialty;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  status: 'Pendiente' | 'En Consulta' | 'Completada' | 'Cancelada';
  specialty: Specialty;
}

export interface SpecialtyFields {
  // Psicología
  hamiltonScore?: number;
  hamiltonLevel?: 'Leve' | 'Moderado' | 'Severo';
  beckScore?: number;
  beckLevel?: 'Leve' | 'Moderado' | 'Severo';
  
  // Nutrición
  dietPlan?: {
    name: string;
    macros: { protein: number; carbs: number; fat: number };
    fileUrl?: string;
  };
  
  // Ortopedia / Fisioterapia
  rehabPlan?: {
    diagnosis: string;
    exercises: string[];
    sessionsCompleted: number;
    sessionsTotal: number;
    evaInitial: number;
    evaCurrent: number;
    mobilityDegrees?: { joint: string; initial: number; current: number };
  };
  
  // Ginecología
  pregnancyTracking?: {
    weeks: number;
    fpp: string;
    fetalWeight: number;
    deliveryType: 'Vaginal' | 'Cesárea' | 'Por definir';
  };
  
  // Cirugía General
  surgerySchedule?: {
    procedure: string;
    surgeon: string;
    startTime: string;
    materialsStatus: 'Completo' | 'Pendiente' | 'En camino';
  };

  [key: string]: any;
}

export interface ClinicConfig {
  notifications: {
    agendaAlerts: number;
    autoReminders: boolean;
    followUpAlerts: boolean;
  };
  workflow: {
    consultationDuration: Record<Specialty, number>;
    workingDays: number[];
    openingHour: string;
    closingHour: string;
  };
  preferences: {
    language: 'es' | 'en';
    theme: 'light' | 'dark';
  };
}
