# TaskFlow Pro

TaskFlow Pro is a full-stack project and task management application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT authentication, and Socket.IO.

The application is structured like a production handoff project: separated frontend and backend apps, environment-based configuration, protected API routes, role-based access control, reusable UI modules, validation middleware, centralized error handling, and seed data for local demos.

## Features

- Email/password authentication with JWT-protected sessions
- Role-based access for `admin`, `manager`, and `user`
- Dashboard KPIs, charts, overdue work, and recent activity
- Project CRUD with status, priority, members, and search
- Task CRUD with assignees, due dates, priority, comments, and Kanban drag-and-drop
- User directory and admin user management
- Socket.IO-ready backend and client setup for realtime updates
- Light/dark mode, toast feedback, loading states, empty states, and responsive layouts
- Secure backend defaults with Helmet, CORS, validation, and centralized error responses

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client |
| Backend | Node.js, Express, Mongoose, Socket.IO, JWT, bcryptjs |
| Database | MongoDB or MongoDB Atlas |
| Tooling | Nodemon, Vite, PostCSS, Autoprefixer |

## Project Structure

```text
.
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- socket/
|   |   |-- utils/
|   |   |-- validators/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- styles/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- .env.example
|   `-- package.json
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow-pro
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, use a strong `JWT_SECRET`, restrict `CLIENT_URL` to the deployed frontend origin, and use a managed MongoDB connection string.

## Local Development

Install all dependencies from the repository root:

```bash
npm run install:all
```

Start the backend API:

```bash
npm run dev:backend
```

Start the frontend app in another terminal:

```bash
npm run dev:frontend
```

Default local URLs:

- Frontend: `http://localhost:5173`

```bash
npm run seed
```

Demo credentials after seeding:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@taskflow.pro` | `Password123!` |
| Manager | `manager@taskflow.pro` | `Password123!` |
| User | `user@taskflow.pro` | `Password123!` |

## Available Scripts

Root scripts:

| Command | Description |
| --- | --- |
| `npm run install:all` | Install backend and frontend dependencies |
| `npm run dev:backend` | Start the Express API with Nodemon |
| `npm run dev:frontend` | Start the Vite development server |
| `npm run seed` | Seed demo data into MongoDB |

Backend scripts:

| Command | Description |
| --- | --- |
| `npm run dev --prefix backend` | Run the API in development mode |
| `npm start --prefix backend` | Run the API with Node |
| `npm run seed --prefix backend` | Seed the database |

Frontend scripts:

| Command | Description |
| --- | --- |
| `npm run dev --prefix frontend` | Run the Vite dev server |
| `npm run build --prefix frontend` | Create a production build |
| `npm run preview --prefix frontend` | Preview the production build locally |

## API Overview

All protected routes require an authenticated JWT session.

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard`

### Projects

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`

### Users

- `GET /api/users/directory`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

## Authorization Model

| Role | Access |
| --- | --- |
| Admin | Full access to users, projects, and tasks |
| Manager | Create and manage projects and tasks |
| User | View assigned work and update allowed task fields/comments |

Authorization is enforced by backend middleware. Frontend route guards and conditional UI should be treated as usability helpers, not security boundaries.

## Production Deployment

### Backend

1. Deploy the `backend` app to Render, Railway, Fly.io, a VPS, or another Node.js host.
2. Set all variables from `backend/.env.example` in the hosting provider.
3. Use MongoDB Atlas or another managed MongoDB service.
4. Set `CLIENT_URL` to the production frontend origin.
5. Run the backend with `npm start --prefix backend`.
6. Confirm `GET /api/health` returns a successful response.

### Frontend

1. Deploy the `frontend` app to Vercel, Netlify, Cloudflare Pages, or another static host.
2. Set `VITE_API_URL` to the deployed backend API URL, including `/api`.
3. Set `VITE_SOCKET_URL` to the deployed backend origin.
4. Build with `npm run build --prefix frontend`.
5. Serve the generated `frontend/dist` directory.

<<<<<<< HEAD
=======
## License
This project was developed as part of a technical assessment.
All rights reserved © 2026 Akash. Unauthorized use, copying, 
or distribution is not permitted.
