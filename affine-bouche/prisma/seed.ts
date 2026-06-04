import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { VIANDES } from '../src/data/viandes.ts';
import { VINS } from '../src/data/vins.ts';

const prisma = new PrismaClient();

async function main() {
  const jsonFilePath = path.resolve(process.cwd(), 'public/fromages.json');

  console.log('Démarrage de l\'importation des données depuis le fichier JSON...');

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`Le fichier ${jsonFilePath} n'existe pas. Veuillez le créer avec les données JSON fournies.`);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonFilePath, 'utf8');
  let jsonData;
  try {
    jsonData = JSON.parse(fileData);
  } catch (err) {
    console.error('Erreur lors du parsing du fichier JSON :', err);
    process.exit(1);
  }

  const fromages = jsonData.fromages || [];
  console.log(`${fromages.length} fromages trouvés. Insertion dans la base de données...`);
  
  // Vider la table avant d'importer
  await prisma.cheeseProfile.deleteMany({});
  
  for (const f of fromages) {
    await prisma.cheeseProfile.create({
      data: {
        nom: f.nom,
        categorie: f.categorie,
        lait: f.lait,
        
        affinageTempMin: f.affinage?.temperature_celsius?.min,
        affinageTempMax: f.affinage?.temperature_celsius?.max,
        affinageHygroMin: f.affinage?.hygrometrie_pct?.min,
        affinageHygroMax: f.affinage?.hygrometrie_pct?.max,
        affinageDureeMin: f.affinage?.duree_jours?.min,
        affinageDureeMax: f.affinage?.duree_jours?.max,
        
        stabilisationTempMin: f.stabilisation?.temperature_celsius?.min,
        stabilisationTempMax: f.stabilisation?.temperature_celsius?.max,
        stabilisationHygroMin: f.stabilisation?.hygrometrie_pct?.min,
        stabilisationHygroMax: f.stabilisation?.hygrometrie_pct?.max,
        
        ventilation: f.ventilation,
        retournement: f.retournement,
        notes: f.notes
      },
    });
  }
  
  console.log('Importation des fromages terminée avec succès !');

  // Vider et insérer les viandes
  console.log('Insertion des viandes...');
  await prisma.viandeProfile.deleteMany({});
  for (const v of VIANDES) {
    await prisma.viandeProfile.create({
      data: {
        id: v.id,
        nom: v.nom,
        categorie: v.categorie,
        temp_conservation_degC: v.temp_conservation_degC,
        temp_maturation_degC: v.temp_maturation_degC,
        hygrometrie_pourcent: v.hygrometrie_pourcent,
        temp_apres_maturation_degC: v.temp_apres_maturation_degC,
      }
    });
  }
  console.log('Importation des viandes terminée !');

  // Vider et insérer les vins
  console.log('Insertion des vins...');
  await prisma.vinProfile.deleteMany({});
  for (const v of VINS) {
    await prisma.vinProfile.create({
      data: {
        id: v.id,
        nom: v.nom,
        type: v.type,
        temp_conservation_degC: v.temp_conservation_degC,
        temp_vieillissement_degC: v.temp_vieillissement_degC,
        hygrometrie_pourcent: v.hygrometrie_pourcent,
        temp_service_recommandee_degC: v.temp_service_recommandee_degC,
      }
    });
  }
  console.log('Importation des vins terminée !');
  
  // S'assurer qu'il y a au moins un mockCave
  const caveCount = await prisma.mockCave.count();
  if (caveCount === 0) {
    await prisma.mockCave.create({
      data: {
        currentTemp: 12.5,
        currentHumidity: 85.0,
        fanActive: false,
        coolerActive: false,
        humidifierActive: false,
      }
    });
    console.log('Statut de la cave initialisé.');
  }
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
