import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Apple, 
  TrendingDown, 
  ChevronRight,
  Utensils,
  Zap
} from 'lucide-react';
import { EvolutionChart } from '../../consultation/EvolutionChart';
import { Patient } from '@/src/types';

export function NutritionWidgets({ patients }: { patients: Patient[] }) {
  // Mock data for nutrition focus
  const nutritionPatients = patients.filter(p => p.history?.some(h => h.specialty === 'Nutrición'));

  const dietPlans = nutritionPatients
    .flatMap(p => p.history || [])
    .filter(h => h.specialty === 'Nutrición' && h.data?.dietPlan)
    .map(h => h.data!.dietPlan!)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-0">
          <div>
            <CardTitle className="text-lg font-bold text-[#004990] flex items-center gap-2">
              <Scale className="text-secondary" size={20} />
              Evolución de IMC y Peso
            </CardTitle>
          </div>
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
            Global Clínica
          </Badge>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[250px] w-full bg-slate-50 rounded-3xl p-4">
            <EvolutionChart 
              history={nutritionPatients.flatMap(p => p.history || []).filter(h => h.specialty === 'Nutrición')} 
              type="weight" 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-secondary text-white rounded-[2rem] overflow-hidden shadow-xl shadow-secondary/20">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Utensils size={20} />
            Planes Alimenticios
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-6">
          <p className="text-white/80 text-sm leading-relaxed">
            Planes personalizados con distribución de macronutrientes.
          </p>
          <div className="space-y-4">
            {dietPlans.length > 0 ? dietPlans.map((plan, idx) => (
              <div key={idx} className="p-4 bg-white/10 rounded-2xl space-y-3 group hover:bg-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{plan.name}</span>
                  <button className="p-2 bg-white/20 rounded-xl hover:bg-white/40 transition-all" title="Descargar Dieta">
                    <Zap size={14} className="text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] font-bold uppercase tracking-tighter">
                  <div className="text-center p-1 bg-white/5 rounded-lg">
                    <p className="text-white/60">Prot</p>
                    <p>{plan.macros.protein}%</p>
                  </div>
                  <div className="text-center p-1 bg-white/5 rounded-lg">
                    <p className="text-white/60">Carb</p>
                    <p>{plan.macros.carbs}%</p>
                  </div>
                  <div className="text-center p-1 bg-white/5 rounded-lg">
                    <p className="text-white/60">Grasa</p>
                    <p>{plan.macros.fat}%</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-xs text-white/40 text-center py-4">No hay planes registrados.</p>
            )}
          </div>
          <button className="w-full py-4 bg-white text-secondary rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-[0.98]">
            Nuevo Plan Nutricional
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
