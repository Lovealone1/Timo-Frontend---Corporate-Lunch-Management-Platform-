'use client';

import React from 'react';

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center space-y-6">
            <div className="space-y-3">
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-[0.25em]">Panel de administración</p>
                <h1 className="text-5xl font-black tracking-tighter">
                    Dashboard.
                </h1>
                <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed">
                    Navega a través del menú lateral para gestionar los recursos del sistema.
                </p>
            </div>
        </div>
    );
}
