FROM node:18-alpine

WORKDIR /app

# Instalar dependencias necesarias para bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Eliminar node_modules y package-lock.json si existen
RUN rm -rf node_modules package-lock.json

# Instalar dependencias y reconstruir bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .

# Reconstruir bcrypt después de copiar los archivos
RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3001

ENV NODE_ENV=development
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=task_management
ENV JWT_SECRET=cc7c0a0b-3d4e-4f5a-9b8c-7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0
ENV JWT_EXPIRATION=1d
ENV PORT=3001
ENV AUTH_SERVICE_PORT=3001
ENV TASK_SERVICE_URL=http://task-service:3002

CMD ["npm", "run", "start:prod"] 