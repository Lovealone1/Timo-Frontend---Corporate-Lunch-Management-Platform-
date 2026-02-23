import Dexie, { type Table } from 'dexie';
import { type OfflineOrder, type CachedMenu } from '@/types';

export class AppDatabase extends Dexie {
    orders!: Table<OfflineOrder>;
    menu!: Table<CachedMenu>;
    syncQueue!: Table<{ id?: number; type: string; payload: unknown; createdAt: number }>;

    constructor() {
        super('LunchAppDB');
        this.version(1).stores({
            orders: '++id, tempId, status, createdAt',
            menu: 'id, updatedAt',
            syncQueue: '++id, type, createdAt'
        });
    }
}

export const db = new AppDatabase();
export type { OfflineOrder, CachedMenu };
