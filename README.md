# Expense Tracker with Analytics (MERN)

A full-stack expense tracker built with MongoDB, Express, React (Vite), and Node.js.

## Features

- User registration and login
- Bcrypt password hashing
- JWT auth with protected routes
- Add, edit, delete transactions
- Filter transactions by category
- Transaction history table
- Analytics dashboard with Chart.js:
  - Income vs expense
  - Monthly expense chart
  - Category-wise expense pie chart
- Responsive Tailwind CSS UI

## Project Structure

```text
expense-tracker/
  backend/
    config/db.js
    controllers/
    middleware/
    models/
    routes/
    server.js
  frontend/
    src/components/
    src/pages/
    src/App.jsx
    src/main.jsx
```

## Backend Setup

1. Create env file:
   - Copy `backend/.env.example` to `backend/.env`
2. Install dependencies:
   - `cd backend`
   - `npm install`
3. Run server:
   - `npm run dev`

## Frontend Setup

1. Create env file:
   - Copy `frontend/.env.example` to `frontend/.env`
2. Install dependencies:
   - `cd frontend`
   - `npm install`
3. Run app:
   - `npm run dev`

## Environment Variables

Backend (`backend/.env`):

- `PORT=5000`
- `MONGO_URI=<your_mongodb_connection_string>`
- `JWT_SECRET=<your_secret>`
- `CLIENT_URL=http://localhost:5173`

Frontend (`frontend/.env`):

- `VITE_API_URL=http://localhost:5000/api`

## Deployment Notes

### Backend on Render

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add env vars from `backend/.env.example`
- Update `CLIENT_URL` to your deployed frontend URL

### Frontend on Vercel

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Set env var `VITE_API_URL` to your deployed Render API URL, e.g.:
  - `https://your-render-app.onrender.com/api`

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Transactions (JWT required):

- `POST /api/transactions`
- `GET /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
