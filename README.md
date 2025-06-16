# Sistema de Gestión de Tareas - Inlaze

Este proyecto es un sistema de gestión de tareas desarrollado para Inlaze, implementando una arquitectura de microservicios con NestJS (backend) y Next.js (frontend).

## Enlace al Repositorio
[GitHub Repository](https://github.com/CarlosCeballos1/Pruebatecnica)

## Estructura del Proyecto

```
/
├── backend/           # Servicios NestJS
│   ├── auth-service/  # Microservicio de autenticación
│   └── task-service/  # Microservicio de gestión de tareas y proyectos
└── frontend/         # Aplicación Next.js
```
## Requisitos Previos

- Node.js (v18 o superior)
- Docker y Docker Compose
- PostgreSQL
- Redis (para caché y gestión de sesiones)

## Configuración del Entorno

1. Clonar el repositorio:
```bash
git clone https://github.com/CarlosCeballos1/Pruebatecnica.git
cd Pruebatecnica
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```
## Ejecución del Proyecto

1. Iniciar los servicios backend:
```bash
cd backend
npm run start:dev
```

2. Iniciar el frontend:
```bash
docker-compose up -d --build
```

## Características Principales

- Gestión de proyectos y tareas
- Sistema de autenticación y autorización con JWT
- Roles de usuario (admin y user)
- Filtros y búsqueda de tareas
- Interfaz de usuario moderna con Tailwind CSS
- Gestión de estados de tareas (pendiente, en progreso, completada, cancelada)
- Asignación de tareas a usuarios
- Prioridades de tareas (baja, media, alta)

## Tecnologías Utilizadas

### Backend
- NestJS
- PostgreSQL
- JWT para autenticación
- TypeORM
- Class Validator
- Zod para validación de datos

### Frontend
- Next.js
- Tailwind CSS
- React Hook Form
- Zod para validación de formularios
- Headless UI para componentes
- React Hot Toast para notificaciones

## Credenciales por Defecto

### Usuario Administrador
- Email: admin@example.com
- Contraseña: Admin123!

## API Endpoints

### Autenticación
- POST /api/auth/login - Iniciar sesión
- POST /api/auth/register - Registro de usuarios

### Usuarios
- GET /api/users - Listar usuarios (requiere rol admin)
- GET /api/users/me - Obtener usuario actual
- POST /api/users - Crear usuario (requiere rol admin)
- PATCH /api/users/:id - Actualizar usuario (requiere rol admin)
- DELETE /api/users/:id - Eliminar usuario (requiere rol admin)

### Tareas
- GET /api/tasks - Listar tareas
- POST /api/tasks - Crear tarea
- GET /api/tasks/:id - Obtener tarea
- PATCH /api/tasks/:id - Actualizar tarea
- DELETE /api/tasks/:id - Eliminar tarea

### Proyectos
- GET /api/projects - Listar proyectos
- POST /api/projects - Crear proyecto
- GET /api/projects/:id - Obtener proyecto
- PATCH /api/projects/:id - Actualizar proyecto
- DELETE /api/projects/:id - Eliminar proyecto


## Licencia

Este proyecto es una prueba técnica desarrollada con fines educativos y de demostración. No tiene fines comerciales ni está destinado para uso en producción. 