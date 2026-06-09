// @ts-ignore
import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// Palette de couleurs premium
const AMBER = '#78350f';        // Couleur de marque principale (Ambre fonce)
const AMBER_LIGHT = '#d97706';  // Accent ambre
const SLATE = '#0f172a';        // Texte principal sombre
const SLATE_MID = '#334155';    // Texte secondaire
const SLATE_LIGHT = '#64748b';  // Texte tertiaire / labels
const BORDER_COLOR = '#e2e8f0'; // Bordures gris leger
const BG_CARD = '#f8fafc';      // Couleur de fond des cartes techniques
const WHITE = '#ffffff';

export async function GET() {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 0, 
    info: {
      Title: "Fiche Technique Officielle - L'Affine Bouche",
      Author: 'Atelier L\'Affine Bouche & ECAM LaSalle Lyon',
      Subject: 'Cave d\'Affinage Gastronomique Connectée',
      Keywords: 'Affinage, Fromage, Vin, Maturation Viande, IoT, Web Bluetooth, Peltier, Humidité',
    }
  });

  const chunks: Buffer[] = [];

  return new Promise<NextResponse>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(
        new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="fiche-technique-affine-bouche.pdf"',
            'Content-Length': pdfBuffer.length.toString(),
          },
        })
      );
    });
    doc.on('error', reject);

    const W = doc.page.width;   // A4: 595.28
    const H = doc.page.height;  // A4: 841.89
    const M = 48;               // Marges interieures
    const CW = W - M * 2;       // Largeur utile de contenu: 499.28

    /* ==========================================================================
       PAGE 1 : COUVERTURE & CONCEPT MODULAIRE
       ========================================================================== */
    
    // Bandeau d'en-tete
    doc.rect(0, 0, W, 140).fill(AMBER);
    doc.rect(0, 137, W, 3).fill(AMBER_LIGHT);

    // Conteneur du logo blanc en haut a gauche
    const logoSize = 90;
    doc.roundedRect(24, 25, logoSize, logoSize, 12).fill(WHITE);

    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (existsSync(logoPath)) {
        const logoBuffer = readFileSync(logoPath);
        doc.image(logoBuffer, 24 + 10, 35, { width: logoSize - 20, height: logoSize - 20 });
      }
    } catch (e) {
      console.error('Failed to load logo in PDF:', e);
    }

    const textX = 24 + logoSize + 20;
    const textW = W - M - textX;

    // Signature Ingenieur en haut a droite
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(WHITE).opacity(0.8)
      .text('CONÇU PAR DES INGÉNIEURS ECAM LASALLE LYON', textX, 28, { align: 'right', width: textW });
    doc.opacity(1);

    // Titre Principal
    doc.fontSize(26).font('Helvetica-Bold').fillColor(WHITE)
      .text("L'Affine Bouche", textX, 45, { width: textW });

    // Categorie
    doc.fontSize(11).font('Helvetica-Bold').fillColor(AMBER_LIGHT)
      .text('CAVE D\'AFFINAGE GASTRONOMIQUE CONNECTÉE', textX, 78, { width: textW });

    // Fiche Technique
    doc.fontSize(9.5).font('Helvetica').fillColor(WHITE).opacity(0.85)
      .text('Dossier Technique & Spécifications Matérielles  ·  V1.0', textX, 95, { width: textW });
    doc.opacity(1);

    // Citation accroche italique
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(WHITE).opacity(0.7)
      .text('"L\'art de l\'affinage traditionnel, maîtrisé par la technologie moderne."', textX, 112, { width: textW });
    doc.opacity(1);

    let y = 165;

    // Introduction / Description du Concept
    doc.fontSize(14).font('Helvetica-Bold').fillColor(SLATE)
      .text('Le Concept L\'Affine Bouche', M, y);
    y += 20;

    doc.fontSize(9.5).font('Helvetica').fillColor(SLATE_MID)
      .text(
        "L'Affine Bouche réinvente la conservation gastronomique à domicile. Conçue à l'origine par un collectif d'ingénieurs de l'ECAM LaSalle Lyon, cette cave combine régulation moléculaire, capteurs connectés et design modulaire premium. Elle reproduit fidèlement le microclimat des caves d'affinage artisanales pour sublimer fromages, vins et viandes maturées, tout en évitant les vibrations destructrices des compresseurs traditionnels.",
        M, y, { width: CW, align: 'justify', lineGap: 3.5 }
      );
    y = doc.y + 16;

    // Badges d'usages
    const usages = ['Affinage Fromages', 'Vieillissement Vins', 'Maturation Viandes', 'Charcuteries'];
    let pillX = M;
    usages.forEach((u) => {
      const pillW = doc.fontSize(8.5).widthOfString(u) + 20;
      doc.roundedRect(pillX, y, pillW, 20, 10).fill('#fef3c7');
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(AMBER)
        .text(u, pillX + 10, y + 6, { width: pillW - 20, lineBreak: false });
      pillX += pillW + 8;
    });

    y += 34;

    // Section : Architecture Modulaire
    doc.rect(M, y, 4, 18).fill(AMBER_LIGHT);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(SLATE)
      .text('Une Architecture Modulaire Innovante', M + 12, y + 2);
    doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor(BORDER_COLOR).lineWidth(1).stroke();
    y += 30;

    doc.fontSize(9.5).font('Helvetica').fillColor(SLATE_MID)
      .text(
        "Grâce à notre système modulaire empilable breveté, vous assemblez votre cave selon vos besoins réels. L'alimentation électrique et la communication de données s'effectuent via des connecteurs magnétiques rapides intégrés sur les faces. L'installation se compose de :",
        M, y, { width: CW, align: 'justify', lineGap: 3.5 }
      );
    y = doc.y + 12;

    const components = [
      { name: "Le Bloc Spécial Maître", desc: "Socle obligatoire de l'installation modulaire. Il intègre le thermostat central de sécurité, l'hygro-brumisateur d'eau distillée centralisé, les filtres d'odeurs à charbon actif de grande taille, l'écran de contrôle tactile OLED de 5 pouces et la carte réseau Wi-Fi/Bluetooth." },
      { name: "Les Blocs d'Affinage Additionnels (1 à 5 max)", desc: "Modules de stockage autonomes d'une hauteur utile de 40 cm. Chacun est équipé de tiroirs en bois de hêtre, de capteurs indépendants et d'un actuateur Peltier permettant un réglage micro-climatique unique par tiroir." }
    ];

    components.forEach((comp) => {
      doc.circle(M + 8, y + 7, 3).fill(AMBER_LIGHT);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(SLATE)
        .text(comp.name, M + 18, y, { width: CW - 18 });
      y = doc.y + 3;
      doc.fontSize(9).font('Helvetica').fillColor(SLATE_MID)
        .text(comp.desc, M + 18, y, { width: CW - 18, align: 'justify', lineGap: 2.5 });
      y = doc.y + 12;
    });

    y += 8;

    // Section : Les Trois Gammes
    doc.rect(M, y, 4, 18).fill(AMBER_LIGHT);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(SLATE)
      .text('Trois Gammes Commercialisées', M + 12, y + 2);
    doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor(BORDER_COLOR).lineWidth(1).stroke();
    y += 30;

    const rangeW = (CW - 16) / 3;
    const rangeColors = ['#f8fafc', '#fffbeb', '#fbf7f5'];
    const rangeBars   = ['#94a3b8', AMBER_LIGHT, '#78350f'];

    const rangeData = [
      { name: 'Gamme Compact', price: '500 € TTC', text: 'Un unique bloc hermétique de 50 cm de côté avec centrale intégrée. Idéal pour débuter en appartement ou pour les petites cuisines.' },
      { name: 'Gamme Familiale', price: 'Dès 500 € TTC', text: 'Configuration évolutive avec 1 bloc maître et 1 à 5 blocs d\'affinage superposés en colonnes de hauteur modulable.' },
      { name: 'Gamme Professionnelle', price: 'Sur Devis', text: 'Solutions multi-colonnes de grande capacité pour restaurants, crémiers-fromagers, bouchers et viticulteurs exigeants.' }
    ];

    rangeData.forEach((range, idx) => {
      const xPos = M + idx * (rangeW + 8);
      
      // Card Background
      doc.roundedRect(xPos, y, rangeW, 110, 8).fill(rangeColors[idx]);
      doc.rect(xPos, y, rangeW, 4).fill(rangeBars[idx]);

      // Star on Popular
      if (idx === 1) {
        doc.roundedRect(xPos + rangeW / 2 - 30, y - 9, 60, 15, 7.5).fill(AMBER_LIGHT);
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor(WHITE)
          .text('★ Populaire', xPos + rangeW / 2 - 25, y - 5, { width: 50, lineBreak: false });
      }

      // Range Title
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(SLATE)
        .text(range.name, xPos + 10, y + 15, { width: rangeW - 20, align: 'center' });
      
      // Range Price
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(AMBER)
        .text(range.price, xPos + 10, y + 28, { width: rangeW - 20, align: 'center' });

      // Range description text
      doc.fontSize(8).font('Helvetica').fillColor(SLATE_MID)
        .text(range.text, xPos + 10, y + 42, { width: rangeW - 20, align: 'justify', lineGap: 2 });
    });

    // Bas de page (Footer Page 1)
    const footerY1 = H - 35;
    doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_LIGHT)
      .text('Fiche technique officielle — L\'Affine Bouche — Page 1/2', M, footerY1, { align: 'center', width: CW });

    
    /* ==========================================================================
       PAGE 2 : SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES
       ========================================================================== */
    doc.addPage();

    // Bandeau d'en-tete reduit pour Page 2
    doc.rect(0, 0, W, 65).fill(AMBER);
    doc.rect(0, 62, W, 3).fill(AMBER_LIGHT);

    doc.fontSize(14).font('Helvetica-Bold').fillColor(WHITE)
      .text("L'Affine Bouche — Spécifications Matérielles", M, 20, { width: CW });
    doc.fontSize(8.5).font('Helvetica').fillColor(WHITE).opacity(0.8)
      .text("Données ingénierie détaillées, tolérances environnementales et certifications", M, 38, { width: CW });
    doc.opacity(1);

    y = 85;

    // TITRE : CARACTÉRISTIQUES CLIMATIQUES & COMPOSANTS
    doc.rect(M, y, 4, 18).fill(AMBER_LIGHT);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(SLATE)
      .text('Caractéristiques Climatiques & Composants Physiques', M + 12, y + 2);
    doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor(BORDER_COLOR).lineWidth(1).stroke();
    y += 30;

    // Grille 2 colonnes de details techniques
    const colW = (CW - 14) / 2;
    
    const detailedSpecs = [
      {
        title: "Thermorégulation Peltier PWM",
        desc: "Equipée de cellules thermoélectriques Peltier de classe industrielle. Aucun compresseur mécanique, supprimant les vibrations nocives pour la structure cellulaire des fromages et le dépôt des vins. Contrôle par microcontrôleur PID avec pont en H en modulation de largeur d'impulsion (PWM).\n• Plage de consigne : 2°C à 22°C\n• Précision de stabilisation : ±0,5°C\n• Sécurité de surchauffe par thermostat bimétallique."
      },
      {
        title: "Hygro-brumisation Piézoélectrique",
        desc: "Humidificateur à ultrasons par vibration haute fréquence (1.5 MHz) d'une cellule céramique. Crée un brouillard sec de micro-gouttelettes d'eau de moins de 5 microns qui augmente l'humidité ambiante de manière uniforme sans détremper les surfaces.\n• Plage de fonctionnement : 70% à 95% RH\n• Précision d'hygrométrie : ±3%\n• Consommation d'eau : réservoir intégré de 1.5 Litres avec capteur de niveau bas."
      },
      {
        title: "Filtration des Odeurs Forcée",
        desc: "Chaque module communique avec la centrale contenant une cartouche cylindrique de charbon actif extrudé à haute porosité. Un ventilateur forcé à flux continu fait circuler l'air à travers le filtre pour éliminer toute trace d'odeur externe tout en préservant le bouquet des fromages à l'intérieur.\n• Matériau filtrant : Charbon actif issu de noix de coco\n• Adsorption physique : surface spécifique > 1050 m²/g\n• Durée de vie du filtre : 6 à 12 mois."
      },
      {
        title: "Électronique embarquée & Capteurs",
        desc: "Chaque compartiment est instrumenté d'une sonde numérique combinée haute précision scellée contre l'humidité.\n• Sonde de température : Capteur à semi-conducteur ±0,2°C\n• Sonde d'humidité relative : Capteur capacitif polymère ±2%\n• Affichage local : Ecran OLED 1.3 pouces à fort contraste pour suivi en temps réel de la température et de l'hygrométrie de consigne."
      }
    ];

    let rowY = y;
    detailedSpecs.forEach((spec, index) => {
      const colIdx = index % 2;
      const xPos = M + colIdx * (colW + 14);

      // Card Box
      doc.roundedRect(xPos, rowY, colW, 145, 8).fill(BG_CARD);
      doc.rect(xPos, rowY, 3, 145).fill(AMBER_LIGHT);

      // Titre spec
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(SLATE)
        .text(spec.title, xPos + 12, rowY + 10, { width: colW - 22 });
      
      // Texte spec
      doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_MID)
        .text(spec.desc, xPos + 12, rowY + 24, { width: colW - 22, align: 'justify', lineGap: 2.2 });

      if (colIdx === 1) {
        rowY += 157;
      }
    });

    y = rowY + 10;

    // TITRE : DIMENSIONS, ÉLECTRICITÉ & ENVIRONNEMENT
    doc.rect(M, y, 4, 18).fill(AMBER_LIGHT);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(SLATE)
      .text('Données Structurelles, Électriques & Normes', M + 12, y + 2);
    doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor(BORDER_COLOR).lineWidth(1).stroke();
    y += 30;

    const extraSpecs = [
      {
        category: "Dimensions & Structures",
        items: [
          "Dimensions extérieures : 500 x 500 x 500 mm (par bloc standard)",
          "Dimensions intérieures utiles : 400 x 400 x 400 mm",
          "Poids à vide : 6.0 kg par bloc (12.0 kg pour le Bloc Maître)",
          "Matériaux intérieurs : Acier inoxydable AISI 304, poli miroir (anti-bactérien)",
          "Isolation thermique : Mousse polyuréthane injectée (épaisseur 40 mm, sans CFC)",
          "Clayettes : Bois de hêtre brut certifié FSC, traité contre l'humidité sans vernis chimique"
        ]
      },
      {
        category: "Données Électriques & Normes",
        items: [
          "Alimentation d'entrée : 230 V AC / 50 Hz",
          "Tension interne de sécurité : 12 V / 24 V DC (Très Basse Tension de Sécurité)",
          "Consommation maximale : 120 W par module (lors du refroidissement actif)",
          "Consommation moyenne annuelle : < 120 kWh / module (classe d'efficacité supérieure)",
          "Étanchéité électronique : Indice de protection IP65 (résistant à la saturation en eau)",
          "Certifications officielles : Conforme Directive Basse Tension 2014/35/UE, Marquage CE, RoHS"
        ]
      }
    ];

    extraSpecs.forEach((section, index) => {
      const colIdx = index % 2;
      const xPos = M + colIdx * (colW + 14);

      doc.fontSize(10).font('Helvetica-Bold').fillColor(SLATE)
        .text(section.category, xPos, y);
      
      let itemY = y + 18;
      section.items.forEach((item) => {
        doc.circle(xPos + 4, itemY + 4, 2).fill(AMBER);
        doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_MID)
          .text(item, xPos + 12, itemY, { width: colW - 14, lineGap: 2 });
        itemY = doc.y + 4;
      });
    });

    y += 110;

    // Bandeau d'information sur la conception ingenierie
    doc.roundedRect(M, y, CW, 50, 8).fill('#fef3c7');
    doc.fontSize(9).font('Helvetica-Bold').fillColor(AMBER)
      .text('Note sur le projet de conception', M + 15, y + 10);
    doc.fontSize(8).font('Helvetica').fillColor(SLATE_MID)
      .text("Cette cave d'affinage connectée a été conçue comme prototype de recherche de fin d'études par les élèves ingénieurs de l'ECAM LaSalle Lyon. L'objectif industriel était de maximiser l'efficience énergétique des éléments Peltier via un algorithme de thermostat PWM adaptatif tout en s'affranchissant du gaz frigorigène.", M + 15, y + 22, { width: CW - 30, align: 'justify', lineGap: 2.2 });

    // Bas de page (Footer Page 2)
    const footerY2 = H - 35;
    doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_LIGHT)
      .text('Fiche technique officielle — L\'Affine Bouche — Page 2/2', M, footerY2, { align: 'center', width: CW });

    doc.end();
  });
}
