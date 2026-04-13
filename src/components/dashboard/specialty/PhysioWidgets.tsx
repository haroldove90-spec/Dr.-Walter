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
      const rehab = last?.data?.rehabPlan;
      return {
        name: `${p.firstName} ${p.lastName}`,
        session: rehab?.sessionsCompleted || 1,
        total: rehab?.sessionsTotal || 10,
        task: rehab?.diagnosis || last?.diagnosis || 'Rehabilitación General',
        evaInitial: rehab?.evaInitial || 8,
        evaCurrent: rehab?.evaCurrent || 5,
        mobility: rehab?.mobilityDegrees
      };
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <Activity className="text-secondary" size={20} />
            Control de Dolor y Movilidad
          </CardTitle>
          <Badge className="bg-secondary/10 text-secondary border-none rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Progreso Clínico</Badge>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escala de Dolor (EVA)</p>
              {activeRehab.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#004990]">{item.name}</span>
                    <span className="text-slate-400">EVA: {item.evaInitial} → {item.evaCurrent}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-400 opacity-30" style={{ width: `${item.evaInitial * 10}%` }} />
                    <div className="h-full bg-emerald-500 -ml-[100%] transition-all duration-1000" style={{ width: `${item.evaCurrent * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arcos de Movilidad</p>
              {activeRehab.filter(r => r.mobility).map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#004990]">{item.mobility?.joint}</span>
                    <Badge className="bg-secondary text-white border-none text-[9px] font-bold">+{item.mobility!.current - item.mobility!.initial}°</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Inicial</p>
                      <p className="text-lg font-bold text-slate-600">{item.mobility?.initial}°</p>
                    </div>
                    <ChevronRight className="text-slate-300" size={16} />
                    <div className="flex-1 text-center">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Actual</p>
                      <p className="text-lg font-bold text-secondary">{item.mobility?.current}°</p>
                    </div>
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
            Sesiones de Rehab
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-8">
          {activeRehab.length > 0 ? activeRehab.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] text-white/60 font-medium truncate max-w-[150px]">{item.task}</p>
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
            Nueva Rutina
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
