'use client';

import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { authService, UserProfile } from '@/services/auth-service';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await authService.me();
                setProfile(data);
            } catch {
                // We'll let layout handle unauthenticated states usually
            }
        }
        fetchProfile();
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50">
            <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">

                {/* Brand */}
                <div className="flex items-center gap-3 w-60">
                    <UtensilsCrossed size={16} className="text-zinc-500 dark:text-zinc-400" />
                    <span className="font-black tracking-tighter text-2xl text-zinc-900 dark:text-white leading-none">TIMO.</span>
                    <span className="text-zinc-500 text-xs hidden sm:block">/ Admin</span>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3">
                    {profile && (
                        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 mr-2">
                            <span className="text-zinc-600 dark:text-zinc-400">{profile.email}</span>
                            <span className="text-zinc-700 dark:text-zinc-600">·</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">{profile.role}</span>
                        </div>
                    )}

                    <ThemeToggle />

                    <button
                        onClick={() => authService.logout().then(() => router.replace('/admin/login'))}
                        title="Cerrar sesión"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                    >
                        <LogOut size={16} />
                    </button>
                </div>

            </div>
        </header>
    );
}
