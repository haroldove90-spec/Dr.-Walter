import React from 'react';
import { QuickAccess } from './QuickAccess';
import { Specialty } from '@/src/types';

interface HomeViewProps {
  onSelectSpecialty: (specialty: Specialty) => void;
  currentSpecialty: Specialty;
  doctorName: string;
}

export function HomeView({ onSelectSpecialty, currentSpecialty, doctorName }: HomeViewProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-[#004990]">¡Bienvenido, Dr. {doctorName}!</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Seleccione una especialidad para comenzar a gestionar sus pacientes y consultas.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <QuickAccess onSelect={onSelectSpecialty} currentSpecialty={currentSpecialty} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
        <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-50 flex flex-col items-center text-center gap-4 group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004990] group-hover:bg-[#004990] group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 className="font-bold text-lg text-[#004990]">Gestión de Pacientes</h3>
          <p className="text-sm text-slate-500">Administre expedientes, historias clínicas y consentimientos informados.</p>
        </div>

        <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-50 flex flex-col items-center text-center gap-4 group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          </div>
          <h3 className="font-bold text-lg text-[#004990]">Agenda Médica</h3>
          <p className="text-sm text-slate-500">Organice sus citas, bloqueos de horario y recordatorios automáticos.</p>
        </div>

        <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-50 flex flex-col items-center text-center gap-4 group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          </div>
          <h3 className="font-bold text-lg text-[#004990]">Reportes y Análisis</h3>
          <p className="text-sm text-slate-500">Visualice estadísticas de consulta, ingresos y evolución de pacientes.</p>
        </div>
      </div>
    </div>
  );
}
