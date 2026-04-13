import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { StatCard } from './components/dashboard/StatCard';
import { ConsultationView } from './components/consultation/ConsultationView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DoctorOnboarding } from './components/auth/DoctorOnboarding';
import { cn } from '@/lib/utils';
import { EspecialidadesGrid } from './components/dashboard/EspecialidadesGrid';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity,
  Search,
  Plus,
  Bell,
  ChevronRight,
  Download,
  FileSpreadsheet,
  BarChart3,
  Trash2,
  Edit2,
  Filter,
  FileDown,
  Clock,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Patient, Appointment, Doctor, Specialty, Prescription, ClinicConfig } from '@/src/types';
import { exportToExcel } from './lib/exportUtils';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS } from './lib/mockData';
import { NutritionWidgets } from './components/dashboard/specialty/NutritionWidgets';
import { PsychologyWidgets } from './components/dashboard/specialty/PsychologyWidgets';
import { GynecologyWidgets } from './components/dashboard/specialty/GynecologyWidgets';
import { PhysioWidgets } from './components/dashboard/specialty/PhysioWidgets';
import { SurgeryWidgets } from './components/dashboard/specialty/SurgeryWidgets';
import { SPECIALTY_COLORS } from './types';
import { PatientForm } from './components/dashboard/PatientForm';
import { CalendarView } from './components/dashboard/CalendarView';
import { DashboardChart } from './components/dashboard/DashboardChart';
import { AdminView } from './components/dashboard/AdminView';
import { QuickAccess } from './components/dashboard/QuickAccess';
import { PrescriptionForm } from './components/consultation/PrescriptionForm';
import { PrescriptionsList } from './components/dashboard/PrescriptionsList';
import { HomeView } from './components/dashboard/HomeView';
import { PWAInstallBanner } from './components/layout/PWAInstallBanner';
import { exportPrescriptionToPDF, sharePrescription } from './lib/exportUtils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Pill } from 'lucide-react';
import { SettingsPage } from './components/dashboard/SettingsPage';

export default function App() {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(() => {
    const saved = localStorage.getItem('currentDoctor');
    if (saved) return JSON.parse(saved);
    
    // Default doctor to bypass onboarding as requested
    const defaultDoctor: Doctor = {
      id: '1',
      firstName: 'Walter',
      lastName: 'Guidos',
      specialty: 'Médico General',
      role: 'director'
    };
    localStorage.setItem('currentDoctor', JSON.stringify(defaultDoctor));
    return defaultDoctor;
  });
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('activeTab');
    return saved || 'home';
  });
  const [inConsultation, setInConsultation] = useState<Appointment | null>(null);
  const [viewingExpediente, setViewingExpediente] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('patients');
    return saved ? JSON.parse(saved) : [];
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingSpecialty, setViewingSpecialty] = useState<Specialty | 'Global'>(() => {
    const saved = localStorage.getItem('viewingSpecialty');
    if (saved) return saved as Specialty | 'Global';
    return 'Global';
  });

  // New state for CRUD and Navigation
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [highlightedAppointmentId, setHighlightedAppointmentId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [config, setConfig] = useState<ClinicConfig>(() => {
    const saved = localStorage.getItem('clinicConfig');
    if (saved) return JSON.parse(saved);
    
    return {
      notifications: {
        agendaAlerts: 15,
        autoReminders: true,
        followUpAlerts: true,
      },
      workflow: {
        consultationDuration: {
          'Médico General': 20,
          'Psicología': 50,
          'Nutrición': 40,
          'Ortopedia': 30,
          'Ginecología': 30,
          'Fisioterapia': 45,
          'Cirugía General': 40,
        },
        workingDays: [1, 2, 3, 4, 5],
        openingHour: '08:00',
        closingHour: '18:00',
      },
      preferences: {
        language: 'es',
        theme: 'light',
      },
    };
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const notifiedAppointments = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const upcoming = appointments.find(apt => {
        const aptDate = new Date(apt.date);
        const diff = (aptDate.getTime() - now.getTime()) / (1000 * 60);
        return diff > 0 && diff <= config.notifications.agendaAlerts && apt.status === 'Pendiente' && !notifiedAppointments.current.has(apt.id);
      });

      if (upcoming) {
        const patient = patients.find(p => p.id === upcoming.patientId);
        setToast({ 
          message: `Recordatorio: ${patient?.firstName} ${patient?.lastName} en ${Math.round((new Date(upcoming.date).getTime() - Date.now()) / 60000)} min`, 
          type: 'success' 
        });
        notifiedAppointments.current.add(upcoming.id);
        setTimeout(() => setToast(null), 5000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [appointments, config.notifications.agendaAlerts, patients]);

  useEffect(() => {
    localStorage.setItem('clinicConfig', JSON.stringify(config));
    if (config.preferences.theme !== theme) {
      setTheme(config.preferences.theme);
    }
  }, [config]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show banner if user hasn't dismissed it in this session
      const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleResetDemo = () => {
    if (window.confirm('¿Está seguro de reiniciar la demo? Se borrarán todos los datos locales.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setCurrentDoctor(updatedDoctor);
    setViewingSpecialty(updatedDoctor.specialty);
    localStorage.setItem('currentDoctor', JSON.stringify(updatedDoctor));
  };

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('viewingSpecialty', viewingSpecialty);
  }, [viewingSpecialty]);

  useEffect(() => {
    if (currentDoctor) {
      localStorage.setItem('currentDoctor', JSON.stringify(currentDoctor));
      
      // Force load mock data if current data is empty or seems to be the old version
      const savedPatients = localStorage.getItem('patients');
      const parsedPatients = savedPatients ? JSON.parse(savedPatients) : [];
      
      if (parsedPatients.length === 0 || !parsedPatients.some((p: any) => p.history?.some((h: any) => h.data?.hamiltonScore))) {
        console.log('Cargando datos de muestra enriquecidos...');
        setPatients(MOCK_PATIENTS);
        localStorage.setItem('patients', JSON.stringify(MOCK_PATIENTS));
        
        setAppointments(MOCK_APPOINTMENTS);
        localStorage.setItem('appointments', JSON.stringify(MOCK_APPOINTMENTS));
      }
    }
  }, [currentDoctor]);

  useEffect(() => {
    if (patients.length > 0) localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  if (!currentDoctor) {
    return <DoctorOnboarding onComplete={setCurrentDoctor} />;
  }

  const handleStartConsultation = (appointment: Appointment) => {
    setInConsultation(appointment);
  };

  const handleSaveConsultation = (appointmentId: string, patientId: string, medicalRecord: any) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'Completada' } : apt
    ));

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newHistory = [...(p.history || []), {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          specialty: viewingSpecialty,
          ...medicalRecord
        }];
        return { ...p, history: newHistory };
      }
      return p;
    }));

    setInConsultation(null);
  };

  const handleSavePrescription = (prescription: Prescription) => {
    setPatients(prev => prev.map(p => {
      if (p.id === prescription.patientId) {
        const history = [...(p.history || [])];
        if (history.length > 0) {
          const lastRecord = { ...history[history.length - 1] };
          lastRecord.prescriptions = [...(lastRecord.prescriptions || []), prescription];
          history[history.length - 1] = lastRecord;
        } else {
          history.push({
            id: `rec-rx-${Date.now()}`,
            date: new Date().toISOString(),
            specialty: prescription.specialty,
            diagnosis: 'Consulta de seguimiento / Receta',
            data: {},
            prescriptions: [prescription]
          });
        }
        return { ...p, history };
      }
      return p;
    }));
    setToast({ message: 'Receta guardada con éxito', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsPatientFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsPatientFormOpen(true);
  };

  const handleSavePatient = (patientData: Partial<Patient>) => {
    if (editingPatient) {
      setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, ...patientData } : p));
    } else {
      const newPatient: Patient = {
        ...patientData as Patient,
        id: `p${Date.now()}`,
        history: []
      };
      setPatients(prev => [...prev, newPatient]);
    }
    setIsPatientFormOpen(false);
    setToast({ message: 'Paciente guardado con éxito', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const currentPatient = inConsultation 
    ? patients.find(p => p.id === inConsultation.patientId) 
    : null;

  const handleDeletePatient = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este paciente?')) {
      setPatients(prev => prev.filter(p => p.id !== id));
      setAppointments(prev => prev.filter(a => a.patientId !== id));
    }
  };

  const stats = {
    pacientesHoy: appointments.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString() && 
      a.specialty === viewingSpecialty
    ).length,
    ingresosMes: appointments.filter(a => 
      a.status === 'Completada' && 
      a.specialty === viewingSpecialty
    ).length * 50, // Mocking $50 per consultation
    proximasCitas: appointments.filter(a => 
      a.status === 'Pendiente' && 
      a.specialty === viewingSpecialty
    ).length
  };

  const filteredAppointments = appointments.filter(apt => {
    const patient = patients.find(p => p.id === apt.patientId);
    const fullName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesSpecialty = apt.specialty === viewingSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleExportPatients = () => {
    const data = patients.filter(p => {
      return p.history?.some(h => h.specialty === viewingSpecialty) || appointments.some(a => a.patientId === p.id && a.specialty === viewingSpecialty);
    });
    exportToExcel(data, `Pacientes_${viewingSpecialty}`, viewingSpecialty);
  };

  const renderSpecialtyWidgets = () => {
    switch (viewingSpecialty) {
      case 'Nutrición': return <NutritionWidgets patients={patients} />;
      case 'Psicología': return <PsychologyWidgets patients={patients} />;
      case 'Ginecología': return <GynecologyWidgets patients={patients} />;
      case 'Fisioterapia':
      case 'Ortopedia': return <PhysioWidgets patients={patients} />;
      case 'Cirugía General': return <SurgeryWidgets patients={patients} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB] font-sans text-[#1A1A1A] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        doctor={currentDoctor} 
        viewingSpecialty={viewingSpecialty}
        onSpecialtyChange={setViewingSpecialty}
        onInstall={handleInstall}
        deferredPrompt={deferredPrompt}
      />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className={cn(
              "px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border",
              toast.type === 'success' ? "bg-emerald-500 border-emerald-400 text-white" : "bg-rose-500 border-rose-400 text-white"
            )}>
              <CheckCircle2 size={18} />
              <span className="font-bold text-sm">{toast.message}</span>
            </div>
          </div>
        )}

        {/* PWA Install Banner */}
        {showInstallBanner && (
          <PWAInstallBanner 
            onInstall={handleInstall} 
            onClose={handleDismissInstall} 
          />
        )}

        {/* Top Header Bar - Updated with Mobile Styling */}
        <header className="sticky top-0 z-30 bg-[#004990] md:bg-[#F5F7FB]/80 md:backdrop-blur-md px-4 md:px-8 py-4 md:py-6 flex items-center justify-between shadow-lg md:shadow-none">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Buscar pacientes, citas..." 
                className="pl-10 w-[300px] bg-white border-none shadow-sm rounded-2xl h-11 focus-visible:ring-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Mobile Logo/Title */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <Stethoscope size={18} className="text-secondary" />
              </div>
              <h1 className="font-bold text-white text-sm">Clínica Guidos</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {viewingSpecialty !== 'Global' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewingSpecialty('Global')}
                className="hidden md:flex items-center gap-2 text-[#004990] hover:bg-blue-50 rounded-xl font-bold text-xs"
              >
                <LayoutGrid size={16} />
                Panel Central
              </Button>
            )}
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/10 md:bg-white shadow-sm text-white md:text-slate-400 hover:text-secondary">
              <Bell size={20} />
            </Button>
            <div className="h-8 w-[1px] bg-white/10 md:bg-slate-200 mx-1 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setActiveTab('profile')}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">Dr. {currentDoctor.lastName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{viewingSpecialty}</p>
              </div>
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-secondary/20 overflow-hidden">
                {currentDoctor.photoUrl ? (
                  <img src={currentDoctor.photoUrl} alt="Dr" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  `${currentDoctor.firstName[0]}${currentDoctor.lastName[0]}`
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {isPrescriptionModalOpen && selectedPatientForPrescription && (
            <Dialog open={isPrescriptionModalOpen} onOpenChange={setIsPrescriptionModalOpen}>
              <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
                <PrescriptionForm 
                  patient={selectedPatientForPrescription}
                  doctor={currentDoctor}
                  specialty={viewingSpecialty}
                  onSave={(rx) => {
                    handleSavePrescription(rx);
                    setIsPrescriptionModalOpen(false);
                  }}
                  onExport={(rx) => exportPrescriptionToPDF(selectedPatientForPrescription, rx, currentDoctor)}
                  onShare={(rx) => sharePrescription(selectedPatientForPrescription, rx)}
                />
              </DialogContent>
            </Dialog>
          )}

          {viewingExpediente ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => setViewingExpediente(null)} className="rounded-xl">
                    <ArrowLeft size={20} />
                  </Button>
                  <h2 className="text-2xl font-bold text-[#004990]">Expediente de {viewingExpediente.firstName}</h2>
                </div>
                <Button 
                  className="bg-secondary hover:bg-secondary/90 rounded-2xl shadow-lg shadow-secondary/20 gap-2"
                  onClick={() => {
                    const mockApt = { id: 'temp', patientId: viewingExpediente.id, specialty: viewingSpecialty, date: new Date().toISOString(), status: 'Pendiente' } as Appointment;
                    setInConsultation(mockApt);
                    setViewingExpediente(null);
                  }}
                >
                  <Plus size={18} />
                  Nueva Consulta
                </Button>
              </div>
              
              <ConsultationView 
                patient={viewingExpediente} 
                appointment={{ id: 'view', patientId: viewingExpediente.id, specialty: viewingSpecialty, date: new Date().toISOString(), status: 'Completada' } as Appointment} 
                doctor={currentDoctor}
                onBack={() => setViewingExpediente(null)} 
                onSave={() => {}} // Read-only mode essentially
                onSavePrescription={handleSavePrescription}
                setToast={setToast}
              />
            </div>
          ) : inConsultation && currentPatient ? (
            <ConsultationView 
              patient={currentPatient} 
              appointment={inConsultation} 
              doctor={currentDoctor}
              onBack={() => setInConsultation(null)} 
              onSave={(record) => handleSaveConsultation(inConsultation.id, currentPatient.id, record)}
              onSavePrescription={handleSavePrescription}
              setToast={setToast}
            />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              {activeTab === 'home' && (
                <HomeView 
                  onSelectSpecialty={(spec) => {
                    setViewingSpecialty(spec);
                    setActiveTab('dashboard');
                  }}
                  currentSpecialty={viewingSpecialty as Specialty}
                  doctorName={currentDoctor.firstName}
                />
              )}

              {activeTab === 'dashboard' && (
                <>
                  {/* Welcome Section */}
                  <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-[#004990]">¡Hola {currentDoctor.firstName}!</h2>
                      <p className="text-slate-500 mt-1">Bienvenido a su plataforma. Ayudemos a los pacientes a vivir una vida más saludable.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button 
                        onClick={() => {
                          setSelectedPatientForPrescription(patients[0]); // Default to first for demo
                          setIsPrescriptionModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-200 gap-2 font-bold h-11"
                      >
                        <Pill size={18} />
                        Nueva Receta
                      </Button>
                    </div>
                  </div>

                  {viewingSpecialty === 'Global' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <EspecialidadesGrid onSelect={setViewingSpecialty} />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <StatCard 
                          title="Pacientes Hoy" 
                          value={stats.pacientesHoy} 
                          icon={Users} 
                          trend="+12%" 
                          trendUp={true}
                          color="bg-blue-500"
                        />
                        <StatCard 
                          title="Ingresos (Est.)" 
                          value={`$${stats.ingresosMes}`} 
                          icon={TrendingUp} 
                          trend="+8%" 
                          trendUp={true}
                          color="bg-emerald-500"
                        />
                        <StatCard 
                          title="Próximas Citas" 
                          value={stats.proximasCitas} 
                          icon={Calendar} 
                          trend="-2%" 
                          trendUp={false}
                          color="bg-orange-500"
                        />
                      </div>

                      {/* Specialty Specific Widgets */}
                      {currentDoctor.role !== 'admin' && (
                        <div className="mb-8">
                          <QuickAccess onSelect={setViewingSpecialty} currentSpecialty={viewingSpecialty} />
                        </div>
                      )}

                      <div className="grid grid-cols-12 gap-8">
                        {/* Left Column: Charts and Schedule */}
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                          {/* Main Chart Card */}
                          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-0">
                              <div>
                                <CardTitle className="text-lg font-bold text-[#004990]">Estadísticas de Consulta</CardTitle>
                                <p className="text-xs text-slate-400 mt-1">
                                  {viewingSpecialty === 'Nutrición' ? 'Tendencia de Peso Promedio' : 
                                   viewingSpecialty === 'Ginecología' ? 'Crecimiento Fetal vs Ideal' : 
                                   'Resumen mensual de pacientes atendidos'}
                                </p>
                              </div>
                              <select className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl outline-none cursor-pointer shadow-lg shadow-secondary/20">
                                <option>Anual</option>
                                <option>Mensual</option>
                              </select>
                            </CardHeader>
                            <CardContent className="p-8">
                              <DashboardChart specialty={viewingSpecialty as Specialty} />
                              <div className="grid grid-cols-2 gap-8 mt-8">
                                <div className="p-6 bg-[#F5F7FB] rounded-3xl">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Esta Semana</p>
                                  <p className="text-2xl font-bold text-[#004990] mt-1">259 <span className="text-xs font-medium text-emerald-500 ml-2">+12%</span></p>
                                </div>
                                <div className="p-6 bg-[#F5F7FB] rounded-3xl">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Este Mes</p>
                                  <p className="text-2xl font-bold text-[#004990] mt-1">873 <span className="text-xs font-medium text-emerald-500 ml-2">+8%</span></p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Duty Hour / Schedule */}
                          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-0">
                              <CardTitle className="text-lg font-bold text-[#004990]">Horario de Turno</CardTitle>
                              <select className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl outline-none cursor-pointer shadow-lg shadow-secondary/20">
                                <option>Semanal</option>
                              </select>
                            </CardHeader>
                            <CardContent className="p-8">
                              <div className="flex justify-between items-center mb-8">
                                {['Sáb', 'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((day, i) => (
                                  <div key={day} className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer",
                                    i === 2 ? "bg-[#004990] text-white shadow-xl shadow-primary/20" : "hover:bg-slate-50"
                                  )}>
                                    <span className="text-[10px] font-bold uppercase opacity-60">{day}</span>
                                    <span className="text-sm font-bold">{9 + i}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-center">
                                <div className="bg-[#004990] px-8 py-4 rounded-full flex items-center gap-4 shadow-xl shadow-primary/20">
                                  <span className="text-white font-bold text-lg">49 horas</span>
                                  <span className="text-secondary font-bold text-sm">Promedio Semanal</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Right Column: Stats and Lists */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                          {/* Patient Gender Donut */}
                          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-0">
                              <CardTitle className="text-base font-bold text-[#004990]">Género de Pacientes</CardTitle>
                              <Button variant="ghost" size="sm" className="text-secondary font-bold text-xs hover:bg-secondary/10">Ver Todo</Button>
                            </CardHeader>
                            <CardContent className="p-8 flex flex-col items-center">
                              <div className="relative w-40 h-40 mb-6">
                                <div className="absolute inset-0 rounded-full border-[12px] border-slate-100" />
                                <div className="absolute inset-0 rounded-full border-[12px] border-secondary border-t-transparent border-l-transparent rotate-45" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-[#004990]">64%</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Mujeres</p>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-secondary" />
                                    <span className="text-xs font-bold text-slate-600">Femenino</span>
                                  </div>
                                  <span className="text-xs font-bold text-[#004990]">1,240</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                                    <span className="text-xs font-bold text-slate-600">Masculino</span>
                                  </div>
                                  <span className="text-xs font-bold text-[#004990]">680</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Upcoming Appointments */}
                          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-4">
                              <CardTitle className="text-base font-bold text-[#004990]">Próximas Citas</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-8">
                              <div className="space-y-2">
                                {filteredAppointments.slice(0, 5).map((apt) => {
                                  const patient = patients.find(p => p.id === apt.patientId);
                                  return (
                                    <div 
                                      key={apt.id} 
                                      onClick={() => {
                                        setHighlightedAppointmentId(apt.id);
                                        setActiveTab('agenda');
                                      }}
                                      className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-all cursor-pointer group"
                                    >
                                      <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-secondary group-hover:text-white transition-all">
                                        {patient?.firstName[0]}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{patient?.firstName} {patient?.lastName}</p>
                                        <p className="text-[10px] text-secondary font-bold">Primera Visita</p>
                                      </div>
                                      <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar size={14} className="text-secondary" />
                                        <span className="text-xs font-bold text-slate-900">
                                          {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Profile Card */}
                          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                              <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-[#F5F7FB] shadow-inner overflow-hidden">
                                {currentDoctor.photoUrl ? (
                                  <img src={currentDoctor.photoUrl} alt="Dr" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-2xl">
                                    {currentDoctor.firstName[0]}{currentDoctor.lastName[0]}
                                  </div>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-[#004990]">Dr. {currentDoctor.firstName} {currentDoctor.lastName}</h3>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{viewingSpecialty}</p>
                              <div className="grid grid-cols-2 gap-8 w-full mt-8 pt-8 border-t border-slate-50">
                                <div>
                                  <p className="text-sm font-bold text-[#004990]">4.5</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#004990]">{patients.length}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pacientes</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'scales' && <PsychologyWidgets patients={patients} />}
              {activeTab === 'diets' && <NutritionWidgets patients={patients} />}
              {activeTab === 'births' && <GynecologyWidgets patients={patients} />}
              {activeTab === 'rehab' && <PhysioWidgets patients={patients} />}
              {activeTab === 'surgery' && <SurgeryWidgets patients={patients} />}
              {activeTab === 'prescriptions' && <PrescriptionsList patients={patients} />}

              {activeTab === 'agenda' && (
                <CalendarView 
                  appointments={appointments} 
                  patients={patients} 
                  viewingSpecialty={viewingSpecialty} 
                  highlightedAppointmentId={highlightedAppointmentId}
                  config={config}
                />
              )}

              {activeTab === 'consultations' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#004990]">Consultas Pendientes</h2>
                    <Badge className="bg-secondary text-white border-none rounded-xl px-4 py-1">
                      {appointments.filter(a => a.status === 'Pendiente' && a.specialty === viewingSpecialty).length} Pendientes
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.filter(a => a.status === 'Pendiente' && a.specialty === viewingSpecialty).map((apt) => {
                      const patient = patients.find(p => p.id === apt.patientId);
                      return (
                        <Card key={apt.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group">
                          <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl group-hover:bg-secondary group-hover:text-white transition-all">
                                {patient?.firstName[0]}
                              </div>
                              <div>
                                <p className="text-lg font-bold text-[#004990]">{patient?.firstName} {patient?.lastName}</p>
                                <p className="text-xs text-slate-400 font-medium">{patient?.gender}, {new Date().getFullYear() - new Date(patient?.dob || '').getFullYear()} años</p>
                              </div>
                            </div>
                            <div className="space-y-3 mb-8">
                              <div className="flex items-center gap-3 text-slate-500">
                                <Clock size={16} className="text-secondary" />
                                <span className="text-sm font-medium">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-500">
                                <Activity size={16} className="text-secondary" />
                                <span className="text-sm font-medium">Consulta de Seguimiento</span>
                              </div>
                            </div>
                            <Button 
                              className="w-full rounded-2xl bg-[#004990] hover:bg-[#003d7a] font-bold py-6 shadow-lg shadow-primary/20"
                              onClick={() => {
                                setInConsultation(apt);
                              }}
                            >
                              Iniciar Consulta
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <SettingsPage 
                  doctor={currentDoctor} 
                  config={config}
                  onUpdateDoctor={handleUpdateDoctor} 
                  onUpdateConfig={setConfig}
                  onReset={handleResetDemo} 
                  onInstall={handleInstall}
                  deferredPrompt={deferredPrompt}
                  setToast={setToast}
                />
              )}

              {activeTab === 'admin' && (
                <AdminView />
              )}

              {activeTab === 'patients' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#004990]">Base de Datos de Pacientes</h2>
                    <div className="flex gap-4">
                      <Button onClick={handleAddPatient} className="gap-2 bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        Nuevo Paciente
                      </Button>
                      <Button onClick={handleExportPatients} className="gap-2 bg-secondary hover:bg-secondary/90 rounded-2xl shadow-lg shadow-secondary/20">
                        <FileSpreadsheet size={18} />
                        Exportar Lista (Excel)
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="border-none shadow-sm overflow-hidden rounded-[2rem]">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none">
                            <TableHead className="font-bold text-[#004990] h-14 px-8">Nombre Completo</TableHead>
                            <TableHead className="font-bold text-[#004990] h-14">Género</TableHead>
                            <TableHead className="font-bold text-[#004990] h-14">Edad</TableHead>
                            <TableHead className="font-bold text-[#004990] h-14">Contacto</TableHead>
                            <TableHead className="text-right font-bold text-[#004990] h-14 px-8">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patients.filter(p => {
                            const matchesSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
                            const hasSpecialtyHistory = p.history?.some(h => h.specialty === viewingSpecialty);
                            const hasSpecialtyAppointment = appointments.some(a => a.patientId === p.id && a.specialty === viewingSpecialty);
                            return matchesSearch && (hasSpecialtyHistory || hasSpecialtyAppointment);
                          }).map((p) => (
                            <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                              <TableCell className="font-bold px-8">{p.firstName} {p.lastName}</TableCell>
                              <TableCell className="text-slate-500">{p.gender}</TableCell>
                              <TableCell className="text-slate-500">{new Date().getFullYear() - new Date(p.dob).getFullYear()} años</TableCell>
                              <TableCell className="text-slate-500">{p.contact}</TableCell>
                              <TableCell className="text-right px-8">
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="gap-2 h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                    onClick={() => {
                                      setSelectedPatientForPrescription(p);
                                      setIsPrescriptionModalOpen(true);
                                    }}
                                  >
                                    <Pill size={14} />
                                    <span className="hidden sm:inline">Receta</span>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="gap-2 h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                    onClick={() => setViewingExpediente(p)}
                                  >
                                    <Search size={14} />
                                    <span className="hidden sm:inline">Ver</span>
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-secondary hover:bg-secondary/10"
                                    onClick={() => handleEditPatient(p)}
                                  >
                                    <Edit2 size={16} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                    onClick={() => handleDeletePatient(p.id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <PatientForm 
        isOpen={isPatientFormOpen} 
        onClose={() => setIsPatientFormOpen(false)} 
        onSave={handleSavePatient}
        patient={editingPatient}
      />
    </div>
  );
}
