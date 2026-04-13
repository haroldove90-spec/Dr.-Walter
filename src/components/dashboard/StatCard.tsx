import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
            color,
            "bg-opacity-10"
          )}>
            <Icon className={color.replace('bg-', 'text-')} size={24} />
          </div>
          {trend && (
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold",
              trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold text-[#004990] mt-2 tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
