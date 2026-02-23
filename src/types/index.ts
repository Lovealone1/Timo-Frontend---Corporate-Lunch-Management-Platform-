export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrl?: string;
}

export interface Menu {
    id: string;
    date: string;
    items: MenuItem[];
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface OfflineOrder {
    id?: number;
    tempId: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'synced' | 'failed';
    createdAt: string;
    syncedAt?: string;
}

export interface CachedMenu {
    id: string;
    data: Menu;
    updatedAt: string;
}
