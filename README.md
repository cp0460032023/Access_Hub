# Access Hub

Sistema fullstack de gestión de usuarios con control de acceso basado en roles (RBAC).

**Frontend:** https://access-hub-elma.onrender.com  
**Backend API:** https://access-hub-backend-neyi.onrender.com

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 · Standalone Components · Reactive Forms |
| Backend | NestJS 11 · TypeORM · Passport JWT · CASL.js · bcrypt |
| Base de datos | PostgreSQL 16 |
| DevOps | Docker · Docker Compose · Render.com |

---

## Roles y permisos

| Acción | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| Ver lista de usuarios | ✅ | ✅ | ❌ |
| Crear usuario | ✅ | ❌ | ❌ |
| Editar usuario | ✅ | ✅ | ❌ |
| Eliminar usuario | ✅ | ❌ | ❌ |
| Editar perfil propio | ✅ | ✅ | ✅ |
| Cambiar contraseña | ✅ | ✅ | ✅ |

---

## Endpoints de la API

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/login` | No | Iniciar sesión y obtener JWT |
| GET | `/users` | JWT | Listar usuarios (paginado, con búsqueda y filtro) |
| GET | `/users/:id` | JWT | Obtener usuario por ID |
| POST | `/users` | JWT | Crear usuario (solo admin) |
| PATCH | `/users/:id` | JWT | Actualizar usuario |
| PATCH | `/users/:id/password` | JWT | Cambiar contraseña |
| DELETE | `/users/:id` | JWT | Eliminar usuario (soft delete, solo admin) |

---

## Instalación con Docker

```bash
git clone https://github.com/cp0460032023/Access_Hub.git
cd Access_Hub
docker-compose up --build
```

Servicios disponibles:
- Frontend: http://localhost
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

## Instalación sin Docker

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL (default: 5432) |
| `DB_USERNAME` | Usuario de la BD |
| `DB_PASSWORD` | Contraseña de la BD |
| `DB_NAME` | Nombre de la BD |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Expiración del token (default: 24h) |
| `PORT` | Puerto del backend (default: 3000) |

---

## Estructura del proyecto

```
Access_Hub/
├── docker-compose.yml
├── backend/               # NestJS API
│   └── src/
│       ├── auth/          # Autenticación JWT
│       ├── users/         # CRUD de usuarios
│       └── casl/          # Autorización por roles
└── frontend/              # Angular 21
    └── src/app/
        ├── core/          # Guards, interceptores, servicios
        ├── modules/       # Auth, Users, Profile
        └── shared/        # Dashboard, Toast, Navbar
```
