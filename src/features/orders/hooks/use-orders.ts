'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order-service';
import { db } from '@/core/db';

export function useOrders() {
    const queryClient = useQueryClient();

    // Query for synced orders (from server)
    const syncedOrdersQuery = useQuery({
        queryKey: ['orders', 'synced'],
        queryFn: async () => {
            // In a real app, this would fetch from API_URL/orders
            // For now, it might return empty or mock
            return [];
        },
    });

    // Query for local pending orders
    const pendingOrdersQuery = useQuery({
        queryKey: ['orders', 'pending'],
        queryFn: () => db.orders.where('status').equals('pending').toArray(),
    });

    const createOrderMutation = useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', 'pending'] });
        },
    });

    return {
        syncedOrders: syncedOrdersQuery.data || [],
        pendingOrders: pendingOrdersQuery.data || [],
        isLoading: syncedOrdersQuery.isLoading || pendingOrdersQuery.isLoading,
        createOrder: createOrderMutation.mutate,
        isCreating: createOrderMutation.isPending,
    };
}

export function useMenu() {
    return useQuery({
        queryKey: ['menu'],
        queryFn: orderService.getMenu,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
