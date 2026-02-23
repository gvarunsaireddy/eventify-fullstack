# 🚀 Eventify — Event Management System

A full-stack event management platform built with **React**, **Node.js/Express**, and **MongoDB Atlas**.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## ✨ Features

### Users
- Register & login with JWT authentication
- Browse events with search & category filters
- View event details with registration
- Personal dashboard showing registered events
- Unregister from events

### Admins
- Full event CRUD (Create, Read, Update, Delete)
- Admin dashboard with stats overview
- View event registrations and attendee details

### Technical
- 🔐 JWT authentication with bcrypt password hashing
- 🛡️ Role-based access control (User / Admin)
- 📱 Fully responsive dark-themed UI
- ✨ Glassmorphism design with smooth animations
- 🔄 Real-time toast notifications
- 🛡️ Protected routes with auth guards
- 🚀 Deployment-ready (Vercel + Render)

## 📁 Project Structure

```
├── server/                 # Backend API
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, role, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── seed.js             # Database seeder
│   └── server.js           # Entry point
│
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service (Axios)
│   │   ├── App.jsx         # Root with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── vite.config.js
│   └── vercel.json
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

**Server `.env`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/eventify
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

**Client `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional)
```bash
cd server
npm run seed
```
Creates demo accounts:
| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@eventify.com | admin123  |
| User  | john@example.com   | user123   |

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🚀 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import in Vercel, set `VITE_API_URL` env var
3. Deploy (vercel.json handles SPA rewrites)

### Backend → Render
1. Push `server/` to GitHub
2. Create Web Service on Render
3. Set environment variables (MONGO_URI, JWT_SECRET, CLIENT_URL)
4. Deploy

## 📡 API Endpoints

| Method | Endpoint                    | Access  | Description              |
|--------|-----------------------------|---------|--------------------------|
| POST   | /api/auth/register          | Public  | Register user            |
| POST   | /api/auth/login             | Public  | Login user               |
| GET    | /api/auth/me                | Private | Get current user         |
| GET    | /api/events                 | Public  | List events              |
| GET    | /api/events/:id             | Public  | Get single event         |
| POST   | /api/events                 | Admin   | Create event             |
| PUT    | /api/events/:id             | Admin   | Update event             |
| DELETE | /api/events/:id             | Admin   | Delete event             |
| POST   | /api/events/:id/register    | Private | Register for event       |
| DELETE | /api/events/:id/register    | Private | Unregister from event    |
| GET    | /api/events/:id/registrations | Admin | View event attendees     |
| GET    | /api/users/my-events        | Private | User's registered events |

## 📄 License

MIT License — free to use and modify.
