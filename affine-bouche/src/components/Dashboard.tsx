'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { VIANDES, VIANDES_BY_CATEGORY, ViandeProfile } from '@/data/viandes';
import { VINS, VINS_BY_TYPE, VinProfile } from '@/data/vins';

// ============================================================
// SECTION 1 — TYPES & INTERFACES
// ============================================================

export interface CheeseProfile {
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

export type ContentType = 'fromage' | 'viande' | 'vin';

export interface CompartmentState {
  id: number;
  // Content
  contentType: ContentType;
  selectedItemId: string | null;
  // Fromage-specific
  preference: 'jeune' | 'moyen' | 'vieux';
  targetDurationDays: number;
  startDate: number | null;
  // Viande-specific
  maturePhase: 'conservation' | 'maturation' | 'post-maturation';
  // Vin-specific
  vinPhase: 'conservation' | 'vieillissement';
  // Sensors & actuators
  isAutoMode: boolean;
  currentTemp: number;
  currentHumidity: number;
  coolerActive: boolean;
  humidifierActive: boolean;
  fanActive: boolean;
}

// ============================================================
// SECTION 2 — HELPERS: TARGET CONDITIONS PER CONTENT TYPE
// ============================================================

function getDefaultTemp(contentType: ContentType): number {
  if (contentType === 'vin') return 12.0;
  if (contentType === 'viande') return 2.0;
  return 14.0; // fromage
}

function getTargetConditions(
  comp: CompartmentState,
  cheeses: CheeseProfile[]
): { targetTemp: number; targetHygro: number } | null {
  if (!comp.selectedItemId) return null;

  if (comp.contentType === 'fromage') {
    const cheese = cheeses.find(c => c.id === comp.selectedItemId);
    if (!cheese) return null;
    const min = cheese.affinageTempMin ?? 10;
    const max = cheese.affinageTempMax ?? 14;
    const hygro = cheese.affinageHygroMin ?? 85;
    let targetTemp = (min + max) / 2;
    if (comp.preference === 'jeune') targetTemp = min;
    if (comp.preference === 'vieux') targetTemp = max;
    return { targetTemp, targetHygro: hygro };
  }

  if (comp.contentType === 'viande') {
    const viande = VIANDES.find(v => v.id === comp.selectedItemId);
    if (!viande) return null;
    const tempMap = {
      'conservation': viande.temp_conservation_degC,
      'maturation': viande.temp_maturation_degC,
      'post-maturation': viande.temp_apres_maturation_degC,
    };
    return { targetTemp: tempMap[comp.maturePhase], targetHygro: viande.hygrometrie_pourcent };
  }

  if (comp.contentType === 'vin') {
    const vin = VINS.find(v => v.id === comp.selectedItemId);
    if (!vin) return null;
    const targetTemp = comp.vinPhase === 'conservation'
      ? vin.temp_conservation_degC
      : vin.temp_vieillissement_degC;
    return { targetTemp, targetHygro: vin.hygrometrie_pourcent };
  }

  return null;
}

// ============================================================
// SECTION 3 — COMPARTMENT CONTENT TYPE LABELS & ICONS
// ============================================================

const CONTENT_TYPE_META: Record<ContentType, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  fromage: { label: 'Fromage', icon: '🧀', color: 'text-amber-900', bgColor: 'bg-amber-50', borderColor: 'border-amber-900/60' },
  viande: { label: 'Viande',  icon: '🥩', color: 'text-red-900',   bgColor: 'bg-red-50',   borderColor: 'border-red-900/60' },
  vin:    { label: 'Vin',     icon: '🍷', color: 'text-purple-900', bgColor: 'bg-purple-50', borderColor: 'border-purple-900/60' },
};

// ============================================================
// SECTION 4 — DASHBOARD COMPONENT
// ============================================================

export default function Dashboard({ initialCheeses }: { initialCheeses: CheeseProfile[] }) {

  // ── 4.1 STATE ──────────────────────────────────────────────

  const [compartments, setCompartments] = useState<CompartmentState[]>(
    Array.from({ length: 6 }).map((_, index) => ({
      id: index + 1,
      contentType: 'fromage',
      selectedItemId: null,
      preference: 'moyen',
      targetDurationDays: 30,
      startDate: null,
      maturePhase: 'maturation',
      vinPhase: 'conservation',
      isAutoMode: true,
      currentTemp: 14.5,
      currentHumidity: 70.0,
      coolerActive: false,
      humidifierActive: false,
      fanActive: false,
    }))
  );

  const [activeCompartmentId, setActiveCompartmentId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setTick] = useState(0);

  // ── 4.2 SIMULATION LOOP ────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);

      setCompartments(prev => prev.map(comp => {
        let { currentTemp, currentHumidity, coolerActive, humidifierActive, fanActive, isAutoMode } = comp;

        if (isAutoMode && comp.selectedItemId) {
          const targets = getTargetConditions(comp, initialCheeses);
          if (targets) {
            const { targetTemp, targetHygro } = targets;
            coolerActive = currentTemp > targetTemp + 0.3;
            if (currentTemp <= targetTemp) coolerActive = false;
            humidifierActive = currentHumidity < targetHygro - 1;
            if (currentHumidity >= targetHygro) humidifierActive = false;
            fanActive = coolerActive || humidifierActive;
          }
        }

        let tempDelta = 0.02;
        if (coolerActive) tempDelta = -0.15;

        let hygroDelta = -0.05;
        if (humidifierActive) hygroDelta = 0.3;
        if (coolerActive && !humidifierActive) hygroDelta -= 0.1;

        return {
          ...comp,
          currentTemp: Number((currentTemp + tempDelta).toFixed(2)),
          currentHumidity: Number((Math.min(100, Math.max(0, currentHumidity + hygroDelta))).toFixed(2)),
          coolerActive,
          humidifierActive,
          fanActive,
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialCheeses]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('affine_bouche_compartments');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 6) {
            setCompartments(parsed);
          }
        } catch (e) {
          console.error("Failed to load compartments from localStorage", e);
        }
      }
    }
  }, []);

  // ── 4.3 EVENT HANDLERS ─────────────────────────────────────

  const updateCompartment = (id: number, updates: Partial<CompartmentState>) => {
    setCompartments(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem('affine_bouche_compartments', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleContentTypeChange = (id: number, contentType: ContentType) => {
    const defaultTemp = getDefaultTemp(contentType);
    updateCompartment(id, {
      contentType,
      selectedItemId: null,
      startDate: null,
      currentTemp: defaultTemp,
      preference: 'moyen',
      maturePhase: 'maturation',
      vinPhase: 'conservation',
    });
    setIsDropdownOpen(false);
  };

  const assignItem = (compartmentId: number, itemId: string | null, contentType: ContentType) => {
    if (!itemId) {
      updateCompartment(compartmentId, { selectedItemId: null, startDate: null });
      return;
    }

    if (contentType === 'fromage') {
      const cheese = initialCheeses.find(c => c.id === itemId);
      const min = cheese?.affinageDureeMin ?? 21;
      const max = cheese?.affinageDureeMax ?? 35;
      updateCompartment(compartmentId, {
        selectedItemId: itemId,
        startDate: Date.now(),
        targetDurationDays: Math.round((min + max) / 2),
      });
    } else {
      updateCompartment(compartmentId, { selectedItemId: itemId, startDate: Date.now() });
    }
  };

  const changePreference = (compartmentId: number, pref: 'jeune' | 'moyen' | 'vieux') => {
    const comp = compartments.find(c => c.id === compartmentId);
    const cheese = initialCheeses.find(c => c.id === comp?.selectedItemId);
    if (!cheese) return;
    const min = cheese.affinageDureeMin ?? 21;
    const max = cheese.affinageDureeMax ?? 35;
    const target = pref === 'jeune' ? min : pref === 'vieux' ? max : Math.round((min + max) / 2);
    updateCompartment(compartmentId, { preference: pref, targetDurationDays: target });
  };

  const toggleControl = (control: keyof CompartmentState) => {
    if (!activeCompartmentId) return;
    const activeComp = compartments.find(c => c.id === activeCompartmentId);
    if (!activeComp || activeComp.isAutoMode) return;
    updateCompartment(activeCompartmentId, { [control]: !activeComp[control] });
  };

  // ── 4.4 DERIVED DATA ───────────────────────────────────────

  const activeComp = compartments.find(c => c.id === activeCompartmentId);
  const activeContentMeta = activeComp ? CONTENT_TYPE_META[activeComp.contentType] : null;

  const activeItem = useMemo(() => {
    if (!activeComp?.selectedItemId) return null;
    if (activeComp.contentType === 'fromage') return initialCheeses.find(c => c.id === activeComp.selectedItemId) ?? null;
    if (activeComp.contentType === 'viande') return VIANDES.find(v => v.id === activeComp.selectedItemId) ?? null;
    if (activeComp.contentType === 'vin') return VINS.find(v => v.id === activeComp.selectedItemId) ?? null;
    return null;
  }, [activeComp, initialCheeses]);

  const cheesesByCategory = useMemo(() =>
    initialCheeses.reduce((acc, c) => {
      const cat = c.categorie ?? 'Autres';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(c);
      return acc;
    }, {} as Record<string, CheeseProfile[]>),
    [initialCheeses]
  );

  const now = Date.now();

  // ============================================================
  // SECTION 5 — RENDER: LEFT PANEL (CONFIG)
  // ============================================================

  const renderConfigPanel = () => {
    if (!activeCompartmentId || !activeComp) {
      return (
        <div className="text-slate-500 text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <span className="text-4xl block mb-3">👈</span>
          <p className="text-sm font-medium">Sélectionnez un compartiment dans la grille pour le configurer.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">

        {/* ── Content Type Tabs ── */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type de contenu</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CONTENT_TYPE_META) as ContentType[]).map(ct => {
              const meta = CONTENT_TYPE_META[ct];
              const isActive = activeComp.contentType === ct;
              return (
                <button
                  key={ct}
                  onClick={() => handleContentTypeChange(activeCompartmentId, ct)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${isActive ? `${meta.bgColor} ${meta.borderColor} ${meta.color}` : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <span className="text-lg">{meta.icon}</span>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Item Selector Dropdown ── */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {activeContentMeta?.label} sélectionné(e)
          </label>
          <div
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 cursor-pointer hover:border-amber-900/40 transition-colors flex justify-between items-center text-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="truncate">{activeItem ? (activeItem as any).nom : 'Aucun — emplacement libre'}</span>
            <span className={`text-slate-400 ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
              {/* Clear option */}
              <div
                className="px-4 py-2.5 cursor-pointer text-slate-500 hover:bg-slate-50 text-sm border-b border-slate-100 flex items-center gap-2"
                onClick={() => { assignItem(activeCompartmentId, null, activeComp.contentType); setIsDropdownOpen(false); }}
              >
                <span>❌</span> Retirer la sélection
              </div>

              {/* Fromages */}
              {activeComp.contentType === 'fromage' && Object.entries(cheesesByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <div className="bg-slate-50 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 sticky top-0 border-b border-slate-100">{cat}</div>
                  {items.map(c => (
                    <div key={c.id} className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeComp.selectedItemId === c.id ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => { assignItem(activeCompartmentId, c.id, 'fromage'); setIsDropdownOpen(false); }}>
                      {c.nom}
                    </div>
                  ))}
                </div>
              ))}

              {/* Viandes */}
              {activeComp.contentType === 'viande' && Object.entries(VIANDES_BY_CATEGORY).map(([cat, items]) => (
                <div key={cat}>
                  <div className="bg-slate-50 text-red-900 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 sticky top-0 border-b border-slate-100">{cat}</div>
                  {items.map(v => (
                    <div key={v.id} className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeComp.selectedItemId === v.id ? 'bg-red-50 text-red-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => { assignItem(activeCompartmentId, v.id, 'viande'); setIsDropdownOpen(false); }}>
                      {v.nom}
                    </div>
                  ))}
                </div>
              ))}

              {/* Vins */}
              {activeComp.contentType === 'vin' && Object.entries(VINS_BY_TYPE).map(([type, items]) => (
                <div key={type}>
                  <div className="bg-slate-50 text-purple-900 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 sticky top-0 border-b border-slate-100">{type}</div>
                  {items.map(v => (
                    <div key={v.id} className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeComp.selectedItemId === v.id ? 'bg-purple-50 text-purple-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => { assignItem(activeCompartmentId, v.id, 'vin'); setIsDropdownOpen(false); }}>
                      {v.nom}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Context-specific Parameters ── */}
        {activeItem && activeComp.contentType === 'fromage' && renderFromageParams(activeComp, activeItem as CheeseProfile)}
        {activeItem && activeComp.contentType === 'viande' && renderViandeParams(activeComp, activeItem as ViandeProfile)}
        {activeItem && activeComp.contentType === 'vin'    && renderVinParams(activeComp, activeItem as VinProfile)}

        {/* ── Auto Mode Toggle ── */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <p className="font-semibold text-slate-800 text-sm">Mode Automatique</p>
            <p className="text-xs text-slate-500">Régulation intelligente des capteurs</p>
          </div>
          <button
            onClick={() => updateCompartment(activeCompartmentId, { isAutoMode: !activeComp.isAutoMode })}
            className={`w-14 h-8 rounded-full transition-colors relative ${activeComp.isAutoMode ? 'bg-amber-900' : 'bg-slate-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${activeComp.isAutoMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>

        {/* ── Manual Controls ── */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contrôles manuels</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'coolerActive' as const,      label: 'Froid',        activeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
              { key: 'humidifierActive' as const,   label: 'Brumisateur',  activeClass: 'bg-teal-100 text-teal-800 border-teal-200' },
              { key: 'fanActive' as const,          label: 'Ventilation',  activeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
            ].map(({ key, label, activeClass }) => (
              <button
                key={key}
                onClick={() => toggleControl(key)}
                disabled={activeComp.isAutoMode}
                className={`p-2 rounded-lg text-xs font-bold border transition-colors ${activeComp[key] ? activeClass : 'bg-slate-50 text-slate-400 border-slate-200'} ${activeComp.isAutoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Fromage-specific param panel ──
  const renderFromageParams = (comp: CompartmentState, cheese: CheeseProfile) => (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-amber-50 border border-amber-900/10 rounded-lg p-3">
          <div className="text-slate-500 font-semibold uppercase mb-1">Température cible</div>
          <div className="text-amber-900 font-bold font-mono">{cheese.affinageTempMin}°C – {cheese.affinageTempMax}°C</div>
        </div>
        <div className="bg-amber-50 border border-amber-900/10 rounded-lg p-3">
          <div className="text-slate-500 font-semibold uppercase mb-1">Hygrométrie</div>
          <div className="text-amber-900 font-bold font-mono">{cheese.affinageHygroMin}% – {cheese.affinageHygroMax}%</div>
        </div>
      </div>
      {cheese.notes && (
        <p className="text-[11px] text-amber-900 bg-amber-50/50 border border-amber-900/10 p-3 rounded-lg italic leading-relaxed">{cheese.notes}</p>
      )}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Degré d'affinage</label>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {(['jeune', 'moyen', 'vieux'] as const).map(pref => (
            <button key={pref} onClick={() => changePreference(comp.id, pref)}
              className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${comp.preference === pref ? 'bg-amber-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {pref === 'jeune' ? 'Jeune' : pref === 'moyen' ? 'À point' : 'Corsé'}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-amber-900 font-bold mt-2 px-1">
          <span>Durée cible :</span>
          <span className="font-mono">{comp.targetDurationDays} jours</span>
        </div>
      </div>
    </div>
  );

  // ── Viande-specific param panel ──
  const renderViandeParams = (comp: CompartmentState, viande: ViandeProfile) => (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: 'Conservation', value: `${viande.temp_conservation_degC}°C` },
          { label: 'Maturation',   value: `${viande.temp_maturation_degC}°C` },
          { label: 'Post-matur.',  value: `${viande.temp_apres_maturation_degC}°C` },
          { label: 'Hygrométrie', value: `${viande.hygrometrie_pourcent}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-red-50 border border-red-900/10 rounded-lg p-2.5">
            <div className="text-slate-500 font-semibold uppercase text-[10px] mb-1">{label}</div>
            <div className="text-red-900 font-bold font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phase de maturation</label>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {(['conservation', 'maturation', 'post-maturation'] as const).map(phase => (
            <button key={phase} onClick={() => updateCompartment(comp.id, { maturePhase: phase })}
              className={`py-2 text-[10px] font-bold rounded-lg transition-all ${comp.maturePhase === phase ? 'bg-red-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {phase === 'conservation' ? 'Conserv.' : phase === 'maturation' ? 'Matur.' : 'Post'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Vin-specific param panel ──
  const renderVinParams = (comp: CompartmentState, vin: VinProfile) => (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: 'Conservation',    value: `${vin.temp_conservation_degC}°C` },
          { label: 'Vieillissement',  value: `${vin.temp_vieillissement_degC}°C` },
          { label: 'Hygrométrie',     value: `${vin.hygrometrie_pourcent}%` },
          { label: 'Service',         value: `${vin.temp_service_recommandee_degC}°C` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-purple-50 border border-purple-900/10 rounded-lg p-2.5">
            <div className="text-slate-500 font-semibold uppercase text-[10px] mb-1">{label}</div>
            <div className="text-purple-900 font-bold font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phase de gestion</label>
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {(['conservation', 'vieillissement'] as const).map(phase => (
            <button key={phase} onClick={() => updateCompartment(comp.id, { vinPhase: phase })}
              className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${comp.vinPhase === phase ? 'bg-purple-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {phase === 'conservation' ? 'Conservation' : 'Vieillissement'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // SECTION 6 — RENDER: GRID CARD
  // ============================================================

  const renderGridCard = (comp: CompartmentState) => {
    const isActive = activeCompartmentId === comp.id;
    const meta = CONTENT_TYPE_META[comp.contentType];

    let item: CheeseProfile | ViandeProfile | VinProfile | null = null;
    if (comp.contentType === 'fromage' && comp.selectedItemId) item = initialCheeses.find(c => c.id === comp.selectedItemId) ?? null;
    if (comp.contentType === 'viande' && comp.selectedItemId) item = VIANDES.find(v => v.id === comp.selectedItemId) ?? null;
    if (comp.contentType === 'vin'    && comp.selectedItemId) item = VINS.find(v => v.id === comp.selectedItemId) ?? null;

    const targets = getTargetConditions(comp, initialCheeses);
    const isTempOk  = targets ? Math.abs(comp.currentTemp     - targets.targetTemp)  < 1.0 : false;
    const isHygroOk = targets ? Math.abs(comp.currentHumidity - targets.targetHygro) < 5.0 : false;

    // Chrono (fromage only)
    let elapsedDays = 0, progressPct = 0;
    if (comp.contentType === 'fromage' && item && comp.startDate) {
      elapsedDays = (now - comp.startDate) / (1000 * 60 * 60 * 24);
      progressPct = Math.min(100, Math.max(0, (elapsedDays / comp.targetDurationDays) * 100));
    }
    const isFinished = comp.contentType === 'fromage' && elapsedDays >= comp.targetDurationDays && elapsedDays > 0;

    return (
      <div
        key={comp.id}
        onClick={() => setActiveCompartmentId(comp.id)}
        className={`relative z-10 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col ${isActive ? `${meta.borderColor} scale-[1.02] shadow-sm` : 'border-slate-200 hover:border-slate-300'} bg-white p-5 min-h-[220px]`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{meta.icon}</span>
            <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Zone {comp.id}</h4>
          </div>
          <div className="flex gap-1">
            {comp.coolerActive      && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Refroidissement actif"></span>}
            {comp.humidifierActive  && <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" title="Brumisateur actif"></span>}
          </div>
        </div>

        {/* Empty state */}
        {!item ? (
          <div className={`flex-1 flex flex-col items-center justify-center gap-1 ${meta.color} opacity-40 hover:opacity-70 transition-opacity`}>
            <span className="text-3xl">{meta.icon}</span>
            <span className="text-xs font-medium">Ajouter {comp.contentType === 'vin' ? 'un vin' : comp.contentType === 'viande' ? 'une viande' : 'un fromage'}</span>
          </div>
        ) : (
          <>
            {/* Item name */}
            <h5 className={`font-bold text-sm leading-snug mb-3 truncate ${meta.color}`}>{(item as any).nom}</h5>

            {/* Sensors */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`p-2 rounded-lg border text-xs ${isTempOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="text-slate-500 uppercase font-bold text-[9px] mb-0.5">Temp</div>
                <div className={`text-base font-mono font-bold ${isTempOk ? 'text-green-800' : 'text-red-800'}`}>{comp.currentTemp.toFixed(1)}°</div>
                {targets && <div className="text-[9px] text-slate-400 mt-0.5">cible {targets.targetTemp}°C</div>}
              </div>
              <div className={`p-2 rounded-lg border text-xs ${isHygroOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="text-slate-500 uppercase font-bold text-[9px] mb-0.5">Hygro</div>
                <div className={`text-base font-mono font-bold ${isHygroOk ? 'text-green-800' : 'text-red-800'}`}>{comp.currentHumidity.toFixed(1)}%</div>
                {targets && <div className="text-[9px] text-slate-400 mt-0.5">cible {targets.targetHygro}%</div>}
              </div>
            </div>

            {/* Footer: type-specific indicators */}
            <div className="mt-auto">
              {comp.contentType === 'fromage' && (
                isFinished ? (
                  <div className="w-full text-center bg-green-100 text-green-800 text-[10px] font-bold py-1.5 rounded-lg border border-green-200 animate-pulse uppercase">
                    ✓ Prêt à déguster
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono font-bold">
                      <span>J {elapsedDays.toFixed(1)}</span>
                      <span>{comp.targetDurationDays} J</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-800 to-amber-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </>
                )
              )}

              {comp.contentType === 'viande' && (
                <div className={`text-center py-1.5 rounded-lg text-[10px] font-bold uppercase ${meta.bgColor} ${meta.color} border ${meta.borderColor}`}>
                  Phase : {comp.maturePhase}
                </div>
              )}

              {comp.contentType === 'vin' && (
                <div className="flex justify-between items-center">
                  <div className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase ${meta.bgColor} ${meta.color} border ${meta.borderColor}`}>
                    {comp.vinPhase}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono font-bold">
                    Service {(item as VinProfile).temp_service_recommandee_degC}°C
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // ============================================================
  // SECTION 7 — MAIN RENDER
  // ============================================================

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10 text-slate-900">

      {/* ── Left Panel ── */}
      <div className="xl:col-span-4 space-y-6">
        <div className="relative z-50 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-5 text-slate-900 flex items-center gap-2">
            <span>{activeContentMeta?.icon ?? '⚙️'}</span>
            Compartiment {activeCompartmentId ? `#${activeCompartmentId}` : ''}
          </h3>
          {renderConfigPanel()}
        </div>
      </div>

      {/* ── Right Panel: Grid ── */}
      <div className="xl:col-span-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-amber-900">Cave d'Affinage — 6 Compartiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
            <div className="absolute inset-0 border-[8px] border-amber-900/10 rounded-xl pointer-events-none z-0"></div>
            {compartments.map(comp => renderGridCard(comp))}
          </div>
        </div>
      </div>

    </div>
  );
}
