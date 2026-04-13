import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Map as MapIcon, 
  RotateCcw, 
  ChevronRight,
  TrendingUp,
  Dumbbell
} from 'lucide-react';

import { Patient } from '@/src/types';

export function PhysioWidgets({ patients }: { patients: Patient[] }) {
  const physioPatients = patients.filter(p => p.history?.some(h => h.specialty === 'Fisioterapia' || h.specialty === 'Ortopedia'));
  
  const activeRehab = physioPatients
    .map(p => {
      const last = p.history?.filter(h => h.specialty === 'Fisioterapia' || h.specialty === 'Ortopedia').pop();
      return {
        name: `${p.firstName} ${p.lastName}`,
        session: last?.data?.sessionNumber || 1,
        total: 10,
        task: last?.diagnosis || 'Rehabilitación General'
      };
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <MapIcon className="text-secondary" size={20} />
            Mapa de Lesiones Activas
          </CardTitle>
          <Badge className="bg-secondary/10 text-secondary border-none rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Vista Anatómica</Badge>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full max-w-[200px] aspect-[1/2] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="text-slate-200 flex flex-col items-center">
                <Activity size={64} className="opacity-20" />
                <span className="text-[10px] font-bold uppercase mt-4 tracking-widest">Cuerpo Humano</span>
              </div>
              {/* Mock injury markers */}
              <div className="absolute top-[25%] left-[45%] w-5 h-5 bg-rose-500/40 rounded-full animate-ping" />
              <div className="absolute top-[25%] left-[45%] w-5 h-5 bg-rose-500 rounded-full border-2 border-white shadow-lg" />
              
              <div className="absolute bottom-[35%] right-[35%] w-5 h-5 bg-orange-500/40 rounded-full animate-ping" />
              <div className="absolute bottom-[35%] right-[35%] w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg" />
            </div>
            
            <div className="flex-1 space-y-6 w-full">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zonas de Mayor Incidencia</p>
              {[
                { zone: 'Lumbar', count: 12, color: 'bg-rose-500' },
                { zone: 'Rodilla', count: 8, color: 'bg-orange-500' },
                { zone: 'Hombro', count: 5, color: 'bg-secondary' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#004990]">{item.zone}</span>
                    <span className="text-slate-400">{item.count} pacientes</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${item.color} rounded-full shadow-sm`} style={{ width: `${(item.count / 15) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-[#004990] text-white rounded-[2rem] overflow-hidden shadow-xl shadow-blue-900/20">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <RotateCcw size={20} className="text-secondary" />
            Progreso de Rehabilitación
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-8">
          {activeRehab.length > 0 ? activeRehab.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] text-white/60 font-medium">{item.task}</p>
                </div>
                <p className="text-xs font-bold text-secondary">Sesión {item.session}/{item.total}</p>
              </div>
              <Progress value={(item.session / item.total) * 100} className="h-2 bg-white/10" />
            </div>
          )) : (
            <p className="text-xs text-white/40 text-center py-8">No hay rehabilitaciones activas.</p>
          )}
          <button className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4">
            <Dumbbell size={18} />
            Nueva Rutina de Ejercicios
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
