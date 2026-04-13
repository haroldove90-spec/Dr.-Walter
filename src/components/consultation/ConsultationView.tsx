import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Clock, 
  FileText, 
  Save, 
  ArrowLeft,
  Activity,
  ChevronRight,
  FileDown,
  CheckCircle2,
  History,
  TrendingUp
} from 'lucide-react';
import { SpecialtyForm } from './SpecialtyForm';
import { EvolutionChart } from './EvolutionChart';
import { Specialty, Patient, Appointment } from '@/src/types';
import { exportConsultationToPDF } from '@/src/lib/exportUtils';
import { cn } from '@/lib/utils';

interface ConsultationViewProps {
  patient: Patient;
  appointment: Appointment;
  onBack: () => void;
  onSave: (record: any) => void;
}

export function ConsultationView({ patient, appointment, onBack, onSave }: ConsultationViewProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(appointment.specialty);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [specialtyData, setSpecialtyData] = useState<any>({});

  // Simulated Auto-save
  const simulateAutoSave = useCallback(() => {
    setLastAutoSave(new Date().toLocaleTimeString());
    // In a real app, this would send data to the server
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateAutoSave, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [simulateAutoSave]);

  const handleSave = () => {
    if (!diagnosis || !treatmentPlan) {
      alert('Por favor complete el diagnóstico y el plan de tratamiento.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      onSave({
        specialty: selectedSpecialty,
        diagnosis,
        treatmentPlan,
        data: specialtyData
      });
      setTimeout(() => {
        setSaved(false);
        onBack();
      }, 1500);
    }, 1500);
  };

  const handleExportPDF = () => {
    exportConsultationToPDF(patient, appointment, {
      diagnosis,
      treatmentPlan,
      ...specialtyData
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-zinc-900">Consulta Actual</h2>
            <div className="flex items-center gap-2 text-xs lg:text-sm text-zinc-500 mt-1">
              <span>Expediente #2024-089</span>
              <ChevronRight size={14} />
              <span className="font-medium text-blue-600">{appointment.specialty}</span>
              {lastAutoSave && (
                <>
                  <Separator orientation="vertical" className="h-3 mx-1" />
                  <span className="text-[10px] text-zinc-400 italic">Auto-guardado: {lastAutoSave}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none" onClick={handleExportPDF}>
            <FileDown size={18} className="mr-2" />
            PDF
          </Button>
          <Button 
            className={cn(
              "flex-1 md:flex-none transition-all duration-300",
              saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
            )}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : saved ? (
              <CheckCircle2 size={18} className="mr-2" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {saved ? 'Guardado' : 'Finalizar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Info & Evolution */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg truncate">{patient.firstName} {patient.lastName}</CardTitle>
                  <CardDescription>{patient.gender}, {new Date().getFullYear() - new Date(patient.dob).getFullYear()} años</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-2">
                  <Clock size={14} /> Última visita
                </span>
                <span className="font-medium">15 Mar, 2024</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-2">
                  <Activity size={14} /> Alergias
                </span>
                <Badge variant="destructive" className="text-[10px] uppercase">Penicilina</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Antecedentes</p>
                <p className="text-sm text-zinc-600">Hipertensión controlada, Diabetes Tipo 2.</p>
              </div>
            </CardContent>
          </Card>

          {/* Evolution Chart Card */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                Evolución del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EvolutionChart 
                history={patient.history || []} 
                type={selectedSpecialty === 'Nutrición' ? 'weight' : 'pain'} 
              />
              <div className="mt-4 flex justify-center">
                <Badge variant="outline" className="text-[10px] font-normal text-zinc-400">
                  {selectedSpecialty === 'Nutrición' ? 'Seguimiento de Peso (kg)' : 'Seguimiento de Dolor (EVA)'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <History size={16} className="text-zinc-400" />
                Consultas Previas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-50">
                {(patient.history || []).slice().reverse().map((record) => {
                  const isRelevant = record.specialty === selectedSpecialty;
                  return (
                    <div 
                      key={record.id} 
                      className={cn(
                        "p-4 hover:bg-zinc-50 transition-colors cursor-pointer group border-l-2",
                        isRelevant ? "border-blue-500 bg-blue-50/30" : "border-transparent"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-zinc-900">{new Date(record.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <Badge variant={isRelevant ? "default" : "outline"} className="text-[9px] px-1 h-4 font-normal">
                          {record.specialty}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 group-hover:line-clamp-none transition-all">{record.diagnosis}</p>
                    </div>
                  );
                })}
                {(!patient.history || patient.history.length === 0) && (
                  <div className="p-8 text-center">
                    <p className="text-xs text-zinc-400 italic">No hay historial previo.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-zinc-100 px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Expediente Clínico</CardTitle>
                  <CardDescription>Complete la evolución del paciente</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-lg border border-zinc-100">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase px-2">Módulo</span>
                  <select 
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value as Specialty)}
                    className="text-xs font-bold bg-white border border-zinc-200 rounded-md px-2 py-1 focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="Médico General">Médico General</option>
                    <option value="Psicología">Psicología</option>
                    <option value="Nutrición">Nutrición</option>
                    <option value="Ortopedia">Ortopedia</option>
                    <option value="Ginecología">Ginecología</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Cirugía General">Cirugía General</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="mb-8">
                <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                  Signos Vitales
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Presión Art.</p>
                    <p className="text-lg font-bold">120/80</p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Frec. Card.</p>
                    <p className="text-lg font-bold">72 <span className="text-xs font-normal">bpm</span></p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Temp.</p>
                    <p className="text-lg font-bold">36.5 <span className="text-xs font-normal">°C</span></p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Saturación</p>
                    <p className="text-lg font-bold">98 <span className="text-xs font-normal">%</span></p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                  Evaluación de Especialidad: {selectedSpecialty}
                </h3>
                
                <SpecialtyForm specialty={selectedSpecialty} onChange={setSpecialtyData} />
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                  Diagnóstico y Plan
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    Diagnóstico Principal (CIE-10) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Buscar diagnóstico..." 
                    className="bg-zinc-50 border-zinc-200" 
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    Plan de Tratamiento / Receta <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full min-h-[120px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Indique medicamentos, dosis y duración..." 
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
