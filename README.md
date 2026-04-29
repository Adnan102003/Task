# ⚡ TaskFlow — Full Stack Task Manager

A full-stack task management web app built with **React**, **Node.js/Express**, and **MongoDB**.

## 🚀 Features
- ✅ User Signup & Login with JWT Authentication
- ✅ Protected routes (only logged-in users can access the dashboard)
- ✅ Full CRUD for tasks (Create, Read, Update, Delete)
- ✅ Filter tasks by status (To Do / In Progress / Done)
- ✅ Priority levels (Low / Medium / High)
- ✅ Stats dashboard
- ✅ Responsive dark UI

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure
```
taskflow/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth (signup, login, me)
│   │   └── tasks.js           # /api/tasks (CRUD)
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js       # Axios instance with JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   └── index.css
    └── .env.example
```

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow
JWT_SECRET=pick_any_long_random_string_here
CLIENT_URL=http://localhost:5173
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open http://localhost:5173 🎉

---

## 🌐 Deployment

### Step 1 — MongoDB Atlas (Free)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Create free account
2. Create a **Free Cluster** (M0)
3. Under **Database Access** → Add user with password
4. Under **Network Access** → Allow access from anywhere (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy the URI
6. Replace `<password>` in the URI with your DB user's password

### Step 2 — Deploy Backend on Render (Free)
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo → select `backend` as the root directory
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add **Environment Variables**:
   - `MONGO_URI` = your Atlas URI
   - `JWT_SECRET` = your secret
   - `CLIENT_URL` = your Vercel URL (add after deploying frontend)
6. Deploy → copy your Render URL (e.g. `https://taskflow-api.onrender.com`)

### Step 3 — Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add **Environment Variable**:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
4. Deploy → get your Vercel URL
5. Go back to Render → update `CLIENT_URL` to your Vercel URL → redeploy

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/tasks | Yes | Get all tasks |
| POST | /api/tasks | Yes | Create task |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |

---

## 👤 Author
Made with ❤️ for the Full Stack Developer Internship Assignment
