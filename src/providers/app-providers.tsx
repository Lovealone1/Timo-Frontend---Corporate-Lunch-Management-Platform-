'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/query-client';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
