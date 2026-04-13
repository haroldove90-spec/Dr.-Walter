import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Bed
} from 'lucide-react';

import { Patient } from '@/src/types';

export function SurgeryWidgets({ patients }: { patients: Patient[] }) {
  const surgeryPatients = patients.filter(p => p.history?.some(h => h.specialty === 'Cirugía General' || h.specialty === 'Médico General'));
  
  const scheduledSurgeries = surgeryPatients
    .filter(p => {
      const last = p.history?.filter(h => h.specialty === 'Cirugía General').pop();
      return last?.data?.surgerySchedule;
    })
    .map(p => {
      const last = p.history?.filter(h => h.specialty === 'Cirugía General').pop();
      const schedule = last?.data?.surgerySchedule;
      return {
        name: `${p.firstName} ${p.lastName}`,
        proc: schedule?.procedure || last?.diagnosis || 'Cirugía Menor',
        date: schedule?.startTime || 'Por definir',
        surgeon: schedule?.surgeon || 'Dr. Walter Guidos',
        room: 'Q1',
        materials: schedule?.materialsStatus || 'Completo',
        status: 'Confirmado'
      };
    })
    .slice(0, 3);

  const hospitalized = surgeryPatients
    .filter(p => {
      const last = p.history?.filter(h => h.specialty === 'Cirugía General').pop();
      return last?.data?.hospitalizationNeeded;
    })
    .map((p, i) => ({
      name: `${p.firstName} ${p.lastName}`,
      bed: `20${i + 1}`,
      condition: 'Estable'
    }))
    .slice(0, 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-0">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <ClipboardList className="text-secondary" size={20} />
            Programación Quirúrgica
          </CardTitle>
          <Badge className="bg-secondary/10 text-secondary border-none rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Semana Actual</Badge>
        </CardHeader>
        <CardContent className="p-8">
          <div className="overflow-x-auto rounded-3xl border border-slate-50">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Paciente</th>
                  <th className="px-6 py-4 text-left">Procedimiento / Cirujano</th>
                  <th className="px-6 py-4 text-left">Hora</th>
                  <th className="px-6 py-4 text-left">Materiales</th>
                  <th className="px-6 py-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {scheduledSurgeries.length > 0 ? scheduledSurgeries.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#004990]">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Q1</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 font-bold">{item.proc}</p>
                      <p className="text-[10px] text-secondary font-medium">{item.surgeon}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} className="text-secondary" />
                        <span className="text-xs font-bold text-slate-600">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${item.materials === 'Completo' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-orange-200 text-orange-600 bg-orange-50'}`}>
                        {item.materials}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge className="bg-blue-100 text-blue-700 border-none text-[9px] font-bold px-2 py-0.5 rounded-lg">
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-xs">No hay cirugías programadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <Bed className="text-secondary" size={20} />
            Hospitalización
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-3xl text-center border border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Camas Ocupadas</p>
              <p className="text-2xl font-bold text-[#004990] mt-1">{hospitalized.length}/6</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-3xl text-center border border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Altas Hoy</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">2</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Pacientes en Piso</p>
            {hospitalized.length > 0 ? hospitalized.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md hover:shadow-slate-200/50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-bold shadow-sm text-secondary">
                    {item.bed}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">No hay pacientes hospitalizados.</p>
            )}
          </div>
          
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
            <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
              <strong>Aviso:</strong> El Quirófano 1 estará en mantenimiento preventivo mañana de 06:00 a 08:00.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
