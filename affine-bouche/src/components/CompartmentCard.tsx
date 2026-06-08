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

import { CONTENT_TYPE_META } from '../data/constants';

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
      className={`relative z-10 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col ${
        isActive 
          ? `${meta.borderColor} scale-[1.02] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50` 
          : 'border-slate-200/70 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm'
      } p-6 min-h-[230px] group/card`}
    >
      {/* Active Ambient Glow behind active card */}
      {isActive && (
        <div className={`absolute -inset-1 opacity-20 dark:opacity-10 bg-gradient-to-r ${
          comp.contentType === 'fromage' ? 'from-amber-500 to-amber-700' : comp.contentType === 'viande' ? 'from-red-500 to-red-750' : 'from-purple-500 to-purple-700'
        } blur-lg -z-10`}></div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl filter drop-shadow-sm group-hover/card:scale-110 transition-transform duration-300">{meta.icon}</span>
          <div>
            <h4 className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[9px] tracking-widest">Zone {comp.id}</h4>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize">{meta.label}</span>
          </div>
        </div>
        <div className="flex gap-1.5 items-center bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-850">
          <div className="flex gap-1">
            {comp.coolerActive && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Refroidissement actif"></span>
            )}
            {comp.humidifierActive && (
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" title="Brumisateur actif"></span>
            )}
            {comp.fanActive && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" title="Ventilation active"></span>
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
            {comp.coolerActive || comp.humidifierActive || comp.fanActive ? 'ON' : 'STBY'}
          </span>
        </div>
      </div>

      {/* Empty state */}
      {!item ? (
        <div className={`flex-1 flex flex-col items-center justify-center gap-2 ${meta.color} opacity-40 dark:opacity-30 hover:opacity-80 transition-opacity py-4`}>
          <div className="w-12 h-12 rounded-full border border-dashed border-current flex items-center justify-center text-xl">
            ＋
          </div>
          <span className="text-xs font-bold tracking-wide text-center">Configurer l'emplacement</span>
        </div>
      ) : (
        <>
          {/* Item name */}
          <h5 className={`font-black text-base leading-snug mb-4 truncate ${meta.color}`}>{item.nom}</h5>

          {/* Sensors */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-3 rounded-xl border transition-colors ${
              isTempOk 
                ? 'border-green-200/70 dark:border-green-950/40 bg-green-50/40 dark:bg-green-950/10' 
                : 'border-red-200/70 dark:border-red-950/40 bg-red-50/40 dark:bg-red-950/10'
            }`}>
              <div className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[9px] tracking-wider mb-1">Température</div>
              <div className={`text-lg font-mono font-black ${isTempOk ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {comp.currentTemp.toFixed(1)}<span className="text-xs font-normal">°C</span>
              </div>
              {targets && <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">Cible : {targets.targetTemp}°C</div>}
            </div>

            <div className={`p-3 rounded-xl border transition-colors ${
              isHygroOk 
                ? 'border-green-200/70 dark:border-green-950/40 bg-green-50/40 dark:bg-green-950/10' 
                : 'border-red-200/70 dark:border-red-950/40 bg-red-50/40 dark:bg-red-950/10'
            }`}>
              <div className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[9px] tracking-wider mb-1">Hygrométrie</div>
              <div className={`text-lg font-mono font-black ${isHygroOk ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {comp.currentHumidity.toFixed(1)}<span className="text-xs font-normal">%</span>
              </div>
              {targets && <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">Cible : {targets.targetHygro}%</div>}
            </div>
          </div>

          {/* Footer: unified progress and estimates */}
          <div className="mt-auto space-y-3">
            {isFinished ? (
              <div className="w-full text-center bg-green-550/10 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-black py-2 rounded-xl border border-green-250/30 dark:border-green-900/30 animate-pulse uppercase tracking-wider">
                ✓ Prêt à déguster
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {comp.contentType === 'vin' ? 'Vieillissement' : comp.contentType === 'viande' ? 'Maturation' : 'Affinage'}
                  </span>
                  <span className={`${meta.color} font-black`}>
                    {progressPct.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${progressGradients[comp.contentType]} h-1.5 rounded-full transition-all duration-700`} 
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    📅 Prêt le :
                  </span>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">
                    {tastingDateStr}
                  </span>
                </div>
              </>
            )}

            {/* Sub-status (Phase information) */}
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100/60 dark:border-slate-800/40 text-[9px]">
              <span className="text-slate-400 dark:text-slate-500 font-semibold">
                Mode : {comp.isAutoMode ? 'Automatique 🤖' : 'Manuel ⚙️'}
              </span>
              <span className="font-bold capitalize text-slate-600 dark:text-slate-305 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-850">
                {comp.contentType === 'vin' ? comp.vinPhase : comp.contentType === 'viande' ? comp.maturePhase : `${comp.preference === 'moyen' ? 'À point' : comp.preference === 'vieux' ? 'Corsé' : 'Jeune'}`}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
