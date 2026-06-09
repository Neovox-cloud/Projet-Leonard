import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data || !data.nom || typeof data.nom !== 'string' || data.nom.trim() === '') {
      return NextResponse.json(
        { error: 'Données invalides : le type de produit et le nom sont requis.' },
        { status: 400 }
      );
    }

    const validateFloat = (val: any, min: number, max: number, name: string): number => {
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed < min || parsed > max) {
        throw new Error(`Le paramètre "${name}" (${val}) doit être un nombre compris entre ${min} et ${max}.`);
      }
      return parsed;
    };

    const validateInt = (val: any, min: number, max: number, name: string): number => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed < min || parsed > max) {
        throw new Error(`Le paramètre "${name}" (${val}) doit être un entier compris entre ${min} et ${max}.`);
      }
      return parsed;
    };

    // Helper to generate string IDs since Prisma client schemas might not auto-generate them for all models.
    const generateId = () => {
      return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    try {
      if (type === 'fromage') {
        const cheese = await prisma.cheeseProfile.create({
          data: {
            nom: data.nom.trim(),
            categorie: data.categorie || 'Personnalisé',
            lait: data.lait || 'Non spécifié',
            affinageTempMin: validateFloat(data.affinageTempMin, 2, 22, 'Température minimale d\'affinage'),
            affinageTempMax: validateFloat(data.affinageTempMax, 2, 22, 'Température maximale d\'affinage'),
            affinageHygroMin: validateFloat(data.affinageHygroMin, 40, 100, 'Hygrométrie minimale'),
            affinageHygroMax: validateFloat(data.affinageHygroMax, 40, 100, 'Hygrométrie maximale'),
            affinageDureeMin: validateInt(data.affinageDureeMin, 1, 365, 'Durée minimale'),
            affinageDureeMax: validateInt(data.affinageDureeMax, 1, 365, 'Durée maximale'),
            notes: data.notes || '',
          },
        });
        return NextResponse.json({ success: true, item: cheese });
      }

      if (type === 'viande') {
        const viande = await prisma.viandeProfile.create({
          data: {
            id: generateId(),
            nom: data.nom.trim(),
            categorie: data.categorie || 'Personnalisé',
            temp_conservation_degC: validateFloat(data.temp_conservation_degC, -2, 22, 'Température de conservation'),
            temp_maturation_degC: validateFloat(data.temp_maturation_degC, -2, 22, 'Température de maturation'),
            hygrometrie_pourcent: validateFloat(data.hygrometrie_pourcent, 40, 100, 'Hygrométrie cible'),
            temp_apres_maturation_degC: validateFloat(data.temp_apres_maturation_degC, -2, 22, 'Température post-maturation'),
          },
        });
        return NextResponse.json({ success: true, item: viande });
      }

      if (type === 'vin') {
        const vin = await prisma.vinProfile.create({
          data: {
            id: generateId(),
            nom: data.nom.trim(),
            type: data.categorie || 'Rouge', // target `type` in VinProfile schema is mapped to our category selector field
            temp_conservation_degC: validateFloat(data.temp_conservation_degC, 4, 22, 'Température de conservation'),
            temp_vieillissement_degC: validateFloat(data.temp_vieillissement_degC, 4, 22, 'Température de vieillissement'),
            hygrometrie_pourcent: validateFloat(data.hygrometrie_pourcent, 40, 100, 'Hygrométrie cible'),
            temp_service_recommandee_degC: validateFloat(data.temp_service_recommandee_degC, 4, 22, 'Température de service'),
          },
        });
        return NextResponse.json({ success: true, item: vin });
      }
    } catch (validationError: any) {
      return NextResponse.json({ error: validationError.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Type de produit inconnu.' }, { status: 400 });
  } catch (error: any) {
    console.error('Erreur API produits:', error);
    return NextResponse.json(
      { error: `Erreur interne du serveur : ${error.message}` },
      { status: 500 }
    );
  }
}
