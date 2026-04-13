import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Specialty } from '@/src/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface SpecialtyFormProps {
  specialty: Specialty;
  onChange?: (data: any) => void;
}

export function SpecialtyForm({ specialty, onChange }: SpecialtyFormProps) {
  // Nutrition States
  const [nutritionData, setNutritionData] = useState({
    weight: '',
    height: '',
    bmi: null as number | null,
    tricepsFold: '',
    subscapularFold: '',
    fatPercentage: '',
    muscleMass: '',
    observations: ''
  });

  // Psychology States
  const [psychologyData, setPsychologyData] = useState({
    reason: '',
    sessionNotes: '',
    mood: '',
    riskLevel: 'Bajo'
  });

  // Gynecology States
  const [gynecologyData, setGynecologyData] = useState({
    gesta: '',
    para: '',
    cesarea: '',
    abortos: '',
    fur: '',
    fpp: '',
    findings: ''
  });

  // Physio States
  const [physioData, setPhysioData] = useState({
    areas: [] as string[],
    eva: 5,
    mechanism: ''
  });

  // General States
  const [generalData, setGeneralData] = useState({
    notes: '',
    referral: ''
  });

  // Surgery States
  const [surgeryData, setSurgeryData] = useState({
    procedure: '',
    risk: 'Bajo',
    preOpNotes: ''
  });

  useEffect(() => {
    if (specialty === 'Nutrición') {
      const w = parseFloat(nutritionData.weight);
      const h = parseFloat(nutritionData.height) / 100;
      if (w && h > 0) {
        const bmiVal = parseFloat((w / (h * h)).toFixed(1));
        setNutritionData(prev => ({ ...prev, bmi: bmiVal }));
      }
    }
  }, [nutritionData.weight, nutritionData.height, specialty]);

  useEffect(() => {
    const data = {
      'Nutrición': nutritionData,
      'Psicología': psychologyData,
      'Ginecología': gynecologyData,
      'Fisioterapia': physioData,
      'Ortopedia': physioData,
      'Cirugía General': surgeryData,
      'Médico General': generalData
    }[specialty];
    onChange?.(data);
  }, [nutritionData, psychologyData, gynecologyData, physioData, generalData, surgeryData, specialty, onChange]);

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: 'Bajo Peso', color: 'bg-blue-100 text-blue-700' };
    if (val < 25) return { label: 'Normal', color: 'bg-emerald-100 text-emerald-700' };
    if (val < 30) return { label: 'Sobrepeso', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Obesidad', color: 'bg-red-100 text-red-700' };
  };

  switch (specialty) {
    case 'Nutrición':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Peso (kg) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                value={nutritionData.weight} 
                onChange={(e) => setNutritionData(prev => ({ ...prev, weight: e.target.value }))} 
                placeholder="0.0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Estatura (cm) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                value={nutritionData.height} 
                onChange={(e) => setNutritionData(prev => ({ ...prev, height: e.target.value }))} 
                placeholder="0" 
              />
            </div>
            <div className="space-y-2">
              <Label>IMC Calculado</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={nutritionData.bmi || ''} placeholder="---" className="bg-zinc-50 font-bold" />
                {nutritionData.bmi && (
                  <Badge className={getBMICategory(nutritionData.bmi).color + " border-none whitespace-nowrap"}>
                    {getBMICategory(nutritionData.bmi).label}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-zinc-400">Pliegue Tricipital</Label>
              <Input 
                type="number" 
                placeholder="mm" 
                className="bg-white" 
                value={nutritionData.tricepsFold}
                onChange={(e) => setNutritionData(prev => ({ ...prev, tricepsFold: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-zinc-400">Pliegue Subesc.</Label>
              <Input 
                type="number" 
                placeholder="mm" 
                className="bg-white" 
                value={nutritionData.subscapularFold}
                onChange={(e) => setNutritionData(prev => ({ ...prev, subscapularFold: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-zinc-400">% Grasa</Label>
              <Input 
                type="number" 
                placeholder="%" 
                className="bg-white" 
                value={nutritionData.fatPercentage}
                onChange={(e) => setNutritionData(prev => ({ ...prev, fatPercentage: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-zinc-400">Masa Muscular</Label>
              <Input 
                type="number" 
                placeholder="kg" 
                className="bg-white" 
                value={nutritionData.muscleMass}
                onChange={(e) => setNutritionData(prev => ({ ...prev, muscleMass: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observaciones Dietéticas</Label>
            <textarea 
              className="w-full min-h-[100px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Describa los hábitos del paciente..." 
              value={nutritionData.observations}
              onChange={(e) => setNutritionData(prev => ({ ...prev, observations: e.target.value }))}
            />
          </div>
        </div>
      );
    case 'Ginecología':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <Label className="text-xs font-bold text-zinc-500 uppercase mb-4 block">Antecedentes Gineco-Obstétricos</Label>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Gesta</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-white" 
                  value={gynecologyData.gesta}
                  onChange={(e) => setGynecologyData(prev => ({ ...prev, gesta: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Para</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-white" 
                  value={gynecologyData.para}
                  onChange={(e) => setGynecologyData(prev => ({ ...prev, para: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cesárea</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-white" 
                  value={gynecologyData.cesarea}
                  onChange={(e) => setGynecologyData(prev => ({ ...prev, cesarea: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Abortos</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-white" 
                  value={gynecologyData.abortos}
                  onChange={(e) => setGynecologyData(prev => ({ ...prev, abortos: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Fecha Última Regla (FUR)</Label>
              <Input 
                type="date" 
                value={gynecologyData.fur}
                onChange={(e) => setGynecologyData(prev => ({ ...prev, fur: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha Probable de Parto (FPP)</Label>
              <Input 
                type="date" 
                className="bg-blue-50 border-blue-100" 
                value={gynecologyData.fpp}
                onChange={(e) => setGynecologyData(prev => ({ ...prev, fpp: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hallazgos en Exploración / Papanicolaou</Label>
            <textarea 
              className="w-full min-h-[100px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={gynecologyData.findings}
              onChange={(e) => setGynecologyData(prev => ({ ...prev, findings: e.target.value }))}
            />
          </div>
        </div>
      );
    case 'Fisioterapia':
    case 'Ortopedia':
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4">
            <Label className="text-sm font-bold">Áreas de Dolor / Afectación</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Cervical', 'Lumbar', 'Hombro', 'Rodilla', 'Tobillo', 'Muñeca'].map((area) => (
                <div key={area} className="flex items-center space-x-2 p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <Checkbox 
                    id={area} 
                    checked={physioData.areas.includes(area)}
                    onCheckedChange={(checked) => {
                      setPhysioData(prev => ({
                        ...prev,
                        areas: checked 
                          ? [...prev.areas, area] 
                          : prev.areas.filter(a => a !== area)
                      }));
                    }}
                  />
                  <label htmlFor={area} className="text-sm font-medium leading-none cursor-pointer">{area}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold">Escala Visual Analógica (EVA)</Label>
              <Badge className="bg-rose-500 text-white border-none">Nivel de Dolor: {physioData.eva}</Badge>
            </div>
            <div className="space-y-6">
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                value={physioData.eva}
                onChange={(e) => setPhysioData(prev => ({ ...prev, eva: parseInt(e.target.value) }))}
              />
              <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase px-1">
                <span>Sin Dolor (1)</span>
                <span>Moderado (5)</span>
                <span>Inoportable (10)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mecanismo de Lesión y Limitación Funcional</Label>
            <textarea 
              className="w-full min-h-[100px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={physioData.mechanism}
              onChange={(e) => setPhysioData(prev => ({ ...prev, mechanism: e.target.value }))}
            />
          </div>
        </div>
      );
    case 'Psicología':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">Motivo de Consulta <span className="text-red-500">*</span></Label>
            <textarea 
              className="w-full min-h-[80px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="¿Por qué acude el paciente hoy?" 
              value={psychologyData.reason}
              onChange={(e) => setPsychologyData(prev => ({ ...prev, reason: e.target.value }))}
            />
          </div>
          
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-zinc-400 font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Notas de Sesión (Protegidas)
              </Label>
              <Badge variant="outline" className="text-zinc-500 border-zinc-700 text-[10px]">Cifrado de Extremo a Extremo</Badge>
            </div>
            <textarea 
              className="w-full min-h-[200px] bg-zinc-800 border-none rounded-xl p-4 text-zinc-200 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none" 
              placeholder="Escriba aquí las notas detalladas de la sesión..."
              value={psychologyData.sessionNotes}
              onChange={(e) => setPsychologyData(prev => ({ ...prev, sessionNotes: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado de Ánimo</Label>
              <Input 
                placeholder="Ej: Eutímico, Ansioso..." 
                value={psychologyData.mood}
                onChange={(e) => setPsychologyData(prev => ({ ...prev, mood: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nivel de Riesgo</Label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-zinc-200 text-sm bg-white"
                value={psychologyData.riskLevel}
                onChange={(e) => setPsychologyData(prev => ({ ...prev, riskLevel: e.target.value }))}
              >
                <option>Bajo</option>
                <option>Moderado</option>
                <option>Alto</option>
              </select>
            </div>
          </div>
        </div>
      );
    case 'Cirugía General':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Procedimiento Quirúrgico Propuesto</Label>
            <Input 
              placeholder="Ej: Colecistectomía Laparoscópica" 
              value={surgeryData.procedure}
              onChange={(e) => setSurgeryData(prev => ({ ...prev, procedure: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Riesgo Quirúrgico</Label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-zinc-200 text-sm bg-white"
                value={surgeryData.risk}
                onChange={(e) => setSurgeryData(prev => ({ ...prev, risk: e.target.value }))}
              >
                <option>Bajo</option>
                <option>Medio</option>
                <option>Alto</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notas Pre-Operatorias</Label>
            <textarea 
              className="w-full min-h-[100px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Indicaciones especiales..." 
              value={surgeryData.preOpNotes}
              onChange={(e) => setSurgeryData(prev => ({ ...prev, preOpNotes: e.target.value }))}
            />
          </div>
        </div>
      );
    case 'Médico General':
    default:
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Notas de Evolución General</Label>
            <textarea 
              className="w-full min-h-[150px] p-3 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Describa la evolución del paciente..." 
              value={generalData.notes}
              onChange={(e) => setGeneralData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Referencia a Especialidad (Opcional)</Label>
            <Input 
              placeholder="Ej: Referir a Nutrición por IMC elevado" 
              value={generalData.referral}
              onChange={(e) => setGeneralData(prev => ({ ...prev, referral: e.target.value }))}
            />
          </div>
        </div>
      );
  }
}
