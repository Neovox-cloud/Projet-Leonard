'use client';

import React, { useState, useEffect } from 'react';
import { ContentType, CheeseProfile, ViandeProfile, VinProfile } from '../hooks/useSimulationCave';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: ContentType;
  onProductAdded: (newItem: CheeseProfile | ViandeProfile | VinProfile, type: ContentType) => void;
}

export default function ProductModal({ isOpen, onClose, initialType, onProductAdded }: ProductModalProps) {
  const [modalProductType, setModalProductType] = useState<ContentType>(initialType);
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

  // Sync state if initialType changes
  useEffect(() => {
    setModalProductType(initialType);
  }, [initialType]);

  // Listen to Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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

      onProductAdded(resData.item, modalProductType);
      
      // Reset form
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
      onClose();
    } catch (err: any) {
      setModalError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-605 dark:hover:text-slate-350 transition-colors text-xl font-bold p-2 cursor-pointer"
        >
          ✕
        </button>

        <div>
          <span className="text-amber-800 dark:text-amber-500 text-xs font-bold uppercase tracking-wider block mb-1">
            Personnalisation
          </span>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Ajouter mon produit
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Créez votre propre profil et configurez ses consignes d'affinage optimales.
          </p>
        </div>

        {/* Type selector tabs inside Modal */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-100 dark:border-slate-850">
          {(['fromage', 'viande', 'vin'] as ContentType[]).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setModalProductType(type)}
              className={`py-2 px-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                modalProductType === type
                  ? 'bg-amber-900 text-white shadow-sm dark:bg-amber-800'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {type === 'fromage' ? '🧀 Fromage' : type === 'viande' ? '🥩 Viande' : '🍷 Vin'}
            </button>
          ))}
        </div>

        {modalError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs rounded-xl font-semibold">
            ⚠️ {modalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-slate-650 dark:text-slate-400">Nom du produit <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="ex: Mon Reblochon Fermier, Saucisse de sanglier..."
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
            />
          </div>

          {/* Dynamic inputs based on Type */}
          {modalProductType === 'fromage' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Catégorie</label>
                  <input
                    type="text"
                    placeholder="ex: Pâte pressée non cuite"
                    value={formData.categorie}
                    onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-655 dark:text-slate-400">Type de lait</label>
                  <select
                    value={formData.lait}
                    onChange={(e) => setFormData(prev => ({ ...prev, lait: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
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
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Affinage Min (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.affinageTempMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, affinageTempMin: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Affinage Max (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.affinageTempMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, affinageTempMax: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Hygrométrie Min (%)</label>
                  <input
                    type="number"
                    value={formData.affinageHygroMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, affinageHygroMin: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Hygrométrie Max (%)</label>
                  <input
                    type="number"
                    value={formData.affinageHygroMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, affinageHygroMax: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Durée Min (jours)</label>
                  <input
                    type="number"
                    value={formData.affinageDureeMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, affinageDureeMin: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Durée Max (jours)</label>
                  <input
                    type="number"
                    value={formData.affinageDureeMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, affinageDureeMax: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-650 dark:text-slate-400">Notes / Remarques</label>
                <textarea
                  placeholder="ex: retourner tous les 2 jours..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors h-16 resize-none"
                />
              </div>
            </>
          )}

          {modalProductType === 'viande' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-650 dark:text-slate-400">Catégorie de viande</label>
                <input
                  type="text"
                  placeholder="ex: Bœuf, Salaison de porc..."
                  value={formData.categorie}
                  onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Conservation (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temp_conservation_degC}
                    onChange={(e) => setFormData(prev => ({ ...prev, temp_conservation_degC: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Maturation (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temp_maturation_degC}
                    onChange={(e) => setFormData(prev => ({ ...prev, temp_maturation_degC: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Post-Maturation (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temp_apres_maturation_degC}
                    onChange={(e) => setFormData(prev => ({ ...prev, temp_apres_maturation_degC: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Hygrométrie cible (%)</label>
                  <input
                    type="number"
                    value={formData.hygrometrie_pourcent}
                    onChange={(e) => setFormData(prev => ({ ...prev, hygrometrie_pourcent: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {modalProductType === 'vin' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-slate-650 dark:text-slate-400">Type de Vin (couleur / région)</label>
                <input
                  type="text"
                  placeholder="ex: Rouge, Blanc sec, Champagne..."
                  value={formData.categorie} // mapped into type or category
                  onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Conservation (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temp_conservation_degC}
                    onChange={(e) => setFormData(prev => ({ ...prev, temp_conservation_degC: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Vieillissement (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temp_vieillissement_degC}
                    onChange={(e) => setFormData(prev => ({ ...prev, temp_vieillissement_degC: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Hygrométrie cible (%)</label>
                  <input
                    type="number"
                    value={formData.hygrometrie_pourcent}
                    onChange={(e) => setFormData(prev => ({ ...prev, hygrometrie_pourcent: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-650 dark:text-slate-400">Temp. Service conseillée (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temp_service_recommandee_degC}
                    onChange={(e) => setFormData(prev => ({ ...prev, temp_service_recommandee_degC: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:border-amber-900 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-900 dark:focus:ring-amber-700 outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-amber-900 dark:bg-amber-800 hover:bg-amber-800 dark:hover:bg-amber-750 text-white rounded-2xl font-bold shadow-lg shadow-amber-900/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
