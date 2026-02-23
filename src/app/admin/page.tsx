'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { authService, UserProfile } from '@/services/auth-service';
import { UtensilsCrossed, LogOut, LayoutDashboard } from 'lucide-react';

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
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await authService.logout();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                    <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-200">

            {/* Nav */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-900 text-white">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <UtensilsCrossed size={16} className="text-zinc-500" />
                        <span className="font-black tracking-tighter text-2xl text-white leading-none">TIMO.</span>
                        <span className="text-zinc-600 text-xs ml-1 hidden sm:block">/ Admin</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 hidden sm:block">
                            {profile?.email} · <span className="text-zinc-300 font-medium capitalize">{profile?.role?.toLowerCase()}</span>
                        </span>
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            title="Cerrar sesión"
                            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition-all"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                            <LayoutDashboard size={22} className="text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Resumen de operaciones del día.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <StatsCard title="Pedidos Hoy" value="24" />
                        <StatsCard title="Usuarios Registrados" value="156" />
                        <StatsCard title="Menús Activos" value="3" />
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Ver vista de usuario
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">{title}</p>
            <p className="text-3xl font-bold tracking-tighter">{value}</p>
        </div>
    );
}
