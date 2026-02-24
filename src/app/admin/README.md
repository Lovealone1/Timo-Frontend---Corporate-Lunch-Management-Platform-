# Admin Panel & CRUD Factory

Bienvenido al módulo de Administración de **TIMO**. Este módulo implementa un **CRUD Factory genérico**, 100% modular y reutilizable para cualquier entidad gestionada desde el frontend.

## Arquitectura

- **Routing (App Router)**: Todas las rutas bajo `/admin/*` usan el `AdminLayout` que provee el Sidebar la Cabecera.
- **`src/features/admin-crud`**: Contiene todo el motor genérico:
  - `types.ts`: Define `CrudEntityConfig` (columnas, endpoints, esquema de validación).
  - `hooks/useCrud.ts`: React Query hooks (`useCrudList`, `useCrudCreate`, etc.) conectados a `apiClient`.
  - `components/*`: Componentes UI agnósticos (Table, Dialogs, Page).

## Cómo agregar un nuevo recurso (en 5 minutos)

Imagina que agregas un nuevo recurso llamado `categories` (Categorías).

1. **Agrega el Config en `src/features/menu-items/config.tsx` (o crea un archivo similar)**
   ```tsx
   import { z } from 'zod';
   import { CrudEntityConfig } from '../admin-crud/types';

   export const categoriesConfig: CrudEntityConfig = {
     entityKey: 'categories',
     title: 'Categorías',
     singularTitle: 'Categoría',
     endpoints: { base: '/categories' },
     columns: [
       { header: 'ID', accessorKey: 'id' },
       { header: 'Nombre', accessorKey: 'name' }
     ],
     formFields: [
       { name: 'name', label: 'Nombre', type: 'text' }
     ],
     formSchema: z.object({ name: z.string() }),
     defaultValues: { name: '' }
   };
   ```

2. **Crea la página en `src/app/admin/categories/page.tsx`**
   ```tsx
   import { CrudPage } from '@/features/admin-crud/components/CrudPage';
   import { categoriesConfig } from '@/features/menu-items/config';

   export default function CategoriesPage() {
     return <CrudPage config={categoriesConfig} />;
   }
   ```

3. **Agrega el enlace en el Sidebar**
   Abre `src/components/admin/AdminSidebar.tsx` y agrega la ruta al arreglo `items`.

¡Listo! Ya tienes una tabla paginada/listada, modal de creación, modal de edición, confirmación de desactivación y eliminación, todo validado por Zod y comunicado con la API vía React Query.

## Variables de Entorno y Configuración API

- **`NEXT_PUBLIC_API_URL`**: Asegúrate de tener esta variable en tu `.env.local`. Por defecto el `apiClient` apunta a `http://localhost:3001`.
- **Modificación de token (TODO)**: Actualmente `apiClient` intenta leer tokens desde persistencia (`auth-service.ts`). Si cambiará el provider de Auth, modifícalo directamente en el interceptor de `src/services/api-client.ts`.
