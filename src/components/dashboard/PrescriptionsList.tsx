import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pill, 
  FileDown, 
  Share2, 
  Search,
  Calendar,
  User
} from 'lucide-react';
import { Patient, Prescription } from '@/src/types';
import { exportPrescriptionToPDF, sharePrescription } from '@/src/lib/exportUtils';

interface PrescriptionsListProps {
  patients: Patient[];
}

export function PrescriptionsList({ patients }: PrescriptionsListProps) {
  const allPrescriptions = patients.flatMap(p => 
    (p.history || []).flatMap(h => 
      (h.prescriptions || []).map(rx => ({
        ...rx,
        patientName: `${p.firstName} ${p.lastName}`,
        patient: p
      }))
    )
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#004990]">Historial de Recetas</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar receta..." 
              className="pl-10 pr-4 py-2 bg-white border-none shadow-sm rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allPrescriptions.length > 0 ? allPrescriptions.map((rx, idx) => (
          <Card key={idx} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#004990]">
                    <Pill size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{rx.patientName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{rx.specialty}</span>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <Calendar size={12} />
                        {new Date(rx.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-4">
                  <div className="flex flex-wrap gap-2">
                    {rx.items.map((item, i) => (
                      <Badge key={i} variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 text-[10px] font-medium">
                        {item.medication}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl text-slate-400 hover:text-secondary hover:bg-blue-50"
                    onClick={() => exportPrescriptionToPDF(rx.patient, rx)}
                  >
                    <FileDown size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                    onClick={() => sharePrescription(rx.patient, rx)}
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">No se han emitido recetas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
