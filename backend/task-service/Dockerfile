# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY task-service/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY task-service/ .

# Crear estructura de directorios para auth-service
RUN mkdir -p auth-service/src/users/entities

# Copiar entidades necesarias del auth-service
COPY auth-service/src/users/entities/user.entity.ts /app/auth-service/src/users/entities/

# Compilar la aplicación
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY task-service/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar archivos compilados y necesarios del builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/auth-service ./auth-service

# Verificar que los archivos se copiaron correctamente
RUN ls -la dist/

# Configuración de variables de entorno
ENV NODE_ENV=production
ENV TASK_SERVICE_PORT=3002
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=task_management
ENV JWT_SECRET=cc7c0a0b-3d4e-4f5a-9b8c-7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0
ENV JWT_EXPIRATION=1d
ENV PORT=3002
ENV AUTH_SERVICE_URL=http://auth-service:3001

# Exponer puerto
EXPOSE 3002

# Comando para ejecutar la aplicación
CMD ["node", "dist/src/main.js"] 