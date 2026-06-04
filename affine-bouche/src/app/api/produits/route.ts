import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data || !data.nom) {
      return NextResponse.json(
        { error: 'Données invalides : le type de produit et le nom sont requis.' },
        { status: 400 }
      );
    }

    // Helper to generate string IDs since Prisma client schemas might not auto-generate them for all models.
    const generateId = () => {
      return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    if (type === 'fromage') {
      const cheese = await prisma.cheeseProfile.create({
        data: {
          nom: data.nom,
          categorie: data.categorie || 'Personnalisé',
          lait: data.lait || 'Non spécifié',
          affinageTempMin: parseFloat(data.affinageTempMin) || 10,
          affinageTempMax: parseFloat(data.affinageTempMax) || 14,
          affinageHygroMin: parseFloat(data.affinageHygroMin) || 85,
          affinageHygroMax: parseFloat(data.affinageHygroMax) || 90,
          affinageDureeMin: parseInt(data.affinageDureeMin) || 15,
          affinageDureeMax: parseInt(data.affinageDureeMax) || 30,
          notes: data.notes || '',
        },
      });
      return NextResponse.json({ success: true, item: cheese });
    }

    if (type === 'viande') {
      const viande = await prisma.viandeProfile.create({
        data: {
          id: generateId(),
          nom: data.nom,
          categorie: data.categorie || 'Personnalisé',
          temp_conservation_degC: parseFloat(data.temp_conservation_degC) || 2,
          temp_maturation_degC: parseFloat(data.temp_maturation_degC) || 2,
          hygrometrie_pourcent: parseFloat(data.hygrometrie_pourcent) || 80,
          temp_apres_maturation_degC: parseFloat(data.temp_apres_maturation_degC) || 4,
        },
      });
      return NextResponse.json({ success: true, item: viande });
    }

    if (type === 'vin') {
      const vin = await prisma.vinProfile.create({
        data: {
          id: generateId(),
          nom: data.nom,
          type: data.categorie || 'Rouge', // target `type` in VinProfile schema is mapped to our category selector field
          temp_conservation_degC: parseFloat(data.temp_conservation_degC) || 12,
          temp_vieillissement_degC: parseFloat(data.temp_vieillissement_degC) || 12,
          hygrometrie_pourcent: parseFloat(data.hygrometrie_pourcent) || 70,
          temp_service_recommandee_degC: parseFloat(data.temp_service_recommandee_degC) || 16,
        },
      });
      return NextResponse.json({ success: true, item: vin });
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
