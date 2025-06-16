# Task Management Dashboard

Un dashboard moderno y profesional para la gestión de tareas, construido con Next.js 14, Tailwind CSS y Hero UI.

## Características

- 🎨 Diseño moderno y responsive
- 🔐 Autenticación con JWT
- 📊 Tablero Kanban con drag & drop
- 📱 Interfaz adaptativa para móvil y desktop
- 🎯 Gestión completa de tareas y proyectos
- 👥 Sistema de asignación de tareas
- 💬 Comentarios en tiempo real
- 🔔 Notificaciones
- 📈 Métricas y estadísticas

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Backend API configurado y funcionando

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd frontend
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/              # Rutas y páginas
│   ├── components/       # Componentes React
│   ├── context/         # Contextos de React
│   ├── lib/             # Utilidades y configuración
│   ├── types/           # Tipos TypeScript
│   └── styles/          # Estilos globales
├── public/              # Archivos estáticos
└── ...
```

## Tecnologías Utilizadas

- **Framework**: Next.js 14
- **UI Library**: Hero UI (NextUI)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios
- **Icons**: Hero Icons
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 