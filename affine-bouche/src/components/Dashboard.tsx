'use client';

import React, { useState, useMemo } from 'react';
import { Bluetooth } from 'lucide-react';
import { 
  useSimulationCave, 
  ContentType, 
  CompartmentState, 
  CheeseProfile, 
  ViandeProfile, 
  VinProfile 
} from '../hooks/useSimulationCave';
import ThemeToggle from './ThemeToggle';
import HistoryChart from './HistoryChart';
import ProductModal from './ProductModal';
import CompartmentCard from './CompartmentCard';
import { CONTENT_TYPE_META } from '../data/constants';

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

  // Bluetooth scanning & connection states
  const [bluetoothState, setBluetoothState] = useState<'disconnected' | 'scanning' | 'connecting' | 'connected'>('disconnected');
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [foundDevices, setFoundDevices] = useState<string[]>([]);
  const [connectionProgress, setConnectionProgress] = useState(0);

  const {
    compartments,
    updateCompartment,
    handleContentTypeChange,
    assignItem,
    changePreference,
    toggleControl,
    clearAllCompartments,
    loadSavedCompartments,
    clearCompartmentsState
  } = useSimulationCave(cheeses, viandes, vins, connectedDevice);
  const [activeCompartmentId, setActiveCompartmentId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProductType, setModalProductType] = useState<ContentType>('fromage');

  const startScanning = () => {
    setBluetoothState('scanning');
    setFoundDevices([]);
    setTimeout(() => {
      setFoundDevices(['L\'Affine Bouche - Cave V1 #0412', 'L\'Affine Bouche - Pro Cave #8951']);
    }, 1800);
  };

  const connectToDevice = (deviceName: string) => {
    setBluetoothState('connecting');
    setConnectionProgress(0);
    
    const duration = 1800; // 1.8s
    const step = 40; // update every 40ms
    const increment = 100 / (duration / step);
    
    const interval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, step);

    setTimeout(() => {
      setBluetoothState('connected');
      setConnectedDevice(deviceName);
      loadSavedCompartments(deviceName); // Load configured items from memory on connection
      setTimeout(() => {
        setShowBluetoothModal(false);
      }, 1200);
    }, duration);
  };

  const disconnectDevice = () => {
    setBluetoothState('disconnected');
    setConnectedDevice(null);
    clearCompartmentsState(); // Clear the view state on disconnect, keeping the localStorage safe
  };

  // Close Bluetooth modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBluetoothModal) {
        setShowBluetoothModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showBluetoothModal]);  // Wrapper for ContentType change
  const onContentTypeChange = (id: number, contentType: ContentType) => {
    handleContentTypeChange(id, contentType);
    setIsDropdownOpen(false);
  };

  // Wrapper for toggleControl
  const onToggleActuator = (control: keyof CompartmentState) => {
    if (!activeCompartmentId) return;
    toggleControl(activeCompartmentId, control);
  };

  // Derived active state
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

  const handleProductAdded = (newItem: CheeseProfile | ViandeProfile | VinProfile, type: ContentType) => {
    if (type === 'fromage') {
      setCheeses(prev => [...prev, newItem as CheeseProfile].sort((a, b) => a.nom.localeCompare(b.nom)));
    } else if (type === 'viande') {
      setViandes(prev => [...prev, newItem as ViandeProfile].sort((a, b) => a.nom.localeCompare(b.nom)));
    } else if (type === 'vin') {
      setVins(prev => [...prev, newItem as VinProfile].sort((a, b) => a.nom.localeCompare(b.nom)));
    }

    if (activeCompartmentId) {
      assignItem(activeCompartmentId, newItem.id, type);
    }
  };

  // Fromage Parameters
  const renderFromageParams = (comp: CompartmentState, cheese: CheeseProfile) => (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-900/10 dark:border-amber-800/20 rounded-lg p-3">
          <div className="text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Température cible</div>
          <div className="text-amber-900 dark:text-amber-400 font-bold font-mono">{cheese.affinageTempMin}°C – {cheese.affinageTempMax}°C</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-900/10 dark:border-amber-800/20 rounded-lg p-3">
          <div className="text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Hygrométrie</div>
          <div className="text-amber-900 dark:text-amber-400 font-bold font-mono">{cheese.affinageHygroMin}% – {cheese.affinageHygroMax}%</div>
        </div>
      </div>
      {cheese.notes && (
        <p className="text-[11px] text-amber-900 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-900/10 dark:border-amber-800/10 p-3 rounded-lg italic leading-relaxed">{cheese.notes}</p>
      )}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Degré d'affinage</label>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850">
          {(['jeune', 'moyen', 'vieux'] as const).map(pref => (
            <button key={pref} onClick={() => changePreference(comp.id, pref)}
              className={`py-2 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${comp.preference === pref ? 'bg-amber-900 dark:bg-amber-800 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              {pref === 'jeune' ? 'Jeune' : pref === 'moyen' ? 'À point' : 'Corsé'}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-amber-900 dark:text-amber-400 font-bold mt-2 px-1">
          <span>Durée cible :</span>
          <span className="font-mono">{comp.targetDurationDays} jours</span>
        </div>
      </div>
    </div>
  );

  // Viande Parameters
  const renderViandeParams = (comp: CompartmentState, viande: ViandeProfile) => (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: 'Conservation', value: `${viande.temp_conservation_degC}°C` },
          { label: 'Maturation',   value: `${viande.temp_maturation_degC}°C` },
          { label: 'Post-matur.',  value: `${viande.temp_apres_maturation_degC}°C` },
          { label: 'Hygrométrie', value: `${viande.hygrometrie_pourcent}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-red-50 dark:bg-red-950/20 border border-red-900/10 dark:border-red-800/20 rounded-lg p-2.5">
            <div className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] mb-1">{label}</div>
            <div className="text-red-900 dark:text-red-400 font-bold font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phase de maturation</label>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850">
          {(['conservation', 'maturation', 'post-maturation'] as const).map(phase => (
            <button key={phase} onClick={() => updateCompartment(comp.id, { maturePhase: phase })}
              className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${comp.maturePhase === phase ? 'bg-red-900 dark:bg-red-800 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              {phase === 'conservation' ? 'Conserv.' : phase === 'maturation' ? 'Matur.' : 'Post'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Vin Parameters
  const renderVinParams = (comp: CompartmentState, vin: VinProfile) => (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: 'Conservation',    value: `${vin.temp_conservation_degC}°C` },
          { label: 'Vieillissement',  value: `${vin.temp_vieillissement_degC}°C` },
          { label: 'Hygrométrie',     value: `${vin.hygrometrie_pourcent}%` },
          { label: 'Service',         value: `${vin.temp_service_recommandee_degC}°C` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-purple-50 dark:bg-purple-950/20 border border-purple-900/10 dark:border-purple-800/20 rounded-lg p-2.5">
            <div className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] mb-1">{label}</div>
            <div className="text-purple-900 dark:text-purple-400 font-bold font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phase de gestion</label>
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850">
          {(['conservation', 'vieillissement'] as const).map(phase => (
            <button key={phase} onClick={() => updateCompartment(comp.id, { vinPhase: phase })}
              className={`py-2 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${comp.vinPhase === phase ? 'bg-purple-900 dark:bg-purple-800 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'}`}>
              {phase === 'conservation' ? 'Conservation' : 'Vieillissement'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Left Config Panel Renders
  const renderConfigPanel = () => {
    if (!activeCompartmentId || !activeComp) {
      return (
        <div className="text-slate-500 dark:text-slate-400 text-center py-12 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <span className="text-4xl block mb-3">👈</span>
          <p className="text-sm font-medium">Sélectionnez un compartiment dans la grille pour le configurer.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Content Type Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type de contenu</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CONTENT_TYPE_META) as ContentType[]).map(ct => {
              const meta = CONTENT_TYPE_META[ct];
              const isActive = activeComp.contentType === ct;
              return (
                <button
                  key={ct}
                  onClick={() => onContentTypeChange(activeCompartmentId, ct)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isActive ? `${meta.bgColor} ${meta.borderColor} ${meta.color}` : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-805 text-slate-505 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                  <span className="text-lg">{meta.icon}</span>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Item Selector Dropdown */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {activeContentMeta?.label} sélectionné(e)
            </label>
            <button
              onClick={() => {
                setModalProductType(activeComp.contentType);
                setIsModalOpen(true);
              }}
              className="text-xs font-bold text-amber-900 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 flex items-center gap-1 transition-colors bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/10 dark:border-amber-800/10 cursor-pointer"
            >
              ➕ Ajouter
            </button>
          </div>
          <div
            className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-800 dark:text-slate-200 cursor-pointer hover:border-amber-900/40 dark:hover:border-amber-700/40 transition-colors flex justify-between items-center text-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="truncate">{activeItem ? (activeItem as any).nom : 'Aucun — emplacement libre'}</span>
            <span className={`text-slate-400 ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
              {/* Add custom option */}
              <div
                className="px-4 py-2.5 cursor-pointer text-amber-900 dark:text-amber-500 font-bold hover:bg-amber-50 dark:hover:bg-amber-950/40 text-sm border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"
                onClick={() => {
                  setModalProductType(activeComp.contentType);
                  setIsModalOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <span>➕</span> Créer un produit personnalisé...
              </div>

              {/* Clear option */}
              <div
                className="px-4 py-2.5 cursor-pointer text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"
                onClick={() => { assignItem(activeCompartmentId, null, activeComp.contentType); setIsDropdownOpen(false); }}
              >
                <span>❌</span> Retirer la sélection
              </div>

              {/* Fromages */}
              {activeComp.contentType === 'fromage' && Object.entries(cheesesByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <div className="bg-slate-50 dark:bg-slate-950 text-amber-900 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 sticky top-0 border-b border-slate-100 dark:border-slate-800">{cat}</div>
                  {items.map(c => (
                    <div key={c.id} className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeComp.selectedItemId === c.id ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                      onClick={() => { assignItem(activeCompartmentId, c.id, 'fromage'); setIsDropdownOpen(false); }}>
                      {c.nom}
                    </div>
                  ))}
                </div>
              ))}

              {/* Viandes */}
              {activeComp.contentType === 'viande' && Object.entries(viandesByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <div className="bg-slate-50 dark:bg-slate-950 text-red-900 dark:text-red-500 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 sticky top-0 border-b border-slate-100 dark:border-slate-800">{cat}</div>
                  {items.map(v => (
                    <div key={v.id} className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeComp.selectedItemId === v.id ? 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                      onClick={() => { assignItem(activeCompartmentId, v.id, 'viande'); setIsDropdownOpen(false); }}>
                      {v.nom}
                    </div>
                  ))}
                </div>
              ))}

              {/* Vins */}
              {activeComp.contentType === 'vin' && Object.entries(vinsByType).map(([type, items]) => (
                <div key={type}>
                  <div className="bg-slate-50 dark:bg-slate-950 text-purple-900 dark:text-purple-500 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 sticky top-0 border-b border-slate-100 dark:border-slate-800">{type}</div>
                  {items.map(v => (
                    <div key={v.id} className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeComp.selectedItemId === v.id ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                      onClick={() => { assignItem(activeCompartmentId, v.id, 'vin'); setIsDropdownOpen(false); }}>
                      {v.nom}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context-specific Parameters */}
        {activeItem && activeComp.contentType === 'fromage' && renderFromageParams(activeComp, activeItem as CheeseProfile)}
        {activeItem && activeComp.contentType === 'viande' && renderViandeParams(activeComp, activeItem as ViandeProfile)}
        {activeItem && activeComp.contentType === 'vin'    && renderVinParams(activeComp, activeItem as VinProfile)}

        {/* Auto Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Mode Automatique</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Régulation intelligente des capteurs</p>
          </div>
          <button
            onClick={() => updateCompartment(activeCompartmentId, { isAutoMode: !activeComp.isAutoMode })}
            className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${activeComp.isAutoMode ? 'bg-amber-900 dark:bg-amber-800' : 'bg-slate-305 dark:bg-slate-700'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${activeComp.isAutoMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>

        {/* Manual Mode Parameters Sliders */}
        {!activeComp.isAutoMode && (
          <div className="bg-amber-50/40 dark:bg-amber-950/5 border border-amber-900/10 dark:border-amber-800/10 rounded-xl p-4 space-y-4 shadow-sm animate-in fade-in duration-300">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-wider">Consignes Personnalisées</h4>
            
            {/* Custom Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-605 dark:text-slate-400 font-medium">Température Cible :</span>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-400">{(activeComp.customTargetTemp ?? 12).toFixed(1)}°C</span>
              </div>
              <input 
                type="range" 
                min={activeComp.contentType === 'viande' ? "-2" : "4"} 
                max="22" 
                step="0.5"
                value={activeComp.customTargetTemp ?? 12}
                onChange={(e) => updateCompartment(activeCompartmentId, { customTargetTemp: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-900 dark:accent-amber-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>{activeComp.contentType === 'viande' ? "-2°C" : "4°C"}</span>
                <span>22°C</span>
              </div>
            </div>

            {/* Custom Humidity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-650 dark:text-slate-400 font-medium">Hygrométrie Cible :</span>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-400">{activeComp.customTargetHumidity ?? 80}%</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="98" 
                step="1"
                value={activeComp.customTargetHumidity ?? 80}
                onChange={(e) => updateCompartment(activeCompartmentId, { customTargetHumidity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-900 dark:accent-amber-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>40%</span>
                <span>98%</span>
              </div>
            </div>
          </div>
        )}

        {/* Manual Controls */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">État des Actionneurs</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'coolerActive' as const,      label: 'Froid',        activeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40' },
              { key: 'humidifierActive' as const,   label: 'Brumisateur',  activeClass: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/40' },
              { key: 'fanActive' as const,          label: 'Ventilation',  activeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40' },
            ].map(({ key, label, activeClass }) => (
              <button
                key={key}
                onClick={() => onToggleActuator(key)}
                disabled={activeComp.isAutoMode}
                className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${activeComp[key] ? activeClass : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-850'} ${activeComp.isAutoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen py-4 space-y-8 overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 -z-10 w-[500px] h-[500px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-12 right-1/4 -z-10 w-[600px] h-[600px] rounded-full bg-purple-500/5 dark:bg-purple-900/5 blur-[130px] pointer-events-none"></div>

      {/* MVP Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none gap-6 transition-all duration-500">
        <div>
          <span className="text-amber-800 dark:text-amber-500 text-xs font-black uppercase tracking-[0.25em] block mb-2">
            Console de Contrôle en Temps Réel
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            L'Affine Bouche <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-900 dark:from-amber-400 dark:to-amber-600">Connect</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => {
              if (bluetoothState === 'connected') {
                disconnectDevice();
              } else {
                setShowBluetoothModal(true);
                startScanning();
              }
            }}
            className={`${
              bluetoothState === 'connected'
                ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white shadow-lg shadow-green-500/10 hover:scale-[1.02] active:scale-[0.98]'
                : bluetoothState === 'scanning' || bluetoothState === 'connecting'
                ? 'bg-amber-900 hover:bg-amber-805 dark:bg-amber-800 dark:hover:bg-amber-700 text-white shadow-lg shadow-amber-900/10 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-50/50 dark:bg-slate-950/50 text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200'
            } px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer`}
          >
            <Bluetooth className={`w-4 h-4 ${bluetoothState === 'scanning' || bluetoothState === 'connecting' ? 'animate-spin text-white' : bluetoothState === 'connected' ? 'text-white animate-pulse' : 'text-slate-400'}`} />
            {bluetoothState === 'connected' 
              ? `Connecté : ${connectedDevice?.split('#')[1] || 'Cave'}` 
              : bluetoothState === 'scanning'
              ? 'Recherche...'
              : bluetoothState === 'connecting'
              ? 'Connexion...'
              : 'Cave déconnectée'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10 text-slate-900 dark:text-slate-100">
        {/* Left Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="relative z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none transition-all duration-300">
            <h3 className="text-base font-black uppercase tracking-wider mb-6 text-slate-900 dark:text-white flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-850 pb-4">
              <span className="text-xl">{activeContentMeta?.icon ?? '⚙️'}</span>
              <span>Compartiment {activeCompartmentId ? `#${activeCompartmentId}` : ''}</span>
            </h3>
            <div className={bluetoothState !== 'connected' ? 'filter blur-md select-none pointer-events-none opacity-20 transition-all duration-500' : 'transition-all duration-500'}>
              {renderConfigPanel()}
            </div>

            {/* Real-time History Chart Integration on Left Panel */}
            <div className="mt-6 pt-6 border-t border-slate-105 dark:border-slate-850">
              {bluetoothState !== 'connected' ? (
                <div className="h-[210px] flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                  <span className="text-2xl mb-2">📡</span>
                  <p className="text-xs font-black text-slate-450 dark:text-slate-550 uppercase tracking-wider">Flux hors ligne</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-[220px] mx-auto">Associez votre cave en Bluetooth pour synchroniser et afficher la télémétrie en temps réel.</p>
                </div>
              ) : !activeComp ? (
                <div className="h-[210px] flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                  <span className="text-2xl mb-2">📊</span>
                  <p className="text-xs font-black text-slate-450 dark:text-slate-550 uppercase tracking-wider">Aucune zone active</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-[220px] mx-auto">Sélectionnez un compartiment de la cave pour analyser ses courbes de température et d'humidité.</p>
                </div>
              ) : (
                <HistoryChart history={activeComp.history} />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Grid */}
        <div className="xl:col-span-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
              <div>
                <h2 className="text-lg font-black text-amber-900 dark:text-amber-500 uppercase tracking-wide">Cave d'Affinage</h2>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Gérez individuellement les 6 compartiments indépendants</p>
              </div>
              <button
                disabled={bluetoothState !== 'connected'}
                onClick={clearAllCompartments}
                className="text-xs font-bold text-red-955 dark:text-red-300 hover:text-white dark:hover:text-white flex items-center gap-2 transition-all bg-red-50 dark:bg-red-950/20 hover:bg-red-600 dark:hover:bg-red-750 px-4 py-2.5 rounded-xl border border-red-200/30 dark:border-red-900/20 cursor-pointer shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>🗑️</span> Tout vider
              </button>
            </div>
            
            <div className="relative">
              {/* Blurred grid if disconnected */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 relative transition-all duration-700 ${bluetoothState !== 'connected' ? 'filter blur-[8px] select-none pointer-events-none opacity-20' : ''}`}>
                {compartments.map(comp => (
                  <CompartmentCard 
                    key={comp.id}
                    comp={comp}
                    activeCompartmentId={activeCompartmentId}
                    setActiveCompartmentId={setActiveCompartmentId}
                    cheeses={cheeses}
                    viandes={viandes}
                    vins={vins}
                    now={now}
                  />
                ))}
              </div>

              {/* Overlay CTA if disconnected */}
              {bluetoothState !== 'connected' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 rounded-2xl p-4 text-center">
                  <div className="bg-white/95 dark:bg-slate-900/95 p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] max-w-sm space-y-5 backdrop-blur-lg transform hover:scale-[1.01] transition-all duration-500">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-955 border border-amber-100 dark:border-amber-900/20 flex items-center justify-center relative shadow-inner">
                      <Bluetooth className="w-8 h-8 text-amber-850 dark:text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Console en attente de liaison</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                        Veuillez synchroniser votre console en Bluetooth pour surveiller et contrôler vos modules de vieillissement et d'affinage.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowBluetoothModal(true);
                        startScanning();
                      }}
                      className="w-full bg-amber-900 hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-full transition-all shadow-lg shadow-amber-900/10 cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Bluetooth className="w-4 h-4" />
                      Associer via Bluetooth
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Premium Product Creation Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={modalProductType}
        onProductAdded={handleProductAdded}
      />

      {/* Bluetooth Connection Modal */}
      {showBluetoothModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-200 space-y-6 transition-colors">
            
            {/* Close Button */}
            <button
              onClick={() => setShowBluetoothModal(false)}
              className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-305 transition-colors text-xl font-bold p-2 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-955 border border-amber-100 dark:border-amber-900/20 flex items-center justify-center relative">
                <Bluetooth className={`w-8 h-8 text-amber-800 dark:text-amber-500 ${bluetoothState === 'scanning' ? 'animate-pulse scale-110' : bluetoothState === 'connecting' ? 'animate-spin' : ''}`} />
                {bluetoothState === 'scanning' && (
                  <span className="absolute inset-0 rounded-full border border-amber-900/30 animate-ping opacity-60"></span>
                )}
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {bluetoothState === 'scanning' ? 'Recherche de cave...' : bluetoothState === 'connecting' ? 'Connexion en cours...' : bluetoothState === 'connected' ? 'Connexion établie !' : 'Bluetooth'}
              </h3>
              <p className="text-slate-505 dark:text-slate-400 text-xs">
                {bluetoothState === 'scanning' 
                  ? 'Recherche des caves à proximité via Bluetooth Low Energy...' 
                  : bluetoothState === 'connecting' 
                  ? 'Établissement du canal sécurisé de communication...' 
                  : 'Votre cave est maintenant synchronisée.'}
              </p>
            </div>

            {/* Content states */}
            {bluetoothState === 'scanning' && (
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold text-slate-405 dark:text-slate-400 uppercase tracking-wider">Appareils détectés :</p>
                {foundDevices.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 italic">Recherche d'appareils...</div>
                ) : (
                  foundDevices.map(device => (
                    <button
                      key={device}
                      onClick={() => connectToDevice(device)}
                      className="w-full text-left p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-900/40 dark:hover:border-amber-700/40 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-250 transition-all cursor-pointer hover:scale-[1.01] active:scale-95 flex justify-between items-center"
                    >
                      <span>{device}</span>
                      <span className="text-[10px] text-amber-800 dark:text-amber-500 bg-amber-50 dark:bg-amber-955 px-2 py-0.5 rounded border border-amber-900/10 dark:border-amber-900/20">Associer</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {bluetoothState === 'connecting' && (
              <div className="space-y-3">
                <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-205 dark:border-slate-850">
                  <div className="bg-amber-800 dark:bg-amber-600 h-2.5 rounded-full transition-all duration-75" style={{ width: `${connectionProgress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-black font-mono px-1">
                  <span>Liaison radio...</span>
                  <span>{Math.round(connectionProgress)}%</span>
                </div>
              </div>
            )}

            {bluetoothState === 'connected' && (
              <div className="text-center py-4 space-y-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-lg border border-green-200 dark:border-green-900/30 animate-bounce">
                  ✓
                </div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400">{connectedDevice}</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
