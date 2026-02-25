import React, { useState, useEffect } from 'react';
import { Settings2, X } from 'lucide-react';
import { MenuResponse } from '../hooks/useMenus';
import { useCrudList } from '@/features/admin-crud/hooks/useCrud';

interface ProteinResponse {
    id: string;
    name: string;
    isActive: boolean;
}

interface MenuEditProteinsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (proteinIds: string[]) => Promise<void>;
    isLoading: boolean;
    menu: MenuResponse | null;
}

export function MenuEditProteinsDialog({ isOpen, onClose, onConfirm, isLoading, menu }: MenuEditProteinsDialogProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Fetch all proteins (even inactive if they were already assigned, but mostly active ones)
    const { data: proteins = [], isLoading: proteinsLoading } = useCrudList<ProteinResponse>('/proteins');

    useEffect(() => {
        if (menu && isOpen) {
            setSelectedIds(new Set(menu.proteinOptions.map(po => po.proteinTypeId)));
        }
    }, [menu, isOpen]);

    if (!isOpen || !menu) return null;

    const handleToggle = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onConfirm(Array.from(selectedIds));
        } catch {
            // Addressed by higher order components
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                                <Settings2 size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Editar Proteínas</h3>
                        </div>
                        {!isLoading && (
                            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        Menú: <strong>{menu.date.split('T')[0]}</strong>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {proteinsLoading && <p className="text-sm text-zinc-400">Cargando opciones...</p>}
                            {!proteinsLoading && proteins.map((protein) => {
                                const isSelected = selectedIds.has(protein.id);
                                // Si la proteína está inactiva pero no está seleccionada, no la mostramos para evitar basura,
                                // Si está inactiva pero ESTÁ en el menú, se muestra para que puedan quitarla
                                if (!protein.isActive && !isSelected) return null;

                                return (
                                    <label key={protein.id} className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggle(protein.id)}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-zinc-900 dark:text-zinc-100 rounded border-zinc-300 dark:border-zinc-600 focus:ring-zinc-500"
                                        />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {protein.name}
                                            {!protein.isActive && <span className="ml-2 text-[10px] text-red-500 uppercase">(Inactiva)</span>}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
                                disabled={isLoading || proteinsLoading}
                                className="px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
