import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell, 
  Download,
  Receipt,
  Percent,
  Calculator,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Patient, Appointment, Payment, PaymentMethod, Specialty } from '@/src/types';
import { cn } from '@/lib/utils';
import { exportToExcel } from '@/src/lib/exportUtils';

interface AdminDashboardProps {
  patients: Patient[];
  appointments: Appointment[];
}

export function AdminDashboard({ patients, appointments }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'pos' | 'marketing'>('metrics');

  // Mock Data for Finance
  const revenueData = [
    { name: 'Psicología', value: 4500 },
    { name: 'Nutrición', value: 3200 },
    { name: 'Ortopedia', value: 5800 },
    { name: 'Ginecología', value: 7200 },
    { name: 'Fisioterapia', value: 4100 },
    { name: 'Cirugía', value: 12500 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const upcomingReminders = appointments
    .filter(a => a.status === 'Pendiente')
    .slice(0, 4);

  const inactivePatients = patients.filter(p => !p.history || p.history.length === 0).slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Administración Clínica</h2>
          <p className="text-sm text-zinc-500">Gestión financiera y seguimiento de pacientes</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setActiveTab('metrics')}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
              activeTab === 'metrics' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Métricas
          </button>
          <button 
            onClick={() => setActiveTab('pos')}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
              activeTab === 'pos' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Caja / POS
          </button>
          <button 
            onClick={() => setActiveTab('marketing')}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
              activeTab === 'marketing' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Marketing
          </button>
        </div>
      </div>

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Ingresos Mes</p>
                    <h3 className="text-2xl font-bold mt-1">$37,300</h3>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-blue-100">
                  <ArrowUpRight size={14} />
                  <span className="font-bold">+12.5%</span> vs mes anterior
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Pacientes Nuevos</p>
                    <h3 className="text-2xl font-bold mt-1">24</h3>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight size={14} />
                  <span className="font-bold">+4</span> esta semana
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Especialidad Top</p>
                    <h3 className="text-2xl font-bold mt-1">Cirugía</h3>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="mt-4 text-xs text-zinc-500">
                  Representa el <span className="font-bold text-zinc-900">33%</span> del ingreso
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Corte Diario</p>
                    <h3 className="text-2xl font-bold mt-1">$4,250</h3>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                    <DollarSign size={20} />
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto text-xs text-blue-600 font-bold mt-4">
                  Ver desglose de hoy
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ingresos por Especialidad</CardTitle>
                <CardDescription>Distribución mensual de facturación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Pacientes Recurrentes vs Nuevos</CardTitle>
                <CardDescription>Fidelización de la clínica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Recurrentes', value: 65 },
                          { name: 'Nuevos', value: 35 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#e2e8f0" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold">65%</span>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Retención</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Registro de Cobro</CardTitle>
                <CardDescription>Gestione el pago de la consulta actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Paciente</label>
                    <select className="w-full h-10 px-3 rounded-md border border-zinc-200 text-sm bg-white">
                      {patients.map(p => (
                        <option key={p.id}>{p.firstName} {p.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Concepto / Especialidad</label>
                    <select className="w-full h-10 px-3 rounded-md border border-zinc-200 text-sm bg-white">
                      <option>Consulta General - $50.00</option>
                      <option>Especialidad - $80.00</option>
                      <option>Paquete 5 Sesiones Fisioterapia - $350.00</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Método de Pago</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-600">
                      <DollarSign size={24} className="mb-2" />
                      <span className="text-xs font-bold">Efectivo</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-200 transition-all">
                      <CreditCard size={24} className="mb-2 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-600">Tarjeta</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-200 transition-all">
                      <ArrowUpRight size={24} className="mb-2 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-600">Transferencia</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-bold">$80.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1"><Percent size={14} /> Descuento (10%)</span>
                    <span className="font-bold">-$8.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-zinc-900">
                    <span>Total a Cobrar</span>
                    <span>$72.00</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                    <Calculator size={20} className="mr-2" />
                    Registrar Pago
                  </Button>
                  <Button variant="outline" className="h-12 px-6">
                    <Receipt size={20} className="mr-2" />
                    Facturar CFDI
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Desglose de Comisiones</CardTitle>
                  <CardDescription>Reparto automático por especialidad</CardDescription>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-100">Configuración: 70/30</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Honorarios Especialista (70%)</p>
                        <p className="text-[10px] text-zinc-500">Pago directo al médico</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">$50.40</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Comisión Clínica (30%)</p>
                        <p className="text-[10px] text-zinc-500">Mantenimiento e insumos</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">$21.60</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download size={18} className="text-blue-400" />
                  Corte de Caja
                </CardTitle>
                <CardDescription className="text-zinc-400">Resumen del día {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Efectivo</span>
                    <span className="font-bold">$1,250.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tarjeta</span>
                    <span className="font-bold">$2,100.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Transferencia</span>
                    <span className="font-bold">$900.00</span>
                  </div>
                </div>
                <Separator className="bg-zinc-800" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-400">$4,250.00</span>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                  onClick={() => exportToExcel([], 'Corte_Caja_Diario')}
                >
                  Exportar a Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Datos Fiscales del Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-[11px] space-y-1">
                  <p className="font-bold text-zinc-400 uppercase">RFC</p>
                  <p className="text-zinc-900">XAXX010101000</p>
                </div>
                <div className="text-[11px] space-y-1">
                  <p className="font-bold text-zinc-400 uppercase">Razón Social</p>
                  <p className="text-zinc-900">PÚBLICO EN GENERAL</p>
                </div>
                <div className="text-[11px] space-y-1">
                  <p className="font-bold text-zinc-400 uppercase">Régimen Fiscal</p>
                  <p className="text-zinc-900">601 - General de Ley Personas Morales</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Editar Datos Fiscales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-orange-500" />
                Recordatorios de Citas
              </CardTitle>
              <CardDescription>Mensajes automáticos para próximas consultas</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-50">
                {upcomingReminders.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{patient?.firstName} {patient?.lastName}</p>
                          <p className="text-[10px] text-zinc-500">{appointment.specialty} • Mañana 10:00 AM</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs gap-2">
                        <MessageSquare size={14} className="text-emerald-500" />
                        WhatsApp
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} className="text-rose-500" />
                Pacientes Inactivos (+30 días)
              </CardTitle>
              <CardDescription>Alertas de seguimiento para re-activación</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-50">
                {inactivePatients.map((patient) => (
                  <div key={patient.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{patient.firstName} {patient.lastName}</p>
                        <p className="text-[10px] text-rose-500 font-bold uppercase">Inactivo hace 45 días</p>
                      </div>
                    </div>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white text-xs h-8">
                      Re-contactar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Plantilla de Recordatorio</CardTitle>
              <CardDescription>Personalice el mensaje que se envía a los pacientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-sm text-emerald-800 leading-relaxed">
                  "Hola <span className="font-bold">[Nombre del Paciente]</span>, le recordamos su cita en la <span className="font-bold">Clínica Dr. Walter Guidos</span> para la especialidad de <span className="font-bold">[Especialidad]</span> el día <span className="font-bold">[Fecha]</span> a las <span className="font-bold">[Hora]</span>. Por favor confirme su asistencia respondiendo a este mensaje. ¡Le esperamos!"
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Restaurar Predeterminado</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Guardar Plantilla</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
