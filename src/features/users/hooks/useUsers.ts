import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export interface UserResponseDto {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
    enabled: boolean;
    createdAt: string;
}

interface UsersListResponse {
    data: UserResponseDto[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export function useUsersList(page = 1, limit = 10, search = '') {
    return useQuery({
        queryKey: ['users', { page, limit, search }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) params.append('q', search);

            const { data } = await apiClient.get<UsersListResponse | UserResponseDto[]>(`/users?${params.toString()}`);

            // Check if backend returns paginated format or just array, handle gracefully for safety
            if (Array.isArray(data)) {
                return {
                    data,
                    meta: {
                        total: data.length,
                        page: 1,
                        lastPage: 1
                    }
                } as UsersListResponse;
            }
            return data;
        },
    });
}

export function useUserRoleUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, role }: { id: string; role: 'ADMIN' | 'USER' }) => {
            const { data } = await apiClient.patch<UserResponseDto>(`/users/${id}/role`, { role });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useUserEnabledToggle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
            const { data } = await apiClient.patch<UserResponseDto>(`/users/${id}/enabled`, { enabled });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useUserCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<UserResponseDto, 'id' | 'createdAt'> & { password?: string }) => {
            const response = await apiClient.post<UserResponseDto>('/users', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
