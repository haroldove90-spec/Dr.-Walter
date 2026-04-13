import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  X, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  ClipboardList
} from 'lucide-react';
import { Appointment, Patient, Specialty, ClinicConfig } from '@/src/types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CalendarViewProps {
  appointments: Appointment[];
  patients: Patient[];
  viewingSpecialty: Specialty;
  highlightedAppointmentId?: string | null;
  config: ClinicConfig;
}

export function CalendarView({ appointments, patients, viewingSpecialty, highlightedAppointmentId, config }: CalendarViewProps) {
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  // Generate hours based on config
  const startHour = parseInt(config.workflow.openingHour.split(':')[0]);
  const endHour = parseInt(config.workflow.closingHour.split(':')[0]);
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => {
    const h = i + startHour;
    return `${h < 10 ? '0' : ''}${h}:00`;
  });

  const getAppointmentForSlot = (dayIndex: number, hour: string) => {
    // This is a simplified mock calendar logic
    // In a real app, we would match by actual date and time
    const dayOffset = dayIndex - new Date().getDay() + 1;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    
    return appointments.find(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getDate() === targetDate.getDate() && 
             apt.specialty === viewingSpecialty &&
             Math.random() > 0.8; // Randomly distribute for demo
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#004990]">Agenda de Citas</h2>
          <p className="text-sm text-slate-500 mt-1">Gestión de horarios para {viewingSpecialty}</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm font-bold text-[#004990]">Abril 2024</span>
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-slate-50">
            <div className="p-4 bg-slate-50/50 border-r border-slate-50" />
            {days.map((day, i) => (
              <div 
                key={day} 
                className={cn(
                  "p-4 text-center border-r border-slate-50 last:border-r-0 bg-slate-50/50",
                  !config.workflow.workingDays.includes(i) && "opacity-40 grayscale"
                )}
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</p>
                <p className="text-sm font-bold text-[#004990] mt-1">{15 + i}</p>
              </div>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-slate-50 last:border-b-0 group">
                <div className="p-4 text-right border-r border-slate-50 bg-slate-50/20">
                  <span className="text-[10px] font-bold text-slate-400">{hour}</span>
                </div>
                {days.map((_, i) => {
                  const isWorkingDay = config.workflow.workingDays.includes(i);
                  const apt = isWorkingDay ? getAppointmentForSlot(i, hour) : null;
                  const patient = apt ? patients.find(p => p.id === apt.patientId) : null;
                  
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "p-2 border-r border-slate-50 last:border-r-0 min-h-[80px] relative group-hover:bg-slate-50/30 transition-colors",
                        !isWorkingDay && "bg-slate-100/30 pattern-diagonal-lines"
                      )}
                    >
                      {apt && patient && (
                        <div 
                          onClick={() => setSelectedApt(apt)}
                          className={cn(
                            "p-2 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all border-l-4",
                            apt.id === highlightedAppointmentId 
                              ? "bg-secondary text-white border-white ring-4 ring-secondary/20 scale-105 z-10" 
                              : "bg-secondary/10 border-secondary"
                          )}
                        >
                          <p className={cn(
                            "text-[10px] font-bold truncate",
                            apt.id === highlightedAppointmentId ? "text-white" : "text-secondary"
                          )}>{patient.firstName} {patient.lastName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={8} className={apt.id === highlightedAppointmentId ? "text-white/80" : "text-secondary"} />
                            <span className={cn(
                              "text-[8px] font-bold",
                              apt.id === highlightedAppointmentId ? "text-white/70" : "text-secondary/70"
                            )}>{hour}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-3xl bg-emerald-500 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Citas Confirmadas</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-3xl bg-blue-500 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Tiempo Promedio</p>
              <p className="text-2xl font-bold">{config.workflow.consultationDuration[viewingSpecialty]} min</p>
            </div>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-3xl bg-[#004990] text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Badge className="bg-white text-[#004990] hover:bg-white">New</Badge>
            </div>
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Nuevos Pacientes</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Appointment Detail Modal */}
      <Dialog open={!!selectedApt} onOpenChange={(open) => !open && setSelectedApt(null)}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl max-w-md p-0 overflow-hidden">
          {selectedApt && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-[#004990] p-8 text-white relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedApt(null)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <X size={20} />
                </Button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold">
                    {patients.find(p => p.id === selectedApt.patientId)?.firstName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {patients.find(p => p.id === selectedApt.patientId)?.firstName} {patients.find(p => p.id === selectedApt.patientId)?.lastName}
                    </h3>
                    <Badge className="bg-secondary text-white border-none mt-1">
                      {selectedApt.specialty}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CalendarIcon size={16} className="text-secondary" />
                      <span className="text-sm font-bold">{new Date(selectedApt.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hora</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={16} className="text-secondary" />
                      <span className="text-sm font-bold">{new Date(selectedApt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{patients.find(p => p.id === selectedApt.patientId)?.contact}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">{patients.find(p => p.id === selectedApt.patientId)?.email || 'Sin correo'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <ClipboardList size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">Motivo: Consulta de Seguimiento</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 rounded-2xl bg-[#004990] hover:bg-[#003d7a] font-bold shadow-lg shadow-primary/20">
                    Iniciar Consulta
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-2xl border-slate-200 text-slate-500 font-bold">
                    Reagendar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
