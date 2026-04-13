import React from 'react';
import { QuickAccess } from './QuickAccess';
import { Specialty } from '@/src/types';

interface HomeViewProps {
  onSelectSpecialty: (specialty: Specialty) => void;
  currentSpecialty: Specialty;
  doctorName: string;
}

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeView({ onSelectSpecialty, currentSpecialty, doctorName }: HomeViewProps) {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 py-12 px-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl mb-4">
          <span className="text-3xl font-bold text-secondary">WG</span>
        </div>
        <h2 className="text-5xl font-bold text-[#004990] tracking-tight">¡Bienvenido, Dr. {doctorName}!</h2>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
          Plataforma Integral de Gestión Médica. Seleccione una especialidad para comenzar.
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <QuickAccess onSelect={onSelectSpecialty} currentSpecialty={currentSpecialty} />
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          variant="ghost" 
          onClick={() => window.location.reload()}
          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl gap-2 font-bold px-8 h-12"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
