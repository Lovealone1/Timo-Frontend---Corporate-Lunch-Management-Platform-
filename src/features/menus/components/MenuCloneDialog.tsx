import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

interface MenuCloneDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: string) => Promise<void>;
    isLoading: boolean;
    sourceDate: string;
}

export function MenuCloneDialog({ isOpen, onClose, onConfirm, isLoading, sourceDate }: MenuCloneDialogProps) {
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) {
            setError('Por favor selecciona una fecha');
            return;
        }

        // Reset and try to submit
        setError('');
        try {
            await onConfirm(date);
        } catch {
            // Error handling is managed by the higher order component generally
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-500">
                                <Calendar size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Clonar Menú</h3>
                        </div>
                        {!isLoading && (
                            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        Vas a clonar el menú del día <strong>{sourceDate}</strong>. Por favor selecciona la nueva fecha de destino.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Nueva Fecha
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-colors"
                            />
                            {error && <p className="text-xs text-red-500">{error}</p>}
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Confirmar Clonado
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
