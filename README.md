# Task Dashboard – Frontend Developer Task

A scalable web application with authentication and a dashboard, built as part of the Frontend Developer Intern assignment. This project demonstrates modern frontend engineering, backend integration, security best practices, and a production-ready structure.

---

## Overview

This project is a full-stack task management web app built with Next.js (TypeScript), using Next.js API routes as a lightweight backend and MongoDB as the database. It implements JWT-based authentication, a protected dashboard, and CRUD operations on a `Task` entity, along with search and filter functionality.

---

## Features (Mapped to PDF Requirements)

### Frontend (Primary Focus)
- Built with Next.js + React + TypeScript using the App Router and file-based routing.
- Fully responsive UI implemented with Tailwind CSS.
- Authentication pages:
  - `/register` – User signup form with validation.
  - `/login` – User login form with validation.
- Client-side validation using native HTML constraints (required, minLength, email type, etc.).
- Server-side validation using Zod in API route handlers.

### Basic Backend (Supportive)
- Lightweight backend implemented using Next.js API route handlers (`src/app/api/...`) within the same repository.
- REST-style APIs:
  - `POST /api/auth/register` – User signup
  - `POST /api/auth/login` – User login
  - `POST /api/auth/logout` – Logout
  - `GET /api/me` – Get profile
  - `PUT /api/me` – Update profile
  - `GET /api/tasks` – List tasks (optional filters)
  - `POST /api/tasks` – Create task
  - `PUT /api/tasks/:id` – Update task
  - `DELETE /api/tasks/:id` – Delete task
- MongoDB + Mongoose used for persistent storage of users and tasks.

### Dashboard Features
- `/dashboard` is a protected route; only logged-in users can access it (guarded via middleware + JWT cookie).
- Dashboard shows:
  - Current user profile (name, email) fetched from `/api/me`.
  - Task list owned by the logged-in user from `/api/tasks`.
- Task CRUD:
  - Create task (title, optional description).
  - Update task status (`todo`, `in_progress`, `done`).
  - Delete task.
- Search and filter UI:
  - Text search by task title (`q` query param).
  - Status filter (`status` query param).
- Logout implemented via `POST /api/auth/logout` to clear JWT cookie and redirect to login.

### Security & Scalability
- Password hashing using bcrypt before storing in MongoDB.
- JWT-based authentication:
  - On login/register, a signed JWT is stored in an httpOnly cookie.
  - Protected routes and APIs read this cookie for user identification.
- Auth middleware / helpers:
  - Middleware protects routes (such as `/dashboard`) using JWT cookie verification.
  - Server-side helper extracts and verifies JWT from cookies for API routes.
- Error handling and validation:
  - Zod schemas validate request bodies for auth and task endpoints.
  - JSON error responses with appropriate HTTP status codes.
- Scalable project structure allows easy extension of entities and features.

---

## Tech Stack
- Framework: Next.js (App Router) + React
- Language: TypeScript
- Styling: Tailwind CSS
- Backend: Next.js API route handlers
- Database: MongoDB (via Mongoose)
- Auth: JWT (jsonwebtoken) + httpOnly cookies
- Validation: Zod
- Package Manager: npm

---

## Project Structure

src/
├── app/
│   ├── api/ # Backend API routes
│   │   ├── auth/
│   │   ├── me/
│   │   └── tasks/
│   ├── dashboard/ # Protected dashboard
│   ├── login/
│   ├── register/
│   └── page.tsx
├── lib/ # Utilities
│   ├── db.ts
│   ├── jwt.ts
│   └── auth.ts
├── models/ # Mongoose models
│   ├── User.ts
│   └── Task.ts
└── middleware.ts # Route protection

- `models/` – MongoDB models for `User` and `Task`.
- `lib/db.ts` – Shared MongoDB connection helper.
- `lib/jwt.ts` – JWT sign/verify helpers.
- `lib/auth.ts` – Helpers for reading current user from cookies.
- `app/api/...` – All backend endpoints (auth, profile, tasks).
- `middleware.ts` – Protects `/dashboard` using JWT cookie.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local instance or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone <https://github.com/Saadsid007/Task-Dashboard---Frontend-Developer-Task.git>
cd task-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/task_dashboard
# or your Atlas URI:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task_dashboard
JWT_SECRET=your_strong_random_secret_here
```
Use a strong secret (e.g., `crypto.randomBytes(32).toString("hex")` to generate).

### 4. Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

---

## API Documentation

### Authentication

#### POST /api/auth/register
- Description: Register a new user.
- Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- Response: `201 Created` + `user` object; sets `token` httpOnly cookie.

#### POST /api/auth/login
- Description: Log in an existing user.
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Response: `200 OK` + `user` object; sets `token` httpOnly cookie.

#### POST /api/auth/logout
- Description: Log the user out by clearing the JWT cookie.
- Response: `200 OK`, `{ "ok": true }`

---

### User Profile

#### GET /api/me
- Description: Get the currently logged-in user’s profile.
- Auth: Requires valid `token` cookie.
- Response:
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### PUT /api/me
- Description: Update profile fields (e.g., `name`).
- Body:
```json
{ "name": "Updated Name" }
```
- Response: `200 OK` + updated `user`.

---

### Tasks

#### GET /api/tasks?q=&status=
- Description: Get all tasks for the logged-in user, with optional search and filter.
- Query params:
  - `q` (optional): text search on title.
  - `status` (optional): one of `todo`, `in_progress`, `done`.
- Response: list of tasks owned by the logged-in user.

#### POST /api/tasks
- Description: Create a new task.
- Body example:
```json
{
  "title": "My first task",
  "description": "Optional description",
  "status": "todo"
}
```
- Response: `201 Created` + `task`.

#### PUT /api/tasks/:id
- Description: Update task fields such as status, title, or description.
- Body example:
```json
{ "status": "done" }
```
- Response: `200 OK` + updated `task`.

#### DELETE /api/tasks/:id
- Description: Delete a task by ID.
- Response: `200 OK`, `{ "ok": true }`

---

## How This Satisfies the Deliverables
This project meets the deliverable requirements:
1. Frontend (React/Next.js) + lightweight backend (Next.js API routes) in a single GitHub repo.
2. Functional authentication (register/login/logout) using JWT stored in httpOnly cookies.
3. Protected dashboard with CRUD-enabled `Task` entity and search/filter UI.
4. API documentation included in README; you can export to Postman collection from these details.
5. Scaling & security suggestions provided below.

---

## Scaling for Production
### Infrastructure
- Deploy the Next.js app (frontend + API routes) on Vercel, AWS, or Render.
- Use MongoDB Atlas with replica sets, backups, and proper indexes.
- Store environment variables securely in the hosting provider.

### Security
- Use HTTPS everywhere; set `secure: true` on cookies in production.
- Add rate limiting to auth endpoints; consider bot protection.
- Add input sanitization, logging, and monitoring.

### Performance & Separation
- Use Next.js optimizations (caching, ISR).
- For scaling, move API logic to a dedicated service (Node.js/Express) and maintain the same REST contract; keep frontend and backend independently deployable.

---
