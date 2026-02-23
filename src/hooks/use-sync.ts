'use client';

import { useEffect } from 'react';
import { useOnlineStatus } from './use-online-status';
import { SyncManager } from '@/lib/offline/sync-manager';

export function useSync() {
    const isOnline = useOnlineStatus();

    useEffect(() => {
        if (isOnline) {
            console.log('Online detected. Triggering sync...');
            SyncManager.syncPendingOrders();
        }
    }, [isOnline]);

    return { isOnline, triggerSync: () => SyncManager.syncPendingOrders() };
}
