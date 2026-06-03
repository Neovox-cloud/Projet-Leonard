export interface ViandeProfile {
  id: string;
  nom: string;
  categorie: string;
  temp_conservation_degC: number;
  temp_maturation_degC: number;
  hygrometrie_pourcent: number;
  temp_apres_maturation_degC: number;
}

const rawViandes = [
  {
    "categorie": "Boeuf d'Exception",
    "varietes": [
      { "nom": "Boeuf de Kobe (Wagyu)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Matsusaka Beef", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Ohmi Beef", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Olive Wagyu", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Boeuf de Mishima", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Wagyu Australien (Fullblood)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Wagyu Americain (Snake River Farms)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Boeuf de Hanwoo (Coree)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Boeuf Polonais mature au gras de boeuf", "temp_conservation_degC": 1.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Boeuf Rubia Gallega (Blonde de Galice)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 3.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 }
    ]
  },
  {
    "categorie": "Boeuf Traditionnel et Races a Viande",
    "varietes": [
      { "nom": "Angus Noir (Black Angus)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Aberdeen Angus", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Red Angus", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Hereford", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Charolaise", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Limousine", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Aubrac", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Salers", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Normande", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Simmental", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Blonde d'Aquitaine", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Chianina (Italie)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Marchigiana", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Piemontaise", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Romagnola", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Highland Cattle", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Galloway", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Texas Longhorn", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Shorthorn", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Devon", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Dexter", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Belted Galloway", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "White Park", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Sussex", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "South Devon", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Lincoln Red", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Welsh Black", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Irish Moiled", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Boeuf de Coutancie", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Parthenaise", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Gasconne", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Bazadaise", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Maine-Anjou (Rouge des Pres)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Tarentaise", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Abondance", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Vosgienne", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Bleue du Nord", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Blanc Bleu Belge", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Fleckvieh", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Braunvieh", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Tyrol Grey (Grauvieh)", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Pinzgauer", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Hinterwalder", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Vorderwalder", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Asturiana de los Valles", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Avilena-Negra Iberica", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Retinta", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Morucha", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Alentejana (Portugal)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Barrosa", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Mirandesa", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Mertolenga", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Cachena", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Boeuf de Brangus", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Braford", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Santa Gertrudis", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Beefmaster", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Nelore (Bresil)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Guzerat", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Brahman", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.5 }
    ]
  },
  {
    "categorie": "Veau",
    "varietes": [
      { "nom": "Veau de lait de la Limousine", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Veau sous la mere", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Veau de Correze", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Veau Vitello Tonic (Italie)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 }
    ]
  },
  {
    "categorie": "Porc d'Exception",
    "varietes": [
      { "nom": "Porc Iberique (Pata Negra - Bellota)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 3.0, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Mangalica (Hongrie)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 3.0, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Noir de Bigorre", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Berkshire (Kurobuta)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Porc Duroc", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Gascon", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Basque (Kintoa)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Blanc de l'Ouest", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Cul Noir du Limousin", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc de Pietrain", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Large White", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Landrace", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Tamworth", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Porc Hampshire", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Porc Gloucester Old Spots", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 1.0 }
    ]
  },
  {
    "categorie": "Agneau et Mouton",
    "varietes": [
      { "nom": "Agneau de pre-sale (Mont-Saint-Michel)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Agneau de Sisteron", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Agneau de Lozere (Elovel)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Agneau de l'Aveyron", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Agneau Pauillac", "temp_conservation_degC": 2.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.5 },
      { "nom": "Agneau Salt Marsh (UK)", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Mouton de Belle-Ile", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Mouton Herdwick (Lake District)", "temp_conservation_degC": 1.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Agneau de Nouvelle-Zelande", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Agneau Icelandic", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 }
    ]
  },
  {
    "categorie": "Canard (Maturation sur le coffre)",
    "varietes": [
      { "nom": "Canard de Challans", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Canard Mulard", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Canard de Barbarie", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Caneton Nantais", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Canard Croise de Burgaud", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 85, "temp_apres_maturation_degC": 1.0 }
    ]
  },
  {
    "categorie": "Gibier (Faisandage controle)",
    "varietes": [
      { "nom": "Cerf Elaphe (Filet ou cuisse)", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Chevreuil (Selle ou cuisse)", "temp_conservation_degC": 1.0, "temp_maturation_degC": 1.5, "hygrometrie_pourcent": 75, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Sanglier (Marcassin)", "temp_conservation_degC": 1.0, "temp_maturation_degC": 2.0, "hygrometrie_pourcent": 78, "temp_apres_maturation_degC": 0.5 },
      { "nom": "Faisan (Faisandage sur plume)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 3.0, "hygrometrie_pourcent": 82, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Lievre d'Europe", "temp_conservation_degC": 1.5, "temp_maturation_degC": 2.5, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 },
      { "nom": "Grouse (Ecosse)", "temp_conservation_degC": 2.0, "temp_maturation_degC": 3.0, "hygrometrie_pourcent": 80, "temp_apres_maturation_degC": 1.0 }
    ]
  }
];

// Flatten to a list with generated IDs
export const VIANDES: ViandeProfile[] = rawViandes.flatMap(cat =>
  cat.varietes.map(v => ({
    id: `viande-${v.nom.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)}`,
    nom: v.nom,
    categorie: cat.categorie,
    temp_conservation_degC: v.temp_conservation_degC,
    temp_maturation_degC: v.temp_maturation_degC,
    hygrometrie_pourcent: v.hygrometrie_pourcent,
    temp_apres_maturation_degC: v.temp_apres_maturation_degC,
  }))
);

// Grouped by category (for dropdowns)
export const VIANDES_BY_CATEGORY: Record<string, ViandeProfile[]> = VIANDES.reduce((acc, v) => {
  if (!acc[v.categorie]) acc[v.categorie] = [];
  acc[v.categorie].push(v);
  return acc;
}, {} as Record<string, ViandeProfile[]>);
