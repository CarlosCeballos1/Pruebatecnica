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

1. Iniciar los servicios frontend:
```bash
cd frontend
npm run dev
```

2. Iniciar el backend:
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

## Decisiones Técnicas y Desafíos Superados

Durante el ciclo de desarrollo de este sistema de gestión de tareas, se abordaron diversos desafíos técnicos y se implementaron soluciones estratégicas que definieron la arquitectura y la calidad del producto final. A continuación, se detalla un análisis desde una perspectiva de desarrollo full-stack.

### 1. Arquitectura de Microservicios: NestJS y Next.js

*   **Contexto y Racional:** La elección de una arquitectura de microservicios, empleando NestJS para el backend (desglosado en `auth-service` y `task-service`) y Next.js para el frontend, se fundamentó en la necesidad de construir un sistema escalable, resiliente y de fácil mantenimiento. Esta separación de preocupaciones permite la evolución independiente de cada componente, minimizando el acoplamiento y facilitando despliegues autónomos.
    *   **NestJS:** Como framework progresivo de Node.js, NestJS se alinea con la robustez de TypeScript, permitiendo una estructura de código modular y orientada a la inyección de dependencias, lo que favorece la testabilidad y la claridad del código en los servicios de autenticación y lógica de negocio.
    *   **Next.js:** Para el frontend, Next.js fue seleccionado por su capacidad de Server-Side Rendering (SSR) y Static Site Generation (SSG), que optimiza el rendimiento inicial de la aplicación, mejora la indexación SEO y ofrece una experiencia de desarrollo React enriquecida.
*   **Desafío Inherente:** La gestión de la comunicación y el estado entre múltiples servicios introduce una capa adicional de complejidad. Si bien en esta implementación se optó por una comunicación directa vía HTTP, en un contexto de mayor escala, se considerarían patrones como API Gateway para centralizar la entrada y la orquestación.

### 2. Optimización del Código para Entornos de Producción: Gestión de Logs

*   **Contexto:** La proliferación de `console.log` y otras llamadas a métodos de `console` durante el desarrollo es común, pero su persistencia en entornos de producción puede llevar a:
    *   Degradación del rendimiento debido a operaciones de I/O innecesarias.
    *   Exposición inadvertida de datos sensibles en los logs del servidor o del navegador.
    *   Incremento del "ruido" en los sistemas de monitoreo, dificultando la identificación de problemas reales.
*   **Desafío:** Realizar una limpieza sistemática y exhaustiva de todas las utilidades de depuración sin comprometer la visibilidad de errores críticos en producción.
*   **Solución Implementada:** Se ejecutó un proceso de revisión meticuloso a través de todo el codebase (`.js`, `.jsx`, `.ts`, `.tsx`), eliminando proactivamente instancias de `console.log()`, `console.warn()`, `console.info()`, `console.debug()`, `console.table()`, `console.trace()`, `console.dir()`, `console.time()`/`console.timeEnd()`, y `console.group()`/`console.groupEnd()`. Se estableció como criterio mantener únicamente los `console.error()` encapsulados dentro de bloques `try/catch` para la captura de excepciones críticas, como errores de red o de procesamiento en llamadas a la API, asegurando así que los fallos operativos importantes sigan siendo monitoreables.
*   **Impacto:** Reducción significativa de la verbosidad de los logs, mejora marginal del rendimiento de la aplicación y alineación con las mejores prácticas de entrega de código para producción.

### 3. Mejora de la Experiencia de Usuario: Responsividad del Encabezado (Header)

*   **Contexto:** El diseño inicial del encabezado (`Header.tsx`) presentaba limitaciones en su capacidad de adaptación a diferentes factores de forma, particularmente en dispositivos móviles, donde los elementos podían superponerse o desbordarse, afectando la usabilidad.
*   **Desafío:** Construir un componente de encabezado adaptable que mantuviera la integridad visual y funcional en un espectro de tamaños de pantalla, desde dispositivos móviles hasta monitores de escritorio.
*   **Solución Implementada:** Se llevó a cabo una refactorización del `Header.tsx` empleando un enfoque de diseño responsivo basado en Tailwind CSS.
    *   Se utilizaron las utilidades de Flexbox (`flex-col`, `md:flex-row`, `items-start`, `md:items-center`, `justify-between`, `gap-4`) para dictar el flujo y la alineación de los elementos (título, barra de búsqueda, botón de acción) de manera dinámica según los breakpoints definidos.
    *   El campo de búsqueda (`<input>`) y el botón de acción fueron ajustados con clases de ancho (`w-full` en móviles, `sm:w-64` y `sm:w-auto` en breakpoints superiores) para asegurar que ocuparan el espacio apropiado sin desbordamientos.
*   **Impacto:** Una interfaz de usuario más robusta y accesible, que proporciona una experiencia de navegación fluida y consistente, fundamental para la retención de usuarios.

### 4. Usabilidad y Consistencia Visual: Visibilidad en Elementos de Formulario (Selects)

*   **Contexto:** Se identificó un problema de usabilidad en el `ProjectModal.tsx` donde los textos dentro de los elementos `<option>` de los campos `select` para "Estado" y "Miembros" se volvían ilegibles (fondo blanco ocultando el texto) al ser enfocados o seleccionados. Este es un problema común con los estilos por defecto del navegador que pueden entrar en conflicto con temas oscuros personalizados.
*   **Desafío:** Asegurar la legibilidad y la coherencia visual de los elementos seleccionables dentro de un contexto de interfaz de usuario con temática oscura.
*   **Solución Implementada:** Para sobrescribir los estilos nativos del navegador y garantizar la consistencia visual, se aplicaron directamente las clases de Tailwind CSS `bg-gray-800` y `text-white` a cada elemento `<option>` dentro de los componentes `<select>`.
*   **Impacto:** Eliminación de una barrera de usabilidad crítica, mejora de la accesibilidad del formulario y mantenimiento de la coherencia estética del diseño general de la aplicación.

### 5. Interfaz de Usuario Intuitiva: Funcionalidad Drag and Drop en Kanban

*   **Contexto:** Un tablero Kanban eficaz requiere una interacción fluida y visual para la gestión de tareas, siendo la capacidad de arrastrar y soltar un elemento fundamental para una buena experiencia de usuario.
*   **Desafío:** Implementar una funcionalidad de drag and drop robusta y con actualizaciones de estado sincronizadas entre el frontend y el backend, asegurando una experiencia de usuario responsiva y persistencia de datos.
*   **Solución Implementada:** Se utilizó la biblioteca `@dnd-kit/core` en el componente `KanbanBoard.tsx` para habilitar el arrastre y la colocación de tareas entre las diferentes columnas (estados).
    *   La lógica `onDragEnd` gestiona la actualización optimista del estado en el frontend para una respuesta inmediata, seguida de una llamada a la API del backend (`apiClientInstance.updateTask`) para persistir el cambio de estado de la tarea en la base de datos.
    *   Se implementó un manejo de errores robusto para revertir la interfaz de usuario a su estado anterior en caso de fallos en la actualización del backend, asegurando la consistencia de los datos.
*   **Impacto:** Mejora sustancial en la usabilidad del tablero Kanban, permitiendo a los usuarios gestionar tareas de forma intuitiva y eficiente, reflejando cambios en tiempo real.

### 6. Diseño Adaptativo: Responsividad del Sidebar

*   **Contexto:** La navegación lateral (sidebar) es un elemento clave en aplicaciones de escritorio, pero puede ocupar un espacio valioso en pantallas pequeñas, comprometiendo la experiencia del usuario.
*   **Desafío:** Crear un sidebar que ofrezca una navegación completa en escritorios, pero que se adapte elegantemente a dispositivos móviles, apareciendo como un menú hamburguesa que se despliega sobre el contenido principal.
*   **Solución Implementada:** En `MainLayout.tsx`, se implementó una combinación de clases de Tailwind CSS y estado de React para controlar la visibilidad y el posicionamiento del sidebar:
    *   En pantallas grandes (`md`), el sidebar es siempre visible (`md:relative md:translate-x-0`).
    *   En pantallas pequeñas, se oculta por defecto (`-translate-x-full`) y se revela con un botón flotante (`Bars3Icon`) que activa un estado (`isSidebarOpen`), aplicando `translate-x-0`.
    *   Se añadió un overlay semitransparente (`bg-black bg-opacity-50`) que cubre el contenido principal cuando el sidebar está abierto en móviles, mejorando el enfoque y la usabilidad.
*   **Impacto:** Optimización del espacio en pantalla y mejora significativa de la experiencia de navegación en dispositivos móviles, manteniendo la funcionalidad completa en todas las resoluciones.

### 7. Profundización en la Implementación del Backend (NestJS Services)

*   **Contexto:** Más allá de la arquitectura de microservicios, la robustez del backend reside en la implementación detallada de sus servicios, incluyendo la validación de datos, la gestión de la persistencia y la seguridad.
*   **Desafío:** Desarrollar endpoints API seguros y eficientes que manejen la lógica de negocio para usuarios, tareas y proyectos, interactuando con la base de datos y validando las entradas.
*   **Solución Implementada:**
    *   **Validación de Datos:** Se utilizó `class-validator` y `Zod` para asegurar que los DTOs (Data Transfer Objects) de entrada cumplan con esquemas predefinidos. Esto previene datos malformados o maliciosos, mejorando la seguridad y la estabilidad de la aplicación. Por ejemplo, en los DTOs para la creación o actualización de tareas y proyectos, se definen reglas estrictas sobre el tipo, formato y contenido de los campos.
    *   **Manejo de Errores Centralizado:** NestJS facilita un manejo de excepciones global mediante "Exception Filters". Esto permite interceptar errores en toda la aplicación y transformarlos en respuestas HTTP uniformes y amigables para el cliente, evitando la exposición de detalles internos del servidor.
    *   **Interacción con la Base de Datos (TypeORM):** Se empleó TypeORM para la gestión de la base de datos PostgreSQL. Esto permitió un desarrollo rápido de modelos de datos (entidades) y repositorios, facilitando las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de manera tipada y segura. Las relaciones entre entidades (ej. tareas con usuarios asignados, proyectos con miembros) se gestionaron eficientemente a través de decoradores de TypeORM.
    *   **Seguridad y Autenticación (JWT):** El `auth-service` implementa un flujo de autenticación basado en JSON Web Tokens (JWT). Se generaron tokens de acceso y refresco para manejar sesiones de usuario de forma segura. La implementación incluyó estrategias de Passport.js para la autenticación y guardias de ruta para la autorización basada en roles (administrador vs. usuario estándar), protegiendo los endpoints sensibles.
*   **Impacto:** Un backend robusto, seguro y escalable, capaz de manejar la lógica de negocio compleja de la aplicación de gestión de tareas, con una alta cohesión en el código y bajo acoplamiento entre módulos.

### 8. Orquestación del Entorno de Desarrollo: Uso de Docker Compose

*   **Contexto:** Dada la arquitectura de microservicios con múltiples componentes (frontend, servicios de backend, base de datos PostgreSQL, y Redis para caché/sesiones), la configuración y el levantamiento manual de cada servicio individualmente sería un proceso tedioso y propenso a errores, especialmente para nuevos desarrolladores o en entornos de CI/CD.
*   **Desafío:** Proveer un entorno de desarrollo consistente, reproducible y de fácil configuración que permitiera a los desarrolladores iniciar todos los servicios necesarios con un único comando, minimizando las dependencias de configuración local y los conflictos de versiones.
*   **Solución Implementada:** Se optó por Docker Compose como la herramienta principal para la orquestación del entorno de desarrollo.
    *   El archivo `docker-compose.yml` define los servicios (`frontend`, `auth-service`, `task-service`, `postgres`, `redis`), sus dependencias, los puertos de exposición, volúmenes de datos y variables de entorno.
    *   Esto permite que cada servicio se ejecute en su propio contenedor aislado, replicando un entorno de producción, pero optimizado para el desarrollo local (ej., hot-reloading para el frontend, reinicio automático para los microservicios).
    *   La persistencia de datos para PostgreSQL se gestiona mediante volúmenes, asegurando que los datos no se pierdan al detener o reiniciar los contenedores.
*   **Impacto:** Simplificación drástica del proceso de setup del proyecto, garantizando que todos los desarrolladores trabajen en un entorno idéntico, reduciendo los errores de "funciona en mi máquina" y facilitando la integración continua y el despliegue. Mejora la eficiencia del equipo al eliminar la fricción en la configuración inicial y el mantenimiento del entorno.

Este análisis extendido proporciona una visión aún más completa de las decisiones técnicas y los desafíos superados, resaltando las complejidades y soluciones implementadas en el desarrollo full-stack de este proyecto. 