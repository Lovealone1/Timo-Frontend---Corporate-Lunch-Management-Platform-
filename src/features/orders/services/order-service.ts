import { db } from '@/core/db';
import { SyncManager } from '@/lib/offline/sync-manager';
import { type OfflineOrder, type Menu } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const orderService = {
    async getOrders() {
        const localPending = await db.orders.where('status').equals('pending').toArray();
        return localPending;
    },

    async createOrder(orderData: Omit<OfflineOrder, 'id' | 'status' | 'tempId' | 'createdAt'>) {
        const tempId = crypto.randomUUID();

        const newOrder: OfflineOrder = {
            ...orderData,
            tempId,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        const id = await db.orders.add(newOrder);

        if (typeof navigator !== 'undefined' && navigator.onLine) {
            SyncManager.syncPendingOrders();
        }

        return { ...newOrder, id };
    },

    async getMenu(): Promise<Menu> {
        try {
            if (typeof navigator !== 'undefined' && !navigator.onLine) throw new Error('Offline');
            const response = await axios.get(`${API_URL}/menu`);

            await db.menu.put({
                id: 'current-menu',
                data: response.data,
                updatedAt: new Date().toISOString()
            });

            return response.data;
        } catch (error) {
            const cached = await db.menu.get('current-menu');
            if (cached) return cached.data;
            throw error;
        }
    }
};
