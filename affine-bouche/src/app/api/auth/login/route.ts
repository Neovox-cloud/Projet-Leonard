import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    // Créer la session
    await login(user.id);

    return NextResponse.json({ success: true, message: 'Connexion réussie' });
  } catch (error: any) {
    console.error('Erreur connexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
