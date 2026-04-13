import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Brain, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  Activity
} from 'lucide-react';

import { Patient } from '@/src/types';

export function PsychologyWidgets({ patients }: { patients: Patient[] }) {
  const psychologyPatients = patients.filter(p => p.history?.some(h => h.specialty === 'Psicología'));
  
  const allRecords = psychologyPatients.flatMap(p => p.history || []).filter(h => h.specialty === 'Psicología');
  
  const avgHamilton = allRecords.length > 0 
    ? Math.round(allRecords.reduce((acc, h) => acc + (h.data?.hamiltonScore || 0), 0) / allRecords.length)
    : 0;
    
  const avgBeck = allRecords.length > 0
    ? Math.round(allRecords.reduce((acc, h) => acc + (h.data?.beckScore || 0), 0) / allRecords.length)
    : 0;

  const criticalCases = psychologyPatients
    .filter(p => {
      const last = p.history?.filter(h => h.specialty === 'Psicología').pop();
      return (last?.data?.hamiltonScore || 0) > 20 || (last?.data?.beckScore || 0) > 20;
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
            <ShieldCheck className="text-secondary" size={20} />
            Modo de Privacidad Activo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4 border border-slate-100">
            <div className="p-3 bg-white rounded-2xl text-secondary shadow-sm">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#004990]">Notas de Sesión Protegidas</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Todas las notas clínicas de esta especialidad están cifradas y solo son visibles para el profesional a cargo.
              </p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-secondary/30 cursor-pointer transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Escala Hamilton (Ansiedad)</p>
                <Activity size={16} className="text-secondary group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-bold text-[#004990]">{avgHamilton} <span className="text-xs font-medium text-slate-400">Promedio</span></p>
              <Badge className={`mt-3 border-none rounded-lg px-2 py-0.5 text-[10px] ${avgHamilton > 17 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {avgHamilton > 24 ? 'Severa' : avgHamilton > 17 ? 'Moderada' : 'Leve'}
              </Badge>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-secondary/30 cursor-pointer transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test de Beck (Depresión)</p>
                <Brain size={16} className="text-secondary group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-bold text-[#004990]">{avgBeck} <span className="text-xs font-medium text-slate-400">Promedio</span></p>
              <Badge className={`mt-3 border-none rounded-lg px-2 py-0.5 text-[10px] ${avgBeck > 18 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {avgBeck > 29 ? 'Severa' : avgBeck > 18 ? 'Moderada' : 'Leve'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-500" />
            Seguimiento Crítico
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-4">
          {criticalCases.length > 0 ? criticalCases.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50">
              <span className="text-sm font-bold text-slate-700">{p.firstName} {p.lastName}</span>
              <Badge className="bg-rose-100 text-rose-700 border-none text-[9px] font-bold px-2 py-0.5 rounded-lg">Riesgo</Badge>
            </div>
          )) : (
            <p className="text-xs text-slate-400 text-center py-8">No hay casos críticos detectados.</p>
          )}
          <Button variant="outline" className="w-full h-12 rounded-2xl text-xs font-bold gap-2 border-slate-200 text-slate-600 hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm">
            <FileText size={16} />
            Protocolos de Crisis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
