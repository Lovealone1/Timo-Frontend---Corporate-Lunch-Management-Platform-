import React from 'react';
import { TableColumn } from '../types';

interface CrudTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    isLoading: boolean;
}

export function CrudTable<T>({ data, columns, isLoading }: CrudTableProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
                <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin mb-4" />
                <span className="text-sm text-zinc-400 font-medium">Cargando datos...</span>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-xl border-dashed bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500 text-sm">
                No se encontraron registros.
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 dark:text-zinc-400 font-semibold tracking-wider">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-3 whitespace-nowrap text-zinc-700 dark:text-zinc-300">
                                    {col.render ? col.render(row) : (row as any)[col.accessorKey as string]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
