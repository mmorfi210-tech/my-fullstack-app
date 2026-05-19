# Full-Stack secure Portal (React + FastAPI + PostgreSQL)

A premium, containerized full-stack web application featuring standard JWT-based email/password authentication, a FastAPI backend, PostgreSQL storage with Alembic migrations, modern glassmorphic responsive UI, Vitest/Pytest suites, and a GitHub Actions CI/CD configuration.

## Features

- **React Frontend**: Built using Vite and styled with a custom vanilla CSS system. Displays a glassmorphic dashboard, responsive layout grids, stats summaries, and CRUD list operations.
- **Python FastAPI Backend**: REST API with JWT security, secure bcrypt password hashing, and clean SQLAlchemy model relationships.
- **PostgreSQL Database**: Persistent relational storage configured with Alembic migration histories.
- **Dockerized Environment**: Ready for local orchestrations with Docker Compose.
- **Robust Testing**: 100% test coverage for core components (using Pytest for Python, Vitest and Happy-Dom for React).
- **CI/CD Integration**: Pre-configured GitHub Actions pipeline for testing and Render automated webhook deployments.

---

## Folder Structure

```
├── backend/                  # Python FastAPI application
│   ├── app/                  # Main source package (models, routes, auth)
│   ├── alembic/              # Database migration revisions
│   ├── tests/                # Pytest suites
│   ├── Dockerfile            # Container configuration
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React client SPA (Vite)
│   ├── src/                  # Components, context state, custom styles, tests
│   ├── index.html            # Entry layout
│   ├── nginx.conf            # Nginx server redirection mapping
│   ├── Dockerfile            # Container configuration
│   └── package.json          # Node dependencies
├── docker-compose.yml        # Orchestration services definition
├── render.yaml               # Render Infrastructure-as-Code blueprint
└── README.md                 # Documentation
```

---

## Local Development (Without Docker)

### 1. Backend Setup
1. Navigate to `/backend`.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/api/docs`.

### 2. Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

---

## Running with Docker Compose

To build and run all services (FastAPI, Nginx React frontend, and PostgreSQL) together:

```bash
docker-compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **FastAPI Documentation**: `http://localhost:8000/api/docs`
- **PostgreSQL Port**: `5432`

---

## Database Migrations (Alembic)

To apply new migrations to your database:
```bash
cd backend
alembic upgrade head
```

To create a new migration script automatically:
```bash
alembic revision --autogenerate -m "describe changes"
```

---

## Executing Automated Tests

### Python Backend Tests
Run the pytest suite:
```bash
cd backend
pytest
```
*(Tests run against an in-memory SQLite database configuration to ensure separation of environments)*

### React Frontend Tests
Run Vitest:
```bash
cd frontend
npm run test
```
*(Tests execute in the virtual happy-dom browser environment)*

---

## Deployment (Render)

This project contains a `render.yaml` blueprint. To deploy:
1. Push this codebase to a GitHub/GitLab repository.
2. In the **Render Dashboard**, select **Blueprints** -> **New Blueprint Instance**.
3. Link your repository. Render will automatically configure the database, build containers, and set up variables.
4. Add the generated webhook URLs to your GitHub repository secrets (`RENDER_DEPLOY_HOOK_BACKEND` and `RENDER_DEPLOY_HOOK_FRONTEND`) to trigger automatic redeployments on push.
