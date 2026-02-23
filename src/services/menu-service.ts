import { apiClient } from './api-client';
import { type Menu } from '@/types';

export const menuService = {
    /**
     * Fetch all menus with optional pagination.
     */
    async findAll(skip?: number, take?: number): Promise<Menu[]> {
        const { data } = await apiClient.get<Menu[]>('/menus', {
            params: { skip, take },
        });
        return data;
    },

    /**
     * Fetch a specific menu by its date.
     * @param date Date in YYYY-MM-DD format.
     */
    async findByDate(date: string): Promise<Menu> {
        const { data } = await apiClient.get<Menu>(`/menus/by-date/${date}`);
        return data;
    },

    /**
     * Fetch a menu by its UUID.
     */
    async findOne(id: string): Promise<Menu> {
        const { data } = await apiClient.get<Menu>(`/menus/${id}`);
        return data;
    },
};
