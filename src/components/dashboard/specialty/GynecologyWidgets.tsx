import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Baby, 
  Calendar, 
  Image as ImageIcon,
  Heart,
  ChevronRight,
  Clock
} from 'lucide-react';

import { Patient } from '@/src/types';

export function GynecologyWidgets({ patients }: { patients: Patient[] }) {
  const gynecologyPatients = patients.filter(p => p.history?.some(h => h.specialty === 'Ginecología'));
  
  const upcomingBirths = gynecologyPatients
    .filter(p => {
      const last = p.history?.filter(h => h.specialty === 'Ginecología').pop();
      return last?.data?.fpp;
    })
    .map(p => {
      const last = p.history?.filter(h => h.specialty === 'Ginecología').pop();
      return {
        name: `${p.firstName} ${p.lastName}`,
        date: new Date(last?.data?.fpp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        weeks: last?.data?.gesta ? '30+' : 'N/A', // Mocking weeks for now
        status: 'Control'
      };
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <Baby className="text-secondary" size={20} />
            Próximos Partos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-4">
          {upcomingBirths.length > 0 ? upcomingBirths.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50 group hover:bg-white hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-bold text-[#004990]">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} className="text-secondary" />
                  <span className="text-[10px] text-slate-500 font-bold">{item.date}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-secondary">{item.weeks} Sem</p>
                <Badge className="bg-emerald-100 text-emerald-700 border-none text-[9px] font-bold px-2 py-0.5 rounded-lg">
                  {item.status}
                </Badge>
              </div>
            </div>
          )) : (
            <p className="text-xs text-slate-400 text-center py-8">No hay partos programados.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <ImageIcon className="text-secondary" size={20} />
            Galería de Ultrasonidos Recientes
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-secondary hover:bg-secondary/10 rounded-xl">Ver Galería Completa</Button>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative aspect-video bg-slate-100 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all">
                <img 
                  src={`https://picsum.photos/seed/ultrasound${i}/400/300`} 
                  alt="Ultrasonido" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-[10px] text-white font-bold">USG Obstétrico - Paciente {i}</p>
                </div>
                <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-2xl text-secondary opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <Heart size={14} fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#004990]">Control Prenatal Semanal</p>
                <p className="text-xs text-slate-500 mt-1">8 pacientes programadas para mañana</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from '@/components/ui/button';
