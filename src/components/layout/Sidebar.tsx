import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Patient, Appointment, Doctor, Specialty } from '@/src/types';

import { 
  Home,
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  Settings, 
  LogOut,
  Stethoscope,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Utensils,
  Brain,
  Baby,
  Activity,
  Scissors,
  User,
  Smartphone,
  Download,
  Pill
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Inicio', id: 'home' },
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Calendar, label: 'Agenda', id: 'agenda' },
  { icon: Users, label: 'Pacientes', id: 'patients' },
  { icon: ClipboardList, label: 'Consultas', id: 'consultations' },
  { icon: Pill, label: 'Recetas', id: 'prescriptions' },
  { icon: Utensils, label: 'Dietas', id: 'diets', specialties: ['Nutrición'] },
  { icon: Brain, label: 'Escalas', id: 'scales', specialties: ['Psicología'] },
  { icon: Baby, label: 'Partos', id: 'births', specialties: ['Ginecología'] },
  { icon: Activity, label: 'Rehabilitación', id: 'rehab', specialties: ['Fisioterapia', 'Ortopedia'] },
  { icon: Scissors, label: 'Quirófano', id: 'surgery', specialties: ['Cirugía General'] },
  { icon: BarChart3, label: 'Administración', id: 'admin', roles: ['admin', 'director'] },
  { icon: Settings, label: 'Configuración', id: 'settings' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  doctor: Doctor;
  viewingSpecialty?: Specialty;
  onSpecialtyChange?: (specialty: Specialty) => void;
  onInstall?: () => void;
  deferredPrompt?: any;
}

export function Sidebar({ activeTab, setActiveTab, doctor, viewingSpecialty, onSpecialtyChange, onInstall, deferredPrompt }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const effectiveSpecialty = viewingSpecialty || doctor.specialty;

  const filteredNavItems = navItems.filter(item => {
    if (item.roles && !item.roles.includes(doctor.role)) return false;
    if (item.specialties && !item.specialties.includes(effectiveSpecialty)) return false;
    return true;
  });

  const specialties: Specialty[] = [
    'Médico General',
    'Psicología',
    'Nutrición',
    'Ortopedia',
    'Ginecología',
    'Fisioterapia',
    'Cirugía General'
  ];

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMobileMenu} className="bg-white shadow-md">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-40 bg-[#004990] transition-all duration-300 flex flex-col shadow-xl lg:shadow-none",
        isCollapsed ? "w-20" : "w-72",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className={cn("p-8 flex flex-col items-center gap-4", isCollapsed && "px-0")}>
          <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center text-white shrink-0 shadow-inner backdrop-blur-md border border-white/10">
            <Stethoscope size={32} className="text-secondary" />
          </div>
          {!isCollapsed && (
            <div className="text-center">
              <h1 className="font-bold text-white text-xl leading-tight tracking-tight">Clínica Guidos</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">Medical Center</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className={cn("text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-4", isCollapsed && "hidden")}>Menú Principal</p>
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
                if (item.specialties && item.specialties.length > 0) {
                  onSpecialtyChange?.(item.specialties[0] as Specialty);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group relative",
                activeTab === item.id 
                  ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                  : "text-white/50 hover:bg-white/5 hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : ""}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                activeTab === item.id ? "bg-white/20" : "bg-transparent group-hover:bg-white/10"
              )}>
                <item.icon size={20} className="shrink-0" />
              </div>
              {!isCollapsed && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-[#004990] text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-xl border border-white/10">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-white/5">
          {!isCollapsed ? (
            <div 
              className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 backdrop-blur-sm mb-4 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => setActiveTab('settings')}
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-base font-bold text-white shadow-lg shadow-secondary/20 shrink-0 overflow-hidden">
                {doctor.photoUrl ? (
                  <img src={doctor.photoUrl} alt="Dr" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  `${doctor.firstName[0]}${doctor.lastName[0]}`
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Dr. {doctor.lastName}</p>
                <p className="text-[10px] text-white/40 truncate font-bold uppercase tracking-wider">{doctor.role === 'director' ? `Director` : doctor.specialty}</p>
              </div>
            </div>
          ) : (
            <div 
              className="flex justify-center mb-6 cursor-pointer hover:scale-105 transition-all"
              onClick={() => setActiveTab('settings')}
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-base font-bold text-white shadow-lg shadow-secondary/20 overflow-hidden">
                {doctor.photoUrl ? (
                  <img src={doctor.photoUrl} alt="Dr" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  `${doctor.firstName[0]}${doctor.lastName[0]}`
                )}
              </div>
            </div>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className={cn(
              "w-full flex items-center gap-3 p-4 text-xs font-bold text-white/30 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all duration-300",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="uppercase tracking-widest">Cerrar Sesión</span>}
          </button>

          {deferredPrompt && (
            <button 
              onClick={onInstall}
              className={cn(
                "w-full flex items-center gap-3 p-4 mt-2 text-xs font-bold text-emerald-400 hover:bg-emerald-400/10 rounded-2xl transition-all duration-300",
                isCollapsed && "justify-center"
              )}
            >
              <Smartphone size={18} className="shrink-0" />
              {!isCollapsed && <span className="uppercase tracking-widest">Instalar App</span>}
            </button>
          )}
        </div>

        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-4 top-24 w-8 h-8 bg-secondary border-4 border-[#F5F7FB] rounded-full items-center justify-center text-white hover:scale-110 transition-all shadow-lg z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </>
  );
}
