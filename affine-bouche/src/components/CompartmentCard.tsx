'use client';

import React from 'react';
import { 
  CompartmentState, 
  CheeseProfile, 
  ViandeProfile, 
  VinProfile,
  ContentType,
  getTargetConditions
} from '../hooks/useSimulationCave';

// Content meta with light and dark mode classes
const CONTENT_TYPE_META: Record<ContentType, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  fromage: { 
    label: 'Fromage', 
    icon: '🧀', 
    color: 'text-amber-900 dark:text-amber-300', 
    bgColor: 'bg-amber-50 dark:bg-amber-950/30', 
    borderColor: 'border-amber-900/60 dark:border-amber-700/60' 
  },
  viande: { 
    label: 'Viande',  
    icon: '🥩', 
    color: 'text-red-900 dark:text-red-300',   
    bgColor: 'bg-red-50 dark:bg-red-950/30',   
    borderColor: 'border-red-900/60 dark:border-red-700/60' 
  },
  vin: { 
    label: 'Vin',     
    icon: '🍷', 
    color: 'text-purple-900 dark:text-purple-300', 
    bgColor: 'bg-purple-50 dark:bg-purple-950/30', 
    borderColor: 'border-purple-900/60 dark:border-purple-700/60' 
  },
};

interface CompartmentCardProps {
  comp: CompartmentState;
  activeCompartmentId: number | null;
  setActiveCompartmentId: (id: number) => void;
  cheeses: CheeseProfile[];
  viandes: ViandeProfile[];
  vins: VinProfile[];
  now: number;
}

export default function CompartmentCard({
  comp,
  activeCompartmentId,
  setActiveCompartmentId,
  cheeses,
  viandes,
  vins,
  now
}: CompartmentCardProps) {
  const isActive = activeCompartmentId === comp.id;
  const meta = CONTENT_TYPE_META[comp.contentType];

  let item: CheeseProfile | ViandeProfile | VinProfile | null = null;
  if (comp.contentType === 'fromage' && comp.selectedItemId) item = cheeses.find(c => c.id === comp.selectedItemId) ?? null;
  if (comp.contentType === 'viande' && comp.selectedItemId) item = viandes.find(v => v.id === comp.selectedItemId) ?? null;
  if (comp.contentType === 'vin' && comp.selectedItemId) item = vins.find(v => v.id === comp.selectedItemId) ?? null;

  const targets = getTargetConditions(comp, cheeses, viandes, vins);
  const isTempOk = targets ? Math.abs(comp.currentTemp - targets.targetTemp) < 1.0 : false;
  const isHygroOk = targets ? Math.abs(comp.currentHumidity - targets.targetHygro) < 5.0 : false;

  // Chrono & progress tracking
  let elapsedDays = 0, progressPct = 0;
  let targetDays = comp.targetDurationDays || (comp.contentType === 'vin' ? 365 : comp.contentType === 'viande' ? 45 : 30);
  let tastingDateStr = '';
  
  if (item && comp.startDate) {
    elapsedDays = (now - comp.startDate) / (1000 * 60 * 60 * 24);
    progressPct = Math.min(100, Math.max(0, (elapsedDays / targetDays) * 100));
    
    const tastingDate = new Date(comp.startDate + (targetDays * 24 * 60 * 60 * 1000));
    tastingDateStr = tastingDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  const isFinished = elapsedDays >= targetDays && elapsedDays > 0;

  // Progress bar gradient styles
  const progressGradients: Record<ContentType, string> = {
    fromage: 'from-amber-800 to-amber-500',
    viande: 'from-red-800 to-red-500',
    vin: 'from-purple-800 to-purple-500'
  };

  return (
    <div
      onClick={() => setActiveCompartmentId(comp.id)}
      className={`relative z-10 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col ${
        isActive 
          ? `${meta.borderColor} scale-[1.02] shadow-md` 
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      } bg-white dark:bg-slate-900 p-5 min-h-[220px]`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{meta.icon}</span>
          <h4 className="text-slate-400 dark:text-slate-550 font-bold uppercase text-[10px] tracking-wider">Zone {comp.id}</h4>
        </div>
        <div className="flex gap-1">
          {comp.coolerActive && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Refroidissement actif"></span>}
          {comp.humidifierActive && <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" title="Brumisateur actif"></span>}
        </div>
      </div>

      {/* Empty state */}
      {!item ? (
        <div className={`flex-1 flex flex-col items-center justify-center gap-1 ${meta.color} opacity-40 dark:opacity-50 hover:opacity-70 dark:hover:opacity-75 transition-opacity`}>
          <span className="text-3xl">{meta.icon}</span>
          <span className="text-xs font-medium text-center">Ajouter {comp.contentType === 'vin' ? 'un vin' : comp.contentType === 'viande' ? 'une viande' : 'un fromage'}</span>
        </div>
      ) : (
        <>
          {/* Item name */}
          <h5 className={`font-bold text-sm leading-snug mb-3 truncate ${meta.color}`}>{item.nom}</h5>

          {/* Sensors */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`p-2 rounded-lg border text-xs ${
              isTempOk 
                ? 'border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20' 
                : 'border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20'
            }`}>
              <div className="text-slate-550 dark:text-slate-400 uppercase font-bold text-[9px] mb-0.5">Temp</div>
              <div className={`text-base font-mono font-bold ${isTempOk ? 'text-green-800 dark:text-green-305' : 'text-red-800 dark:text-red-305'}`}>
                {comp.currentTemp.toFixed(1)}°
              </div>
              {targets && <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">cible {targets.targetTemp}°C</div>}
            </div>
            <div className={`p-2 rounded-lg border text-xs ${
              isHygroOk 
                ? 'border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20' 
                : 'border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20'
            }`}>
              <div className="text-slate-550 dark:text-slate-400 uppercase font-bold text-[9px] mb-0.5">Hygro</div>
              <div className={`text-base font-mono font-bold ${isHygroOk ? 'text-green-800 dark:text-green-305' : 'text-red-800 dark:text-red-305'}`}>
                {comp.currentHumidity.toFixed(1)}%
              </div>
              {targets && <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">cible {targets.targetHygro}%</div>}
            </div>
          </div>

          {/* Footer: unified progress and estimates */}
          <div className="mt-auto space-y-2">
            {isFinished ? (
              <div className="w-full text-center bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 text-[10px] font-bold py-1.5 rounded-lg border border-green-200 dark:border-green-900/40 animate-pulse uppercase">
                ✓ Prêt à déguster
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-505 dark:text-slate-450 uppercase">
                    {comp.contentType === 'vin' ? 'Vieillissement' : comp.contentType === 'viande' ? 'Maturation' : 'Affinage'}
                  </span>
                  <span className={meta.color}>
                    Prêt à {progressPct.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-105 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${progressGradients[comp.contentType]} h-1.5 rounded-full transition-all duration-700`} 
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-slate-500 font-medium pt-0.5">
                  <span className="flex items-center gap-1">
                    📅 Dégustation :
                  </span>
                  <span className="font-semibold font-mono text-slate-605 dark:text-slate-400">
                    {tastingDateStr}
                  </span>
                </div>
              </>
            )}

            {/* Sub-status (Phase information) */}
            <div className="flex justify-between items-center pt-1 border-t border-slate-100/60 dark:border-slate-800/40 text-[9px]">
              <span className="text-slate-400 dark:text-slate-500">
                Mode : {comp.isAutoMode ? 'Auto 🤖' : 'Manuel ⚙️'}
              </span>
              <span className="font-semibold capitalize text-slate-550 dark:text-slate-400">
                {comp.contentType === 'vin' ? comp.vinPhase : comp.contentType === 'viande' ? comp.maturePhase : `${comp.preference === 'moyen' ? 'À point' : comp.preference === 'vieux' ? 'Corsé' : 'Jeune'}`}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
