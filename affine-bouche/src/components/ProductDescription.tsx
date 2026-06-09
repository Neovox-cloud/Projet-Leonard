'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ThermometerSun,
  Droplets,
  Wind,
  Smartphone,
  Activity,
  ShieldCheck,
  Zap,
  Award,
  Layers,
  Box,
  Volume2,
  ChevronRight,
  FileDown,
  GraduationCap,
  Sparkles,
  Users,
  Star,
  Building,
} from 'lucide-react';

/* ─────────────────── DONNÉES ─────────────────── */

interface SpecItem {
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  border: string;
  title: string;
  detail: string;
  explanation: string;
}

const specs: SpecItem[] = [
  {
    icon: ThermometerSun,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Régulation thermique',
    detail: 'Plage 2°C à 22°C, précision ±0,5°C. Module Peltier + ventilateur contrôlé.',
    explanation: "Le module Peltier est un composant thermoélectrique actif. Lorsqu'un courant électrique le traverse, l'une de ses faces se refroidit fortement tandis que l'autre se réchauffe. En inversant simplement la polarité du courant, on peut basculer instantanément de la production de froid à celle de chaud. Ce système est extrêmement silencieux, ultra-précis, et évite les vibrations des compresseurs de réfrigérateurs traditionnels qui perturbent la sédimentation du vin et la maturation des fromages et viandes.",
  },
  {
    icon: Droplets,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: "Contrôle de l'humidité",
    detail: "Hygrométrie 70% à 95%, précision ±3%. Humidificateur ultrasonique + déshumidificateur.",
    explanation: "Le brumisateur à ultrasons utilise une pastille piézoélectrique oscillant à très haute fréquence (plus de 1,5 million de vibrations par seconde). Ces vibrations transforment l'eau liquide en un brouillard de micro-gouttelettes extrêmement fines (brouillard sec) sans chauffer l'eau. Pour l'affinage ou la conservation, cela garantit une hygrométrie stable jusqu'à 95% sans détremper les surfaces ou moisir les produits.",
  },
  {
    icon: Wind,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    title: "Filtration des odeurs",
    detail: "Filtre à charbon actif intégré. Zéro odeur résiduelle vers l'extérieur.",
    explanation: "Le charbon actif possède une structure poreuse exceptionnelle (un gramme de charbon actif possède une surface interne de plus de 1000 m²). Les molécules odorantes sont capturées et piégées dans ces micro-pores par adsorption physique. Le flux d'air interne forcé traverse ce filtre en continu, garantissant l'absence totale de transfert d'odeurs entre les compartiments (ex: vin à côté de fromage corsé) et aucune odeur à l'extérieur de la cave.",
  },
  {
    icon: Smartphone,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Connectivité',
    detail: 'Bluetooth, application mobile iOS/Android. Portée stable 15 m. Configuration en moins de 5 minutes.',
    explanation: "La cave intègre une puce Bluetooth Low Energy (BLE) pour communiquer directement avec votre smartphone. Ce protocole consomme très peu d'énergie et offre une liaison directe et sécurisée sans nécessiter de connexion Internet Wi-Fi. Vous pouvez ajuster les consignes, surveiller la température historique ou déclencher un affinage en restant à proximité de l'appareil.",
  },
  {
    icon: Activity,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Capteurs embarqués',
    detail: 'Température, hygrométrie, CO₂, horloge/timer. Afficheur OLED intégré.',
    explanation: "La cave utilise des capteurs électroniques à semi-conducteurs de dernière génération (SHT). Ils mesurent simultanément la température au dixième de degré près et le taux d'humidité relative à ±3% près. Un capteur de CO₂ évalue également le taux de renouvellement de l'air nécessaire. L'écran OLED à haut contraste affiche en continu ces valeurs sur la façade de chaque bloc.",
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Indice de protection',
    detail: "IP65, résistant à la condensation et à l'humidité interne.",
    explanation: "L'indice IP65 garantit que le module électronique interne est totalement protégé contre les poussières et étanche aux jets d'eau ou à la forte condensation. L'affinage exigeant des taux d'humidité supérieurs à 90%, tous les composants électriques sont tropicalisés (recouverts d'un vernis protecteur) et scellés pour éviter tout court-circuit ou corrosion précoce dans cet environnement saturé en eau.",
  },
  {
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    title: 'Consommation énergétique',
    detail: 'Moins de 120 kWh/an.',
    explanation: "Contrairement aux compresseurs énergivores, la cave utilise une régulation proportionnelle intelligente. Le courant envoyé au module Peltier est régulé finement en continu (PWM) plutôt que par de simples cycles de marche/arrêt. Grâce à une isolation en mousse polyuréthane haute densité de 4 cm d'épaisseur, la déperdition thermique est minimale, limitant la consommation à moins de 120 kWh/an (l'équivalent d'une simple ampoule LED).",
  },
  {
    icon: Award,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Certification',
    detail: 'Marquage CE, conforme directive Basse Tension 2014/35/UE.',
    explanation: "La cave est conforme aux directives européennes Basse Tension (2014/35/UE) et de Compatibilité Électromagnétique (CEM 2014/30/UE). Toute l'électronique de puissance est isolée dans un compartiment technique hermétique, et l'alimentation générale transforme le courant alternatif 230V en une tension sécurisée de 12V ou 24V continus (TBTS - Très Basse Tension de Sécurité) à l'intérieur de la cave.",
  },
  {
    icon: Layers,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'Matériaux',
    detail: 'Surfaces intérieures inox 304 sans BPA, conformes règlements CE 852/2004 et 1935/2004.',
    explanation: "L'inox 304 (acier inoxydable austénitique allié au chrome-nickel) est le matériau de référence en restauration professionnelle. Sa surface lisse et non poreuse empêche le développement des bactéries et résiste à l'acidité dégagée par les fromages en affinage. Tous les joints et plastiques utilisés sont exempts de Bisphénol A (BPA) et certifiés aptes au contact alimentaire direct.",
  },
  {
    icon: Box,
    color: 'text-stone-500',
    bg: 'bg-stone-50',
    border: 'border-stone-100',
    title: 'Format',
    detail: "50 × 50 × 50 cm (extérieur) / 40 × 40 × 40 cm (intérieur utile). Empilables et modulables.",
    explanation: "Chaque bloc mesure 50 cm de côté à l'extérieur. Les parois intègrent 5 cm d'isolant haute densité (mousse polyuréthane tropicalisée), ce qui offre un volume utile interne parfait de 40 × 40 × 40 cm. Ils intègrent des connecteurs magnétiques rapides sur les faces supérieure et latérales pour s'empiler ou s'assembler facilement sans câbles apparents.",
  },
  {
    icon: Volume2,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    title: 'Niveau sonore',
    detail: 'Moins de 35 dB(A).',
    explanation: "Le seul élément mobile de la cave est un ventilateur silencieux de 80 mm. Il utilise des paliers fluides hydrodynamiques (FDB) à la place des roulements à billes classiques, ce qui réduit considérablement le frottement mécanique et les vibrations. La vitesse de rotation est régulée dynamiquement selon les besoins de froid, maintenant le niveau sonore sous la barre des 35 dB(A), soit le bruit d'un chuchotement dans une bibliothèque.",
  },
];

const ranges = [
  {
    icon: Sparkles,
    name: 'Compact',
    tagline: "L'essentiel, élégamment",
    description:
      'Un bloc indépendant, alimentation et réservoir intégrés. Idéal pour un usage personnel ou en appartement.',
    accent: 'from-slate-400 to-slate-600',
    accentBg: 'bg-slate-50',
    accentBorder: 'border-slate-200',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
    featured: false,
    link: '/configurateur?format=compact',
  },
  {
    icon: Users,
    name: 'Familiale',
    tagline: "La puissance du partage",
    description:
      'Bloc principal + modules additionnels assemblables. Alimentation centralisée, capacité augmentée.',
    accent: 'from-amber-500 to-amber-800',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-100',
    featured: true,
    link: '/configurateur?format=famille',
  },
  {
    icon: Building,
    name: 'Professionnelle',
    tagline: "Sur devis uniquement",
    description:
      'Conçue spécifiquement pour les restaurateurs, fromagers et artisans. Grande capacité & régulation pro.',
    accent: 'from-amber-900 to-amber-955',
    accentBg: 'bg-amber-950/5',
    accentBorder: 'border-amber-950/20',
    iconColor: 'text-amber-950',
    iconBg: 'bg-amber-950/10',
    featured: false,
    link: '/configurateur?format=professionnel',
  },
];

const usages = ['Fromages', 'Vins', 'Viandes maturées', 'Charcuteries'];

export default function ProductDescription() {
  const [selectedSpec, setSelectedSpec] = useState<SpecItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpec(null);
      }
    };
    if (selectedSpec) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSpec]);

  return (
    <section
      id="product-description"
      className="py-24 px-6 bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-slate-950 dark:via-amber-950/5 dark:to-slate-950 relative overflow-hidden transition-colors"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-0 top-1/4 w-[600px] h-[600px] rounded-full bg-amber-100/40 dark:bg-amber-900/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-teal-100/30 dark:bg-teal-900/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* ── Badge ingénieurs ── */}
        <div id="ecam-engineers" className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-amber-300/60 dark:border-amber-900/30 bg-white dark:bg-slate-900 shadow-md dark:shadow-none transition-colors">
            <GraduationCap className="w-5 h-5 text-amber-700 dark:text-amber-500 shrink-0" />
            <span className="text-sm font-semibold text-amber-800 dark:text-amber-400 tracking-wide">
              Conçu par des ingénieurs ECAM LaSalle Lyon
            </span>
          </div>
        </div>

        {/* ── En-tête produit ── */}
        <header className="text-center mb-16 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">
            Cave Gastronomique Connectée
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            L'Affine Bouche
          </h2>
          <p className="text-2xl md:text-3xl font-light italic text-amber-700 dark:text-amber-500">
            "L'art de l'affinage, enfin à portée de main."
          </p>

          {/* Usages */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {usages.map((u) => (
              <span
                key={u}
                className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-sm font-medium border border-amber-200 dark:border-amber-900/30 transition-colors"
              >
                {u}
              </span>
            ))}
          </div>
        </header>

        {/* ── Description courte ── */}
        <article className="max-w-3xl mx-auto mb-20 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            L'Affine Bouche est une cave d'affinage gastronomique modulaire et connectée, conçue pour
            reproduire les conditions des meilleures caves artisanales. Elle permet de conserver, affiner
            et maturer fromages, viandes, charcuteries et vins dans un microclimat parfaitement maîtrisé,
            piloté depuis une application mobile. Après une simple configuration, la cave ajuste
            automatiquement ses paramètres et maintient les conditions idéales jusqu'à dégustation.
          </p>
        </article>

        {/* ── Spécifications techniques ── */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Spécifications techniques</h3>
            <p className="text-slate-505 dark:text-slate-400 text-sm mb-4">Cliquez sur un module pour comprendre sa technologie et son principe de fonctionnement.</p>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-800 rounded-full mx-auto" />
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  onClick={() => setSelectedSpec(spec)}
                  className="group flex gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-600 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-205 w-full sm:w-[320px] md:w-[280px] lg:w-[300px] xl:w-[280px] flex-grow max-w-[360px] cursor-pointer"
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-950/45 border border-amber-100 dark:border-amber-900/35 group-hover:scale-110 transition-transform"
                  >
                    <Icon className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-205 text-sm leading-snug mb-1">{spec.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{spec.detail}</p>
                    <span className="text-[10px] text-amber-900 dark:text-amber-400 font-bold mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      En savoir plus ➔
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Trois gammes ── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trois gammes</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-800 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {ranges.map((range) => {
              const Icon = range.icon;
              return (
                <div
                  key={range.name}
                  className={`relative flex flex-col rounded-3xl border-2 ${range.accentBorder} dark:border-slate-800 ${range.accentBg} dark:bg-slate-900 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    range.featured
                      ? 'ring-2 ring-amber-500 ring-offset-4 dark:ring-offset-slate-950 shadow-xl shadow-amber-100 dark:shadow-none'
                      : ''
                  }`}
                >
                  {range.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-800 text-white text-xs font-bold shadow-lg shadow-amber-200 dark:shadow-none tracking-wide">
                        <Star className="w-3 h-3 fill-current" />
                        Populaire
                      </span>
                    </div>
                  )}

                  {/* Gradient line top */}
                  <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${range.accent} mb-6`} />

                  <div className={`w-14 h-14 rounded-2xl ${range.iconBg} ${
                    range.name === 'Compact' ? 'dark:bg-slate-800' : range.name === 'Familiale' ? 'dark:bg-amber-950/40' : 'dark:bg-amber-900/30'
                  } flex items-center justify-center mb-5`}>
                    <Icon className={`w-7 h-7 ${range.iconColor} ${
                      range.name === 'Compact' ? 'dark:text-slate-100 font-bold' : range.name === 'Familiale' ? 'dark:text-amber-400' : 'dark:text-amber-300'
                    }`} />
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{range.name}</h4>
                  <p className={`text-sm font-semibold mb-4 bg-gradient-to-r ${range.accent} bg-clip-text text-transparent`}>
                    {range.tagline}
                  </p>
                  <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed flex-1">{range.description}</p>

                  <Link
                    href={range.link}
                    className={`mt-8 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all group ${
                      range.featured
                        ? `bg-gradient-to-r ${range.accent} text-white shadow-lg hover:opacity-90`
                        : 'border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                    }`}
                  >
                    {range.name === 'Professionnelle' ? 'Demander un devis' : 'Configurer'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Boutons CTA ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          {/* Principal */}
          <Link
            href="/configurateur"
            id="cta-decouvrir-cave"
            className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold text-base shadow-xl shadow-amber-900/25 hover:shadow-2xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Découvrir la cave
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondaire */}
          <a
            href="/api/fiche-technique"
            id="cta-fiche-technique"
            download="fiche-technique-affine-bouche.pdf"
            className="group flex items-center gap-2 px-8 py-4 rounded-full border border-slate-300 text-slate-600 font-medium text-base hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200"
          >
            <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Télécharger la fiche technique
          </a>
        </div>

      </div>

      {/* ── Premium Tech Detail Explanation Modal ── */}
      {selectedSpec && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 max-w-lg w-full relative animate-in zoom-in-95 duration-200 space-y-5 transition-colors">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSpec(null)}
              className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xl font-bold p-2 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/20 shrink-0">
                {React.createElement(selectedSpec.icon, { className: "w-6 h-6 text-amber-700 dark:text-amber-500" })}
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">{selectedSpec.title}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Fiche d'explication technologique</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 border border-amber-900/5 dark:border-amber-800/10 p-4 rounded-2xl italic font-medium animate-pulse">
              "{selectedSpec.detail}"
            </p>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Comment ça fonctionne ?</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                {selectedSpec.explanation}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSpec(null)}
                className="bg-amber-900 dark:bg-amber-800 hover:bg-amber-800 dark:hover:bg-amber-705 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-900/10 cursor-pointer"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
