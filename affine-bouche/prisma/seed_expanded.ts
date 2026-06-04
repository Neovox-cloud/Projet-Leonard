import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 200 French Cheeses
const CHEESES_DATA = [
  // Pâte molle à croûte fleurie (35)
  ...Array.from({ length: 35 }).map((_, i) => ({
    nom: [
      "Camembert de Normandie AOP", "Brie de Meaux AOP", "Brie de Melun AOP", "Chaource AOP",
      "Neufchâtel AOP", "Brillat-Savarin", "Saint-Marcellin", "Saint-Félicien", "Coulommiers",
      "Gaperon", "Robiola", "Brie de Nangis", "Brie de Montereau", "Camembert au Calvados",
      "Chource fermier", "Neufchâtel Coeur", "Brie noir", "Brie de Provins", "Saint-Loup",
      "Fougerus", "Pierre Robert", "Gratte-Paille", "Vignelait", "Explorateur",
      "Délice de Bourgogne", "Bouille", "Carré de l'Est", "Chaource Fermier", "Le Dauphin",
      "Pavin", "Fin-de-Siècle", "Suprême de Brie", "Brillat affiné", "Saint-Félicien tentation",
      "Brie truffé"
    ][i % 35] + (i >= 35 ? ` (Réserve N°${Math.floor(i/35) + 1})` : ""),
    categorie: "Pâte molle à croûte fleurie",
    lait: i % 3 === 0 ? "Vache" : i % 3 === 1 ? "Chèvre" : "Brebis",
    tempMin: 10, tempMax: 14, hygroMin: 90, hygroMax: 95, dureeMin: 21, dureeMax: 45
  })),
  // Pâte molle à croûte lavée (35)
  ...Array.from({ length: 35 }).map((_, i) => ({
    nom: [
      "Époisses AOP", "Munster AOP", "Livarot AOP", "Maroilles AOP", "Pont-l'Évêque AOP",
      "Langres AOP", "Mont d'Or AOP", "Soumaintrain AOP", "Trou du Cru", "Boulette d'Avesnes",
      "Vacherin du Haut-Doubs AOP", "Aisy Cendré", "Affidelice au Chablis", "Ami du Chambertin",
      "Guercois", "Curé Nantais", "Saint-Paulin", "Port-Salut Fermier", "Munster-Géromé AOP",
      "Livarot Fermier", "Maroilles Mignon", "Pont-l'Évêque Fermier", "Langres Coupe",
      "Soumaintrain Fermier", "Trou du Cru à l'eau-de-vie", "Boulette d'Avesnes verte",
      "Vacherin Fribourgeois", "Curé Nantais muscadet", "Saint-Florentin", "Chambarand",
      "Chaumes", "Vieux-Lille", "Gris de Lille", "Cachat", "Reblochon lavé"
    ][i % 35] + (i >= 35 ? ` (Sélection N°${Math.floor(i/35) + 1})` : ""),
    categorie: "Pâte molle à croûte lavée",
    lait: "Vache",
    tempMin: 12, tempMax: 16, hygroMin: 92, hygroMax: 98, dureeMin: 21, dureeMax: 60
  })),
  // Pâte pressée non cuite (40)
  ...Array.from({ length: 40 }).map((_, i) => ({
    nom: [
      "Cantal AOP", "Salers AOP", "Reblochon AOP", "Saint-Nectaire AOP", "Morbier AOP",
      "Tomme de Savoie AOP", "Tomme des Pyrénées AOP", "Ossau-Iraty AOP", "Laguiole AOP",
      "Tome des Bauges AOP", "Saint-Paulien", "Tomme de Montagne", "Tomme de Carmejane",
      "Bethmale", "Moulis", "Tomme de Lozère", "Saint-Gildas", "Provola", "Tomme du Jura",
      "Tomme de chèvre de Savoie", "Tomme de brebis de l'Aveyron", "Trappe de Timadeuc",
      "Trappe d'Échourgnac", "Cantal Entre-Deux AOP", "Cantal Vieux AOP", "Salers Tradition AOP",
      "Saint-Nectaire Fermier AOP", "Morbier Réserve AOP", "Tomme de Savoie fermière AOP",
      "Ossau-Iraty Estive AOP", "Laguiole Sélection AOP", "Tome des Bauges fermière AOP",
      "Bethmale chèvre", "Moulis Vache", "Moulis chèvre", "Tomme de chèvre de l'Ardèche",
      "Tomme de brebis des Pyrénées", "Trappe de Timadeuc affinée", "Trappe d'Échourgnac liqueur",
      "Raclette de Savoie AOP"
    ][i % 40] + (i >= 40 ? ` (Cuvée N°${Math.floor(i/40) + 1})` : ""),
    categorie: "Pâte pressée non cuite",
    lait: i % 2 === 0 ? "Vache" : "Brebis",
    tempMin: 8, tempMax: 12, hygroMin: 85, hygroMax: 95, dureeMin: 60, dureeMax: 180
  })),
  // Pâte pressée cuite (30)
  ...Array.from({ length: 30 }).map((_, i) => ({
    nom: [
      "Comté AOP (12 mois)", "Comté AOP (18 mois)", "Comté AOP (24 mois)", "Beaufort d'Été AOP",
      "Beaufort d'Alpage AOP", "Beaufort d'Hiver AOP", "Abondance AOP", "L'Étivaz AOP",
      "Gruyère France AOP", "Emmental de Savoie", "Emmental Grand Cru", "Comté Réserve Exceptionnelle",
      "Abondance Fermier AOP", "Gruyère de Savoie", "Fribourg Vieux", "Sbrinz", "Comté d'été",
      "Comté de montagne", "Beaufort Chalet d'Alpage", "Abondance de vallée", "Gruyère réserve",
      "Emmental label rouge", "Comté Prestige", "Beaufort d'été sélection", "Abondance alpage",
      "Gruyère d'Alpage", "Emmental de montagne", "Comté Extra", "Beaufort Extra", "Comté 36 mois"
    ][i % 30] + (i >= 30 ? ` (Aff. Spécial N°${Math.floor(i/30) + 1})` : ""),
    categorie: "Pâte pressée cuite",
    lait: "Vache",
    tempMin: 10, tempMax: 15, hygroMin: 80, hygroMax: 90, dureeMin: 120, dureeMax: 720
  })),
  // Pâte persillée (Bleus) (30)
  ...Array.from({ length: 30 }).map((_, i) => ({
    nom: [
      "Roquefort AOP", "Bleu d'Auvergne AOP", "Fourme d'Ambert AOP", "Fourme de Montbrison AOP",
      "Bleu de Gex AOP", "Bleu des Causses AOP", "Bleu du Vercors-Sassenage AOP", "Bresse Bleu",
      "Roquefort Artisanal AOP", "Bleu d'Auvergne Fermier AOP", "Fourme d'Ambert Fermière AOP",
      "Bleu de Laqueuille", "Bleu de Termignon", "Bleu de Séverac", "Bleu de chèvre",
      "Bleu de brebis de l'Aveyron", "Persillé des Aravis", "Persillé de Tignes", "Bleu du Vercors fermier",
      "Roquefort Baragnaudes AOP", "Bleu des Causses Réserve", "Fourme de Montbrison fermière",
      "Persillé du Malzieu", "Bleu d'Auvergne sélection", "Bleu des Causses cave", "Bleu de Termignon alpage",
      "Bleu de Termignon fermier", "Bleu du Haut-Jura AOP", "Roquefort papillon AOP", "Bleu d'Auvergne réserve"
    ][i % 30] + (i >= 30 ? ` (Sélection N°${Math.floor(i/30) + 1})` : ""),
    categorie: "Pâte persillée",
    lait: i % 2 === 0 ? "Vache" : "Brebis",
    tempMin: 8, tempMax: 12, hygroMin: 90, hygroMax: 98, dureeMin: 28, dureeMax: 150
  })),
  // Chèvre et Brebis (30)
  ...Array.from({ length: 30 }).map((_, i) => ({
    nom: [
      "Crottin de Chavignol AOP", "Sainte-Maure de Touraine AOP", "Selles-sur-Cher AOP",
      "Valençay AOP", "Pouligny-Saint-Pierre AOP", "Rocamadour AOP", "Pélardon AOP",
      "Picodon AOP", "Banon AOP", "Chabichou du Poitou AOP", "Mothais sur Feuille",
      "Sainte-Maure Fermier AOP", "Crottin de Chavignol Bleu AOP", "Valençay Fermier AOP",
      "Pouligny-Saint-Pierre Fermier AOP", "Picodon de l'Ardèche AOP", "Picodon de la Drôme AOP",
      "Banon Fermier AOP", "Chabichou du Poitou Fermier AOP", "Mothais sur feuille fermier",
      "Pélardon Fermier AOP", "Rocamadour Fermier AOP", "Selles-sur-Cher Fermier AOP",
      "Tomme de chèvre des Cévennes", "Tomme de brebis de Corse", "Chevrotin AOP",
      "Rigotte de Condrieu AOP", "Rigotte de Condrieu fermière AOP", "Chevrotin des Aravis AOP",
      "Charolais AOP"
    ][i % 30] + (i >= 30 ? ` (Réserve N°${Math.floor(i/30) + 1})` : ""),
    categorie: "Fromage de chèvre ou brebis",
    lait: i % 2 === 0 ? "Chèvre" : "Brebis",
    tempMin: 10, tempMax: 14, hygroMin: 85, hygroMax: 90, dureeMin: 14, dureeMax: 60
  }))
];

// 200 French Meats / Charcuteries
const MEATS_DATA = [
  // Boeuf d'Exception (40)
  ...Array.from({ length: 40 }).map((_, i) => ({
    nom: [
      "Boeuf de Kobe (Wagyu) Français", "Matsusaka Beef Français", "Ohmi Beef Import", "Olive Wagyu Import",
      "Boeuf de Mishima Pur Sang", "Wagyu Français (Fullblood)", "Boeuf Polonais mature au gras",
      "Boeuf Rubia Gallega (Blonde de Galice)", "Boeuf Fin Gras du Mézenc AOP", "Limousine Maturée 30 jours",
      "Charolaise Maturée 45 jours", "Aubrac Maturée 30 jours", "Salers Maturée 60 jours",
      "Normande Maturée 35 jours", "Angus Noir (Black Angus) Français", "Hereford Maturée 40 jours",
      "Bazadaise Maturée 50 jours", "Simmental d'Alsace Maturée", "Parthenaise Maturée 35 jours",
      "Gasconne de Montagne Maturée", "Blonde d'Aquitaine Sélection", "Mishimabeef AOP",
      "Wagyu croisé Angus", "Wagyu croisé Limousin", "Fin Gras du Mézenc réserve", "Limousine d'alpage",
      "Charolaise herbage", "Aubrac estive", "Salers tradition", "Normande herbage", "Angus sélection",
      "Hereford herbage", "Bazadaise sélection", "Simmental sélection", "Parthenaise sélection",
      "Gasconne sélection", "Blonde d'Aquitaine herbage", "Boeuf de Coutancie", "Maine-Anjou AOP",
      "Tarentaise Maturée"
    ][i % 40] + (i >= 40 ? ` (Sélection N°${Math.floor(i/40) + 1})` : ""),
    categorie: "Boeuf d'Exception",
    temp_conservation: 1.5, temp_maturation: 2.0, hygro: 80, temp_apres_maturation: 1.0
  })),
  // Porc et Charcuterie sèche (60)
  ...Array.from({ length: 60 }).map((_, i) => ({
    nom: [
      "Jambon de Bayonne IGP", "Saucisson Sec d'Auvergne AOP", "Rosette de Lyon", "Jambon Noir de Bigorre AOP",
      "Jambon du Kintoa AOP", "Saucisse de Morteau AOP", "Saucisse de Montbéliard AOP", "Coppa de Corse AOP",
      "Lonzu de Corse AOP", "Prisuttu de Corse AOP", "Jambon de Vendée", "Jambon Sec des Ardennes AOP",
      "Saucisson Sec de l'Ardèche AOP", "Saucisson Sec de Savoie", "Jambon Sec de Savoie", "Bresi du Jura",
      "Figatellu de Corse", "Chorizo de Porc Basque", "Salami de Savoie", "Saucisson aux Noisettes",
      "Saucisson au Beaufort", "Saucisson au Sanglier", "Saucisson au Canard", "Magret de Canard Séché",
      "Filet Mignon de Porc Séché", "Viande Séchée des Alpes", "Bresaola de Savoie", "Pancetta Corse",
      "Saucisse sèche de l'Aveyron", "Jambon de Porc Gascon", "Jambon de Porc Blanc de l'Ouest",
      "Jambon de Cul Noir du Limousin", "Jambon de Mangalica", "Jambon d'Auvergne d'Alpage",
      "Saucisson Sec d'Auvergne fermier", "Rosette de Lyon artisanale", "Jambon Noir de Bigorre réserve",
      "Jambon du Kintoa réserve AOP", "Saucisse de Morteau IGP", "Saucisse de Montbéliard IGP",
      "Coppa de Corse fermière AOP", "Lonzu de Corse fermier AOP", "Prisuttu de Corse fermier AOP",
      "Jambon de Vendée aux herbes", "Jambon Sec des Ardennes IGP", "Saucisson de l'Ardèche IGP",
      "Saucisson de Savoie fumé", "Jambon de Savoie 18 mois", "Bresi du Jura fumé", "Figatellu de Corse grillé",
      "Chorizo basque doux", "Chorizo basque fort", "Salami de Savoie noisettes", "Saucisson noix de Savoie",
      "Saucisson chèvre de Savoie", "Saucisson myrtilles de Savoie", "Saucisson d'agneau de Savoie",
      "Magret séché fumé", "Filet mignon séché piment", "Filet mignon séché herbes"
    ][i % 60] + (i >= 60 ? ` (Aff. Exceptionnel N°${Math.floor(i/60) + 1})` : ""),
    categorie: "Porc et Charcuterie",
    temp_conservation: 2.0, temp_maturation: 2.5, hygro: 78, temp_apres_maturation: 1.5
  })),
  // Agneau et Mouton (40)
  ...Array.from({ length: 40 }).map((_, i) => ({
    nom: [
      "Agneau de pré-salé de la Baie du Mont-Saint-Michel AOP", "Agneau de Sisteron AOP",
      "Agneau de Lozère AOP", "Agneau de l'Aveyron AOP", "Agneau de Pauillac AOP",
      "Agneau Salt Marsh AOP", "Mouton de Belle-Île AOP", "Mouton Herdwick AOP",
      "Agneau de Nouvelle-Zélande AOP", "Agneau Icelandic AOP", "Agneau des Pyrénées AOP",
      "Agneau de l'Adour AOP", "Agneau de lait des Pyrénées AOP", "Agneau du Bourbonnais AOP",
      "Agneau du Limousin AOP", "Agneau du Quercy AOP", "Agneau des Alpilles AOP",
      "Agneau de Crau AOP", "Agneau du Périgord AOP", "Agneau de Vendée AOP",
      "Agneau de pré-salé breton", "Agneau de Sisteron sélection", "Agneau de Lozère sélection",
      "Agneau de l'Aveyron sélection", "Agneau de Pauillac sélection", "Agneau Salt Marsh sélection",
      "Mouton de Belle-Île sélection", "Mouton Herdwick sélection", "Agneau des Pyrénées sélection",
      "Agneau de l'Adour sélection", "Agneau de lait sélection", "Agneau du Bourbonnais sélection",
      "Agneau du Limousin sélection", "Agneau du Quercy sélection", "Agneau des Alpilles sélection",
      "Agneau de Crau sélection", "Agneau du Périgord sélection", "Agneau de Vendée sélection",
      "Mouton de Barèges-Gavarnie AOP", "Mouton Charollais AOP"
    ][i % 40] + (i >= 40 ? ` (Sélection N°${Math.floor(i/40) + 1})` : ""),
    categorie: "Agneau et Mouton",
    temp_conservation: 1.5, temp_maturation: 2.0, hygro: 82, temp_apres_maturation: 1.0
  })),
  // Canard, Volaille et Gibier (60)
  ...Array.from({ length: 60 }).map((_, i) => ({
    nom: [
      "Canard de Challans AOP", "Canard Mulard AOP", "Canard de Barbarie AOP", "Caneton Nantais AOP",
      "Canard Croisé de Burgaud AOP", "Cerf Élaphe AOP", "Chevreuil AOP", "Sanglier AOP",
      "Faisan AOP", "Lièvre d'Europe AOP", "Grouse Écosse AOP", "Poularde de Bresse AOP",
      "Chapon de Bresse AOP", "Dinde de Bresse AOP", "Pintadeau de la Drôme AOP",
      "Canard de Challans sélection", "Canard Mulard sélection", "Canard de Barbarie sélection",
      "Caneton Nantais sélection", "Canard Croisé sélection", "Cerf Élaphe sélection",
      "Chevreuil sélection", "Sanglier sélection", "Faisan sélection", "Lièvre sélection",
      "Grouse sélection", "Poularde de Bresse fermière", "Chapon de Bresse fermier",
      "Dinde de Bresse fermière", "Pintadeau de la Drôme fermier", "Gelinotte des bois AOP",
      "Perdrix grise AOP", "Perdrix rouge AOP", "Bécasse des bois AOP", "Colvert AOP",
      "Caille des blés AOP", "Grive musicienne AOP", "Merle noir AOP", "Palombe AOP",
      "Pigeon ramier AOP", "Oie d'Anjou AOP", "Oie du Périgord AOP", "Oie de Toulouse AOP",
      "Chapon du Gers AOP", "Poularde du Gers AOP", "Poularde de Loué AOP", "Chapon de Loué AOP",
      "Poularde de Janzé AOP", "Chapon de Janzé AOP", "Pintadeau de Janzé AOP", "Poulet de Bresse AOP",
      "Poulet du Gers AOP", "Poulet de Loué AOP", "Poulet de Janzé AOP", "Poulet de Licques AOP",
      "Chapon de Licques AOP", "Dinde de Licques AOP", "Poulet des Landes AOP", "Chapon des Landes AOP",
      "Poularde des Landes AOP"
    ][i % 60] + (i >= 60 ? ` (Qualité Supérieure N°${Math.floor(i/60) + 1})` : ""),
    categorie: "Volaille et Gibier",
    temp_conservation: 1.0, temp_maturation: 1.5, hygro: 75, temp_apres_maturation: 0.5
  }))
];

// 200 French Wines
const WINES_DATA = [
  // Vins Rouges Puissants & de Garde (50)
  ...Array.from({ length: 50 }).map((_, i) => ({
    nom: [
      "Pauillac AOP (Bordeaux)", "Margaux AOP (Bordeaux)", "Saint-Julien AOP (Bordeaux)", "Pomerol AOP (Bordeaux)",
      "Saint-Émilion Grand Cru AOP", "Pessac-Léognan Rouge AOP", "Hermitage Rouge AOP (Rhône)",
      "Côte-Rôtie AOP (Rhône)", "Châteauneuf-du-Pape Rouge AOP", "Cornas AOP (Rhône)", "Saint-Joseph Rouge AOP",
      "Gigondas AOP (Rhône)", "Cahors AOP", "Madiran AOP", "Bandol Rouge AOP (Provence)",
      "Corbières Boutenac AOP", "Minervois-La Livinière AOP", "Faugères Rouge AOP", "Saint-Chinian AOP",
      "Fitou AOP", "Costières de Nîmes Rouge AOP", "Buzet Rouge AOP", "Cahors Prestige AOP",
      "Madiran Réserve AOP", "Bandol Rouge sélection", "Saint-Émilion sélection", "Pomerol sélection",
      "Pauillac Grand Cru sélection", "Margaux Grand Cru sélection", "Saint-Julien Grand Cru sélection",
      "Pessac-Léognan sélection", "Hermitage sélection", "Côte-Rôtie sélection", "Châteauneuf-du-Pape sélection",
      "Cornas sélection", "Saint-Joseph sélection", "Gigondas sélection", "Cahors sélection",
      "Madiran sélection", "Bandol sélection", "Bordeaux Supérieur AOP", "Médoc AOP",
      "Haut-Médoc AOP", "Saint-Estèphe AOP", "Listrac-Médoc AOP", "Moulis-en-Médoc AOP",
      "Fronsac AOP", "Canon-Fronsac AOP", "Lalande-de-Pomerol AOP", "Lussac-Saint-Émilion AOP"
    ][i % 50] + (i >= 50 ? ` (Millésime N°${Math.floor(i/50) + 1})` : ""),
    type: "Vins Rouges de Garde",
    temp_conservation: 12.0, temp_vieillissement: 12.5, hygro: 72, temp_service: 17.5
  })),
  // Vins Rouges Légers & Délicats (40)
  ...Array.from({ length: 40 }).map((_, i) => ({
    nom: [
      "Gevrey-Chambertin AOP (Bourgogne)", "Nuits-Saint-Georges AOP (Bourgogne)", "Pommard AOP (Bourgogne)",
      "Volnay AOP (Bourgogne)", "Chambolle-Musigny AOP (Bourgogne)", "Vosne-Romanée AOP (Bourgogne)",
      "Clos de Vougeot Grand Cru AOP", "Chassagne-Montrachet Rouge AOP", "Aloxe-Corton AOP (Bourgogne)",
      "Mercurey Rouge AOP (Bourgogne)", "Givry Rouge AOP (Bourgogne)", "Morgon AOP (Beaujolais)",
      "Moulin-à-Vent AOP (Beaujolais)", "Fleurie AOP (Beaujolais)", "Chiroubles AOP (Beaujolais)",
      "Brouilly AOP (Beaujolais)", "Chinon Rouge AOP (Loire)", "Bourgueil AOP (Loire)",
      "Saumur-Champigny AOP (Loire)", "Menetou-Salon Rouge AOP", "Sancerre Rouge AOP (Loire)",
      "Saint-Nicolas-de-Bourgueil AOP", "Anjou Rouge AOP", "Touraine Rouge AOP", "Bourgogne Pinot Noir AOP",
      "Gevrey-Chambertin sélection", "Nuits-Saint-Georges sélection", "Pommard sélection",
      "Volnay sélection", "Chambolle-Musigny sélection", "Vosne-Romanée sélection", "Clos de Vougeot sélection",
      "Chassagne-Montrachet sélection", "Aloxe-Corton sélection", "Mercurey sélection", "Givry sélection",
      "Morgon sélection", "Moulin-à-Vent sélection", "Fleurie sélection", "Chiroubles sélection"
    ][i % 40] + (i >= 40 ? ` (Millésime N°${Math.floor(i/40) + 1})` : ""),
    type: "Vins Rouges Légers",
    temp_conservation: 12.0, temp_vieillissement: 12.0, hygro: 75, temp_service: 15.5
  })),
  // Vins Blancs Secs & Onctueux (50)
  ...Array.from({ length: 50 }).map((_, i) => ({
    nom: [
      "Meursault Blanc AOP (Bourgogne)", "Puligny-Montrachet AOP (Bourgogne)", "Chassagne-Montrachet Blanc AOP",
      "Corton-Charlemagne Grand Cru AOP", "Chablis Grand Cru AOP", "Chablis Premier Cru AOP",
      "Pouilly-Fuissé AOP (Bourgogne)", "Saint-Véran AOP (Bourgogne)", "Sancerre Blanc AOP (Loire)",
      "Pouilly-Fumé AOP (Loire)", "Savennières AOP (Loire)", "Vouvray Blanc Sec AOP (Loire)",
      "Muscadet Sèvre et Maine sur Lie AOP", "Riesling d'Alsace Grand Cru AOP", "Gewurztraminer d'Alsace AOP",
      "Pinot Gris d'Alsace AOP", "Condrieu AOP (Rhône)", "Hermitage Blanc AOP (Rhône)",
      "Châteauneuf-du-Pape Blanc AOP", "Pessac-Léognan Blanc AOP (Bordeaux)", "Graves Blanc AOP (Bordeaux)",
      "Meursault sélection", "Puligny-Montrachet sélection", "Chassagne-Montrachet sélection",
      "Corton-Charlemagne sélection", "Chablis Grand Cru sélection", "Chablis Premier Cru sélection",
      "Pouilly-Fuissé sélection", "Saint-Véran sélection", "Sancerre Blanc sélection", "Pouilly-Fumé sélection",
      "Savennières sélection", "Vouvray sélection", "Muscadet sélection", "Riesling sélection",
      "Gewurztraminer sélection", "Pinot Gris sélection", "Condrieu sélection", "Hermitage Blanc sélection",
      "Châteauneuf-du-Pape Blanc sélection", "Petit Chablis AOP", "Saint-Bris AOP",
      "Bouzeron AOP", "Montagny AOP", "Rully Blanc AOP", "Mâcon-Villages AOP",
      "Quincy AOP", "Reuilly Blanc AOP", "Sancerre silex", "Pouilly-Fumé caillottes"
    ][i % 50] + (i >= 50 ? ` (Millésime N°${Math.floor(i/50) + 1})` : ""),
    type: "Vins Blancs Secs",
    temp_conservation: 11.5, temp_vieillissement: 12.0, hygro: 75, temp_service: 12.5
  })),
  // Vins Liquoreux & Doux (30)
  ...Array.from({ length: 30 }).map((_, i) => ({
    nom: [
      "Sauternes AOP (Bordeaux)", "Barsac AOP (Bordeaux)", "Monbazillac AOP (Sud-Ouest)", "Coteaux du Layon AOP",
      "Quarts de Chaume Grand Cru AOP", "Vouvray Moelleux AOP (Loire)", "Alsace Vendanges Tardives AOP",
      "Alsace Sélection de Grains Nobles", "Tokaji Aszu AOP (Hongrie - Import)", "Banyuls AOP (Languedoc-Roussillon)",
      "Maury AOP (Languedoc-Roussillon)", "Rasteau Vin Doux Naturel AOP", "Muscat de Beaumes-de-Venise AOP",
      "Muscat de Frontignan AOP", "Muscat de Rivesaltes AOP", "Sauternes sélection", "Barsac sélection",
      "Monbazillac sélection", "Coteaux du Layon sélection", "Quarts de Chaume sélection", "Vouvray sélection",
      "Alsace sélection VT", "Alsace sélection SGN", "Tokaji sélection", "Banyuls sélection",
      "Maury sélection", "Rasteau sélection", "Muscat Beaumes-de-Venise sélection", "Muscat Frontignan sélection",
      "Muscat Rivesaltes sélection"
    ][i % 30] + (i >= 30 ? ` (Millésime N°${Math.floor(i/30) + 1})` : ""),
    type: "Vins Liquoreux",
    temp_conservation: 12.0, temp_vieillissement: 12.0, hygro: 75, temp_service: 9.5
  })),
  // Champagnes & Effervescents (30)
  ...Array.from({ length: 30 }).map((_, i) => ({
    nom: [
      "Champagne Brut Millésimé AOP", "Champagne Blanc de Blancs AOP", "Champagne Blanc de Noirs AOP",
      "Champagne Rosé Assemblage AOP", "Champagne Rosé de Saignée AOP", "Champagne Extra Brut AOP",
      "Champagne Grand Cru AOP", "Champagne Premier Cru AOP", "Cremant de Bourgogne AOP",
      "Cremant d'Alsace AOP", "Cremant de Loire AOP", "Champagne Brut Tradition AOP",
      "Champagne Brut Réserve AOP", "Champagne Brut Millésimé sélection", "Champagne Blanc de Blancs sélection",
      "Champagne Blanc de Noirs sélection", "Champagne Rosé sélection", "Champagne Extra Brut sélection",
      "Champagne Grand Cru sélection", "Champagne Premier Cru sélection", "Cremant de Bourgogne sélection",
      "Cremant d'Alsace sélection", "Cremant de Loire sélection", "Champagne Demi-Sec AOP",
      "Champagne Doux AOP", "Clairette de Die AOP", "Blanquette de Limoux AOP", "Cerdon du Bugey AOP",
      "Vouvray Pétillant AOP", "Saumur Brut AOP"
    ][i % 30] + (i >= 30 ? ` (Millésime N°${Math.floor(i/30) + 1})` : ""),
    type: "Champagnes & Effervescents",
    temp_conservation: 10.5, temp_vieillissement: 11.0, hygro: 78, temp_service: 9.5
  }))
];

function getWineRegion(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("bordeaux") || n.includes("pauillac") || n.includes("margaux") || n.includes("saint-julien") || n.includes("pomerol") || n.includes("saint-émilion") || n.includes("pessac-léognan") || n.includes("médoc") || n.includes("saint-estèphe") || n.includes("listrac") || n.includes("moulis") || n.includes("fronsac") || n.includes("sauternes") || n.includes("barsac") || n.includes("graves")) {
    return "Bordeaux";
  }
  if (n.includes("bourgogne") || n.includes("chablis") || n.includes("meursault") || n.includes("puligny") || n.includes("chassagne") || n.includes("corton") || n.includes("vougeot") || n.includes("gevrey") || n.includes("nuits-saint-georges") || n.includes("pommard") || n.includes("volnay") || n.includes("chambolle") || n.includes("vosne") || n.includes("aloxe") || n.includes("mercurey") || n.includes("givry") || n.includes("montagny") || n.includes("rully") || n.includes("mâcon") || n.includes("bouzeron") || n.includes("crémant de bourgogne")) {
    return "Bourgogne";
  }
  if (n.includes("rhône") || n.includes("hermitage") || n.includes("côte-rôtie") || n.includes("châteauneuf") || n.includes("cornas") || n.includes("saint-joseph") || n.includes("gigondas") || n.includes("beaumes-de-venise") || n.includes("rasteau") || n.includes("clairette de die")) {
    return "Vallée du Rhône";
  }
  if (n.includes("loire") || n.includes("sancerre") || n.includes("pouilly-fumé") || n.includes("savennières") || n.includes("vouvray") || n.includes("muscadet") || n.includes("chinon") || n.includes("bourgueil") || n.includes("saumur") || n.includes("menetou") || n.includes("quincy") || n.includes("reuilly") || n.includes("layon") || n.includes("chaume") || n.includes("cremant de loire")) {
    return "Vallée de la Loire";
  }
  if (n.includes("champagne")) {
    return "Champagne";
  }
  if (n.includes("alsace") || n.includes("riesling") || n.includes("gewurztraminer") || n.includes("cremant d'alsace") || n.includes("pinot gris")) {
    return "Alsace";
  }
  if (n.includes("corbières") || n.includes("minervois") || n.includes("faugères") || n.includes("saint-chinian") || n.includes("fitou") || n.includes("costières") || n.includes("banyuls") || n.includes("maury") || n.includes("frontignan") || n.includes("rivesaltes") || n.includes("limoux")) {
    return "Languedoc-Roussillon";
  }
  if (n.includes("bandol") || n.includes("provence") || n.includes("corse") || n.includes("patrimonio") || n.includes("ajaccio")) {
    return "Provence & Corse";
  }
  if (n.includes("cahors") || n.includes("madiran") || n.includes("buzet") || n.includes("jura") || n.includes("arbois") || n.includes("chalon") || n.includes("l'étoile") || n.includes("monbazillac") || n.includes("bugey") || n.includes("savoie") || n.includes("chignin") || n.includes("apremont")) {
    return "Sud-Ouest, Jura & Savoie";
  }
  return "Autres Régions";
}

async function main() {
  console.log(`Démarrage de l'insertion de l'index étendu (200 de chaque)...`);

  // --- FROMAGES ---
  console.log(`Insertion des fromages (${CHEESES_DATA.length} entrées)...`);
  await prisma.cheeseProfile.deleteMany({});
  for (const [index, f] of CHEESES_DATA.entries()) {
    await prisma.cheeseProfile.create({
      data: {
        nom: f.nom,
        categorie: f.categorie,
        lait: f.lait,
        affinageTempMin: f.tempMin,
        affinageTempMax: f.tempMax,
        affinageHygroMin: f.hygroMin,
        affinageHygroMax: f.hygroMax,
        affinageDureeMin: f.dureeMin,
        affinageDureeMax: f.dureeMax,
        stabilisationTempMin: 4,
        stabilisationTempMax: 8,
        stabilisationHygroMin: 80,
        stabilisationHygroMax: 85,
        ventilation: "Automatique",
        retournement: "Hebdomadaire",
        notes: "Profil réel de référence nationale."
      }
    });
  }

  // --- VIANDES ---
  console.log(`Insertion des viandes (${MEATS_DATA.length} entrées)...`);
  await prisma.viandeProfile.deleteMany({});
  for (const [index, v] of MEATS_DATA.entries()) {
    const slugId = `viande-${v.nom.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)}-${index}`;
    await prisma.viandeProfile.create({
      data: {
        id: slugId,
        nom: v.nom,
        categorie: v.categorie,
        temp_conservation_degC: v.temp_conservation,
        temp_maturation_degC: v.temp_maturation,
        hygrometrie_pourcent: v.hygro,
        temp_apres_maturation_degC: v.temp_apres_maturation
      }
    });
  }

  // --- VINS ---
  console.log(`Insertion des vins (${WINES_DATA.length} entrées)...`);
  await prisma.vinProfile.deleteMany({});
  for (const [index, w] of WINES_DATA.entries()) {
    const slugId = `vin-${w.nom.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)}-${index}`;
    const region = getWineRegion(w.nom);
    await prisma.vinProfile.create({
      data: {
        id: slugId,
        nom: w.nom,
        type: region,
        temp_conservation_degC: w.temp_conservation,
        temp_vieillissement_degC: w.temp_vieillissement,
        hygrometrie_pourcent: w.hygro,
        temp_service_recommandee_degC: w.temp_service
      }
    });
  }

  console.log("Seeding étendu terminé avec succès !");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
