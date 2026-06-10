import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super_secret_key_for_development_only_change_me_in_prod';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  // Liste des chemins protégés
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      // Redirection vers login si pas de cookie
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Vérification du token
      await jwtVerify(sessionCookie, key, {
        algorithms: ['HS256'],
      });
      // Si valide, on laisse passer
      return NextResponse.next();
    } catch (error) {
      console.error('Erreur middleware jwtVerify:', error);
      // Si le token est invalide ou expiré
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session'); // On nettoie le cookie invalide
      return response;
    }
  }

  // Pour les autres routes, on laisse passer
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware s'exécute
export const config = {
  matcher: ['/dashboard/:path*'],
};
