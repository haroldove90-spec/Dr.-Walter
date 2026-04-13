import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  PieChart, 
  Activity,
  CheckCircle2,
  Clock,
  UserCheck,
  UserMinus
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const doctorsList = [
  { id: 1, name: 'Dr. Walter Guidos', specialty: 'Medicina General', status: 'Activo', patients: 1250 },
  { id: 2, name: 'Dra. Elena Rivas', specialty: 'Ginecología', status: 'Activo', patients: 840 },
  { id: 3, name: 'Dr. Roberto Sosa', specialty: 'Ortopedia', status: 'Ausente', patients: 620 },
  { id: 4, name: 'Dra. Ana Torres', specialty: 'Psicología', status: 'Activo', patients: 450 },
  { id: 5, name: 'Dr. Luis Méndez', specialty: 'Nutrición', status: 'Activo', patients: 380 },
];

export function AdminView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#004990]">Panel Administrativo</h2>
          <p className="text-sm text-slate-500 mt-1">Control financiero y gestión de personal</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm rounded-[2rem] bg-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <Badge className="bg-white/20 text-white border-none">+15%</Badge>
            </div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Ingresos Totales</p>
            <p className="text-2xl font-bold mt-1">$45,280.00</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-[#004990] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Activity size={24} />
              </div>
              <Badge className="bg-white/20 text-white border-none">Meta 90%</Badge>
            </div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Consultas Realizadas</p>
            <p className="text-2xl font-bold mt-1">1,248</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-secondary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <PieChart size={24} />
              </div>
            </div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Estatus de Pagos</p>
            <p className="text-2xl font-bold mt-1">92% <span className="text-sm font-normal opacity-70">al día</span></p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Nuevos Pacientes</p>
            <p className="text-2xl font-bold mt-1">84 <span className="text-sm font-normal opacity-70">este mes</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctors Management */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-4">
            <CardTitle className="text-lg font-bold text-[#004990]">Gestión de Médicos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="font-bold text-[#004990] h-14 px-8">Médico</TableHead>
                  <TableHead className="font-bold text-[#004990] h-14">Especialidad</TableHead>
                  <TableHead className="font-bold text-[#004990] h-14">Estatus</TableHead>
                  <TableHead className="text-right font-bold text-[#004990] h-14 px-8">Pacientes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctorsList.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="font-bold px-8">{doc.name}</TableCell>
                    <TableCell className="text-slate-500">{doc.specialty}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full px-3 py-1 border-none",
                        doc.status === 'Activo' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {doc.status === 'Activo' ? <UserCheck size={12} className="mr-1" /> : <UserMinus size={12} className="mr-1" />}
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8 font-bold text-[#004990]">{doc.patients}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue by Specialty */}
        <Card className="border-none shadow-sm rounded-[2rem]">
          <CardHeader className="px-8 pt-8 pb-4">
            <CardTitle className="text-lg font-bold text-[#004990]">Ingresos por Especialidad</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {[
                { name: 'Ginecología', amount: '$12,400', color: 'bg-[#004990]', percent: 85 },
                { name: 'Nutrición', amount: '$8,200', color: 'bg-secondary', percent: 65 },
                { name: 'Ortopedia', amount: '$15,100', color: 'bg-orange-500', percent: 95 },
                { name: 'Psicología', amount: '$4,500', color: 'bg-emerald-500', percent: 45 },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-600">{item.name}</span>
                    <span className="text-sm font-bold text-[#004990]">{item.amount}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", item.color)} 
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
