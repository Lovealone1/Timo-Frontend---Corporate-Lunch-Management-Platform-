import React from 'react';
import { Layers, X } from 'lucide-react';
import { MenuResponse } from '../hooks/useMenus';

interface MenuItemsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    menu: MenuResponse | null;
}

export function MenuItemsDialog({ isOpen, onClose, menu }: MenuItemsDialogProps) {
    if (!isOpen || !menu) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Items del Menú</h2>
                            <p className="text-xs text-zinc-500">Fecha: {menu.date.split('T')[0]} ({menu.dayOfWeek})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Proteins */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">Proteínas</h4>
                        {menu.proteinOptions.length > 0 ? (
                            <ul className="space-y-2">
                                {menu.proteinOptions.map(po => (
                                    <li key={po.id} className="text-sm flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        {po.proteinType.name}
                                        {menu.defaultProteinType?.id === po.proteinTypeId && (
                                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 uppercase">Default</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-zinc-400 italic">No hay proteínas asignadas.</p>
                        )}
                    </div>

                    {/* Side Dishes */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">Acompañamientos</h4>
                        {menu.sideOptions.length > 0 ? (
                            <ul className="space-y-2">
                                {menu.sideOptions.map(so => (
                                    <li key={so.id} className="text-sm flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        {so.sideDish.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-zinc-400 italic">No hay acompañamientos asignados.</p>
                        )}
                    </div>

                    {/* Extras */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Sopa</h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                {menu.soup ? menu.soup.name : <span className="text-zinc-400 italic">Ninguna</span>}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Bebida</h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                {menu.drink ? menu.drink.name : <span className="text-zinc-400 italic">Ninguna</span>}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
