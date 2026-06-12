'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-medium text-amber-700 hover:text-amber-900 transition flex items-center gap-1"
    >
      <LogOut className="w-4 h-4" />
      Se déconnecter
    </button>
  );
}
