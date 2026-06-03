'use client';

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
} from 'lucide-react';

/* ─────────────────── DONNÉES ─────────────────── */

const specs = [
  {
    icon: ThermometerSun,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Régulation thermique',
    detail: 'Plage 2°C à 22°C, précision ±0,5°C. Module Peltier + ventilateur contrôlé.',
  },
  {
    icon: Droplets,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: "Contrôle de l'humidité",
    detail: "Hygrométrie 70% à 95%, précision ±3%. Humidificateur ultrasonique + déshumidificateur.",
  },
  {
    icon: Wind,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    title: "Filtration des odeurs",
    detail: "Filtre à charbon actif intégré. Zéro odeur résiduelle vers l'extérieur.",
  },
  {
    icon: Smartphone,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Connectivité',
    detail: 'Bluetooth, application mobile iOS/Android. Portée stable 15 m. Configuration en moins de 5 minutes.',
  },
  {
    icon: Activity,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Capteurs embarqués',
    detail: 'Température, hygrométrie, CO₂, horloge/timer. Afficheur OLED intégré.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Indice de protection',
    detail: "IP65, résistant à la condensation et à l'humidité interne.",
  },
  {
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    title: 'Consommation énergétique',
    detail: 'Moins de 120 kWh/an.',
  },
  {
    icon: Award,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Certification',
    detail: 'Marquage CE, conforme directive Basse Tension 2014/35/UE.',
  },
  {
    icon: Layers,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'Matériaux',
    detail: 'Surfaces intérieures inox 304 sans BPA, conformes règlements CE 852/2004 et 1935/2004.',
  },
  {
    icon: Box,
    color: 'text-stone-500',
    bg: 'bg-stone-50',
    border: 'border-stone-100',
    title: 'Format',
    detail: "40 × 40 × 40 cm par bloc. Les blocs s'empilent ou se disposent côte à côte.",
  },
  {
    icon: Volume2,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    title: 'Niveau sonore',
    detail: 'Moins de 35 dB(A).',
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
  },
  {
    icon: Star,
    name: 'Haut de gamme',
    tagline: "L'excellence sans limite",
    description:
      'Configuration multi-blocs sur-mesure pour restaurateurs, cavistes et écoles de cuisine.',
    accent: 'from-yellow-600 to-yellow-900',
    accentBg: 'bg-yellow-50',
    accentBorder: 'border-yellow-200',
    iconColor: 'text-yellow-700',
    iconBg: 'bg-yellow-100',
    featured: false,
  },
];

const usages = ['Fromages', 'Vins', 'Viandes maturées', 'Charcuteries'];

/* ─────────────────── COMPOSANT ─────────────────── */

export default function ProductDescription() {
  return (
    <section
      id="product-description"
      className="py-24 px-6 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-0 top-1/4 w-[600px] h-[600px] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-teal-100/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* ── Badge ingénieurs ── */}
        <div id="ecam-engineers" className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-amber-300/60 bg-white shadow-md shadow-amber-100">
            <GraduationCap className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="text-sm font-semibold text-amber-800 tracking-wide">
              Conçu par des ingénieurs ECAM LaSalle Lyon
            </span>
          </div>
        </div>

        {/* ── En-tête produit ── */}
        <header className="text-center mb-16 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Cave Gastronomique Connectée
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            L'Affine Bouche
          </h2>
          <p className="text-2xl md:text-3xl font-light italic text-amber-700">
            "L'art de l'affinage, enfin à portée de main."
          </p>

          {/* Usages */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {usages.map((u) => (
              <span
                key={u}
                className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium border border-amber-200"
              >
                {u}
              </span>
            ))}
          </div>
        </header>

        {/* ── Description courte ── */}
        <article className="max-w-3xl mx-auto mb-20 text-center">
          <p className="text-lg text-slate-600 leading-relaxed">
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
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Spécifications techniques</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-800 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  className={`group flex gap-4 p-5 rounded-2xl border ${spec.border} ${spec.bg} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
                >
                  <div
                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${spec.bg} border ${spec.border} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 ${spec.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm leading-snug mb-1">{spec.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{spec.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Trois gammes ── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Trois gammes</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-800 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {ranges.map((range) => {
              const Icon = range.icon;
              return (
                <div
                  key={range.name}
                  className={`relative flex flex-col rounded-3xl border-2 ${range.accentBorder} ${range.accentBg} p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    range.featured
                      ? 'ring-2 ring-amber-500 ring-offset-4 shadow-xl shadow-amber-100'
                      : ''
                  }`}
                >
                  {range.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-800 text-white text-xs font-bold shadow-lg shadow-amber-200 tracking-wide">
                        <Star className="w-3 h-3 fill-current" />
                        Populaire
                      </span>
                    </div>
                  )}

                  {/* Gradient line top */}
                  <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${range.accent} mb-6`} />

                  <div className={`w-14 h-14 rounded-2xl ${range.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-7 h-7 ${range.iconColor}`} />
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-900 mb-1">{range.name}</h4>
                  <p className={`text-sm font-semibold mb-4 bg-gradient-to-r ${range.accent} bg-clip-text text-transparent`}>
                    {range.tagline}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">{range.description}</p>

                  <Link
                    href="/configurateur"
                    className={`mt-8 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all group ${
                      range.featured
                        ? `bg-gradient-to-r ${range.accent} text-white shadow-lg hover:opacity-90`
                        : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    Configurer
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
    </section>
  );
}
