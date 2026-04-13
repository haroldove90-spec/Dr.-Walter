import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Specialty, Doctor } from '@/src/types';
import { cn } from '@/lib/utils';

interface DoctorOnboardingProps {
  onComplete: (doctor: Doctor) => void;
}

export function DoctorOnboarding({ onComplete }: DoctorOnboardingProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>('Nutrición');

  const specialties: Specialty[] = [
    'Médico General',
    'Psicología', 
    'Nutrición', 
    'Ortopedia', 
    'Ginecología', 
    'Fisioterapia', 
    'Cirugía General'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isWalter = (firstName.toLowerCase() === 'walter' && lastName.toLowerCase() === 'guidos') || mode === 'login';
    const mockDoctor: Doctor = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: firstName || (mode === 'login' ? 'Walter' : 'Nuevo'),
      lastName: lastName || (mode === 'login' ? 'Guidos' : 'Médico'),
      specialty: specialty,
      role: isWalter ? 'director' : 'doctor'
    };
    onComplete(mockDoctor);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Clínica Guidos</h1>
          <p className="text-zinc-500 mt-2">Portal de Gestión Médica Especializada</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="flex bg-zinc-100 p-1 rounded-lg mb-4">
              <button 
                onClick={() => setMode('login')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2",
                  mode === 'login' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500"
                )}
              >
                <LogIn size={16} /> Acceder
              </button>
              <button 
                onClick={() => setMode('register')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2",
                  mode === 'register' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500"
                )}
              >
                <UserPlus size={16} /> Registro
              </button>
            </div>
            <CardTitle>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta médica'}</CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Ingrese sus credenciales para gestionar sus consultas.' 
                : 'Complete sus datos para activar su consultorio digital.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Ej: Walter" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Ej: Guidos" 
                      required 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="doctor@clinicaguidos.com" required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad Médica</Label>
                <select 
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as Specialty)}
                  className="w-full h-10 px-3 rounded-md border border-zinc-200 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  {specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {mode === 'login' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
              )}

              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-bold mt-6">
                {mode === 'login' ? 'Entrar al Panel' : 'Finalizar Registro'}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-400">
          Al continuar, acepta los términos de servicio y privacidad de Clínica Guidos.
        </p>
      </div>
    </div>
  );
}
