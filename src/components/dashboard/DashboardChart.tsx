import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Specialty } from '@/src/types';

interface DashboardChartProps {
  specialty: Specialty;
}

const generateMockData = (specialty: Specialty) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  if (specialty === 'Nutrición') {
    return months.map((m, i) => ({
      name: m,
      value: 85 - (i * 0.8) + (Math.random() * 2), // Weight trend
      ideal: 75
    }));
  }
  
  if (specialty === 'Ginecología') {
    return months.map((m, i) => ({
      name: m,
      value: 20 + (i * 1.5) + (Math.random() * 3), // Fetal growth simulation
      ideal: 22 + (i * 1.4)
    }));
  }

  // Default: Patient volume
  return months.map((m) => ({
    name: m,
    value: 150 + Math.floor(Math.random() * 100)
  }));
};

export function DashboardChart({ specialty }: DashboardChartProps) {
  const data = generateMockData(specialty);
  
  const getMetricName = () => {
    if (specialty === 'Nutrición') return 'Peso Promedio (kg)';
    if (specialty === 'Ginecología') return 'Crecimiento Fetal (cm)';
    return 'Pacientes Atendidos';
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#004990" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#004990" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#004990" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            name={getMetricName()}
            animationDuration={1500}
          />
          {(specialty === 'Nutrición' || specialty === 'Ginecología') && (
            <Area 
              type="monotone" 
              dataKey="ideal" 
              stroke="#10b981" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorSecondary)" 
              name="Meta/Ideal"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
