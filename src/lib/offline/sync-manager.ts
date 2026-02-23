import { db } from '@/core/db';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class SyncManager {
    private static isSyncing = false;

    static async syncPendingOrders() {
        if (this.isSyncing) return;

        if (typeof navigator !== 'undefined' && !navigator.onLine) return;

        try {
            this.isSyncing = true;
            const pendingOrders = await db.orders
                .where('status')
                .equals('pending')
                .toArray();

            if (pendingOrders.length === 0) return;

            console.log(`Starting sync for ${pendingOrders.length} orders...`);

            for (const order of pendingOrders) {
                try {
                    const token = localStorage.getItem('auth_token');

                    await axios.post(`${API_URL}/orders`, order, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    await db.orders.update(order.id!, {
                        status: 'synced',
                        syncedAt: new Date().toISOString()
                    });

                    console.log(`Order ${order.tempId} synced successfully.`);
                } catch (error) {
                    console.error(`Failed to sync order ${order.tempId}:`, error);
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    static async addToQueue(type: string, payload: unknown) {
        await db.syncQueue.add({
            type,
            payload,
            createdAt: Date.now()
        });

        if (typeof navigator !== 'undefined' && navigator.onLine) {
            this.syncPendingOrders();
        }
    }
}
