import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Apple, 
  Activity, 
  Baby, 
  Scissors, 
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { Specialty } from '@/src/types';
import { cn } from '@/lib/utils';

interface QuickAccessProps {
  onSelect: (specialty: Specialty) => void;
  currentSpecialty: Specialty;
}

const specialties: { name: Specialty; icon: any; color: string }[] = [
  { name: 'Médico General', icon: Stethoscope, color: 'bg-blue-500' },
  { name: 'Psicología', icon: Brain, color: 'bg-purple-500' },
  { name: 'Nutrición', icon: Apple, color: 'bg-emerald-500' },
  { name: 'Ortopedia', icon: Activity, color: 'bg-orange-500' },
  { name: 'Ginecología', icon: Baby, color: 'bg-rose-500' },
  { name: 'Fisioterapia', icon: HeartPulse, color: 'bg-cyan-500' },
  { name: 'Cirugía General', icon: Scissors, color: 'bg-slate-700' },
];

export function QuickAccess({ onSelect, currentSpecialty }: QuickAccessProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#004990] px-2">Acceso Directo a Especialidades</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {specialties.map((spec) => (
          <Card 
            key={spec.name}
            onClick={() => onSelect(spec.name)}
            className={cn(
              "border-none shadow-sm rounded-3xl cursor-pointer transition-all hover:scale-105 active:scale-95 group overflow-hidden",
              currentSpecialty === spec.name ? "ring-4 ring-primary/20" : ""
            )}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12",
                spec.color
              )}>
                <spec.icon size={24} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                currentSpecialty === spec.name ? "text-primary" : "text-slate-500"
              )}>
                {spec.name}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
