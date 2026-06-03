export interface VinProfile {
  id: string;
  nom: string;
  type: string;
  temp_conservation_degC: number;
  temp_vieillissement_degC: number;
  hygrometrie_pourcent: number;
  temp_service_recommandee_degC: number;
}

const rawVins = [
  {
    "type": "Vins Rouges Puissants & de Garde",
    "varietes": [
      { "nom": "Bordeaux Rouge (Pauillac, Saint-Emilion, Pomerol)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.5, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 17.5 },
      { "nom": "Vallee du Rhone Septentrionale (Hermitage, Cote-Rotie)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.5, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 17.0 },
      { "nom": "Vallee du Rhone Meridionale (Chateauneuf-du-Pape)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 13.0, "hygrometrie_pourcent": 70, "temp_service_recommandee_degC": 16.5 },
      { "nom": "Barolo & Barbaresco (Nebbiolo - Italie)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.5, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 17.0 },
      { "nom": "Brunello di Montalcino (Sangiovese - Italie)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.5, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 17.0 },
      { "nom": "Rioja Gran Reserva (Espagne)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 13.0, "hygrometrie_pourcent": 70, "temp_service_recommandee_degC": 17.0 },
      { "nom": "Ribera del Duero (Espagne)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.5, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 17.0 },
      { "nom": "Napa Valley Cabernet Sauvignon (USA)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 13.0, "hygrometrie_pourcent": 70, "temp_service_recommandee_degC": 18.0 }
    ]
  },
  {
    "type": "Vins Rouges Legers & Delicats",
    "varietes": [
      { "nom": "Bourgogne Rouge (Pinot Noir - Vosne-Romanee, Gevrey-Chambertin)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.0, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 15.5 },
      { "nom": "Beaujolais Crus (Morgon, Moulin-a-Vent)", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.0, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 14.0 },
      { "nom": "Loire Rouge (Saumur-Champigny, Chinon)", "temp_conservation_degC": 11.5, "temp_vieillissement_degC": 12.0, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 14.5 }
    ]
  },
  {
    "type": "Vins Blancs Secs & Onctueux",
    "varietes": [
      { "nom": "Bourgogne Blanc (Chardonnay - Meursault, Montrachet)", "temp_conservation_degC": 11.5, "temp_vieillissement_degC": 12.0, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 12.5 },
      { "nom": "Chablis Grand Cru", "temp_conservation_degC": 11.0, "temp_vieillissement_degC": 11.5, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 11.0 },
      { "nom": "Loire Blanc Sec (Sancerre, Pouilly-Fume)", "temp_conservation_degC": 11.0, "temp_vieillissement_degC": 11.5, "hygrometrie_pourcent": 72, "temp_service_recommandee_degC": 10.5 },
      { "nom": "Riesling Grand Cru (Alsace / Allemagne)", "temp_conservation_degC": 11.0, "temp_vieillissement_degC": 11.5, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 10.0 }
    ]
  },
  {
    "type": "Vins Liquoreux & Doux",
    "varietes": [
      { "nom": "Sauternes & Barsac", "temp_conservation_degC": 12.0, "temp_vieillissement_degC": 12.0, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 9.5 },
      { "nom": "Tokaji Aszu (Hongrie)", "temp_conservation_degC": 11.5, "temp_vieillissement_degC": 12.0, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 10.0 },
      { "nom": "Porto Vintage", "temp_conservation_degC": 12.5, "temp_vieillissement_degC": 13.0, "hygrometrie_pourcent": 70, "temp_service_recommandee_degC": 16.0 }
    ]
  },
  {
    "type": "Champagnes & Effervescents",
    "varietes": [
      { "nom": "Champagne Millesime & Prestige", "temp_conservation_degC": 10.5, "temp_vieillissement_degC": 11.0, "hygrometrie_pourcent": 78, "temp_service_recommandee_degC": 9.5 },
      { "nom": "Champagne Brut Non Millesime", "temp_conservation_degC": 10.0, "temp_vieillissement_degC": 10.5, "hygrometrie_pourcent": 75, "temp_service_recommandee_degC": 8.0 }
    ]
  }
];

// Flatten to a list with generated IDs
export const VINS: VinProfile[] = rawVins.flatMap(cat =>
  cat.varietes.map(v => ({
    id: `vin-${v.nom.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)}`,
    nom: v.nom,
    type: cat.type,
    temp_conservation_degC: v.temp_conservation_degC,
    temp_vieillissement_degC: v.temp_vieillissement_degC,
    hygrometrie_pourcent: v.hygrometrie_pourcent,
    temp_service_recommandee_degC: v.temp_service_recommandee_degC,
  }))
);

// Grouped by wine type (for dropdowns)
export const VINS_BY_TYPE: Record<string, VinProfile[]> = VINS.reduce((acc, v) => {
  if (!acc[v.type]) acc[v.type] = [];
  acc[v.type].push(v);
  return acc;
}, {} as Record<string, VinProfile[]>);
