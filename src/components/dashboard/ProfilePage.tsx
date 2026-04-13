import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Doctor, Specialty } from '@/src/types';
import { Badge } from '@/components/ui/badge';
import { Camera, Save, RotateCcw, Building2, GraduationCap, FileSignature, Clock, User, Shield, Moon, Sun, Smartphone, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface ProfilePageProps {
  doctor: Doctor;
  onUpdate: (updatedDoctor: Doctor) => void;
  onReset: () => void;
  onThemeToggle: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
  onInstall: () => void;
  deferredPrompt: any;
}

export function ProfilePage({ doctor, onUpdate, onReset, onThemeToggle, currentTheme, onInstall, deferredPrompt }: ProfilePageProps) {
  const [formData, setFormData] = useState<Doctor>(doctor);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setFormData(prev => ({ ...prev, signatureUrl: canvas.toDataURL() }));
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
      setFormData(prev => ({ ...prev, signatureUrl: '' }));
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, signatureUrl: base64 }));
        
        // Also draw it on canvas if possible
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSpecialtyChange = (value: Specialty) => {
    setFormData(prev => ({ ...prev, specialty: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'signatureUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(formData);
      setIsSaving(false);
      // Show success toast or feedback if available
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004990]">Mi Perfil Profesional</h2>
          <p className="text-slate-500 mt-1">Gestione su identidad y configuración del consultorio</p>
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
            onClick={handleSubmit}
            disabled={isSaving}
            className="rounded-2xl bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20 gap-2 px-6"
          >
            {isSaving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photo & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'photoUrl')}
                />
              </div>
              
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-[#004990]">Dr. {formData.firstName} {formData.lastName}</h3>
                <p className="text-sm font-medium text-secondary uppercase tracking-wider mt-1">{formData.specialty}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-500 border-slate-100">
                    ID: {formData.id}
                  </Badge>
                  <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100">
                    {formData.role.toUpperCase()}
                  </Badge>
                </div>
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
                {!formData.signatureUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <FileSignature size={32} className="text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Dibuje o suba su firma</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={signatureInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleSignatureUpload}
              />
              <p className="text-[10px] text-slate-400 mt-4 text-center italic">Esta firma se incluirá automáticamente en sus recetas PDF.</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={16} className="text-secondary" />
                Aplicación Móvil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button 
                onClick={onInstall}
                disabled={!deferredPrompt}
                className="w-full rounded-2xl bg-[#004990] hover:bg-[#003d7a] gap-2 font-bold"
              >
                <Download size={18} />
                Instalar App
              </Button>
              <p className="text-[10px] text-slate-400 mt-4 text-center italic">Instale la aplicación en su pantalla de inicio para acceso rápido.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                <User size={20} className="text-secondary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre(s)</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={handleInputChange}
                    className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Apellido(s)</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange}
                    className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Especialidad Principal</Label>
                  <Select value={formData.specialty} onValueChange={handleSpecialtyChange}>
                    <SelectTrigger className="rounded-xl border-slate-100 focus:ring-secondary h-12">
                      <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
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
                  <Label htmlFor="licenseNumber" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cédula Profesional / JVPM</Label>
                  <Input 
                    id="licenseNumber" 
                    value={formData.licenseNumber || ''} 
                    onChange={handleInputChange}
                    placeholder="Ej: 12345-6"
                    className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Universidad de Egreso</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    id="university" 
                    value={formData.university || ''} 
                    onChange={handleInputChange}
                    placeholder="Universidad Nacional de El Salvador"
                    className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12 pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                <Building2 size={20} className="text-secondary" />
                Configuración del Consultorio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="officeNumber" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Número de Consultorio</Label>
                  <Input 
                    id="officeNumber" 
                    value={formData.officeNumber || ''} 
                    onChange={handleInputChange}
                    placeholder="Consultorio 302"
                    className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeHours" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horario de Atención</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <Input 
                      id="officeHours" 
                      value={formData.officeHours || ''} 
                      onChange={handleInputChange}
                      placeholder="Lun - Vie: 8:00 AM - 5:00 PM"
                      className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12 pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-bold text-[#004990] flex items-center gap-2">
                <Shield size={20} className="text-secondary" />
                Seguridad y Preferencias
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  {currentTheme === 'light' ? <Sun className="text-orange-500" /> : <Moon className="text-blue-500" />}
                  <div>
                    <p className="text-sm font-bold text-[#004990]">Tema de la Aplicación</p>
                    <p className="text-[10px] text-slate-500">Cambiar entre modo claro y oscuro</p>
                  </div>
                </div>
                <Switch 
                  checked={currentTheme === 'dark'} 
                  onCheckedChange={(checked) => onThemeToggle(checked ? 'dark' : 'light')} 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usuario</Label>
                    <Input 
                      defaultValue="walter.guidos" 
                      className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nueva Contraseña</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      className="rounded-xl border-slate-100 focus-visible:ring-secondary h-12"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
