# Sistema de Gestión de Tareas - Inlaze

Este proyecto es un sistema de gestión de tareas desarrollado para Inlaze, implementando una arquitectura de microservicios con NestJS (backend) y Next.js (frontend).

## Estructura del Proyecto

```
/
├── backend/           # Servicios NestJS
│   ├── auth-service/  # Microservicio de autenticación
│   ├── task-service/  # Microservicio de gestión de tareas
│   └── project-service/ # Microservicio de gestión de proyectos
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
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
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

4. Configurar variables de entorno:
- Copiar los archivos `.env.example` a `.env` en cada directorio de servicio
- Ajustar las variables según el entorno local

## Ejecución del Proyecto

### Desarrollo

1. Iniciar los servicios backend:
```bash
cd backend
npm run start:dev
```

2. Iniciar el frontend:
```bash
cd frontend
npm run dev
```

### Producción

```bash
docker-compose up -d
```

## Características Principales

- Gestión de proyectos y tareas
- Sistema de autenticación y autorización con JWT
- Comentarios y notificaciones en tiempo real
- Filtros y búsqueda avanzada
- Interfaz de usuario moderna con NextUI y Tailwind CSS

## Tecnologías Utilizadas

### Backend
- NestJS
- PostgreSQL
- Redis
- JWT para autenticación
- TypeORM
- Socket.io para notificaciones en tiempo real

### Frontend
- Next.js
- NextUI
- Tailwind CSS
- React Query
- Socket.io Client

## API Documentation

La documentación de la API está disponible en `/api-docs` cuando el servidor está en ejecución.

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto es privado y propiedad de Inlaze. 