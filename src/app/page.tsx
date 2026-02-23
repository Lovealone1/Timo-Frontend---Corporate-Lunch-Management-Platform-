'use client';

import React, { useEffect, useState } from 'react';
import { useOrders, useMenu } from '@/features/orders/hooks/use-orders';
import { useSync } from '@/hooks/use-sync';

export default function Home() {
  const { isOnline } = useSync();
  const { pendingOrders, createOrder } = useOrders();
  const { data: menu } = useMenu();
  const [mounted, setMounted] = useState(false);

  // Additional hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-8 text-slate-500">Cargando aplicación...</div>;

  return (
    <main className="p-8 min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-xl mx-auto space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Backend Almuerzos - Tablet v1</h1>
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            <p className="text-sm font-semibold uppercase tracking-wider">
              {isOnline ? 'En línea (Sincronizado)' : 'Modo Offline (Almacenamiento Local)'}
            </p>
          </div>
        </header>

        <section className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-bold">Resumen de Estado</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Pendientes</p>
              <p className="text-2xl font-bold">{pendingOrders.length}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Menú Cacheado</p>
              <p className="text-2xl font-bold">{menu?.items?.length || 0} items</p>
            </div>
          </div>
        </section>

        <section className="pt-4 space-y-3">
          <button
            onClick={() => createOrder({
              userId: 'tablet-user-01',
              items: [{ id: 'demo', name: 'Almuerzo Base', price: 15000, quantity: 1 }],
              total: 15000,
            })}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition active:scale-[0.98]"
          >
            Crear Pedido de Prueba
          </button>
          <p className="text-[10px] text-slate-400 text-center italic">
            El pedido se guardará en IndexedDB y se sincronizará automáticamente al volver el internet.
          </p>
        </section>
      </div>
    </main>
  );
}
