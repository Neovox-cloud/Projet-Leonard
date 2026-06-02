import Link from 'next/link';
import { ThermometerSun, Droplets, Wind, ShieldCheck, ChevronRight, ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-amber-900">
            L'Affine Bouche
          </div>
          <div className="flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-amber-700 transition">Caractéristiques</Link>
            <Link href="/dashboard" className="text-sm font-medium text-amber-700 hover:text-amber-800 transition">
              Accès Dashboard (MVP)
            </Link>
            <button className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Précommander
            </button>
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
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-800 text-white rounded-full font-semibold text-lg transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 group">
                Acheter maintenant - 778 €
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-sm text-slate-500 font-medium">TTC, Livraison offerte en 48h.</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-amber-50 to-slate-200 border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center">
              {/* Image Placeholder premium */}
              <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply"></div>
              <div className="w-64 h-80 bg-white rounded-xl shadow-xl transform rotate-3 flex items-center justify-center border border-slate-100">
                <span className="text-amber-900/40 font-bold text-2xl rotate-[-90deg] tracking-widest uppercase">L'Affine Bouche</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Une technologie de pointe</h2>
            <p className="text-lg text-slate-600">Tout ce dont vous avez besoin pour un affinage d'exception.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Block 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ThermometerSun className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Thermorégulation Active</h3>
              <p className="text-slate-600 leading-relaxed">
                Maintient une température constante et précise, réglable de 8°C à 16°C, essentielle pour le développement des arômes.
              </p>
            </div>

            {/* Block 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hygrométrie Parfaite</h3>
              <p className="text-slate-600 leading-relaxed">
                Système de brumisation ultrasonique intelligent garantissant un taux d'humidité optimal de 80% à 95%.
              </p>
            </div>

            {/* Block 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wind className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Filtration Moléculaire</h3>
              <p className="text-slate-600 leading-relaxed">
                Filtre à charbon actif de qualité industrielle. Retient les odeurs puissantes tout en renouvelant l'air de la cave.
              </p>
            </div>

            {/* Block 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Application Connectée</h3>
              <p className="text-slate-600 leading-relaxed">
                Contrôlez et surveillez vos fromages en temps réel depuis votre smartphone avec notre base de données intégrée.
              </p>
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
