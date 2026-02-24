'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { authService, UserProfile } from '@/services/auth-service';
import { UtensilsCrossed, LogOut, Settings2 } from 'lucide-react';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const data = await authService.me();
                setProfile(data);
            } catch {
                // Token invalid or expired → back to login
                router.replace('/admin/login');
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin" />
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Verificando sesión…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-200">

            {/* Top nav */}
            <header className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <UtensilsCrossed size={16} className="text-zinc-500" />
                        <span className="font-black tracking-tighter text-2xl text-white leading-none">TIMO.</span>
                        <span className="text-zinc-600 text-xs hidden sm:block">/ Admin</span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {profile && (
                            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
                                <span className="text-zinc-500">{profile.email}</span>
                                <span className="text-zinc-700">·</span>
                                <span className="font-bold text-zinc-300 uppercase tracking-widest">{profile.role}</span>
                            </div>
                        )}
                        <ThemeToggle />
                        <button
                            onClick={() => authService.logout()}
                            title="Cerrar sesión"
                            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-all"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>

                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-6 text-center">
                <div className="space-y-3">
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-[0.25em]">Panel de administración</p>
                    <h1 className="text-5xl font-black tracking-tighter">
                        Bienvenido, {profile?.email?.split('@')[0]}.
                    </h1>
                    <p className="text-zinc-400 max-w-sm mx-auto text-sm leading-relaxed">
                        Has iniciado sesión correctamente. El panel está en construcción.
                        Pronto tendrás acceso a reportes, menús y gestión de usuarios.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                    >
                        ← Ir al inicio
                    </Link>
                    <span className="text-zinc-200 dark:text-zinc-700">|</span>
                    <button
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
                    >
                        <Settings2 size={13} />
                        Configuración
                    </button>
                </div>
            </main>

        </div>
    );
}
