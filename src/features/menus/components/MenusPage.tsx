'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CalendarCheck, CheckCircle2, RotateCcw, ListFilter, Eye, X, Pencil } from 'lucide-react';
import { useMenusList, useMenuDelete, useMenuStatus, useMenuClone, useMenuUpdate, useMenuCreate, MenuResponse } from '../hooks/useMenus';
import { CrudTable } from '@/features/admin-crud/components/CrudTable';
import { CrudConfirmDialog } from '@/features/admin-crud/components/CrudConfirmDialog';
import { TableColumn } from '@/features/admin-crud/types';
import { MenuCloneDialog } from './MenuCloneDialog';
import { MenuItemsDialog } from './MenuItemsDialog';
import { MenuEditProteinsDialog } from './MenuEditProteinsDialog';
import { MenuCreateDialog } from './MenuCreateDialog';

export function MenusPage() {
    const [page, setPage] = useState(0);
    const take = 10;
    const skip = page * take;

    const { data, isLoading } = useMenusList(skip, take);
    const deleteMut = useMenuDelete();
    const statusMut = useMenuStatus();
    const cloneMut = useMenuClone();
    const updateMut = useMenuUpdate();
    const createMut = useMenuCreate();

    // Local State
    const [dateFilter, setDateFilter] = useState('');

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: 'delete' | 'status_served' | 'status_scheduled' | null;
        item: MenuResponse | null;
    }>({ isOpen: false, type: null, item: null });

    const [cloneDialog, setCloneDialog] = useState<{ isOpen: boolean; item: MenuResponse | null }>({ isOpen: false, item: null });
    const [itemsDialog, setItemsDialog] = useState<{ isOpen: boolean; item: MenuResponse | null }>({ isOpen: false, item: null });
    const [editProteinsDialog, setEditProteinsDialog] = useState<{ isOpen: boolean; item: MenuResponse | null }>({ isOpen: false, item: null });
    const [createDialog, setCreateDialog] = useState<{ isOpen: boolean }>({ isOpen: false });

    // Filtering Data
    const filteredData = useMemo(() => {
        if (!data) return [];
        let result = [...data];
        if (dateFilter) {
            result = result.filter(m => m.date.startsWith(dateFilter));
        }
        // Sorting: Most future dates first (date desc)
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return result;
    }, [data, dateFilter]);

    // Handlers
    const handleConfirmAction = async () => {
        const { type, item } = confirmDialog;
        if (!type || !item) return;

        try {
            if (type === 'delete') {
                await deleteMut.mutateAsync(item.id);
            } else if (type === 'status_served') {
                await statusMut.mutateAsync({ id: item.id, status: 'SERVED' });
            } else if (type === 'status_scheduled') {
                await statusMut.mutateAsync({ id: item.id, status: 'SCHEDULED' });
            }
            setConfirmDialog({ isOpen: false, type: null, item: null });
        } catch (err) {
            console.error('Error in confirm action', err);
        }
    };

    const handleCloneConfirm = async (newDate: string) => {
        if (!cloneDialog.item) return;
        try {
            await cloneMut.mutateAsync({ id: cloneDialog.item.id, date: newDate });
            setCloneDialog({ isOpen: false, item: null });
        } catch (err) {
            console.error('Error cloning menu', err);
        }
    };

    const handleEditProteinsConfirm = async (proteinOptionIds: string[]) => {
        if (!editProteinsDialog.item) return;
        try {
            await updateMut.mutateAsync({ id: editProteinsDialog.item.id, payload: { proteinOptionIds } });
            setEditProteinsDialog({ isOpen: false, item: null });
        } catch (err) {
            console.error('Error updating menu proteins', err);
        }
    };

    const handleCreateConfirm = async (payload: any) => {
        try {
            await createMut.mutateAsync(payload);
            setCreateDialog({ isOpen: false });
        } catch (err) {
            console.error('Error creating menu', err);
            throw err; // Form needs to catch it
        }
    };

    // Columns definition
    const columns: TableColumn<MenuResponse>[] = [
        {
            header: 'Fecha / Día',
            accessorKey: 'date',
            render: (item) => {
                const dateOnly = item.date.split('T')[0];
                return (
                    <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{dateOnly}</span>
                        <span className="ml-2 text-xs text-zinc-500 uppercase">({item.dayOfWeek})</span>
                    </div>
                );
            }
        },
        {
            header: 'Estado',
            accessorKey: 'status',
            render: (item) => {
                const isServed = item.status === 'SERVED';
                return (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
            ${isServed
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500'}`}>
                        {isServed ? 'SERVIDO' : 'PROGRAMADO'}
                    </span>
                );
            }
        },
        {
            header: 'Items del Menú',
            accessorKey: 'items',
            render: (item) => (
                <button
                    onClick={() => setItemsDialog({ isOpen: true, item })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                    <Eye size={14} />
                    Ver Menú
                </button>
            )
        },
        {
            header: 'Fecha Creación',
            accessorKey: 'createdAt',
            render: (item) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'
        },
        {
            header: 'Acciones',
            accessorKey: 'actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    {/* Status Toggle */}
                    <button
                        onClick={() => setConfirmDialog({ isOpen: true, type: item.status === 'SCHEDULED' ? 'status_served' : 'status_scheduled', item })}
                        className={`p-1.5 border rounded-md transition-colors ${item.status === 'SCHEDULED'
                            ? 'text-blue-500 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                            : 'text-zinc-500 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                            }`}
                        title={item.status === 'SCHEDULED' ? "Marcar como Servido" : "Volver a Programado"}
                    >
                        {item.status === 'SCHEDULED' ? <CheckCircle2 size={14} /> : <RotateCcw size={14} />}
                    </button>

                    {/* Edit Proteins */}
                    <button
                        onClick={() => setEditProteinsDialog({ isOpen: true, item })}
                        className="p-1.5 text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/20"
                        title="Editar Proteínas"
                    >
                        <Pencil size={14} />
                    </button>

                    {/* Clone */}
                    <button
                        onClick={() => setCloneDialog({ isOpen: true, item })}
                        className="p-1.5 text-indigo-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        title="Clonar Menú"
                    >
                        <CalendarCheck size={14} />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => setConfirmDialog({ isOpen: true, type: 'delete', item })}
                        className="p-1.5 text-red-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Eliminar Menú"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                        Menús
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Gestiona los menús de almuerzo disponibles y programados. (La creación manual está deshabilitada temporalmente).
                    </p>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-colors"
                            title="Filtrar por fecha específica"
                        />
                        {dateFilter && (
                            <button
                                onClick={() => setDateFilter('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setCreateDialog({ isOpen: true })}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={16} />
                        Crear Menú
                    </button>
                </div>
            </div>

            {/* Table */}
            <CrudTable
                data={filteredData}
                columns={columns}
                isLoading={isLoading}
                pagination={{
                    page,
                    pageSize: take,
                    onPageChange: setPage,
                    hasMore: data && data.length === take
                }}
            />

            <CrudConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null, item: null })}
                onConfirm={handleConfirmAction}
                title={
                    confirmDialog.type === 'delete' ? `Eliminar Menú` :
                        confirmDialog.type === 'status_served' ? `Marcar como Servido` :
                            `Deshacer Servido`
                }
                description={
                    confirmDialog.type === 'delete' ? `¿Estás seguro de que deseas ELIMINAR permanentemente este menú? Todas sus reservas (si tiene) también podrían verse afectadas.` :
                        confirmDialog.type === 'status_served' ? `¿Marcar este menú como SERVIDO? Esto actualizará su estado, indicando que ya ocurrió.` :
                            `¿Devolver el menú a PROGRAMADO? Utilízalo sólo si marcaste por error como Servido.`
                }
                confirmText={
                    confirmDialog.type === 'delete' ? 'Eliminar' :
                        confirmDialog.type === 'status_served' ? 'Servido' : 'Programado'
                }
                isLoading={deleteMut.isPending || statusMut.isPending}
                isDestructive={confirmDialog.type === 'delete'}
            />

            <MenuCloneDialog
                isOpen={cloneDialog.isOpen}
                sourceDate={cloneDialog.item?.date || ''}
                onClose={() => setCloneDialog({ isOpen: false, item: null })}
                onConfirm={handleCloneConfirm}
                isLoading={cloneMut.isPending}
            />

            <MenuItemsDialog
                isOpen={itemsDialog.isOpen}
                menu={itemsDialog.item}
                onClose={() => setItemsDialog({ isOpen: false, item: null })}
            />

            <MenuEditProteinsDialog
                isOpen={editProteinsDialog.isOpen}
                menu={editProteinsDialog.item}
                onClose={() => setEditProteinsDialog({ isOpen: false, item: null })}
                onConfirm={handleEditProteinsConfirm}
                isLoading={updateMut.isPending}
            />

            <MenuCreateDialog
                isOpen={createDialog.isOpen}
                onClose={() => setCreateDialog({ isOpen: false })}
                onConfirm={handleCreateConfirm}
                isLoading={createMut.isPending}
            />
        </div>
    );
}
