import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient, Specialty } from '@/src/types';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Partial<Patient>) => void;
  patient?: Patient | null;
}

export function PatientForm({ isOpen, onClose, onSave, patient }: PatientFormProps) {
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Femenino',
    contact: '',
    email: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Femenino',
        contact: '',
        email: '',
      });
    }
  }, [patient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#004990]">
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre</Label>
              <Input 
                id="firstName" 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="rounded-xl border-slate-100 focus-visible:ring-secondary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Apellido</Label>
              <Input 
                id="lastName" 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="rounded-xl border-slate-100 focus-visible:ring-secondary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha de Nacimiento</Label>
              <Input 
                id="dob" 
                type="date"
                value={formData.dob} 
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="rounded-xl border-slate-100 focus-visible:ring-secondary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Género</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger className="rounded-xl border-slate-100 focus:ring-secondary">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teléfono</Label>
            <Input 
              id="contact" 
              value={formData.contact} 
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="7788-0000"
              className="rounded-xl border-slate-100 focus-visible:ring-secondary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="paciente@ejemplo.com"
              className="rounded-xl border-slate-100 focus-visible:ring-secondary"
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-400">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl bg-secondary hover:bg-secondary/90 font-bold shadow-lg shadow-secondary/20">
              {patient ? 'Guardar Cambios' : 'Registrar Paciente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
