import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Stethoscope, 
  Brain, 
  Apple, 
  Bone, 
  Baby, 
  Accessibility, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { Specialty } from '@/src/types';
import { cn } from '@/lib/utils';

interface EspecialidadItem {
  id: Specialty;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const ESPECIALIDADES: EspecialidadItem[] = [
  { 
    id: 'Médico General', 
    name: 'Médico General', 
    icon: Stethoscope, 
    color: 'bg-zinc-500', 
    description: 'Atención primaria y medicina preventiva' 
  },
  { 
    id: 'Psicología', 
    name: 'Psicología', 
    icon: Brain, 
    color: 'bg-purple-500', 
    description: 'Salud mental y bienestar emocional' 
  },
  { 
    id: 'Nutrición', 
    name: 'Nutrición', 
    icon: Apple, 
    color: 'bg-emerald-500', 
    description: 'Planes de alimentación y vida saludable' 
  },
  { 
    id: 'Ortopedia', 
    name: 'Ortopedia', 
    icon: Bone, 
    color: 'bg-orange-500', 
    description: 'Sistema musculoesquelético y lesiones' 
  },
  { 
    id: 'Ginecología', 
    name: 'Ginecología', 
    icon: Baby, 
    color: 'bg-pink-500', 
    description: 'Salud reproductiva y cuidado femenino' 
  },
  { 
    id: 'Fisioterapia', 
    name: 'Fisioterapia', 
    icon: Accessibility, 
    color: 'bg-cyan-500', 
    description: 'Rehabilitación física y movilidad' 
  },
  { 
    id: 'Cirugía General', 
    name: 'Cirugía General', 
    icon: Activity, 
    color: 'bg-blue-500', 
    description: 'Procedimientos quirúrgicos y postoperatorio' 
  },
];

interface EspecialidadesGridProps {
  onSelect: (specialty: Specialty) => void;
}

export function EspecialidadesGrid({ onSelect }: EspecialidadesGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#004990]">Panel de Especialidades</h2>
        <p className="text-sm text-slate-500">Seleccione un área para gestionar</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {ESPECIALIDADES.map((esp) => (
          <Card 
            key={esp.id}
            className="group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden"
            onClick={() => onSelect(esp.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300",
                esp.color
              )}>
                <esp.icon size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">{esp.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{esp.description}</p>
              </div>
              <div className="pt-2">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
