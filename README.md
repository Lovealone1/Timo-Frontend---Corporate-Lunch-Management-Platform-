<div align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</div>

# Almuerzos App - Frontend

Sistema integral para la visualización y gestión de almuerzos corporativos. Este proyecto proporciona dos entornos principales: una **vista de usuario** para que los empleados consulten y reserven el menú del día, y un **panel administrativo** para la gestión de platillos, reservaciones, listas de acceso especiales (whitelist) y catálogos.

## Tecnologías Core

* **Framework:** Next.js (App Router) v15+
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS con componentes base de shadcn/ui
* **Manejo de Estado Remoto:** TanStack React Query (con persistencia offline)
* **Peticiones HTTP:** Axios
* **Package Manager:** pnpm
* **Deployment:** Vercel

## Arquitectura Modular (Feature-Sliced Design)

El proyecto está diseñado bajo una arquitectura modular orientada a **features**, donde el código se agrupa por dominio de negocio en lugar de por tipo de archivo técnico. Esto garantiza una alta escalabilidad y un bajo acoplamiento.

### Estructura de Carpetas Principal

```text
src/
├── app/                  # Rutas de Next.js (App Router), layouts y páginas
├── components/           # Componentes UI globales y reutilizables (ej. shadcn/ui)
├── core/                 # Lógica de dominio puro o configuraciones base
├── features/             # Módulos de negocio aislados (Domain-Driven)
│   ├── admin-crud/       # Factory de CRUD reutilizable para múltiples entidades
│   ├── menu-items/       # Componentes de ítems (Proteínas, Sopas, Bebidas, etc.)
│   ├── menus/            # Lógica y UI para la gestión de menús diarios
│   ├── orders/           # Gestión de pedidos procesados
│   ├── reservations/     # Control y visualización de reservaciones de usuarios
│   ├── users/            # Administración de empleados y carga por lotes (CSV/XLSX)
│   └── whitelist/        # Control de listas blancas de acceso
├── hooks/                # Custom React Hooks globales
├── lib/                  # Utilidades, configuración de Axios, utilidades de Tailwind
├── providers/            # React Context y Providers (React Query, Theme, Auth)
├── services/             # Funciones base para interactuar con la API
└── types/                # Interfaces y tipos TypeScript globales
```

### Decisiones Técnicas y Justificación

1. **Arquitectura Orientada a Features (`src/features/*`):**  
   Al aislar cada módulo (ej. `reservations`, `menus`), cada carpeta contiene sus propios hooks, componentes específicos, servicios y tipos. Esto previene que los archivos globales se conviertan en "cuellos de botella" y permite que múltiples desarrolladores trabajen en distintas funcionalidades sin conflictos de merge.
2. **Sistema CRUD Reutilizable (`admin-crud`):**  
   Implementación de un sistema automatizado para la creación de tablas, formularios y acciones (Crear, Leer, Actualizar, Borrar) en el panel administrativo. Reduce drásticamente la duplicación de código en la gestión de las distintas categorías del menú.
3. **App Router de Next.js:**  
   Adoptado para aprovechar React Server Components (RSC) y mantener un enrutamiento moderno y optimizado tanto para las páginas enfocadas a los usuarios finales como para el panel de administración.
4. **TanStack Query con Persistencia:**  
   Simplifica el manejo del estado del servidor (fetching, caching, invalidación), y añade soporte de resiliencia (`persist-client` / `idb-keyval`) que mejora la disponibilidad de la información en momentos de tráfico o baja conectividad.

## Configuración y Ejecución Local

### Prerrequisitos

* Node.js (v20+ recomendado)
* pnpm (v9+)

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto. Estas variables son necesarias para conectar el frontend con el backend y definir configuraciones básicas.

```env
# URL base para las peticiones al Backend (NestJS)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Nombre público de la aplicación
NEXT_PUBLIC_APP_NAME="Almuerzos Corporativos"
```

### Comandos de Desarrollo

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar el servidor de desarrollo
pnpm run dev

# 3. Construir para producción
pnpm run build

# 4. Iniciar servidor en modo producción (requiere build manual previo)
pnpm run start

# 5. Ejecutar linter
pnpm run lint
```

## Integración con Backend y Autenticación

El sistema interactúa con un backend construido en **NestJS**.

* **Flujos de Autenticación:** Se utiliza **JWT (JSON Web Tokens)** para proteger los entornos.
  1. El personal autorizado accede al panel administrativo validando credenciales y obteniendo su token de sesión largo.
  2. Los usuarios regulares acceden a sus reservas autenticándose mayoritariamente mediante el documento de identidad en los flujos asignados.
  3. El frontend almacena el token de manera segura y lo inyecta mediante **Axios Interceptors** en las cabeceras (`Authorization: Bearer <token>`) de cada solicitud en rutas seguras. En caso de expiración (`401 Unauthorized`), la aplicación finaliza la sesión redireccionando a la pantalla de acceso correspondiente.
* **Control de Permisos de Empleados y Whitelist:** Los módulos encargados consultan y validan los identificadores contra el modelo de negocio para proveer o restringir la visualización y reservación de platos en un día determinado.

## Features Actuales

* **Vistas de Usuario (Empleados):** Interfaz para visualizar el menú actual, elegir componentes y confirmar una reserva usando el documento validado.
* **Panel de Generación de Menús (Menus):** Creación, modificación y asignación del calendario corporativo de alimentos.
* **Catálogo de Componentes (Menu Items):** Administración de catálogo de opciones modulares: `Proteins` (Proteínas), `Drinks` (Bebidas), `Soups` (Sopas), `Side Dishes` (Acompañamientos).
* **Gestión de Reservaciones (Reservations):** Monitoreo detallado del listado en tiempo real de las opciones elegidas por los usuarios.
* **Módulo de Administración de Personal (Users):**
  * Alta, baja y modificación de acceso del personal para los comedores.
  * **Bulk Import:** Capacidad para importar empleados masivamente mediante formato estructurado CSV/XLSX.
* **Listas Blancas Transitorias (Whitelist):** Gestión de invitados o credenciales especiales temporales que están autorizados para hacer una reserva.
* **Sistema de UI Integrado e Inclusivo:** 
  * Diseño modular con Shadcn/ui.
  * **Modo Oscuro / Claro:** Soporte base de theming en toda la vista de usuarios y vista de administrador gestionado vía `next-themes`.

---


<br />

> _Aplicación desarrollada siguiendo principios de Clean Code, fuertemente tipada con TypeScript y mantenida con orientación a la máxima escalabilidad del dominio corporativo._
