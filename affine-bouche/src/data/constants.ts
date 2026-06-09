import { ContentType } from '../hooks/useSimulationCave';

export const CONTENT_TYPE_META: Record<ContentType, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  fromage: { 
    label: 'Fromage', 
    icon: '🧀', 
    color: 'text-amber-900 dark:text-amber-300', 
    bgColor: 'bg-amber-50 dark:bg-amber-955/30', 
    borderColor: 'border-amber-900/60 dark:border-amber-700/60' 
  },
  viande: { 
    label: 'Viande',  
    icon: '🥩', 
    color: 'text-red-900 dark:text-red-300',   
    bgColor: 'bg-red-50 dark:bg-red-955/30',   
    borderColor: 'border-red-900/60 dark:border-red-700/60' 
  },
  vin: { 
    label: 'Vin',     
    icon: '🍷', 
    color: 'text-purple-900 dark:text-purple-300', 
    bgColor: 'bg-purple-50 dark:bg-purple-955/30', 
    borderColor: 'border-purple-900/60 dark:border-purple-700/60' 
  },
};
