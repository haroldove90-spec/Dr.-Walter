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
import { MedicalRecord } from '@/src/types';

interface EvolutionChartProps {
  history: MedicalRecord[];
  type: 'weight' | 'pain';
}

export function EvolutionChart({ history, type }: EvolutionChartProps) {
  const data = history
    .filter(record => (type === 'weight' ? record.weight : record.painLevel !== undefined))
    .map(record => ({
      date: new Date(record.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      value: type === 'weight' ? record.weight : record.painLevel,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
        <p className="text-xs text-zinc-400">No hay suficientes datos históricos para graficar.</p>
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'weight' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#a1a1aa' }} 
              dy={10}
            />
            <YAxis 
              hide 
              domain={['dataMin - 5', 'dataMax + 5']} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              name={type === 'weight' ? 'Peso (kg)' : 'Dolor (EVA)'}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#a1a1aa' }} 
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 10]} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#f43f5e" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              name="Nivel de Dolor"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
