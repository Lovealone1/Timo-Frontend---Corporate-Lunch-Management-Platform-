import { set, get, del } from 'idb-keyval';
import { apiClient } from './api-client';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user?: { id: string; email?: string };
}

export interface UserProfile {
    userId: string;
    role: string;
    email: string;
}

export const authService = {
    /**
     * Log in with email and password.
     * On success, tokens are persisted in IndexedDB.
     */
    async login(credentials: Record<string, string>): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/token', credentials);
        await this.saveTokens(data.access_token, data.refresh_token);
        return data;
    },

    /**
     * Fetch the current authenticated user's profile.
     */
    async me(): Promise<UserProfile> {
        const { data } = await apiClient.get<UserProfile>('/auth/me');
        return data;
    },

    async saveTokens(accessToken: string, refreshToken: string) {
        await set(TOKEN_KEY, accessToken);
        await set(REFRESH_KEY, refreshToken);
    },

    async getToken() {
        return await get<string>(TOKEN_KEY);
    },

    async logout() {
        await del(TOKEN_KEY);
        await del(REFRESH_KEY);
        // Reload to clear memory state if needed
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },
};
