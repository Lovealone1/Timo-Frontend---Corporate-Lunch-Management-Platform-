'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, Settings2, LogOut, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MenuCard } from '@/components/menus/MenuCard';
import { menuService } from '@/services/menu-service';
import { Menu } from '@/types';

// Helper to get Mon-Sat for the designated week based on Colombia time
function getCurrentWeekDays(offsetWeeks: number = 0): Date[] {
    const today = new Date();
    // Use local time approximations for now, assuming user is in Colombia
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday

    // Calculate difference to Monday. If Sunday (0), Monday is -6. Otherwise day - 1.
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday + (offsetWeeks * 7));
    monday.setHours(0, 0, 0, 0);

    const days: Date[] = [];
    for (let i = 0; i < 6; i++) { // Lunes to Sabado (6 days)
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    return days;
}

export default function MenusPage() {
    const router = useRouter();
    const [cedula, setCedula] = useState<string | null>(null);
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [menus, setMenus] = useState<Record<string, Menu | null>>({});
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

    const fetchDayMenu = async (date: Date, userCc?: string) => {
        // format YYYY-MM-DD
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        setIsLoading(prev => ({ ...prev, [dateStr]: true }));
        try {
            const menu = await menuService.findByDate(dateStr, userCc);
            setMenus(prev => ({ ...prev, [dateStr]: menu }));
        } catch {
            setMenus(prev => ({ ...prev, [dateStr]: null }));
        } finally {
            setIsLoading(prev => ({ ...prev, [dateStr]: false }));
        }
    };

    useEffect(() => {
        const storedCedula = localStorage.getItem('user_cedula');
        if (!storedCedula) {
            router.push('/');
            return;
        }
        setCedula(storedCedula);

        const days = getCurrentWeekDays(weekOffset);
        setWeekDays(days);

        days.forEach(day => fetchDayMenu(day, storedCedula));
    }, [router, weekOffset]);

    const handleLogout = () => {
        localStorage.removeItem('user_cedula');
        router.push('/');
    };

    if (!cedula) return null; // Avoid flicker before redirect

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200 flex flex-col">

            {/* Header */}
            <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-sm">
                <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UtensilsCrossed size={16} className="text-zinc-500" />
                        <span className="font-black tracking-tighter text-2xl text-zinc-900 dark:text-white leading-none">
                            TIMO.
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="flex items-center gap-2 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hidden sm:block">
                                C.C: {cedula}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                                title="Cerrar sesión"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>

                        <Link
                            href="/admin/login"
                            className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                            title="Acceso Administrativo"
                        >
                            <Settings2 size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full px-4 lg:px-8 py-8 flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-zinc-400">
                            <CalendarDays size={20} />
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                Menú Semanal
                            </h1>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            Selecciona o visualiza el menú disponible para {weekOffset === 0 ? 'esta' : 'la próxima'} semana.
                        </p>
                    </div>

                    {/* Week Toggle */}
                    <div className="flex items-center bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-lg self-start sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                            onClick={() => setWeekOffset(0)}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${weekOffset === 0 ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            Esta semana
                        </button>
                        <button
                            onClick={() => setWeekOffset(1)}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${weekOffset === 1 ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            Próxima semana
                        </button>
                    </div>
                </div>

                {/* Calendar Layout: Scroll mobile, Grid desktop */}
                <div className="flex-1 w-full pb-4">
                    <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-6 lg:overflow-visible gap-4 lg:gap-6 h-full pb-4 scrollbar-hide">
                        {weekDays.map((day, idx) => {
                            const yyyy = day.getFullYear();
                            const mm = String(day.getMonth() + 1).padStart(2, '0');
                            const dd = String(day.getDate()).padStart(2, '0');
                            const dateStr = `${yyyy}-${mm}-${dd}`;

                            return (
                                <div key={idx} className="w-[85vw] sm:w-[320px] lg:w-auto h-full shrink-0 snap-center">
                                    <MenuCard
                                        date={day}
                                        menu={menus[dateStr] || null}
                                        isLoading={isLoading[dateStr] !== false}
                                        cedula={cedula}
                                        onReservationSuccess={() => fetchDayMenu(day, cedula)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
