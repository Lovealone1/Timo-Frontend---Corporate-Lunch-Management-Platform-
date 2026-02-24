'use client';

import React from 'react';
import { CrudPage } from '@/features/admin-crud/components/CrudPage';
import { sideDishesConfig } from '@/features/menu-items/config';

export default function SideDishesPage() {
    return <CrudPage config={sideDishesConfig} />;
}
