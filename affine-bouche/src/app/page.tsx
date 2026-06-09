import Link from 'next/link';
import Image from 'next/image';
import { ThermometerSun, Droplets, Wind, ShieldCheck, ChevronRight, ShoppingCart } from 'lucide-react';
import ProductDescription from '@/components/ProductDescription';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="L'Affine Bouche Logo" 
              width={50} 
              height={42} 
              className="object-contain h-10 w-auto"
              priority
            />
            <span className="text-2xl font-bold tracking-tighter text-slate-900">
              L'Affine Bouche
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="#ecam-engineers" className="text-sm font-medium text-slate-600 hover:text-amber-700 transition">Caractéristiques</Link>
            <Link href="/configurateur" className="text-sm font-medium text-amber-750 hover:text-amber-900 transition">
              Configurateur
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-amber-700 transition">
              Dashboard
            </Link>
            <Link href="/configurateur" className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Configurer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
          <div className="w-[800px] h-[800px] rounded-full bg-amber-100 blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Nouveau - Édition Limitée
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              L'art de l'affinage, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-900">
                réinventé.
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Découvrez la première cave à fromage intelligente. Un écosystème parfait, contrôlé au dixième de degré, pour sublimer vos meilleurs crus fromagers à domicile.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/configurateur" className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-800 text-white rounded-full font-semibold text-lg transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 group text-center">
                Configurer ma Cave
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/configurateur" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-full font-semibold text-lg transition-all text-center">
                Acheter Tout-en-un - 500 €
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-amber-50 to-slate-200 border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center">
              <Image 
                src="/diverse_modular_cave.png" 
                alt="Système de Caves d'Affinage Modulaires L'Affine Bouche" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Section */}
      <ProductDescription />

      {/* Examples / Configurations Section */}
      <section id="examples" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Exemples de Configurations</h2>
            <p className="text-lg text-slate-600">Des combinaisons sur-mesure adaptées à vos passions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cave du Charcutier */}
            <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
              <div className="h-64 relative overflow-hidden bg-slate-200">
                <Image 
                  src="/cave_charcutier.png" 
                  alt="La Cave du Charcutier"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-900/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Spécial Viande & Salaisons
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">La Cave du Charcutier</h3>
                <p className="text-slate-600 text-sm mb-6 flex-1">
                  Optimisée pour sécher et affiner vos jambons, saucissons et pièces de viande. Cette configuration comprend 3 blocs d'affinage renforcés et un système d'aération active anti-moisissures.
                </p>
                <div className="space-y-3 pt-4 border-t border-slate-200/60 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Modules :</span>
                    <span className="font-semibold">3 Blocs Viande + 1 Bloc Technique</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Température :</span>
                    <span className="font-semibold text-amber-900">10°C - 14°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Hygrométrie :</span>
                    <span className="font-semibold text-amber-900">75% - 80%</span>
                  </div>
                </div>
                <Link href="/configurateur?preset=charcutier" className="mt-6 w-full text-center py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition-colors">
                  Découvrir ce modèle
                </Link>
              </div>
            </div>

            {/* Cave du Fromager */}
            <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
              <div className="h-64 relative overflow-hidden bg-slate-200">
                <Image 
                  src="/cave_fromager.png" 
                  alt="La Cave du Fromager"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-900/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Affinage Fromages
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">La Cave du Fromager</h3>
                <p className="text-slate-600 text-sm mb-6 flex-1">
                  Le choix historique pour tous les amoureux de fromages. Dotée de tiroirs en bois de hêtre et d'une régulation d'humidité poussée pour des croûtes fleuries parfaites.
                </p>
                <div className="space-y-3 pt-4 border-t border-slate-200/60 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Modules :</span>
                    <span className="font-semibold">3 Blocs Fromage + 1 Humidificateur</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Température :</span>
                    <span className="font-semibold text-amber-900">8°C - 12°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Hygrométrie :</span>
                    <span className="font-semibold text-amber-900">85% - 95%</span>
                  </div>
                </div>
                <Link href="/configurateur?preset=fromager" className="mt-6 w-full text-center py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition-colors">
                  Découvrir ce modèle
                </Link>
              </div>
            </div>

            {/* Cave à Vin */}
            <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
              <div className="h-64 relative overflow-hidden bg-slate-200">
                <Image 
                  src="/cave_vin.png" 
                  alt="La Cave à Vin"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-900/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Conservation & Service
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">La Cave à Vin</h3>
                <p className="text-slate-600 text-sm mb-6 flex-1">
                  Conservez vos plus grands crus dans un environnement sans vibration, à l'abri de la lumière et parfaitement tempéré. Idéal pour le vieillissement de vos bouteilles.
                </p>
                <div className="space-y-3 pt-4 border-t border-slate-200/60 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Modules :</span>
                    <span className="font-semibold">3 Blocs Vin (24 bouteilles)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Température :</span>
                    <span className="font-semibold text-amber-900">12°C - 16°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Hygrométrie :</span>
                    <span className="font-semibold text-amber-900">70% - 75%</span>
                  </div>
                </div>
                <Link href="/configurateur?preset=vin" className="mt-6 w-full text-center py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition-colors">
                  Découvrir ce modèle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© 2026 L'Affine Bouche. Prototype étudiant - Tous droits réservés.</p>
      </footer>
    </div>
  );
}
