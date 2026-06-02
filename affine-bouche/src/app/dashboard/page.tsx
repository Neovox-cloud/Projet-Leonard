import Dashboard from '@/components/Dashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration pour Next.js App Router : on empêche le cache statique si besoin
export const revalidate = 0;

export default async function DashboardPage() {
  const cheeses = await prisma.cheeseProfile.findMany({
    orderBy: { nom: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à la boutique
        </Link>
        <Dashboard initialCheeses={cheeses} />
      </div>
    </div>
  );
}
