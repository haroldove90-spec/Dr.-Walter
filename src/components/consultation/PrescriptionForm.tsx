import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, FileText, Share2, Download } from 'lucide-react';
import { Prescription, PrescriptionItem, Patient, Doctor, Specialty } from '@/src/types';
import { cn } from '@/lib/utils';

interface PrescriptionFormProps {
  patient: Patient;
  doctor: Doctor;
  specialty: Specialty;
  onSave: (prescription: Prescription) => void;
  onExport: (prescription: Prescription) => void;
  onShare: (prescription: Prescription) => void;
}

export function PrescriptionForm({ patient, doctor, specialty, onSave, onExport, onShare }: PrescriptionFormProps) {
  const [items, setItems] = useState<PrescriptionItem[]>([
    { medication: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  const addItem = () => {
    setItems([...items, { medication: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAction = (type: 'save' | 'export' | 'share') => {
    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: patient.id,
      doctorId: doctor.id,
      date: new Date().toISOString(),
      specialty,
      items: items.filter(item => item.medication.trim() !== '')
    };

    if (prescription.items.length === 0) {
      alert('Por favor agregue al menos un medicamento.');
      return;
    }

    if (type === 'save') onSave(prescription);
    if (type === 'export') onExport(prescription);
    if (type === 'share') onShare(prescription);
  };

  return (
    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
      <CardHeader className="bg-slate-50/50 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <FileText size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#004990]">Nueva Receta Médica</CardTitle>
              <p className="text-xs text-slate-500">Prescripción para {patient.firstName} {patient.lastName}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addItem}
            className="rounded-xl border-secondary text-secondary hover:bg-secondary hover:text-white gap-2"
          >
            <Plus size={16} />
            Agregar Medicamento
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-6 bg-slate-50 rounded-3xl space-y-4 relative group animate-in fade-in slide-in-from-top-2 duration-300">
              {items.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeItem(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 size={16} />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medicamento</Label>
                  <Input 
                    placeholder="Ej: Amoxicilina 500mg"
                    value={item.medication}
                    onChange={(e) => updateItem(index, 'medication', e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dosis</Label>
                  <Input 
                    placeholder="Ej: 1 tableta"
                    value={item.dosage}
                    onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frecuencia</Label>
                  <Input 
                    placeholder="Ej: Cada 8 horas"
                    value={item.frequency}
                    onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duración</Label>
                  <Input 
                    placeholder="Ej: 7 días"
                    value={item.duration}
                    onChange={(e) => updateItem(index, 'duration', e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-secondary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indicaciones Adicionales</Label>
                <Input 
                  placeholder="Ej: Tomar después de los alimentos"
                  value={item.instructions}
                  onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                  className="rounded-xl border-slate-200 focus-visible:ring-secondary"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={() => handleAction('save')}
            className="flex-1 rounded-2xl bg-[#004990] hover:bg-[#003d7a] shadow-lg shadow-primary/20 font-bold h-12"
          >
            Guardar en Expediente
          </Button>
          <div className="flex gap-2 flex-1">
            <Button 
              variant="outline"
              onClick={() => handleAction('export')}
              className="flex-1 rounded-2xl border-slate-200 text-slate-600 font-bold h-12 gap-2"
            >
              <Download size={18} />
              PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAction('share')}
              className="flex-1 rounded-2xl border-slate-200 text-slate-600 font-bold h-12 gap-2"
            >
              <Share2 size={18} />
              Compartir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
