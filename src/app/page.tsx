'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UtensilsCrossed, ChevronRight, Settings2 } from 'lucide-react';

export default function Home() {
  const [cedula, setCedula] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Próximamente: Consulta de pedidos por cédula.');
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
                onChange={(e) => setCedula(e.target.value)}
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <Button type="submit" className="w-full group dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Ingresar
                <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
            © 2025 TIMO — Gestión de Almuerzos Corporativos
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
