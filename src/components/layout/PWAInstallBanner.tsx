import React from 'react';
import { Smartphone, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PWAInstallBannerProps {
  onInstall: () => void;
  onClose: () => void;
}

export function PWAInstallBanner({ onInstall, onClose }: PWAInstallBannerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#004990] text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-md relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={18} className="text-white/60" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
            <Smartphone size={24} className="text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight">Instalar Clínica Guidos</h3>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              Accede más rápido y recibe notificaciones instalando la app en tu pantalla de inicio.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Button 
                onClick={onInstall}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold h-10 shadow-lg shadow-secondary/20"
              >
                <Download size={16} className="mr-2" />
                Instalar ahora
              </Button>
              <Button 
                variant="ghost"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold"
              >
                Más tarde
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
