'use client';

import React from 'react';
import { CrudPage } from '@/features/admin-crud/components/CrudPage';
import { soupsConfig } from '@/features/menu-items/config';

export default function SoupsPage() {
    return <CrudPage config={soupsConfig} />;
}
