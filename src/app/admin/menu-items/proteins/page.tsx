'use client';

import React from 'react';
import { CrudPage } from '@/features/admin-crud/components/CrudPage';
import { proteinsConfig } from '@/features/menu-items/config';

export default function ProteinsPage() {
    return <CrudPage config={proteinsConfig} />;
}
