# Sistema de Gestión Eco-Museo

Un sistema completo de gestión de museos construido con React para el frontend y Node.js/Express para el backend, integrado con Supabase para la gestión de la base de datos.

## Descripción del Proyecto

Este sistema proporciona una solución completa para la gestión de historias, actores y autores de un Ecomuseo de Titeres. Incluye componentes tanto del frontend como del backend que trabajan juntos para ofrecer una experiencia de usuario fluida para los administradores del museo.

## Frontend (React)

### Componentes

1. **Gestión de Historias**
   - `HistoryTable.jsx`: Muestra una tabla con todas las historias y acciones para ver, editar y eliminar
   - `AddHistoryForm.jsx`: Componente de formulario para agregar nuevas entradas de historia
   - `EditHistoryForm.jsx`: Componente de formulario para editar entradas de historia existentes

2. **Gestión de Actores**
   - `ActorTable.jsx`: Muestra una tabla con todos los actores y acciones para ver, editar y eliminar
   - `AddActorForm.jsx`: Componente de formulario para agregar nuevos actores
   - `EditActorForm.jsx`: Componente de formulario para editar actores existentes

3. **Gestión de Autores**
   - `AuthorTable.jsx`: Muestra una tabla con todos los autores y acciones para ver, editar y eliminar
   - `AddAuthorForm.jsx`: Componente de formulario para agregar nuevos autores
   - `EditAuthorForm.jsx`: Componente de formulario para editar autores existentes

4. **Integración con API**

   - `ApiFun.jsx`: Funciones utilitarias para hacer llamadas a la API del backend
     - Maneja operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
     - Gestiona las relaciones entre historias, actores y autores
     - Maneja la validación de datos y el manejo de errores

### Características

- Componentes React modernos con sistema de construcción Vite
- Interfaz de usuario responsiva para la gestión de historias
- Validación de formularios y manejo de errores
- Integración con API del backend
- Soporte para gestionar múltiples actores y autores por historia

## Backend (Node.js/Express)

### Arquitectura

1. **Rutas**
   - Rutas de historias (`historyRoutes.js`)
     - GET /histories - Obtener todas las historias
     - POST /histories - Crear nueva historia
     - PUT /histories/:id - Actualizar historia existente
     - DELETE /histories/:id - Eliminar historia

2. **Rutas de Actores**
   - Rutas de actores (`actorRoutes.js`)
     - GET /actors - Obtener todos los actores
     - POST /actors - Crear nuevo actor
     - PUT /actors/:id - Actualizar actor existente
     - DELETE /actors/:id - Eliminar actor

3. **Rutas de Autores**
   - Rutas de autores (`authorRoutes.js`)
     - GET /authors - Obtener todos los autores
     - POST /authors - Crear nuevo autor
     - PUT /authors/:id - Actualizar autor existente
     - DELETE /authors/:id - Eliminar autor

4. **Modelos**
   - Modelo de historia (`history.js`)
     - Gestiona los datos de la historia y sus relaciones
     - Maneja las operaciones de base de datos a través de Supabase
     - Valida los datos antes de las operaciones de base de datos

   - Modelo de actor (`actor.js`)
     - Gestiona los datos del actor y sus relaciones
     - Maneja las operaciones de base de datos a través de Supabase
     - Valida los datos antes de las operaciones de base de datos

   - Modelo de autor (`author.js`)
     - Gestiona los datos del autor y sus relaciones
     - Maneja las operaciones de base de datos a través de Supabase
     - Valida los datos antes de las operaciones de base de datos

### Base de Datos

- Utiliza Supabase para la gestión de PostgreSQL
- Tablas:
  - `history`: Entradas principales de historia
  - `actors`: Actores del museo
  - `authors`: Autores de las historias
  - Tablas de unión para relaciones muchos a muchos

### Relaciones de Datos

- Cada historia puede tener:
  - Un actor principal (idactor)
  - Un autor principal (idautor)
  - Múltiples actores adicionales (actores_ids)
  - Múltiples autores adicionales (autores_ids)

## Stack Técnico

### Frontend

- React
- Vite
- ESLint
- Babel/SWC

### Backend

- Node.js
- Express
- Supabase (PostgreSQL)

## Instrucciones de Instalación

### Frontend (Admin)

1. Navegar al directorio del frontend
2. Ejecutar `bun install` para instalar las dependencias
3. Iniciar el servidor de desarrollo con `bun run dev`

### Backend (Historias)

1. Navegar al directorio del backend
2. Ejecutar `bun install` para instalar las dependencias
3. Configurar las variables de entorno de Supabase
4. Iniciar el servidor con `bun run dev`

## Endpoints de API

### Endpoints de Historias

- GET /api/histories - Obtener todas las historias
- POST /api/histories - Crear nueva historia
- PUT /api/histories/:id - Actualizar historia
- DELETE /api/histories/:id - Eliminar historia

### Endpoints de Actores

- GET /api/actors - Obtener todos los actores
- POST /api/actors - Crear nuevo actor
- PUT /api/actors/:id - Actualizar actor
- DELETE /api/actors/:id - Eliminar actor

### Endpoints de Autores

- GET /api/authors - Obtener todos los autores
- POST /api/authors - Crear nuevo autor
- PUT /api/authors/:id - Actualizar autor
- DELETE /api/authors/:id - Eliminar autors

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
