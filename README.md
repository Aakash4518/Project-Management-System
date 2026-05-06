# TaskFlow Pro

TaskFlow Pro is a production-style full-stack project and task management application built with `React + Vite`, `Tailwind CSS`, `Node.js`, `Express`, `MongoDB`, `Mongoose`, `JWT`, and `Socket.IO`.

It includes:

- Authentication with signup, login, logout, session persistence, and forgot-password UI
- Role-based access control for `admin`, `manager`, and `user`
- Analytics dashboard with KPI cards, charts, overdue tracking, and activity feed
- Project CRUD with search, status tracking, priority, and member assignment
- Task CRUD with assignees, due dates, priority, comments, and Kanban drag-and-drop
- Centralized validation, error handling, secure middleware, and scalable backend structure
- Dark/light mode, toast notifications, skeleton loaders, empty states, and responsive UI

## Structure

```text
backend/
frontend/
README.md
```

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the API:

```bash
npm run dev
```

5. Optional seed data:

```bash
npm run seed
```

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_URL` and `VITE_SOCKET_URL`
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Start the app:

```bash
npm run dev
```

## Demo Credentials

After seeding:

- Admin: `admin@taskflow.pro` / `Password123!`
- Manager: `manager@taskflow.pro` / `Password123!`
- User: `user@taskflow.pro` / `Password123!`

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`

### Users

- `GET /api/users/directory`
- `GET /api/users`
- `PATCH /api/users/:id`

## RBAC Rules

- Admin: full access to users, projects, and tasks
- Manager: can create and manage projects and tasks
- User: can view assigned work and update their own task status/comments only

Backend middleware enforces access independently of the frontend UI.

## Deployment Guide

### Backend

- Deploy to Render, Railway, or a VPS
- Provide environment variables from `backend/.env.example`
- Use MongoDB Atlas for the production database
- Set `CLIENT_URL` to the deployed frontend origin

### Frontend

- Deploy to Vercel or Netlify
- Set `VITE_API_URL` to the deployed backend `/api` base URL
- Set `VITE_SOCKET_URL` to the backend origin

## Notes

- The forgot-password flow currently exposes a preview token instead of sending email; connect it to your mail provider for production
- File upload and calendar/email integrations are scaffold-friendly extensions that can be added next through dedicated services
- I could not run installs or local verification in this environment because the shell sandbox was failing for most non-trivial commands
