'use client';

import React from 'react';
import { CrudPage } from '@/features/admin-crud/components/CrudPage';
import { drinksConfig } from '@/features/menu-items/config';

export default function DrinksPage() {
    return <CrudPage config={drinksConfig} />;
}
