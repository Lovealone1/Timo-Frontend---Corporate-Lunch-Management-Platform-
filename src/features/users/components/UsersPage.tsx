'use client';

import React, { useState } from 'react';
import { useUsersList, useUserEnabledToggle, useUserRoleUpdate, UserResponseDto } from '../hooks/useUsers';
import { CrudTable } from '@/features/admin-crud/components/CrudTable';
import { TableColumn } from '@/features/admin-crud/types';
import { Search, Power, Shield, User, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserCreateDialog } from './UserCreateDialog';

export function UsersPage() {
    const [page, setPage] = useState(0);
    const take = 10;
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: listResponse, isLoading, isFetching } = useUsersList(page + 1, take, debouncedSearch);
    const toggleEnabledMut = useUserEnabledToggle();
    const updateRoleMut = useUserRoleUpdate();

    // Search debounce
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset page on new search
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const columns: TableColumn<UserResponseDto>[] = [
        {
            accessorKey: 'email',
            header: 'Email / Usuario',
            render: (row) => (
                <div className="font-medium text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate" title={row.email}>
                    {row.email}
                </div>
            )
        },
        {
            accessorKey: 'role',
            header: 'Rol',
            render: (row) => (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full w-fit ${row.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {row.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                    {row.role}
                </span>
            )
        },
        {
            accessorKey: 'enabled',
            header: 'Estado',
            render: (row) => (
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${row.enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {row.enabled ? 'ACTIVO' : 'INACTIVO'}
                </span>
            )
        },
        {
            accessorKey: 'createdAt',
            header: 'Fecha Registro',
            render: (row) => new Date(row.createdAt).toLocaleDateString('es-CO')
        },
        {
            accessorKey: 'actions',
            header: '',
            render: (row) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={() => updateRoleMut.mutate({ id: row.id, role: row.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                        disabled={updateRoleMut.isPending}
                        title={row.role === 'ADMIN' ? "Quitar Admin" : "Hacer Admin"}
                        className={`p-2 rounded-lg transition-colors ${row.role === 'ADMIN' ? 'text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'} disabled:opacity-50`}
                    >
                        {row.role === 'ADMIN' ? <User size={16} /> : <Shield size={16} />}
                    </button>
                    <button
                        onClick={() => toggleEnabledMut.mutate({ id: row.id, enabled: !row.enabled })}
                        disabled={toggleEnabledMut.isPending}
                        title={row.enabled ? "Desactivar Usuario" : "Activar Usuario"}
                        className={`p-2 rounded-lg transition-colors ${row.enabled ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'} disabled:opacity-50`}
                    >
                        <Power size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Usuarios</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gestiona los accesos administrativos del sistema</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCreateDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Buscar usuario por correo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10 w-full rounded-lg transition-all focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <CrudTable
                    columns={columns}
                    data={listResponse?.data || []}
                    isLoading={isLoading || isFetching}
                    pagination={{
                        page,
                        pageSize: take,
                        onPageChange: setPage,
                        totalElements: listResponse?.meta?.total || 0,
                        hasMore: listResponse?.meta ? page + 1 < listResponse.meta.lastPage : false
                    }}
                />
            </div>

            <UserCreateDialog
                isOpen={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />
        </div>
    );
}
