'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  ArrowLeft, 
  Layers, 
  HelpCircle,
  Check,
  Flame,
  ShoppingBag,
  Disc,
  Layers3,
  ArrowUp,
  ArrowDown,
  Building,
  Mail,
  Phone,
  User,
  MessageSquare,
  FileText
} from 'lucide-react';
import Link from 'next/link';

// Definitions matching implementation plan
export type FormatType = 'famille' | 'compact' | 'professionnel';

export type ModuleType = 
  | 'maitre'           
  | 'tout-en-un'       
  | 'affinage-standard';  

export type ChamberUsage = 'fromage' | 'vin' | 'viande';

export interface ModuleSpecs {
  type: ModuleType;
  name: string;
  price: number;
  heightCm: number;
  capacityDesc: string;
  description: string;
  gradient: string;
  textColor: string;
  features: string[];
}

export interface ConfiguredModule {
  id: string;
  type: ModuleType;
  usage: ChamberUsage;
  customName?: string;
  column?: number; // 0 (left), 1 (middle), 2 (right)
}

const MODULES_DATABASE: Record<ModuleType, ModuleSpecs> = {
  'maitre': {
    type: 'maitre',
    name: 'Bloc Spécial Maître',
    price: 350,
    heightCm: 40,
    capacityDesc: 'Centrale de Contrôle (Aucun stockage)',
    description: 'Le cerveau de votre installation modulaire. Intègre régulateur thermique, brumisateur d\'eau centralisé, capteurs moléculaires d\'odeurs, écran de contrôle tactile OLED et connectivité Wi-Fi 6.',
    gradient: 'from-amber-950 via-amber-900 to-amber-950 border-amber-800/30',
    textColor: 'text-amber-200',
    features: ['Wi-Fi 6 / Bluetooth', 'Écran Tactile OLED 5"', 'Hygro-brumisateur central', 'Filtre charbon actif']
  },
  'tout-en-un': {
    type: 'tout-en-un',
    name: 'Bloc Spécial Tout-en-un',
    price: 500,
    heightCm: 40,
    capacityDesc: 'Capacité : 5-8 Fromages / 6 Bouteilles',
    description: 'La solution compacte autonome. Intègre à la fois la centrale de contrôle et une chambre d\'affinage modulable de taille idéale. Non extensible.',
    gradient: 'from-amber-50 to-white border-amber-900/10',
    textColor: 'text-amber-900',
    features: ['Centrale intégrée', 'Chambre mono-zone réglable', 'Porte vitrée anti-UV', 'Éclairage LED doux']
  },
  'affinage-standard': {
    type: 'affinage-standard',
    name: 'Module d\'Affinage Standard',
    price: 250,
    heightCm: 40,
    capacityDesc: 'Capacité : 6-10 Fromages ou 6 Bouteilles de Vin',
    description: 'Le module standard et universel. Idéal pour conserver vos fromages à point, stocker vos bouteilles de vins ou faire maturer de la viande.',
    gradient: 'from-slate-50 via-white to-slate-50 border-slate-200',
    textColor: 'text-slate-800',
    features: ['Plateau en bois de hêtre', 'Sonde d\'humidité dédiée', 'Double vitrage thermique']
  }
};

export default function Configurateur() {
  const [format, setFormat] = useState<FormatType | null>(null);
  const [modules, setModules] = useState<ConfiguredModule[]>([]);
  const [step, setStep] = useState<'format-selection' | 'configuration' | 'summary' | 'devis-professionnel'>('format-selection');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Devis form states
  const [devisForm, setDevisForm] = useState({
    entreprise: '',
    contactName: '',
    email: '',
    phone: '',
    secteur: 'Crémerie / Fromagerie',
    capacite: '100-250 kg',
    description: ''
  });
  const [devisSubmitted, setDevisSubmitted] = useState(false);

  // Read initial format from query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialFormat = params.get('format');
      if (initialFormat === 'professionnel') {
        setFormat('professionnel');
        setStep('devis-professionnel');
      } else if (initialFormat === 'compact') {
        setFormat('compact');
        setModules([{
          id: 'compact-default',
          type: 'tout-en-un',
          usage: 'fromage',
          customName: 'Mon Espace Tout-en-un'
        }]);
        setActiveModuleId('compact-default');
        setStep('configuration');
      } else if (initialFormat === 'famille') {
        setFormat('famille');
        setModules([{
          id: 'maitre-default',
          type: 'maitre',
          usage: 'fromage',
          column: 0
        }]);
        setActiveModuleId('maitre-default');
        setStep('configuration');
      }
    }
  }, []);

  // Helper trigger notification
  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 4000);
  };

  const handleDevisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devisForm.entreprise || !devisForm.contactName || !devisForm.email || !devisForm.phone) {
      notify('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    setDevisSubmitted(true);
    notify('Votre demande de devis a bien été envoyée !', 'success');
  };

  // Select format
  const handleSelectFormat = (selectedFormat: FormatType) => {
    setFormat(selectedFormat);
    if (selectedFormat === 'compact') {
      setModules([{
        id: 'compact-default',
        type: 'tout-en-un',
        usage: 'fromage',
        customName: 'Mon Espace Tout-en-un'
      }]);
      setActiveModuleId('compact-default');
      setStep('configuration');
    } else if (selectedFormat === 'famille') {
      // Famille initialization with Master block at base level
      setModules([{
        id: 'maitre-default',
        type: 'maitre',
        usage: 'fromage',
        column: 0
      }]);
      setActiveModuleId('maitre-default');
      setStep('configuration');
    } else if (selectedFormat === 'professionnel') {
      setModules([]);
      setActiveModuleId(null);
      setStep('devis-professionnel');
    }
    notify(`Format ${
      selectedFormat === 'famille' ? 'Famille (Modulaire)' 
      : selectedFormat === 'compact' ? 'Compact (Tout-en-un)' 
      : 'Professionnel (Sur Devis)'
    } sélectionné.`);
  };

  // Reset configurator
  const handleReset = () => {
    setFormat(null);
    setModules([]);
    setActiveModuleId(null);
    setStep('format-selection');
    setDevisSubmitted(false);
    setDevisForm({
      entreprise: '',
      contactName: '',
      email: '',
      phone: '',
      secteur: 'Crémerie / Fromagerie',
      capacite: '100-250 kg',
      description: ''
    });
  };

  // Find first column with space
  const getFirstAvailableColumn = () => {
    const counts = { 0: 0, 1: 0, 2: 0 };
    modules.forEach(m => {
      const col = m.column ?? 0;
      counts[col as keyof typeof counts]++;
    });
    if (counts[0] < 3) return 0;
    if (counts[1] < 3) return 1;
    if (counts[2] < 3) return 2;
    return -1;
  };

  // Add module (Family format only)
  const handleAddModule = (type: ModuleType) => {
    if (format !== 'famille') return;
    
    // Business validation rule check: Cannot exceed 6 modules
    if (modules.length >= 6) {
      notify('Limite de blocs atteinte (maximum 6 blocs au total pour des raisons de puissance électrique).', 'error');
      return;
    }

    const col = getFirstAvailableColumn();
    if (col === -1) {
      notify('Toutes les colonnes sont pleines (maximum 3 blocs par colonne).', 'error');
      return;
    }

    const newId = `module-${Date.now()}`;
    const newModule: ConfiguredModule = {
      id: newId,
      type,
      usage: 'fromage',
      column: col,
      customName: `Module ${modules.length + 1}`
    };

    setModules([...modules, newModule]);
    setActiveModuleId(newId);
    notify(`${MODULES_DATABASE[type].name} ajouté.`);
  };

  // Add module to specific column
  const handleAddModuleToColumn = (columnIdx: number) => {
    if (format !== 'famille') return;

    if (modules.length >= 6) {
      notify('Limite de blocs atteinte (maximum 6 blocs au total).', 'error');
      return;
    }

    const colCount = modules.filter(m => (m.column ?? 0) === columnIdx).length;
    if (colCount >= 3) {
      notify('Cette colonne est déjà pleine.', 'error');
      return;
    }

    const newId = `module-${Date.now()}`;
    const newModule: ConfiguredModule = {
      id: newId,
      type: 'affinage-standard',
      usage: 'fromage',
      column: columnIdx,
      customName: `Module ${modules.length + 1}`
    };

    setModules([...modules, newModule]);
    setActiveModuleId(newId);
    notify("Module d'Affinage Standard ajouté à la colonne.");
  };

  // Remove module (Family format only)
  const handleRemoveModule = (id: string) => {
    if (format !== 'famille') return;
    
    const moduleToRemove = modules.find(m => m.id === id);
    if (!moduleToRemove) return;

    // Business validation rule check: Master block cannot be deleted
    if (moduleToRemove.type === 'maitre') {
      notify('Le Bloc Spécial Maître est obligatoire et sert de socle à votre cave.', 'error');
      return;
    }

    const filtered = modules.filter(m => m.id !== id);
    setModules(filtered);
    
    if (activeModuleId === id) {
      setActiveModuleId(filtered[filtered.length - 1]?.id || null);
    }
    notify(`${MODULES_DATABASE[moduleToRemove.type].name} retiré.`);
  };

  // Move module column left/right
  const handleMoveModuleColumn = (id: string, direction: 'left' | 'right') => {
    if (format !== 'famille') return;
    setModules(prev => prev.map(m => {
      if (m.id !== id) return m;
      const currentCol = m.column ?? 0;
      let nextCol = currentCol + (direction === 'right' ? 1 : -1);
      if (nextCol < 0) nextCol = 0;
      if (nextCol > 2) nextCol = 2;
      
      if (m.type === 'maitre') return m; // Master stays in column 0
      
      const targetColCount = prev.filter(x => (x.column ?? 0) === nextCol).length;
      if (targetColCount >= 3) {
        notify('Cette colonne est pleine.', 'error');
        return m;
      }
      
      return { ...m, column: nextCol };
    }));
  };

  // Update chamber usage of a module
  const handleUpdateUsage = (id: string, usage: ChamberUsage) => {
    setModules(modules.map(m => m.id === id ? { ...m, usage } : m));
    notify(`Usage configuré sur : ${usage === 'fromage' ? '🧀 Fromage' : usage === 'vin' ? '🍷 Vin' : '🥩 Viande'}`);
  };

  // Calculated totals
  const totalPricing = useMemo(() => {
    return modules.reduce((sum, m) => sum + MODULES_DATABASE[m.type].price, 0);
  }, [modules]);

  const totalHeight = useMemo(() => {
    const colHeights = { 0: 0, 1: 0, 2: 0 };
    modules.forEach(m => {
      const colIdx = m.column ?? 0;
      colHeights[colIdx as keyof typeof colHeights] += MODULES_DATABASE[m.type].heightCm;
    });
    return Math.max(colHeights[0], colHeights[1], colHeights[2]);
  }, [modules]);

  const activeModule = useMemo(() => {
    return modules.find(m => m.id === activeModuleId) || null;
  }, [modules, activeModuleId]);

  const columnsData = useMemo(() => {
    const cols: Record<number, ConfiguredModule[]> = { 0: [], 1: [], 2: [] };
    modules.forEach(m => {
      const colIdx = m.column ?? 0;
      cols[colIdx].push(m);
    });
    return cols;
  }, [modules]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-200 py-8 px-4 md:px-8 relative overflow-hidden">
      
      {/* Background radial flares matching homepage */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-amber-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-650 hover:text-amber-900 transition group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Link>
          <div className="text-center">
            <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block mb-1">Atelier L'Affine Bouche</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-900">Configurateur de Cave</h1>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <span className="text-xs text-slate-650">Des questions ? Contactez-nous à</span>
            <a href="mailto:affinebouche@gmail.com" className="px-3 py-1 bg-amber-100 border border-amber-900/20 text-amber-900 text-xs font-semibold rounded-full hover:bg-amber-205 transition-colors">
              affinebouche@gmail.com
            </a>
          </div>
        </div>

        {/* Steps Status Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 bg-white border border-slate-200 p-2.5 rounded-full px-6 shadow-sm">
            <button 
              onClick={handleReset}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${step === 'format-selection' ? 'bg-amber-900 text-white shadow-md' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-100'}`}
            >
              1. Choix du Format
            </button>
            {format !== 'professionnel' ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <button 
                  disabled={!format}
                  onClick={() => setStep('configuration')}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${step === 'configuration' ? 'bg-amber-900 text-white shadow-md' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-100'}`}
                >
                  2. Studio d'Ajustement
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <button 
                  disabled={modules.length === 0}
                  onClick={() => setStep('summary')}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${step === 'summary' ? 'bg-amber-900 text-white shadow-md' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-100'}`}
                >
                  3. Panier & Devis
                </button>
              </>
            ) : (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <button 
                  disabled={!format}
                  onClick={() => setStep('devis-professionnel')}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${step === 'devis-professionnel' ? 'bg-amber-900 text-white shadow-md' : 'text-slate-600 hover:text-amber-900 hover:bg-slate-100'}`}
                >
                  2. Demande de Devis
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live notification popup */}
        {showNotification && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-5 bg-white ${showNotification.type === 'success' ? 'border-green-200 text-green-800' : 'border-red-200 text-red-800'}`}>
            <span className="text-lg">{showNotification.type === 'success' ? '✓' : '⚠️'}</span>
            <p className="text-sm font-semibold">{showNotification.message}</p>
          </div>
        )}

        {/* ---------------------- STEP 1: FORMAT SELECTION ---------------------- */}
        {step === 'format-selection' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Sélectionnez la base de votre Cave</h2>
              <p className="text-lg text-slate-655 max-w-2xl mx-auto font-medium">
                Chaque fromage, vin ou pièce de viande requiert des conditions spécifiques. Sélectionnez le format physique de cave qui vous correspond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {/* Option 1: Modular Family */}
              <div 
                onClick={() => handleSelectFormat('famille')}
                className="group relative bg-white border border-slate-200 hover:border-amber-900/50 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/5 flex flex-col justify-between shadow-sm"
              >
                <div className="absolute top-5 right-5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                  Populaire & Évolutif
                </div>
                
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers3 className="w-7 h-7" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors mb-2">
                      Format 1 : La Cave "Famille"
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Un écosystème entièrement sur-mesure et empilable. Vous commencez obligatoirement par notre <strong>Bloc Maître</strong> (la centrale intelligente), puis vous ajoutez les modules d'affinage indépendants de votre choix au gré de vos besoins.
                    </p>
                  </div>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Modulaire :</strong> Empilez ou retirez des blocs à tout moment.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Jusqu'à 5 zones autonomes :</strong> Contrôle individuel de température/hygrométrie par bloc.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Bloc Maître requis :</strong> Le socle mécanique et intelligent (350 €).</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-semibold">À partir de</span>
                    <span className="text-2xl font-black text-amber-900">500 € <span className="text-xs font-normal text-slate-500">TTC</span></span>
                  </div>
                  <div className="px-5 py-2.5 bg-amber-900 group-hover:bg-amber-800 text-white rounded-xl text-sm font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-900/10">
                    Configurer
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Option 2: Compact */}
              <div 
                onClick={() => handleSelectFormat('compact')}
                className="group relative bg-white border border-slate-200 hover:border-amber-900/50 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/5 flex flex-col justify-between shadow-sm"
              >
                <div className="absolute top-5 right-5 bg-slate-100 text-slate-655 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                  Tout-en-un Clé en main
                </div>
                
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="w-7 h-7" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors mb-2">
                      Format 2 : La Cave "Compact"
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      L'essentiel de l'affinage dans un seul bloc élégant et économique. La centrale intelligente est directement intégrée dans l'unique chambre d'affinage. Idéal pour les appartements ou les petits budgets.
                    </p>
                  </div>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Aucun module additionnel :</strong> Bloc d'une seule pièce non extensible.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Usage configurable :</strong> Ajustez pour Fromage, Vin ou Viande mature.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Prix attractif tout compris :</strong> 500 € tout inclus.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-semibold">Prix unique</span>
                    <span className="text-2xl font-black text-amber-900">500 € <span className="text-xs font-normal text-slate-500">TTC</span></span>
                  </div>
                  <div className="px-5 py-2.5 bg-amber-900 group-hover:bg-amber-800 text-white rounded-xl text-sm font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-900/10">
                    Configurer
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Option 3: Professionnel */}
              <div 
                onClick={() => handleSelectFormat('professionnel')}
                className="group relative bg-white border border-slate-200 hover:border-amber-900/50 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/5 flex flex-col justify-between shadow-sm"
              >
                <div className="absolute top-5 right-5 bg-amber-955 border border-amber-800 text-amber-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
                  Sur Devis Uniquement
                </div>
                
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-955 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building className="w-7 h-7" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors mb-2">
                      Format 3 : Cave "Professionnelle"
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Conçue spécifiquement pour les restaurateurs, crémiers-fromagers, bouchers et vignerons. Une solution sur-mesure de grande capacité adaptée à vos contraintes d'espace et de volume.
                    </p>
                  </div>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Volumes industriels :</strong> Stockage et affinage optimisés de 50 à +500 kg.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Régulations Pro :</strong> Contrôle tactile multi-zones d'une précision chirurgicale.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-750">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span><strong>Étude technique personnalisée :</strong> Installation et configuration par nos experts.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-semibold">Tarification</span>
                    <span className="text-2xl font-black text-amber-955 font-bold">Sur Devis</span>
                  </div>
                  <div className="px-5 py-2.5 bg-amber-950 group-hover:bg-amber-900 text-white rounded-xl text-sm font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-900/10">
                    Demander un Devis
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* General FAQs/Features info */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mt-12">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-955 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Garantie d'Affinage L'Affine Bouche</h4>
                <p className="text-xs text-slate-655 leading-relaxed font-medium">
                  Tous nos blocs de cave profitent de la technologie d'ajustement moléculaire. Température stable au 10ème de degré près et maintien autonome d'une hygrométrie optimale comprise entre 80 et 95% sans raccordement d'eau requis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------- STEP 2: CONFIGURATION STUDIO ---------------------- */}
        {step === 'configuration' && format && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-slate-200 p-8 rounded-3xl min-h-[500px] shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-sm text-slate-500 uppercase tracking-widest">Aperçu de votre Cave</h3>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Hauteur Totale</span>
                    <span className="font-mono text-sm text-amber-900 font-bold">{totalHeight} cm</span>
                  </div>
                </div>

                {/* Stacking zone — columns side-by-side */}
                <div className="relative border-b-8 border-slate-355 bg-slate-100/60 rounded-3xl p-4 min-h-[380px] flex flex-row items-end justify-center gap-3 overflow-hidden select-none">
                  
                  {/* Internal ambient light glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none"></div>

                  {(Object.keys(columnsData) as unknown as string[]).map((colIdxStr) => {
                    const colIdx = parseInt(colIdxStr);
                    const colModules = columnsData[colIdx];
                    return (
                      <div key={colIdx} className="flex flex-col-reverse items-center gap-1.5 w-1/3 max-w-[110px] min-h-[300px] justify-start">
                        {/* Standard add button if column has space */}
                        {format === 'famille' && colModules.length < 3 && modules.length < 6 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddModuleToColumn(colIdx);
                            }}
                            className="w-full h-10 border border-dashed border-slate-300 hover:border-amber-900/40 hover:bg-amber-50/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-900 transition-all text-[10px] font-bold gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Ajouter</span>
                          </button>
                        )}

                        {colModules.map((mod, index) => {
                          const spec = MODULES_DATABASE[mod.type];
                          const isActive = activeModuleId === mod.id;

                          let heightClass = 'h-24';
                          if (mod.type === 'maitre') heightClass = 'h-18';

                          return (
                            <div
                              key={mod.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModuleId(mod.id);
                              }}
                              className={`w-full ${heightClass} rounded-xl border bg-gradient-to-r ${spec.gradient} ${isActive ? 'ring-2 ring-amber-900/30 border-amber-900 shadow-md scale-[1.01]' : 'border-slate-200 hover:border-slate-300'} relative cursor-pointer transition-all duration-300 flex flex-col justify-between p-2.5 group`}
                            >
                              <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

                              <div className="flex justify-between items-start w-full text-[8px] font-bold text-slate-400">
                                <span>{mod.type === 'maitre' ? 'SOCLE' : `H : ${index + 1}`}</span>
                                {mod.type !== 'maitre' && (
                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {colIdx > 0 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveModuleColumn(mod.id, 'left');
                                        }}
                                        className="text-slate-550 hover:text-amber-900 bg-white border border-slate-100 p-0.5 rounded font-extrabold"
                                        title="Déplacer à gauche"
                                      >
                                        ←
                                      </button>
                                    )}
                                    {colIdx < 2 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveModuleColumn(mod.id, 'right');
                                        }}
                                        className="text-slate-550 hover:text-amber-900 bg-white border border-slate-100 p-0.5 rounded font-extrabold"
                                        title="Déplacer à droite"
                                      >
                                        →
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveModule(mod.id);
                                      }}
                                      className="text-slate-500 hover:text-red-655 bg-white border border-slate-100 p-0.5 rounded"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 flex items-center justify-center py-1">
                                {mod.type === 'maitre' ? (
                                  <span className="text-[6.5px] uppercase font-black text-amber-200 tracking-wider">CENTRALE</span>
                                ) : (
                                  <div className="relative w-full h-full border border-slate-200/40 rounded-lg bg-slate-50/50 flex items-center justify-center">
                                    <span className="text-base select-none">
                                      {mod.usage === 'fromage' ? '🧀' : mod.usage === 'vin' ? '🍷' : '🥩'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-end text-[8px] font-bold">
                                <span className={`truncate max-w-[50px] ${mod.type === 'maitre' ? 'text-white' : 'text-slate-800'}`}>
                                  {mod.type === 'maitre' ? 'Centrale' : mod.usage === 'fromage' ? 'Fromage' : mod.usage === 'vin' ? 'Vin' : 'Maturation'}
                                </span>
                                <span className={`font-mono ${mod.type === 'maitre' ? 'text-amber-200' : 'text-slate-500'}`}>
                                  {spec.price}€
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stack validation stats */}
              <div className="mt-6 space-y-2 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Total Cave :</span>
                  <span className="font-bold text-slate-850">{modules.length} bloc{modules.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Poids Estimé (vide) :</span>
                  <span className="font-bold text-slate-850">{modules.length * 6} kg</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100/50">
                  <span className="text-sm font-semibold text-slate-700">Prix configuré :</span>
                  <span className="text-2xl font-black text-amber-900">{totalPricing} €</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2 (Right): Adjusting Studio Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              
              {/* Module selection & controls */}
              <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-8 shadow-sm">
                
                {/* Visual state selector for family modules */}
                {format === 'famille' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-amber-900" />
                        Ajouter des Blocs d'Affinage
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Empilez jusqu'à 4 blocs supplémentaires au-dessus de la centrale. Chaque bloc possède son propre tiroir ventilé indépendant.
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => handleAddModule('affinage-standard')}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-amber-900/30 p-5 rounded-2xl text-left transition-all hover:scale-[1.01] group shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-900 transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4 text-amber-900" />
                            Ajouter un Module d'Affinage Standard (40x40 cm)
                          </h4>
                          <p className="text-xs text-slate-655 mt-1">
                            Capacité universelle de 6-10 fromages, 6 bouteilles ou 3 kg de viande.
                          </p>
                        </div>
                        <span className="text-amber-900 text-lg font-bold font-mono shrink-0">250 €</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Specific active block config settings */}
                {activeModule ? (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Configuration active</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">
                          {MODULES_DATABASE[activeModule.type].name}
                        </h3>
                      </div>
                      <span className="text-lg font-mono text-slate-600 font-bold">{MODULES_DATABASE[activeModule.type].price} €</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                      {MODULES_DATABASE[activeModule.type].description}
                    </p>

                    {/* Features list */}
                    <div className="grid grid-cols-2 gap-2">
                      {MODULES_DATABASE[activeModule.type].features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                          <span className="text-amber-800">✔</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chamber Usage Setting: Cheese, Wine, Meat */}
                    {activeModule.type !== 'maitre' && (
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Contenu de la chambre d'affinage
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Cheese */}
                          <button
                            onClick={() => handleUpdateUsage(activeModule.id, 'fromage')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${activeModule.usage === 'fromage' ? 'bg-amber-100/50 border-amber-900/60 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                          >
                            <span className="text-xl">🧀</span>
                            <span className="text-xs">Fromage</span>
                          </button>

                          {/* Wine */}
                          <button
                            onClick={() => handleUpdateUsage(activeModule.id, 'vin')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${activeModule.usage === 'vin' ? 'bg-amber-100/50 border-amber-900/60 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                          >
                            <span className="text-xl">🍷</span>
                            <span className="text-xs">Vin</span>
                          </button>

                          {/* Meat */}
                          <button
                            onClick={() => handleUpdateUsage(activeModule.id, 'viande')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${activeModule.usage === 'viande' ? 'bg-amber-100/50 border-amber-900/60 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                          >
                            <span className="text-xl">🥩</span>
                            <span className="text-xs">Maturation</span>
                          </button>
                        </div>

                        {/* Explain usage options */}
                        <div className="text-[10px] text-slate-550 leading-normal pt-1.5 flex gap-1.5 items-start">
                          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {activeModule.usage === 'fromage' && "Régule activement l'humidité (85-95%) et la température (10-14°C) pour encourager le développement floral et des croûtes lavées."}
                            {activeModule.usage === 'vin' && "Garantit une température stable de 12°C avec hygrométrie à 70% pour conserver le bois des bouchons de liège et préserver le vieillissement."}
                            {activeModule.usage === 'viande' && "Ajuste à 2°C et active le ventilateur à bas régime pour assécher délicatement et concentrer les arômes de la viande sans moisissure."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                    Sélectionnez un bloc dans le schéma de gauche pour ajuster sa configuration.
                  </div>
                )}
              </div>

              {/* Action bar bottom */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-100/50 border border-slate-200 p-6 rounded-3xl">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Changer de Format
                </button>
                
                <button
                  onClick={() => setStep('summary')}
                  className="w-full sm:w-auto px-8 py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 group shadow-xl shadow-amber-900/10"
                >
                  Suivant : Synthèse de la cave
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ---------------------- STEP 3: SUMMARY ---------------------- */}
        {step === 'summary' && (
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-slate-50 border border-slate-200 p-8 rounded-3xl space-y-8 shadow-xl relative">
            
            {/* Ambient luxury glow inside card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-2">
              <span className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-955 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Récapitulatif de votre Cave</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                Format {format === 'famille' ? 'Famille Modulaire' : format === 'compact' ? 'Compact Tout-en-un' : 'Professionnel sur Devis'}
              </p>
            </div>

            {/* Bill of materials itemized table */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Détail des composants</h3>
              
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {modules.map((mod, i) => {
                  const spec = MODULES_DATABASE[mod.type];
                  return (
                    <div key={mod.id} className="flex justify-between items-center p-4 bg-white text-sm">
                      <div className="flex gap-3 items-center">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{i + 1}</span>
                        <div>
                          <p className="font-bold text-slate-900">{spec.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{spec.capacityDesc}</p>
                          {mod.type !== 'maitre' && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 bg-amber-100 text-[10px] text-amber-900 font-bold uppercase rounded border border-amber-900/10">
                              Option : {mod.usage === 'fromage' ? '🧀 Fromages' : mod.usage === 'vin' ? '🍷 Vins' : '🥩 Maturation Viandes'}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-800">{spec.price} €</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price breakdown box */}
            <div className="bg-slate-100/80 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>Sous-total HT</span>
                <span className="font-mono">{(totalPricing * 0.8).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>TVA (20%)</span>
                <span className="font-mono">{(totalPricing * 0.2).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-650 pb-3 border-b border-slate-200/60 font-semibold">
                <span>Livraison sécurisée</span>
                <span className="text-green-700 font-bold uppercase text-[10px]">Offerte (48h)</span>
              </div>
              
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-slate-850">Prix Total (TTC)</span>
                <span className="text-3xl font-black text-amber-955 font-mono">{totalPricing} €</span>
              </div>
            </div>

            {/* Business summary terms */}
            <div className="bg-amber-50/50 border border-amber-900/10 p-4 rounded-xl text-[10px] text-slate-655 space-y-2 leading-relaxed font-medium">
              <p>💡 <strong>Note sur l'installation :</strong> Les modules de la cave s'empilent via notre système de couplage magnétique sécurisé <i>MagLink</i>. Aucun vissage requis. La centrale gère la répartition électrique automatiquement via un unique cordon branché sur votre prise de secteur.</p>
              <p>🔒 <strong>Garantie constructeur :</strong> Matériel garanti 5 ans pièces et main d'œuvre. Retour gratuit sous 30 jours.</p>
            </div>

            {/* Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
              <button
                onClick={() => setStep('configuration')}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-300 text-slate-650 hover:text-slate-900 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Modifier la configuration
              </button>
              
              <button
                onClick={() => {
                  notify('Félicitations ! Votre cave configurée sur-mesure a été ajoutée au panier.', 'success');
                }}
                className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 group shadow-2xl shadow-amber-900/20 text-base"
              >
                <ShoppingBag className="w-5 h-5 shrink-0" />
                Ajouter cette cave au panier
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        )}

        {/* ---------------------- STEP: DEVIS PROFESSIONNEL ---------------------- */}
        {step === 'devis-professionnel' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-8 rounded-3xl space-y-8 shadow-xl relative animate-in fade-in slide-in-from-bottom-5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-2">
              <span className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-200 flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Demande de Devis Cave Professionnelle</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                Pour les restaurateurs, fromagers et artisans de la gastronomie
              </p>
            </div>

            {!devisSubmitted ? (
              <form onSubmit={handleDevisSubmit} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Entreprise */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Nom de l'établissement / entreprise *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Building className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Le Bon Fromage SAS"
                        value={devisForm.entreprise}
                        onChange={(e) => setDevisForm({ ...devisForm, entreprise: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Nom du contact */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Nom & Prénom du contact *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean Dupont"
                        value={devisForm.contactName}
                        onChange={(e) => setDevisForm({ ...devisForm, contactName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Adresse Email Professionnelle *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="Ex: j.dupont@entreprise.fr"
                        value={devisForm.email}
                        onChange={(e) => setDevisForm({ ...devisForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Numéro de Téléphone *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 06 12 34 56 78"
                        value={devisForm.phone}
                        onChange={(e) => setDevisForm({ ...devisForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Secteur d'Activité */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Secteur d'activité
                    </label>
                    <select
                      value={devisForm.secteur}
                      onChange={(e) => setDevisForm({ ...devisForm, secteur: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition"
                    >
                      <option>Crémerie / Fromagerie</option>
                      <option>Restauration / Hôtellerie</option>
                      <option>Boucherie / Charcuterie</option>
                      <option>Vigneron / Caviste</option>
                      <option>Épicerie Fine / Distribution</option>
                      <option>Autre secteur</option>
                    </select>
                  </div>

                  {/* Capacité Estimée */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Capacité de stockage estimée
                    </label>
                    <select
                      value={devisForm.capacite}
                      onChange={(e) => setDevisForm({ ...devisForm, capacite: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition"
                    >
                      <option>De 50 à 100 kg</option>
                      <option>De 100 à 250 kg</option>
                      <option>De 250 à 500 kg</option>
                      <option>Plus de 500 kg (Sur-mesure industriel)</option>
                    </select>
                  </div>
                </div>

                {/* Description du projet */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Description de votre projet & besoins spécifiques
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                    </span>
                    <textarea
                      rows={4}
                      placeholder="Décrivez vos contraintes d'espace, les types de produits à affiner (fromages à pâte dure, persillée, charcuterie, etc.), l'intégration souhaitée..."
                      value={devisForm.description}
                      onChange={(e) => setDevisForm({ ...devisForm, description: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 focus:bg-white text-sm outline-none transition resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-300 text-slate-655 hover:text-slate-900 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux formats
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-950 hover:bg-amber-900 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 group shadow-xl shadow-amber-950/10 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Envoyer ma demande de devis
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Demande reçue avec succès !</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Merci pour votre intérêt, <strong>{devisForm.contactName}</strong>. Notre équipe d'ingénieurs-affineurs étudie votre demande pour l'établissement <strong>{devisForm.entreprise}</strong>.
                  </p>
                </div>
                <div className="p-4 bg-amber-50/50 border border-amber-900/10 rounded-2xl max-w-md mx-auto text-xs text-slate-600 leading-normal">
                  📅 Un conseiller technique vous contactera par email (<strong>{devisForm.email}</strong>) ou par téléphone sous 24h ouvrées pour affiner votre cahier des charges.
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2 shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour au configurateur
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
