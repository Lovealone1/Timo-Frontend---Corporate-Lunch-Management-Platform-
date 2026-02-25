import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export interface ReservationResponse {
    id: string;
    cc: string;
    date: string;
    proteinTypeId: string;
    proteinType: { id: string; name: string };
    menuId: string;
    status: 'RESERVADA' | 'SERVIDA' | 'CANCELADA';
    createdAt: string;
    updatedAt: string;
}

export interface ReservationSummary {
    date: string;
    status: 'PROGRAMADO' | 'SERVIDO' | 'CANCELADO'; // from menu
    proteins: {
        proteinTypeId: string;
        proteinName: string;
        count: number;
    }[];
}

export function useReservationsByMenu(menuId: string) {
    return useQuery({
        queryKey: ['/reservations/by-menu', menuId],
        queryFn: async () => {
            const { data } = await apiClient.get<ReservationResponse[]>(`/reservations/by-menu/${menuId}`);
            return data;
        },
        enabled: !!menuId,
    });
}

export function useReservationSummary(date: string) {
    return useQuery({
        queryKey: ['/reservations/summary', date],
        queryFn: async () => {
            const { data } = await apiClient.get<ReservationSummary>(`/reservations/summary/${date}`);
            return data;
        },
        enabled: !!date,
    });
}

export function useReservationsBulkServed() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (date: string) => {
            const { data } = await apiClient.patch(`/reservations/bulk-served/${date}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/reservations'] });
            queryClient.invalidateQueries({ queryKey: ['/menus'] }); // menu status might change
        },
    });
}

export function useReservationsBulkCancelled() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (date: string) => {
            const { data } = await apiClient.patch(`/reservations/bulk-cancelled/${date}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/reservations'] });
        },
    });
}

export function useReservationsBulkStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ids, status }: { ids: string[], status: 'RESERVADA' | 'SERVIDA' | 'CANCELADA' }) => {
            // Asumiendo que el backend tiene PATCH /reservations/bulk-status o hacemos peticiones paralelas
            // Para asegurar compatibilidad, hacemos peticiones paralelas a PATCH /reservations/:id/status
            const promises = ids.map(id => apiClient.patch(`/reservations/${id}/status`, { status }));
            const results = await Promise.all(promises);
            return results.map(r => r.data);
        },
        onSuccess: () => {
            // Invalidate queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ['/reservations'] });
        },
    });
}
