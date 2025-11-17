# Team Task Management System

A production-ready mono-repository that delivers a role-aware Team Task Management platform with a Django REST Framework backend and a React 19 + TypeScript frontend.

## Repository structure

```
project-root/
├─ backend/
│  ├─ manage.py
│  ├─ config/
│  ├─ core/
│  ├─ users/
│  ├─ tasks/
│  ├─ requirements.txt
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  └─ .env.example
├─ frontend/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ vite.config.ts
│  ├─ index.html
│  ├─ src/
│  └─ .env.example
└─ README.md
```

---

## Backend (Django + DRF + PostgreSQL)

### Features

- PostgreSQL-first configuration powered by `python-decouple` and `.env` files.
- Custom `User` model with role-based access (Admin, Manager, Member) enforced through DRF permissions.
- JWT authentication with SimpleJWT including register, login, refresh, and logout endpoints.
- Task management APIs with CRUD, assignment, RBAC-driven filtering, and status transitions.
- Admin-only user management with CRUD endpoints and role assignments.
- Comprehensive Docker setup (backend + Postgres) for local or cloud deployments.
- Unit tests that validate key domain rules.

### Environment variables

Duplicate `backend/.env.example` to `.env` and adjust as needed:

```
DJANGO_SECRET_KEY=super-secret
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=team_tasks
POSTGRES_USER=team_tasks
POSTGRES_PASSWORD=team_tasks
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
ACCESS_TOKEN_MINUTES=30
REFRESH_TOKEN_DAYS=7
```

### Local development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Run tests:

```bash
python manage.py test
```

### Dockerized backend

```bash
cd backend
cp .env.example .env
docker compose up --build
```

This brings up Postgres and the backend on `http://localhost:8000`.

---

## Frontend (React 19 + TypeScript + Vite)

### Features

- React Router v7 powered routing with guarded layouts and role-based redirects.
- Zustand store for token persistence (localStorage) and user state.
- React Query hooks encapsulating task and user APIs, including assignment mutations.
- Axios client with interceptors for JWT injection and automatic logout on 401s.
- TailwindCSS-driven responsive UI with dark/light theme switcher.
- Complete module coverage: authentication, dashboard analytics, tasks CRUD, role-aware actions, and admin user management.

### Environment variables

Duplicate `frontend/.env.example` to `.env` and point the API URL to your backend:

```
VITE_API_URL=http://localhost:8000/api/
```

### Local development

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies API calls directly to the backend URL specified in `.env`.

### Production build

```bash
npm run build
npm run preview
```

The optimized assets in `frontend/dist` can be hosted by any static file server or CDN.

---

## Deployment notes

- **Backend**: Build the Docker image found in `backend/Dockerfile` and run migrations before scaling app containers. Ensure environment variables for PostgreSQL and JWT lifetimes are provided.
- **Database**: Use a managed PostgreSQL instance and update the `POSTGRES_*` variables accordingly.
- **Frontend**: Deploy the Vite build output to your preferred CDN or integrate it into the Django static pipeline if desired. Update `VITE_API_URL` for the production API endpoint before building.

---

## Useful commands

| Purpose | Command |
| --- | --- |
| Run Django tests | `cd backend && python manage.py test` |
| Start backend locally | `cd backend && python manage.py runserver` |
| Start backend via Docker | `cd backend && docker compose up --build` |
| Start frontend dev server | `cd frontend && npm run dev` |
| Build frontend | `cd frontend && npm run build` |

---

## API quick reference

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/users/` (Admin)
- `GET /api/users/options/` (Manager/Admin – lightweight directory for assignments)
- `GET /api/users/me/`
- `GET /api/tasks/?status=&assigned_to=`
- `POST /api/tasks/{id}/assign/` (Manager/Admin)

Each endpoint requires the `Authorization: Bearer <token>` header except `register` and `login`.

---

## Testing strategy

- Backend unit and API tests cover user role helpers and task creation rules.
- Frontend components rely on React Query for caching and use optimistic UX with inline loaders/errors.

---

## Extensibility

- Additional modules can plug into the DRF router defined in `config/routers.py`.
- The frontend uses a centralized Axios client and modular hooks, making it straightforward to extend queries or add new stores.

