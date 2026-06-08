import { useState, useEffect } from 'react';

export type ContentType = 'fromage' | 'viande' | 'vin';

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

export interface ViandeProfile {
  id: string;
  nom: string;
  categorie: string;
  temp_conservation_degC: number;
  temp_maturation_degC: number;
  hygrometrie_pourcent: number;
  temp_apres_maturation_degC: number;
}

export interface VinProfile {
  id: string;
  nom: string;
  type: string;
  temp_conservation_degC: number;
  temp_vieillissement_degC: number;
  hygrometrie_pourcent: number;
  temp_service_recommandee_degC: number;
}

export interface CompartmentHistoryEntry {
  time: string;
  temp: number;
  humidity: number;
}

export interface CompartmentState {
  id: number;
  contentType: ContentType;
  selectedItemId: string | null;
  preference: 'jeune' | 'moyen' | 'vieux';
  targetDurationDays: number;
  startDate: number | null;
  maturePhase: 'conservation' | 'maturation' | 'post-maturation';
  vinPhase: 'conservation' | 'vieillissement';
  isAutoMode: boolean;
  currentTemp: number;
  currentHumidity: number;
  coolerActive: boolean;
  humidifierActive: boolean;
  fanActive: boolean;
  customTargetTemp?: number;
  customTargetHumidity?: number;
  history: CompartmentHistoryEntry[];
}

export function getDefaultTemp(contentType: ContentType): number {
  if (contentType === 'vin') return 12.0;
  if (contentType === 'viande') return 2.0;
  return 14.0;
}

export function getTargetConditions(
  comp: CompartmentState,
  cheeses: CheeseProfile[],
  viandes: ViandeProfile[],
  vins: VinProfile[]
): { targetTemp: number; targetHygro: number } | null {
  if (!comp.isAutoMode) {
    return {
      targetTemp: comp.customTargetTemp ?? getDefaultTemp(comp.contentType),
      targetHygro: comp.customTargetHumidity ?? (comp.contentType === 'vin' ? 70 : comp.contentType === 'viande' ? 80 : 85)
    };
  }

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
    const viande = viandes.find(v => v.id === comp.selectedItemId);
    if (!viande) return null;
    const tempMap = {
      'conservation': viande.temp_conservation_degC,
      'maturation': viande.temp_maturation_degC,
      'post-maturation': viande.temp_apres_maturation_degC,
    };
    return { targetTemp: tempMap[comp.maturePhase], targetHygro: viande.hygrometrie_pourcent };
  }

  if (comp.contentType === 'vin') {
    const vin = vins.find(v => v.id === comp.selectedItemId);
    if (!vin) return null;
    const targetTemp = comp.vinPhase === 'conservation'
      ? vin.temp_conservation_degC
      : vin.temp_vieillissement_degC;
    return { targetTemp, targetHygro: vin.hygrometrie_pourcent };
  }

  return null;
}

export function useSimulationCave(
  initialCheeses: CheeseProfile[],
  initialViandes: ViandeProfile[],
  initialVins: VinProfile[],
  connectedDevice: string | null = null
) {
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
      customTargetTemp: 12.0,
      customTargetHumidity: 85,
      history: [
        {
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temp: 14.5,
          humidity: 70.0
        }
      ]
    }))
  );

  const [tick, setTick] = useState(0);

  // Live simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);

      setCompartments(prev => prev.map(comp => {
        let { currentTemp, currentHumidity, coolerActive, humidifierActive, fanActive, isAutoMode } = comp;

        if (!isAutoMode || (isAutoMode && comp.selectedItemId)) {
          const targets = getTargetConditions(comp, initialCheeses, initialViandes, initialVins);
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

        const nextTemp = Number((currentTemp + tempDelta).toFixed(2));
        const nextHygro = Number((Math.min(100, Math.max(0, currentHumidity + hygroDelta))).toFixed(2));

        const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newHistoryEntry = { time: timeStr, temp: nextTemp, humidity: nextHygro };

        return {
          ...comp,
          currentTemp: nextTemp,
          currentHumidity: nextHygro,
          coolerActive,
          humidifierActive,
          fanActive,
          history: [...(comp.history || []), newHistoryEntry].slice(-30)
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialCheeses, initialViandes, initialVins]);

  // Save telemetry on each tick to the database
  useEffect(() => {
    if (tick === 0) return;
    
    const saveTelemetry = async () => {
      const device = connectedDevice || 'default';
      try {
        await Promise.all(
          compartments.map(comp => 
            fetch('/api/telemetry', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                compartmentId: comp.id,
                deviceName: device,
                temp: comp.currentTemp,
                humidity: comp.currentHumidity
              })
            })
          )
        );
      } catch (e) {
        console.error("Failed to post telemetry entry:", e);
      }
    };

    saveTelemetry();
  }, [tick]);

  const getStorageKey = () => {
    return connectedDevice 
      ? `affine_bouche_compartments_${connectedDevice}` 
      : 'affine_bouche_compartments';
  };

  const updateCompartment = (id: number, updates: Partial<CompartmentState>) => {
    setCompartments(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAllCompartments = () => {
    setCompartments(prev => {
      const updated = prev.map(c => ({
        ...c,
        selectedItemId: null,
        startDate: null,
      }));
      if (typeof window !== 'undefined') {
        localStorage.removeItem(getStorageKey());
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
    } else if (contentType === 'viande') {
      updateCompartment(compartmentId, {
        selectedItemId: itemId,
        startDate: Date.now(),
        targetDurationDays: 45, // 45 days default dry aging
      });
    } else if (contentType === 'vin') {
      updateCompartment(compartmentId, {
        selectedItemId: itemId,
        startDate: Date.now(),
        targetDurationDays: 365, // 365 days default aging / conservation
      });
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

  const toggleControl = (compartmentId: number, control: keyof CompartmentState) => {
    const activeComp = compartments.find(c => c.id === compartmentId);
    if (!activeComp || activeComp.isAutoMode) return;
    updateCompartment(compartmentId, { [control]: !activeComp[control] });
  };

  const loadStateAndHistory = async (device: string | null) => {
    const devName = device || 'default';
    let baseCompartments = compartments;

    if (typeof window !== 'undefined') {
      const key = device 
        ? `affine_bouche_compartments_${device}` 
        : 'affine_bouche_compartments';
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 6) {
            baseCompartments = parsed;
          }
        } catch (e) {
          console.error("Failed to parse local storage compartments:", e);
        }
      } else {
        baseCompartments = baseCompartments.map(c => ({ ...c, selectedItemId: null, startDate: null }));
      }
    }

    try {
      const merged = await Promise.all(
        baseCompartments.map(async (comp) => {
          const res = await fetch(`/api/telemetry?compartmentId=${comp.id}&deviceName=${devName}`);
          const data = await res.json();
          if (data.success && data.history && data.history.length > 0) {
            const latestEntry = data.history[data.history.length - 1];
            return {
              ...comp,
              currentTemp: latestEntry.temp,
              currentHumidity: latestEntry.humidity,
              history: data.history,
            };
          }
          
          // Fallback if no history exists: if an item is selected, start at its target conditions
          const targets = getTargetConditions(comp, initialCheeses, initialViandes, initialVins);
          const initTemp = targets ? targets.targetTemp : getDefaultTemp(comp.contentType);
          const initHygro = targets ? targets.targetHygro : (comp.contentType === 'vin' ? 70 : comp.contentType === 'viande' ? 80 : 85);
          
          const finalTemp = comp.selectedItemId ? initTemp : comp.currentTemp;
          const finalHygro = comp.selectedItemId ? initHygro : comp.currentHumidity;

          return {
            ...comp,
            currentTemp: finalTemp,
            currentHumidity: finalHygro,
            history: [
              {
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                temp: finalTemp,
                humidity: finalHygro
              }
            ]
          };
        })
      );
      setCompartments(merged);
    } catch (e) {
      console.error("Failed to load telemetry history:", e);
      setCompartments(baseCompartments);
    }
  };

  // Load telemetry history on connectedDevice change or mount
  useEffect(() => {
    loadStateAndHistory(connectedDevice);
  }, [connectedDevice]);

  const loadSavedCompartments = (device: string | null = connectedDevice) => {
    loadStateAndHistory(device);
  };

  const clearCompartmentsState = () => {
    setCompartments(prev => prev.map(c => ({
      ...c,
      selectedItemId: null,
      startDate: null,
    })));
  };

  return {
    compartments,
    updateCompartment,
    handleContentTypeChange,
    assignItem,
    changePreference,
    toggleControl,
    clearAllCompartments,
    loadSavedCompartments,
    clearCompartmentsState
  };
}
