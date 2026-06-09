'use client';

import React, { useState, useMemo } from 'react';
import { Bluetooth } from 'lucide-react';
import { 
  useSimulationCave, 
  ContentType, 
  CompartmentState, 
  CheeseProfile, 
  ViandeProfile, 
  VinProfile,
  getTargetConditions 
} from '../hooks/useSimulationCave';

// ============================================================
// SECTION 1 — COMPARTMENT CONTENT TYPE LABELS & ICONS
// ============================================================

const CONTENT_TYPE_META: Record<ContentType, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  fromage: { label: 'Fromage', icon: '🧀', color: 'text-amber-900', bgColor: 'bg-amber-50', borderColor: 'border-amber-900/60' },
  viande: { label: 'Viande',  icon: '🥩', color: 'text-red-900',   bgColor: 'bg-red-50',   borderColor: 'border-red-900/60' },
  vin:    { label: 'Vin',     icon: '🍷', color: 'text-purple-900', bgColor: 'bg-purple-50', borderColor: 'border-purple-900/60' },
};

// ============================================================
// SECTION 2 — DASHBOARD COMPONENT
// ============================================================

export default function Dashboard({ 
  initialCheeses, 
  initialViandes, 
  initialVins 
}: { 
  initialCheeses: CheeseProfile[];
  initialViandes: ViandeProfile[];
  initialVins: VinProfile[];
}) {

  const [cheeses, setCheeses] = useState<CheeseProfile[]>(initialCheeses);
  const [viandes, setViandes] = useState<ViandeProfile[]>(initialViandes);
  const [vins, setVins] = useState<VinProfile[]>(initialVins);

  const {
    compartments,
    updateCompartment,
    handleContentTypeChange,
    assignItem,
    changePreference,
    toggleControl
  } = useSimulationCave(cheeses, viandes, vins);

  const [activeCompartmentId, setActiveCompartmentId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding custom product
  const [modalProductType, setModalProductType] = useState<ContentType>('fromage');
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    lait: 'Vache',
    // Fromage specific
    affinageTempMin: '10',
    affinageTempMax: '14',
    affinageHygroMin: '85',
    affinageHygroMax: '90',
    affinageDureeMin: '15',
    affinageDureeMax: '30',
    notes: '',
    // Viande specific
    temp_conservation_degC: '2',
    temp_maturation_degC: '2',
    hygrometrie_pourcent: '80',
    temp_apres_maturation_degC: '4',
    // Vin specific
    temp_vieillissement_degC: '12',
    temp_service_recommandee_degC: '16'
  });
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrapper for ContentType change
  const onContentTypeChange = (id: number, contentType: ContentType) => {
    handleContentTypeChange(id, contentType);
    setIsDropdownOpen(false);
  };

  // Wrapper for toggleControl
  const onToggleActuator = (control: keyof CompartmentState) => {
    if (!activeCompartmentId) return;
    toggleControl(activeCompartmentId, control);
  };

  // ── 2.1 DERIVED DATA ───────────────────────────────────────

  const activeComp = compartments.find(c => c.id === activeCompartmentId);
  const activeContentMeta = activeComp ? CONTENT_TYPE_META[activeComp.contentType] : null;

  const activeItem = useMemo(() => {
    if (!activeComp?.selectedItemId) return null;
    if (activeComp.contentType === 'fromage') return cheeses.find(c => c.id === activeComp.selectedItemId) ?? null;
    if (activeComp.contentType === 'viande') return viandes.find(v => v.id === activeComp.selectedItemId) ?? null;
    if (activeComp.contentType === 'vin') return vins.find(v => v.id === activeComp.selectedItemId) ?? null;
    return null;
  }, [activeComp, cheeses, viandes, vins]);

  const cheesesByCategory = useMemo(() =>
    cheeses.reduce((acc, c) => {
      const cat = c.categorie ?? 'Autres';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(c);
      return acc;
    }, {} as Record<string, CheeseProfile[]>),
    [cheeses]
  );

  const viandesByCategory = useMemo(() =>
    viandes.reduce((acc, v) => {
      if (!acc[v.categorie]) acc[v.categorie] = [];
      acc[v.categorie].push(v);
      return acc;
    }, {} as Record<string, ViandeProfile[]>),
    [viandes]
  );

  const vinsByType = useMemo(() =>
    vins.reduce((acc, v) => {
      if (!acc[v.type]) acc[v.type] = [];
      acc[v.type].push(v);
      return acc;
    }, {} as Record<string, VinProfile[]>),
    [vins]
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
                  onClick={() => onContentTypeChange(activeCompartmentId, ct)}
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              {activeContentMeta?.label} sélectionné(e)
            </label>
            <button
              onClick={() => {
                setModalProductType(activeComp.contentType);
                setFormData(prev => ({
                  ...prev,
                  nom: '',
                  categorie: '',
                  notes: ''
                }));
                setIsModalOpen(true);
              }}
              className="text-xs font-bold text-amber-900 hover:text-amber-800 flex items-center gap-1 transition-colors bg-amber-50 px-2 py-0.5 rounded border border-amber-900/10"
            >
              ➕ Ajouter
            </button>
          </div>
          <div
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 cursor-pointer hover:border-amber-900/40 transition-colors flex justify-between items-center text-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="truncate">{activeItem ? (activeItem as any).nom : 'Aucun — emplacement libre'}</span>
            <span className={`text-slate-400 ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
              {/* Add custom option */}
              <div
                className="px-4 py-2.5 cursor-pointer text-amber-900 font-bold hover:bg-amber-50 text-sm border-b border-slate-100 flex items-center gap-2"
                onClick={() => {
                  setModalProductType(activeComp.contentType);
                  setFormData(prev => ({
                    ...prev,
                    nom: '',
                    categorie: '',
                    notes: ''
                  }));
                  setIsModalOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <span>➕</span> Créer un produit personnalisé...
              </div>

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
              {activeComp.contentType === 'viande' && Object.entries(viandesByCategory).map(([cat, items]) => (
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
              {activeComp.contentType === 'vin' && Object.entries(vinsByType).map(([type, items]) => (
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

        {/* ── Manual Mode Parameters Sliders ── */}
        {!activeComp.isAutoMode && (
          <div className="bg-amber-50/40 border border-amber-900/10 rounded-xl p-4 space-y-4 shadow-sm animate-in fade-in duration-300">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Consignes Personnalisées</h4>
            
            {/* Custom Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Température Cible :</span>
                <span className="font-mono font-bold text-amber-900">{(activeComp.customTargetTemp ?? 12).toFixed(1)}°C</span>
              </div>
              <input 
                type="range" 
                min={activeComp.contentType === 'viande' ? "-2" : "4"} 
                max="22" 
                step="0.5"
                value={activeComp.customTargetTemp ?? 12}
                onChange={(e) => updateCompartment(activeCompartmentId, { customTargetTemp: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{activeComp.contentType === 'viande' ? "-2°C" : "4°C"}</span>
                <span>22°C</span>
              </div>
            </div>

            {/* Custom Humidity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Hygrométrie Cible :</span>
                <span className="font-mono font-bold text-amber-900">{activeComp.customTargetHumidity ?? 80}%</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="98" 
                step="1"
                value={activeComp.customTargetHumidity ?? 80}
                onChange={(e) => updateCompartment(activeCompartmentId, { customTargetHumidity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40%</span>
                <span>98%</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Manual Controls ── */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">État des Actionneurs</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'coolerActive' as const,      label: 'Froid',        activeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
              { key: 'humidifierActive' as const,   label: 'Brumisateur',  activeClass: 'bg-teal-100 text-teal-800 border-teal-200' },
              { key: 'fanActive' as const,          label: 'Ventilation',  activeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
            ].map(({ key, label, activeClass }) => (
              <button
                key={key}
                onClick={() => onToggleActuator(key)}
                disabled={activeComp.isAutoMode}
                className={`p-2 rounded-lg text-xs font-bold border transition-colors ${activeComp[key] ? activeClass : 'bg-slate-50 text-slate-405 border-slate-200'} ${activeComp.isAutoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    if (comp.contentType === 'viande' && comp.selectedItemId) item = initialViandes.find(v => v.id === comp.selectedItemId) ?? null;
    if (comp.contentType === 'vin'    && comp.selectedItemId) item = initialVins.find(v => v.id === comp.selectedItemId) ?? null;

    const targets = getTargetConditions(comp, initialCheeses, initialViandes, initialVins);
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

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom) {
      setModalError('Le nom du produit est requis.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);

    try {
      const response = await fetch('/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: modalProductType,
          data: formData
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Erreur lors de la sauvegarde.');
      }

      const newItem = resData.item;

      // Update local lists
      if (modalProductType === 'fromage') {
        setCheeses(prev => [...prev, newItem].sort((a, b) => a.nom.localeCompare(b.nom)));
      } else if (modalProductType === 'viande') {
        setViandes(prev => [...prev, newItem].sort((a, b) => a.nom.localeCompare(b.nom)));
      } else if (modalProductType === 'vin') {
        setVins(prev => [...prev, newItem].sort((a, b) => a.nom.localeCompare(b.nom)));
      }

      // Auto-assign to current compartment if applicable
      if (activeCompartmentId) {
        assignItem(activeCompartmentId, newItem.id, modalProductType);
      }

      // Reset & close
      setFormData({
        nom: '',
        categorie: '',
        lait: 'Vache',
        affinageTempMin: '10',
        affinageTempMax: '14',
        affinageHygroMin: '85',
        affinageHygroMax: '90',
        affinageDureeMin: '15',
        affinageDureeMax: '30',
        notes: '',
        temp_conservation_degC: '2',
        temp_maturation_degC: '2',
        hygrometrie_pourcent: '80',
        temp_apres_maturation_degC: '4',
        temp_vieillissement_degC: '12',
        temp_service_recommandee_degC: '16'
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  return (
    <div className="space-y-8">
      {/* MVP Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 p-6 rounded-2xl shadow-sm gap-4">
        <div>
          <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block mb-1">
            Console de Contrôle en Temps Réel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            L'Affine Bouche Connect
          </h1>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md shadow-amber-900/10 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Bluetooth className="w-4 h-4 animate-pulse" />
          Se connecter à ma cave
        </button>
      </div>

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
            <h2 className="text-xl font-bold mb-6 text-amber-900">Cave d'Affinage — 5 Zones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
              <div className="absolute inset-0 border-[8px] border-amber-900/10 rounded-xl pointer-events-none z-0"></div>
              {compartments.map((comp, idx) => (
                <div key={comp.id} className={idx === 4 ? "md:col-span-2" : ""}>
                  {renderGridCard(comp)}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Premium Product Creation Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold p-2"
            >
              ✕
            </button>

            <div>
              <span className="text-amber-800 text-xs font-bold uppercase tracking-wider block mb-1">Personnalisation</span>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Ajouter mon produit</h3>
              <p className="text-slate-500 text-xs mt-1">Créez votre propre profil et configurez ses consignes d'affinage optimales.</p>
            </div>

            {/* Type selector tabs inside Modal */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
              {(['fromage', 'viande', 'vin'] as ContentType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setModalProductType(type)}
                  className={`py-2 px-3 text-xs font-extrabold rounded-xl transition-all ${
                    modalProductType === type
                      ? 'bg-amber-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {type === 'fromage' ? '🧀 Fromage' : type === 'viande' ? '🥩 Viande' : '🍷 Vin'}
                </button>
              ))}
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold">
                ⚠️ {modalError}
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              {/* Common Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-600">Nom du produit <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="ex: Mon Reblochon Fermier, Saucisse de sanglier..."
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                />
              </div>

              {/* Dynamic inputs based on Type */}
              {modalProductType === 'fromage' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Catégorie</label>
                      <input
                        type="text"
                        placeholder="ex: Pâte pressée non cuite"
                        value={formData.categorie}
                        onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Type de lait</label>
                      <select
                        value={formData.lait}
                        onChange={(e) => setFormData(prev => ({ ...prev, lait: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      >
                        <option value="Vache">Vache</option>
                        <option value="Chèvre">Chèvre</option>
                        <option value="Brebis">Brebis</option>
                        <option value="Buffle">Buffle</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Affinage Min (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.affinageTempMin}
                        onChange={(e) => setFormData(prev => ({ ...prev, affinageTempMin: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Affinage Max (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.affinageTempMax}
                        onChange={(e) => setFormData(prev => ({ ...prev, affinageTempMax: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Hygrométrie Min (%)</label>
                      <input
                        type="number"
                        value={formData.affinageHygroMin}
                        onChange={(e) => setFormData(prev => ({ ...prev, affinageHygroMin: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Hygrométrie Max (%)</label>
                      <input
                        type="number"
                        value={formData.affinageHygroMax}
                        onChange={(e) => setFormData(prev => ({ ...prev, affinageHygroMax: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Durée Min (jours)</label>
                      <input
                        type="number"
                        value={formData.affinageDureeMin}
                        onChange={(e) => setFormData(prev => ({ ...prev, affinageDureeMin: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Durée Max (jours)</label>
                      <input
                        type="number"
                        value={formData.affinageDureeMax}
                        onChange={(e) => setFormData(prev => ({ ...prev, affinageDureeMax: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-600">Notes & Conseils</label>
                    <textarea
                      placeholder="ex: Brosser à l'eau salée deux fois par semaine..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors resize-none"
                    />
                  </div>
                </>
              )}

              {modalProductType === 'viande' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-slate-600">Catégorie</label>
                    <input
                      type="text"
                      placeholder="ex: Boeuf (Bifteck), Porc (Longe)..."
                      value={formData.categorie}
                      onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Conservation (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.temp_conservation_degC}
                        onChange={(e) => setFormData(prev => ({ ...prev, temp_conservation_degC: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Maturation (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.temp_maturation_degC}
                        onChange={(e) => setFormData(prev => ({ ...prev, temp_maturation_degC: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Hygrométrie (%)</label>
                      <input
                        type="number"
                        value={formData.hygrometrie_pourcent}
                        onChange={(e) => setFormData(prev => ({ ...prev, hygrometrie_pourcent: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Post-Maturation (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.temp_apres_maturation_degC}
                        onChange={(e) => setFormData(prev => ({ ...prev, temp_apres_maturation_degC: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalProductType === 'vin' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-slate-600">Type de Vin (Catégorie)</label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="Rouge">Rouge</option>
                      <option value="Blanc">Blanc</option>
                      <option value="Rosé">Rosé</option>
                      <option value="Jaune">Jaune</option>
                      <option value="Pétillant / Champagne">Pétillant / Champagne</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Conservation (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.temp_conservation_degC}
                        onChange={(e) => setFormData(prev => ({ ...prev, temp_conservation_degC: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Vieillissement (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.temp_vieillissement_degC}
                        onChange={(e) => setFormData(prev => ({ ...prev, temp_vieillissement_degC: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Hygrométrie (%)</label>
                      <input
                        type="number"
                        value={formData.hygrometrie_pourcent}
                        onChange={(e) => setFormData(prev => ({ ...prev, hygrometrie_pourcent: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-600">Temp. Service (°C)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.temp_service_recommandee_degC}
                        onChange={(e) => setFormData(prev => ({ ...prev, temp_service_recommandee_degC: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-center cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-amber-900/10 text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sauvegarde...
                    </>
                  ) : (
                    'Ajouter à la cave'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
