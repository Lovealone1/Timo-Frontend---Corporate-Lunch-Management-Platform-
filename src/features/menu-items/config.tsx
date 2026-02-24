import React from 'react';
import { z } from 'zod';
import { CrudEntityConfig, TableColumn } from '../admin-crud/types';

/**
 * Shared Schema & Columns since Proteins, Drinks, SideDishes and Soups
 * have exactly the same structure in the backend.
 */

const baseSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    isActive: z.boolean().default(true),
});

const baseColumns: TableColumn<any>[] = [
    { header: 'Nombre', accessorKey: 'name' },
    {
        header: 'Estado',
        accessorKey: 'isActive',
        render: (item) => (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
        ${item.isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {item.isActive ? 'Activo' : 'Inactivo'}
            </span>
        )
    },
    {
        header: 'Fecha Creación',
        accessorKey: 'createdAt',
        render: (item) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'
    },
];

const baseFormFields = [
    { name: 'name', label: 'Nombre', type: 'text' as const, placeholder: 'Ej. Res a la plancha' },
    { name: 'isActive', label: 'Estado (Activo/Inactivo)', type: 'boolean' as const },
];

export const proteinsConfig: CrudEntityConfig = {
    entityKey: 'proteins',
    title: 'Proteínas',
    singularTitle: 'Proteína',
    endpoints: {
        base: '/proteins',
    },
    columns: baseColumns,
    formFields: baseFormFields.map(f => f.name === 'name' ? { ...f, placeholder: 'Ej. Pollo Asado' } : f),
    formSchema: baseSchema,
    defaultValues: { isActive: true, name: '' },
};

export const drinksConfig: CrudEntityConfig = {
    entityKey: 'drinks',
    title: 'Bebidas',
    singularTitle: 'Bebida',
    endpoints: {
        base: '/drinks', // wait, the user said the endpoint mapping is "drinks", check user prompt: "drinks", "side-dishes", "soups"
    },
    columns: baseColumns,
    formFields: baseFormFields.map(f => f.name === 'name' ? { ...f, placeholder: 'Ej. Jugo de Mora' } : f),
    formSchema: baseSchema,
    defaultValues: { isActive: true, name: '' },
};

export const sideDishesConfig: CrudEntityConfig = {
    entityKey: 'side-dishes',
    title: 'Acompañamientos',
    singularTitle: 'Acompañamiento',
    endpoints: {
        base: '/side-dishes',
    },
    columns: baseColumns,
    formFields: baseFormFields.map(f => f.name === 'name' ? { ...f, placeholder: 'Ej. Arroz Blanco' } : f),
    formSchema: baseSchema,
    defaultValues: { isActive: true, name: '' },
};

export const soupsConfig: CrudEntityConfig = {
    entityKey: 'soups',
    title: 'Sopas',
    singularTitle: 'Sopa',
    endpoints: {
        base: '/soups',
    },
    columns: baseColumns,
    formFields: baseFormFields.map(f => f.name === 'name' ? { ...f, placeholder: 'Ej. Sancocho' } : f),
    formSchema: baseSchema,
    defaultValues: { isActive: true, name: '' },
};
