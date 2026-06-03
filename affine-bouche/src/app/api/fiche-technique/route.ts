import PDFDocument from 'pdfkit';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const AMBER = '#92400e';
const AMBER_LIGHT = '#d97706';
const SLATE = '#1e293b';
const SLATE_MID = '#475569';
const SLATE_LIGHT = '#94a3b8';
const WHITE = '#ffffff';
const BG = '#fffbeb';

const specs = [
  { title: 'Régulation thermique', detail: 'Plage 2°C à 22°C, précision ±0,5°C. Module Peltier + ventilateur contrôlé.' },
  { title: "Contrôle de l'humidité", detail: 'Hygrométrie 70% à 95%, précision ±3%. Humidificateur ultrasonique + déshumidificateur.' },
  { title: 'Filtration des odeurs', detail: "Filtre à charbon actif intégré. Zéro odeur résiduelle vers l'extérieur." },
  { title: 'Connectivité', detail: 'Bluetooth, application mobile iOS/Android. Portée stable 15 m. Configuration en moins de 5 minutes.' },
  { title: 'Capteurs embarqués', detail: 'Température, hygrométrie, CO2, horloge/timer. Afficheur OLED intégré.' },
  { title: 'Indice de protection', detail: "IP65, résistant à la condensation et à l'humidité interne." },
  { title: 'Consommation énergétique', detail: 'Moins de 120 kWh/an.' },
  { title: 'Certification', detail: 'Marquage CE, conforme directive Basse Tension 2014/35/UE.' },
  { title: 'Matériaux', detail: 'Surfaces intérieures inox 304 sans BPA, conformes règlements CE 852/2004 et 1935/2004.' },
  { title: 'Format', detail: "40 x 40 x 40 cm par bloc. Les blocs s'empilent ou se disposent côte à côte." },
  { title: 'Niveau sonore', detail: 'Moins de 35 dB(A).' },
];

const ranges = [
  {
    name: 'Compact',
    description: "Un bloc indépendant, alimentation et réservoir intégrés. Idéal pour un usage personnel ou en appartement.",
  },
  {
    name: 'Familiale',
    description: 'Bloc principal + modules additionnels assemblables. Alimentation centralisée, capacité augmentée.',
  },
  {
    name: 'Haut de gamme',
    description: 'Configuration multi-blocs sur-mesure pour restaurateurs, cavistes et écoles de cuisine.',
  },
];

export async function GET() {
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: {
    Title: "Fiche Technique - L'Affine Bouche",
    Author: 'ECAM LaSalle Lyon',
    Subject: 'Cave Gastronomique Connectée',
  }});

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

    const W = doc.page.width;   // 595
    const M = 48;               // margin intérieur
    const CW = W - M * 2;      // content width

    /* ══════════════════════════════════════════
       HEADER BANNER
    ══════════════════════════════════════════ */
    doc.rect(0, 0, W, 110).fill(AMBER);

    // Ligne décorative fine
    doc.rect(0, 108, W, 3).fill(AMBER_LIGHT);

    // Badge ingénieurs (coin haut droit)
    doc.fontSize(7).fillColor(WHITE).opacity(0.75)
      .text('Conçu par des ingénieurs ECAM LaSalle Lyon', M, 16, { align: 'right', width: CW });
    doc.opacity(1);

    // Titre produit
    doc.fontSize(26).font('Helvetica-Bold').fillColor(WHITE)
      .text("L'Affine Bouche", M, 30, { width: CW });

    // Sous-titre
    doc.fontSize(11).font('Helvetica').fillColor(WHITE).opacity(0.85)
      .text('Cave Gastronomique Connectée  ·  Fiche Technique', M, 62, { width: CW });
    doc.opacity(1);

    // Accroche
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(WHITE).opacity(0.7)
      .text('"L\'art de l\'affinage, enfin à portée de main."', M, 82, { width: CW });
    doc.opacity(1);

    let y = 130;

    /* ══════════════════════════════════════════
       DESCRIPTION
    ══════════════════════════════════════════ */
    doc.fontSize(9).font('Helvetica').fillColor(SLATE_MID)
      .text(
        "L'Affine Bouche est une cave d'affinage gastronomique modulaire et connectée, conçue pour reproduire les conditions des meilleures caves artisanales. Elle permet de conserver, affiner et maturer fromages, viandes, charcuteries et vins dans un microclimat parfaitement maîtrisé, piloté depuis une application mobile. Après une simple configuration, la cave ajuste automatiquement ses paramètres et maintient les conditions idéales jusqu'à dégustation.",
        M, y, { width: CW, align: 'justify', lineGap: 3 }
      );

    y = doc.y + 22;

    /* ══════════════════════════════════════════
       USAGES PILLS
    ══════════════════════════════════════════ */
    const usages = ['Fromages', 'Vins', 'Viandes maturées', 'Charcuteries'];
    let pillX = M;
    usages.forEach((u) => {
      const pillW = doc.fontSize(8).widthOfString(u) + 18;
      doc.roundedRect(pillX, y, pillW, 18, 9).fill('#fef3c7');
      doc.fontSize(8).font('Helvetica-Bold').fillColor(AMBER)
        .text(u, pillX + 9, y + 5, { width: pillW - 18, lineBreak: false });
      pillX += pillW + 8;
    });

    y += 32;

    /* ══════════════════════════════════════════
       SECTION : SPÉCIFICATIONS TECHNIQUES
    ══════════════════════════════════════════ */
    // Titre section
    doc.rect(M, y, 4, 18).fill(AMBER_LIGHT);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(SLATE)
      .text('Spécifications techniques', M + 12, y + 2);
    doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor('#e2e8f0').lineWidth(1).stroke();

    y += 30;

    // Grille 2 colonnes
    const colW = (CW - 12) / 2;
    let col = 0;

    specs.forEach((spec) => {
      const xPos = M + col * (colW + 12);

      // Fond de carte
      doc.roundedRect(xPos, y, colW, 52, 6).fill('#f8fafc');
      // Barre latérale
      doc.rect(xPos, y, 3, 52).fill(AMBER_LIGHT);

      // Titre spec
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(SLATE)
        .text(spec.title, xPos + 10, y + 8, { width: colW - 18, lineBreak: false });

      // Détail
      doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_MID)
        .text(spec.detail, xPos + 10, y + 22, { width: colW - 18, lineGap: 2 });

      col++;
      if (col === 2) {
        col = 0;
        y += 60;
      }
    });

    // Si nombre impair, avancer y
    if (col === 1) y += 60;

    y += 16;

    /* ══════════════════════════════════════════
       SECTION : TROIS GAMMES
    ══════════════════════════════════════════ */
    doc.rect(M, y, 4, 18).fill(AMBER_LIGHT);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(SLATE)
      .text('Trois gammes', M + 12, y + 2);
    doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor('#e2e8f0').lineWidth(1).stroke();

    y += 30;

    const rangeW = (CW - 16) / 3;
    const rangeColors = ['#f1f5f9', '#fffbeb', '#fefce8'];
    const rangeBars   = ['#94a3b8', AMBER_LIGHT, '#ca8a04'];

    ranges.forEach((range, i) => {
      const xPos = M + i * (rangeW + 8);

      // Fond
      doc.roundedRect(xPos, y, rangeW, 80, 8).fill(rangeColors[i]);

      // Barre top
      doc.rect(xPos, y, rangeW, 4).fill(rangeBars[i]);

      // Badge "Populaire" sur la gamme Familiale
      if (i === 1) {
        doc.roundedRect(xPos + rangeW / 2 - 28, y - 9, 56, 16, 8).fill(AMBER_LIGHT);
        doc.fontSize(7).font('Helvetica-Bold').fillColor(WHITE)
          .text('⭐ Populaire', xPos + rangeW / 2 - 23, y - 5, { width: 50, lineBreak: false });
      }

      // Nom gamme
      doc.fontSize(11).font('Helvetica-Bold').fillColor(SLATE)
        .text(range.name, xPos + 10, y + 14, { width: rangeW - 20 });

      // Description
      doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_MID)
        .text(range.description, xPos + 10, y + 32, { width: rangeW - 20, lineGap: 2 });
    });

    y += 96;

    /* ══════════════════════════════════════════
       FOOTER
    ══════════════════════════════════════════ */
    const footerY = doc.page.height - 40;
    doc.rect(0, footerY - 10, W, 50).fill(SLATE);

    doc.fontSize(7.5).font('Helvetica').fillColor(SLATE_LIGHT)
      .text(
        `© ${new Date().getFullYear()} L'Affine Bouche — Conçu par des ingénieurs ECAM LaSalle Lyon — Prototype étudiant`,
        M, footerY,
        { width: CW, align: 'center' }
      );

    doc.end();
  });
}
