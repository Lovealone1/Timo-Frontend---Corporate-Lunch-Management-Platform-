'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UtensilsCrossed, ChevronRight, Settings2, Loader2, AlertCircle } from 'lucide-react';
import { whitelistService } from '@/services/whitelist-service';

export default function Home() {
  const [cedula, setCedula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula) return;

    setIsLoading(true);
    setError('');

    try {
      await whitelistService.loginByCc(cedula);
      // Guardar también en localStorage por compatibilidad
      localStorage.setItem('user_cedula', cedula);
      // Redirigir a la página de menús (calendario)
      router.push('/menus');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al verificar la cédula');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">

      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <UtensilsCrossed size={16} className="text-zinc-500" />
            <span className="font-black tracking-tighter text-2xl text-white leading-none">
              TIMO.
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/admin/login"
              className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
              title="Acceso Administrativo"
            >
              <Settings2 size={18} className="group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem-3rem)]">

        {/* Left Column: Cédula Login */}
        <section className="space-y-10 order-2 lg:order-1">
          <div className="max-w-sm space-y-6">

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Haz tu pedido</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Ingresa tu número de cédula para consultar el menú del día y realizar tu reserva.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Número de cédula"
                value={cedula}
                onChange={(e) => {
                  setCedula(e.target.value);
                  if (error) setError('');
                }}
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={isLoading}
                className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/50 rounded-lg flex items-start gap-2 border border-red-200 dark:border-red-900/30">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full group dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>

        {/* Right Column: Brand block */}
        <section className="space-y-6 order-1 lg:order-2 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-800 lg:pl-16 py-8">
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter">
            TIMO.
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
            Almuerzos corporativos para tu equipo, sin complicaciones.
            Rápido, confiable y siempre disponible.
          </p>
          <div className="flex flex-wrap gap-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <FeatureItem title="Pedidos" desc="Rápidos y simples" />
            <FeatureItem title="Menú diario" desc="Actualizado cada jornada" />
            <FeatureItem title="Sin internet" desc="Disponible offline" />
          </div>
        </section>

      </main>

      <footer className="fixed bottom-0 w-full border-t border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center">
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-[0.2em]">
            © 2026 TIMO — Gestión de Almuerzos Corporativos
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">{title}</p>
      <p className="text-[11px] text-zinc-400 font-medium">{desc}</p>
    </div>
  );
}
