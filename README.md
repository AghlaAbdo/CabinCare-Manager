# CabinCare Manager

A full-stack application for managing cabin properties and maintenance tasks. Track cabins, log maintenance tasks, and monitor maintenance status through an intuitive dashboard.

## Quick Start Guide

Prerequisites:
- Docker and Docker Compose
- Git

**Live Preview**: You can view a live deployment at http://167.71.6.238:3000/

### Local Setup

Steps:
1. Clone the repository
   ```bash
   git clone git@github.com:AghlaAbdo/CabinCare-Manager.git
   cd CabinCare-Manager
   ```

2. Set up environment files

   **Root directory (.env). Example**:
   ```
   DB_USER=cabincare
   DB_PASSWORD=password
   DB_NAME=cabincare_db
   ```

   **Backend directory (backend/.env). Example**:
   ```
   NODE_ENV=development
   API_PORT=3001
   DATABASE_URL=postgresql://cabincare:password@postgres:5432/cabincare_db
   ```

   **Frontend directory (frontend/.env.local). Example**:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. Run the setup script

    ```bash
   chmod +x setup.sh
   ```

   **Production mode**:
   ```bash
   ./setup.sh
   ```

   **Development mode** (with hot-reload):
   ```bash
   ./setup.sh dev
   ```

4. Open the app
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/api

Stop services:
```bash
docker-compose down
```

## API Documentation

Base URL: `http://localhost:3001/api`

Cabins:
- POST `/api/cabins`
  - Body: `{ "name": string, "location": string, "description": string }`
  - Creates a cabin.
- GET `/api/cabins`
  - Returns all cabins with their tasks.
- GET `/api/cabins/summary`
  - Returns cabins with counts of pending tasks by priority.
  - Response item: `{ id, name, location, description, pendingHighPriority, pendingMediumPriority, pendingLowPriority, totalPendingTasks }`
- GET `/api/cabins/:id`
  - Returns a cabin with all its tasks.
  - Validates `id` as UUID.

Maintenance Tasks:
- POST `/api/tasks`
  - Body: `{ "cabinId": uuid, "description": string, "priority": "High"|"Medium"|"Low", "status": "Pending"|"In Progress"|"Complete" }`
  - Creates a task linked to a cabin.
- GET `/api/tasks`
  - Returns all tasks (latest first).
- GET `/api/tasks/cabin/:cabinId`
  - Returns tasks for a cabin (validates `cabinId`).
- PATCH `/api/tasks/:id`
  - Body: partial update `{ "priority"?: enum, "status"?: enum }`
- DELETE `/api/tasks/:id`
  - Deletes a task.

Errors:
- 400 Bad Request: invalid UUID or bad input
- 404 Not Found: cabin/task not found
- 500 Internal Server Error: unexpected failures

## Architecture

### Technology Stack
- **Frontend**: Next.js, TypeScript, and TailwindCSS
- **Backend**: NestJS - RESTful API with dependency injection
- **Database**: PostgreSQL - Relational data with normalized schema
- **Containerization**: Docker & Docker Compose - Isolated services with networking

### Component Interaction

```
User Browser
    ↓
Next.js Frontend (Port 3000)
    ├── React Components
    ├── API Client Layer
    ↓
NestJS Backend (Port 3001)
    ├── Controllers (Route handlers)
    ├── Services (Business logic)
    ├── Repositories (Data access)
    ↓
PostgreSQL Database (Port 5432)
    └── Cabins, Tasks
```

**Data Flow**:
1. User interacts with Next.js frontend
2. Frontend makes HTTP requests to NestJS API
3. Backend validates, processes, and queries PostgreSQL
4. Results returned to frontend for rendering

## Design Decisions

### 1. Efficient Dashboard Summary Query
Instead of querying cabins, tasks separately and joining in application code, the dashboard summary uses a **single optimized SQL query with aggregations**:
- Joins `cabins` with `tasks` using LEFT JOIN (preserves cabins with no tasks)
- Groups by cabin and uses `COUNT()` and `CASE WHEN` for conditional aggregations
- Avoids N+1 query problem and reduces database round trips
- Result: Dashboard loads instantly even with thousands of tasks

### 2. Multi-Stage Docker Builds
Dockerfiles use multi-stage builds with separate `development` and `production` targets:
- **Development stage**: Installs all dependencies and runs with hot-reload (npm run dev)
- **Production stage**: Builds optimized bundles and runs lightweight production server
- Single Dockerfile supports both modes via `docker-compose.dev.yml` and `docker-compose.prod.yml`
- Reduces production image size by excluding dev dependencies
- Enables fast local development without rebuilding images

### 3. Docker Service Isolation
Each component (frontend, backend, database) runs in its own container:
- Services communicate via Docker Compose networking
- Simplifies local development and production deployment
- Easier debugging and scaling individual components

## Project Structure

```
CabinCare-Manager/
├── setup.sh                    # Automated setup script
├── docker-compose.yml          # Base service orchestration
├── docker-compose.dev.yml      # Development overrides (hot-reload)
├── docker-compose.prod.yml     # Production overrides (optimized build)
├── README.md
├── backend/
│   ├── Dockerfile              # Multi-stage build (dev & prod targets)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── cabins/             # Cabin module
│   │   │   ├── cabins.controller.ts
│   │   │   ├── cabins.service.ts
│   │   │   ├── cabin.entity.ts
│   │   │   └── dto/
│   │   ├── maintenance-tasks/  # Task module
│   │   │   ├── maintenance-tasks.controller.ts
│   │   │   ├── maintenance-tasks.service.ts
│   │   │   ├── maintenance-task.entity.ts
│   │   │   └── dto/
│   │   └── common/
│   │       └── pipes/validate-uuid.pipe.ts
│   ├── .env                    # Backend environment config
│   └── package.json
├── frontend/
│   ├── Dockerfile              # Multi-stage build (dev & prod targets)
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Redirect to dashboard
│   │   └── dashboard/
│   │       └── page.tsx        # Main dashboard page
│   ├── components/             # Reusable React components
│   │   ├── CreateCabinModal.tsx
│   │   ├── CreateTaskModal.tsx
│   │   ├── CabinDetailsModal.tsx
│   │   └── EditTaskModal.tsx
│   ├── .env.local              # Frontend environment config
│   └── package.json
└── data/                       # PostgreSQL volume (created on first run)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change ports in `docker-compose.yml` or stop conflicting services |
| Database connection failed | Ensure PostgreSQL is running: `docker ps` |
| Frontend can't reach API | Verify backend is accessible at `http://localhost:3001` |
