import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Doctor, Specialty, ClinicConfig } from '@/src/types';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Save, 
  RotateCcw, 
  Building2, 
  GraduationCap, 
  FileSignature, 
  Clock, 
  User, 
  Shield, 
  Moon, 
  Sun, 
  Smartphone, 
  Download,
  Bell,
  Settings2,
  Globe,
  Calendar,
  CheckCircle2,
  Trash2,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsPageProps {
  doctor: Doctor;
  config: ClinicConfig;
  onUpdateDoctor: (updatedDoctor: Doctor) => void;
  onUpdateConfig: (updatedConfig: ClinicConfig) => void;
  onReset: () => void;
  onInstall: () => void;
  deferredPrompt: any;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

export function SettingsPage({ 
  doctor, 
  config, 
  onUpdateDoctor, 
  onUpdateConfig, 
  onReset, 
  onInstall, 
  deferredPrompt,
  setToast
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [doctorForm, setDoctorForm] = useState<Doctor>(doctor);
  const [configForm, setConfigForm] = useState<ClinicConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync with props if they change
  useEffect(() => {
    setDoctorForm(doctor);
  }, [doctor]);

  useEffect(() => {
    setConfigForm(config);
  }, [config]);

  // Signature Canvas Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setDoctorForm(prev => ({ ...prev, signatureUrl: canvas.toDataURL() }));
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#004990';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDoctorForm(prev => ({ ...prev, signatureUrl: '' }));
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setDoctorForm(prev => ({ ...prev, signatureUrl: base64 }));
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateDoctor(doctorForm);
      onUpdateConfig(configForm);
      setIsSaving(false);
      setShowSuccess(true);
      setToast({ message: 'Configuración guardada con éxito', type: 'success' });
      setTimeout(() => {
        setShowSuccess(false);
        setToast(null);
      }, 3000);
    }, 800);
  };

  const updateConfig = (path: string, value: any) => {
    const keys = path.split('.');
    setConfigForm(prev => {
      const next = { ...prev };
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const toggleWorkingDay = (day: number) => {
    const current = configForm.workflow.workingDays;
    const next = current.includes(day) 
      ? current.filter(d => d !== day)
      : [...current, day].sort();
    updateConfig('workflow.workingDays', next);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004990]">Configuración</h2>
          <p className="text-slate-500 mt-1">Personalice su consultorio y preferencias operativas</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 gap-2"
          >
            <RotateCcw size={18} />
            Reset Demo
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "rounded-2xl shadow-lg gap-2 px-6 transition-all duration-300",
              showSuccess ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-secondary hover:bg-secondary/90 shadow-secondary/20"
            )}
          >
            {isSaving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )}
            {showSuccess ? 'Guardado' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-2xl w-full md:w-auto grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="profile" className="rounded-xl py-2.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#004990] data-[state=active]:shadow-sm">
            <User size={14} className="mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-xl py-2.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#004990] data-[state=active]:shadow-sm">
            <Clock size={14} className="mr-2" />
            Flujo de Trabajo
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl py-2.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#004990] data-[state=active]:shadow-sm">
            <Bell size={14} className="mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-xl py-2.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#004990] data-[state=active]:shadow-sm">
            <Settings2 size={14} className="mr-2" />
            Preferencias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                      {doctorForm.photoUrl ? (
                        <img src={doctorForm.photoUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User size={64} className="text-slate-300" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                    >
                      <Camera size={20} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setDoctorForm(prev => ({ ...prev, photoUrl: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </div>
                  <div className="text-center mt-6">
                    <h3 className="text-xl font-bold text-[#004990]">Dr. {doctorForm.firstName} {doctorForm.lastName}</h3>
                    <p className="text-sm font-medium text-secondary uppercase tracking-wider mt-1">{doctorForm.specialty}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSignature size={16} className="text-secondary" />
                      Firma Digital
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => signatureInputRef.current?.click()} className="h-6 text-[10px] text-secondary hover:bg-secondary/5">Subir</Button>
                      <Button variant="ghost" size="sm" onClick={clearSignature} className="h-6 text-[10px] text-rose-500 hover:bg-rose-50">Limpiar</Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="w-full h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative">
                    <canvas 
                      ref={canvasRef}
                      width={300}
                      height={128}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full cursor-crosshair"
                    />
                    {!doctorForm.signatureUrl && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <Upload size={32} className="text-slate-300" />
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Dibuje o suba su firma</p>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={signatureInputRef} className="hidden" accept="image/*" onChange={handleSignatureUpload} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem]">
                <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-xl font-bold text-[#004990]">Información Profesional</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre(s)</Label>
                      <Input 
                        value={doctorForm.firstName} 
                        onChange={(e) => setDoctorForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="rounded-xl border-slate-100 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Apellido(s)</Label>
                      <Input 
                        value={doctorForm.lastName} 
                        onChange={(e) => setDoctorForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="rounded-xl border-slate-100 h-12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Especialidad</Label>
                      <Select value={doctorForm.specialty} onValueChange={(v: Specialty) => setDoctorForm(prev => ({ ...prev, specialty: v }))}>
                        <SelectTrigger className="rounded-xl border-slate-100 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Médico General">Médico General</SelectItem>
                          <SelectItem value="Psicología">Psicología</SelectItem>
                          <SelectItem value="Nutrición">Nutrición</SelectItem>
                          <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                          <SelectItem value="Ginecología">Ginecología</SelectItem>
                          <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                          <SelectItem value="Cirugía General">Cirugía General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cédula Profesional</Label>
                      <Input 
                        value={doctorForm.licenseNumber || ''} 
                        onChange={(e) => setDoctorForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                        className="rounded-xl border-slate-100 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Universidad</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <Input 
                        value={doctorForm.university || ''} 
                        onChange={(e) => setDoctorForm(prev => ({ ...prev, university: e.target.value }))}
                        className="rounded-xl border-slate-100 h-12 pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem]">
                <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                    <Calendar size={20} className="text-secondary" />
                    Horarios y Disponibilidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Días Laborales</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, i) => (
                        <button
                          key={day}
                          onClick={() => toggleWorkingDay(i)}
                          className={cn(
                            "w-12 h-12 rounded-2xl font-bold text-xs transition-all",
                            configForm.workflow.workingDays.includes(i)
                              ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                              : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hora de Apertura</Label>
                      <Input 
                        type="time"
                        value={configForm.workflow.openingHour}
                        onChange={(e) => updateConfig('workflow.openingHour', e.target.value)}
                        className="rounded-xl border-slate-100 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hora de Cierre</Label>
                      <Input 
                        type="time"
                        value={configForm.workflow.closingHour}
                        onChange={(e) => updateConfig('workflow.closingHour', e.target.value)}
                        className="rounded-xl border-slate-100 h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem]">
                <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                    <Clock size={20} className="text-secondary" />
                    Duración de Consultas
                  </CardTitle>
                  <CardDescription>Configure el tiempo promedio por especialidad</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(configForm.workflow.consultationDuration).map(([spec, duration]) => (
                      <div key={spec} className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{spec}</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            value={duration}
                            onChange={(e) => updateConfig(`workflow.consultationDuration.${spec}`, parseInt(e.target.value))}
                            className="rounded-xl border-slate-100 h-12"
                          />
                          <span className="text-xs font-bold text-slate-400">min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm rounded-[2rem] bg-[#004990] text-white">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Settings2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Optimización de Agenda</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Estos ajustes afectan directamente la visualización de su calendario y la disponibilidad de citas para sus pacientes.
                  </p>
                  <div className="pt-4">
                    <Badge className="bg-emerald-500 text-white border-none">Sugerencia</Badge>
                    <p className="text-xs mt-2 text-white/60 italic">
                      "Psicología suele requerir 50-60 min, mientras que Medicina General 15-20 min."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm rounded-[2rem]">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                  <Bell size={20} className="text-secondary" />
                  Alertas de Agenda
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Antelación de Notificación</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[5, 15, 30].map(min => (
                      <button
                        key={min}
                        onClick={() => updateConfig('notifications.agendaAlerts', min)}
                        className={cn(
                          "py-3 rounded-2xl font-bold text-sm transition-all border-2",
                          configForm.notifications.agendaAlerts === min
                            ? "bg-secondary/10 border-secondary text-secondary"
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {min} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-[#004990]">Recordatorios Automáticos</p>
                    <p className="text-[10px] text-slate-500">Enviar WhatsApp/Correo al paciente</p>
                  </div>
                  <Switch 
                    checked={configForm.notifications.autoReminders}
                    onCheckedChange={(v) => updateConfig('notifications.autoReminders', v)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-[#004990]">Alertas de Seguimiento</p>
                    <p className="text-[10px] text-slate-500">Revisión de laboratorios y crónicos</p>
                  </div>
                  <Switch 
                    checked={configForm.notifications.followUpAlerts}
                    onCheckedChange={(v) => updateConfig('notifications.followUpAlerts', v)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 px-8 py-6">
                  <CardTitle className="text-base font-bold text-[#004990]">Vista Previa de Notificación</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4 animate-bounce">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shrink-0">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Próxima Cita</p>
                      <p className="text-xs text-slate-500 mt-0.5">Antonio Guidos en {configForm.notifications.agendaAlerts} minutos.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm rounded-[2rem]">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                  <Globe size={20} className="text-secondary" />
                  Interfaz y Región
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Idioma del Sistema</Label>
                  <Select 
                    value={configForm.preferences.language} 
                    onValueChange={(v: 'es' | 'en') => updateConfig('preferences.language', v)}
                  >
                    <SelectTrigger className="rounded-xl border-slate-100 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="es">Español (Latinoamérica)</SelectItem>
                      <SelectItem value="en">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {configForm.preferences.theme === 'light' ? <Sun className="text-orange-500" /> : <Moon className="text-blue-500" />}
                    <div>
                      <p className="text-sm font-bold text-[#004990]">Tema Visual</p>
                      <p className="text-[10px] text-slate-500">Modo Claro / Oscuro</p>
                    </div>
                  </div>
                  <Switch 
                    checked={configForm.preferences.theme === 'dark'}
                    onCheckedChange={(v) => updateConfig('preferences.theme', v ? 'dark' : 'light')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2rem]">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                  <Smartphone size={20} className="text-secondary" />
                  Acceso Nativo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm mx-auto flex items-center justify-center text-secondary">
                    <Download size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#004990]">Instalar Clínica Guidos</h4>
                    <p className="text-xs text-slate-500 mt-1">Acceda instantáneamente desde su pantalla de inicio sin usar el navegador.</p>
                  </div>
                  <Button 
                    onClick={onInstall}
                    disabled={!deferredPrompt}
                    className="w-full rounded-2xl bg-[#004990] hover:bg-[#003d7a] shadow-lg shadow-primary/20 font-bold h-12"
                  >
                    {deferredPrompt ? 'Instalar Aplicación' : 'Ya Instalado / No Disponible'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
