'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface CheeseProfile {
  id: string;
  nom: string;
  categorie: string | null;
  lait: string | null;
  affinageTempMin: number | null;
  affinageTempMax: number | null;
  affinageHygroMin: number | null;
  affinageHygroMax: number | null;
  affinageDureeMin: number | null;
  affinageDureeMax: number | null;
  notes: string | null;
}

interface CompartmentState {
  id: number;
  selectedCheeseId: string | null;
  preference: 'jeune' | 'moyen' | 'vieux';
  targetDurationDays: number;
  startDate: number | null;
  isAutoMode: boolean;
  currentTemp: number;
  currentHumidity: number;
  coolerActive: boolean;
  humidifierActive: boolean;
  fanActive: boolean;
}

export default function Dashboard({ initialCheeses }: { initialCheeses: CheeseProfile[] }) {
  
  // Initialisation des 6 compartiments
  const [compartments, setCompartments] = useState<CompartmentState[]>(
    Array.from({ length: 6 }).map((_, index) => ({
      id: index + 1,
      selectedCheeseId: null,
      preference: 'moyen',
      targetDurationDays: 30,
      startDate: null,
      isAutoMode: true,
      currentTemp: 14.5,
      currentHumidity: 70.0,
      coolerActive: false,
      humidifierActive: false,
      fanActive: false,
    }))
  );

  const [activeCompartmentId, setActiveCompartmentId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  // Force rerender pour le chrono
  const [, setTick] = useState(0);

  const cheesesByCategory = useMemo(() => {
    return initialCheeses.reduce((acc, cheese) => {
      const cat = cheese.categorie || 'Autres';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(cheese);
      return acc;
    }, {} as Record<string, CheeseProfile[]>);
  }, [initialCheeses]);

  // Boucle de simulation indépendante
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1); // Trigger render pour mettre à jour le chrono

      setCompartments(prevCompartments => 
        prevCompartments.map(comp => {
          let { currentTemp, currentHumidity, coolerActive, humidifierActive, fanActive, isAutoMode, selectedCheeseId } = comp;
          
          const selectedCheese = initialCheeses.find(c => c.id === selectedCheeseId);

          // Logique Auto
          if (isAutoMode && selectedCheese) {
            const targetTempMin = selectedCheese.affinageTempMin || 10;
            const targetTempMax = selectedCheese.affinageTempMax || 14;
            const targetHygroMin = selectedCheese.affinageHygroMin || 85;
            
            const targetTempMid = (targetTempMin + targetTempMax) / 2;

            if (currentTemp > targetTempMax) {
              coolerActive = true;
            } else if (currentTemp <= targetTempMid) {
              coolerActive = false;
            }

            if (currentHumidity < targetHygroMin) {
              humidifierActive = true;
            } else if (currentHumidity >= targetHygroMin + 2) {
              humidifierActive = false;
            }
            
            fanActive = coolerActive || humidifierActive;
          }

          // Physique simulée indépendante
          let tempDelta = 0.02; // Tendance naturelle à se réchauffer
          if (coolerActive) tempDelta = -0.15;
          
          let hygroDelta = -0.05; // Tendance à s'assécher
          if (humidifierActive) hygroDelta = 0.3;
          if (coolerActive && !humidifierActive) hygroDelta -= 0.1;

          return {
            ...comp,
            currentTemp: Number((currentTemp + tempDelta).toFixed(2)),
            currentHumidity: Number((Math.min(100, Math.max(0, currentHumidity + hygroDelta))).toFixed(2)),
            coolerActive,
            humidifierActive,
            fanActive
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [initialCheeses]);

  const updateCompartment = (id: number, updates: Partial<CompartmentState>) => {
    setCompartments(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const assignCheese = (compartmentId: number, cheeseId: string | null) => {
    if (!cheeseId) {
      updateCompartment(compartmentId, { selectedCheeseId: null, startDate: null });
      return;
    }
    const cheese = initialCheeses.find(c => c.id === cheeseId);
    const min = cheese?.affinageDureeMin || 21;
    const max = cheese?.affinageDureeMax || 35;
    
    updateCompartment(compartmentId, { 
      selectedCheeseId: cheeseId, 
      startDate: Date.now(), 
      preference: 'moyen', 
      targetDurationDays: Math.round((min + max) / 2) 
    });
  };

  const changePreference = (compartmentId: number, pref: 'jeune' | 'moyen' | 'vieux') => {
    const comp = compartments.find(c => c.id === compartmentId);
    const cheese = initialCheeses.find(c => c.id === comp?.selectedCheeseId);
    if (!cheese) return;
    
    const min = cheese.affinageDureeMin || 21;
    const max = cheese.affinageDureeMax || 35;
    
    let target = Math.round((min + max) / 2);
    if (pref === 'jeune') target = min;
    if (pref === 'vieux') target = max;
    
    updateCompartment(compartmentId, { preference: pref, targetDurationDays: target });
  };

  const toggleControl = (control: keyof CompartmentState) => {
    if (!activeCompartmentId) return;
    const activeComp = compartments.find(c => c.id === activeCompartmentId);
    if (!activeComp || activeComp.isAutoMode) return;
    
    updateCompartment(activeCompartmentId, { [control]: !activeComp[control] });
  };

  const activeComp = compartments.find(c => c.id === activeCompartmentId);
  const activeCheese = activeComp?.selectedCheeseId ? initialCheeses.find(c => c.id === activeComp.selectedCheeseId) : null;
  const now = Date.now();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10 text-slate-900">
      
      {/* Colonne de Gauche */}
      <div className="xl:col-span-4 space-y-6 flex flex-col">
        <div className="relative z-50 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
            <span className="text-amber-800">⚙️</span> Compartiment {activeCompartmentId ? `#${activeCompartmentId}` : ''}
          </h3>
          
          {!activeCompartmentId || !activeComp ? (
            <div className="text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-4xl block mb-2">👈</span>
              Sélectionnez un compartiment dans la grille pour configurer son affinage.
            </div>
          ) : (
            <>
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-slate-500 mb-2">Fromage en affinage</label>
                <div 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 cursor-pointer hover:border-amber-900/50 transition-colors flex justify-between items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{activeCheese ? activeCheese.nom : 'Vide (Emplacement libre)'}</span>
                  <span className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-y-auto custom-scrollbar">
                    <div 
                      className="px-6 py-3 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm border-b border-slate-100"
                      onClick={() => {
                        assignCheese(activeCompartmentId, null);
                        setIsDropdownOpen(false);
                      }}
                    >
                      ❌ Retirer le fromage
                    </div>
                    {Object.entries(cheesesByCategory).map(([category, cheeses]) => (
                      <div key={category}>
                        <div className="bg-slate-50 text-amber-900 text-xs font-bold uppercase tracking-wider px-4 py-2 sticky top-0 z-10 border-b border-slate-100">
                          {category}
                        </div>
                        {cheeses.map(c => (
                          <div 
                            key={c.id} 
                            className={`px-6 py-3 cursor-pointer transition-colors text-sm ${activeComp?.selectedCheeseId === c.id ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                            onClick={() => {
                              assignCheese(activeCompartmentId, c.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {c.nom}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Préférence d'Affinage */}
              {activeCheese && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-500 mb-2">Degré d'affinage souhaité</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => changePreference(activeCompartmentId, 'jeune')}
                      className={`py-2 px-1 text-xs font-semibold rounded-md transition-all ${activeComp?.preference === 'jeune' ? 'bg-amber-900 text-white shadow-sm' : 'text-slate-655 hover:text-slate-900'}`}
                    >
                      Jeune
                    </button>
                    <button 
                      onClick={() => changePreference(activeCompartmentId, 'moyen')}
                      className={`py-2 px-1 text-xs font-semibold rounded-md transition-all ${activeComp?.preference === 'moyen' ? 'bg-amber-900 text-white shadow-sm' : 'text-slate-655 hover:text-slate-900'}`}
                    >
                      À point
                    </button>
                    <button 
                      onClick={() => changePreference(activeCompartmentId, 'vieux')}
                      className={`py-2 px-1 text-xs font-semibold rounded-md transition-all ${activeComp?.preference === 'vieux' ? 'bg-amber-900 text-white shadow-sm' : 'text-slate-655 hover:text-slate-900'}`}
                    >
                      Corsé
                    </button>
                  </div>
                  <div className="text-xs text-amber-900 mt-2 flex justify-between px-1 font-bold">
                    <span>Durée cible :</span>
                    <span className="font-mono">{activeComp?.targetDurationDays} jours</span>
                  </div>
                </div>
              )}

              {/* Toggle Mode Auto */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Mode Automatique</p>
                  <p className="text-xs text-slate-500">Régulation intelligente</p>
                </div>
                <button 
                  onClick={() => updateCompartment(activeCompartmentId, { isAutoMode: !activeComp.isAutoMode })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${activeComp.isAutoMode ? 'bg-amber-900' : 'bg-slate-350'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${activeComp.isAutoMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Actionneurs */}
              <div>
                 <label className="block text-sm font-medium text-slate-500 mb-2">Contrôles manuels</label>
                 <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => toggleControl('coolerActive')} disabled={activeComp.isAutoMode} className={`p-2 rounded-lg text-xs font-bold transition-colors ${activeComp.coolerActive ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'} ${activeComp.isAutoMode && 'opacity-50'}`}>Froid</button>
                    <button onClick={() => toggleControl('humidifierActive')} disabled={activeComp.isAutoMode} className={`p-2 rounded-lg text-xs font-bold transition-colors ${activeComp.humidifierActive ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-slate-50 text-slate-400 border border-slate-200'} ${activeComp.isAutoMode && 'opacity-50'}`}>Brumisateur</button>
                    <button onClick={() => toggleControl('fanActive')} disabled={activeComp.isAutoMode} className={`p-2 rounded-lg text-xs font-bold transition-colors ${activeComp.fanActive ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-slate-50 text-slate-400 border border-slate-200'} ${activeComp.isAutoMode && 'opacity-50'}`}>Ventilation</button>
                 </div>
              </div>
            </>
          )}
        </div>

        {activeCheese && activeComp && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
              <span className="text-yellow-600">🎯</span> Objectifs du compartiment
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Température</span>
                <span className="font-mono text-slate-800 font-bold">{activeCheese.affinageTempMin}°C - {activeCheese.affinageTempMax}°C</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Hygrométrie</span>
                <span className="font-mono text-slate-800 font-bold">{activeCheese.affinageHygroMin}% - {activeCheese.affinageHygroMax}%</span>
              </div>
              <p className="text-amber-900 bg-amber-50/50 p-2.5 rounded-lg border border-amber-900/10 italic text-xs mt-2">{activeCheese.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Colonne de Droite : La Grille */}
      <div className="xl:col-span-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
           <h2 className="text-2xl font-bold mb-6 text-amber-900">
             Cave d'Affinage (Quadrillage)
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 border-[8px] border-amber-900/10 rounded-xl pointer-events-none z-0"></div>
              
              {compartments.map(comp => {
                const cheese = comp.selectedCheeseId ? initialCheeses.find(c => c.id === comp.selectedCheeseId) : null;
                const isActive = activeCompartmentId === comp.id;
                
                const isTempOk = cheese ? comp.currentTemp >= (cheese.affinageTempMin||0) && comp.currentTemp <= (cheese.affinageTempMax||100) : false;
                const isHygroOk = cheese ? comp.currentHumidity >= (cheese.affinageHygroMin||0) && comp.currentHumidity <= (cheese.affinageHygroMax||100) : false;

                // Chrono temps réel
                let elapsedDays = 0;
                let progressPct = 0;
                if (cheese && comp.startDate) {
                  elapsedDays = (now - comp.startDate) / (1000 * 60 * 60 * 24);
                  progressPct = Math.min(100, Math.max(0, (elapsedDays / comp.targetDurationDays) * 100));
                }
                const isFinished = elapsedDays >= comp.targetDurationDays;

                return (
                  <div 
                    key={comp.id}
                    onClick={() => setActiveCompartmentId(comp.id)}
                    className={`relative z-10 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col ${isActive ? 'border-amber-900 scale-[1.02] shadow-sm' : 'border-slate-200 hover:border-slate-350'} bg-slate-50 p-5 min-h-[220px]`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-slate-400 font-bold uppercase text-xs tracking-wider">Zone {comp.id}</h4>
                      <div className="flex gap-1">
                        {comp.coolerActive && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                        {comp.humidifierActive && <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>}
                      </div>
                    </div>

                    {!cheese ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:text-amber-900 transition-colors">
                        <span className="text-3xl mb-1">+</span>
                        <span className="text-sm font-medium">Ajouter un fromage</span>
                      </div>
                    ) : (
                      <>
                        <h5 className="text-slate-800 font-bold text-lg leading-tight mb-2 truncate">{cheese.nom}</h5>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className={`p-2 rounded-lg border ${isTempOk ? 'border-green-200 bg-green-50/60 text-green-800 font-bold' : 'border-red-200 bg-red-50/60 text-red-800 font-bold'}`}>
                            <div className="text-[9px] text-slate-500 uppercase mb-0.5 font-bold">Temp</div>
                            <div className="text-lg font-mono">{comp.currentTemp.toFixed(1)}°</div>
                          </div>
                          <div className={`p-2 rounded-lg border ${isHygroOk ? 'border-green-200 bg-green-50/60 text-green-800 font-bold' : 'border-red-200 bg-red-50/60 text-red-800 font-bold'}`}>
                            <div className="text-[9px] text-slate-500 uppercase mb-0.5 font-bold">Hygro</div>
                            <div className="text-lg font-mono">{comp.currentHumidity.toFixed(1)}%</div>
                          </div>
                        </div>

                        {/* Barre de Progression (Chrono) */}
                        <div className="mt-auto">
                           {isFinished ? (
                             <div className="w-full text-center bg-green-100 text-green-800 text-xs font-bold py-1.5 rounded uppercase border border-green-200 animate-pulse">
                               Prêt à déguster
                             </div>
                           ) : (
                             <>
                               <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono font-bold uppercase">
                                 <span>J {elapsedDays.toFixed(1)}</span>
                                 <span>{comp.targetDurationDays} J</span>
                               </div>
                               <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                 <div 
                                   className="bg-gradient-to-r from-amber-800 to-amber-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                                   style={{ width: `${progressPct}%` }}
                                 ></div>
                               </div>
                             </>
                           )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
