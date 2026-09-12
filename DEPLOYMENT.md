# 🚀 GoalBeat AI — Production Deployment Guide (PostgreSQL Edition)

This project has been fully migrated to **PostgreSQL** (`pg` driver).
You can now host the database directly inside **Render** (or use any cloud PostgreSQL like Supabase, Neon, or Aiven PostgreSQL).

---

## 📋 The 4 Deployment Parts

1. **Part 1: Database** — Render PostgreSQL (or Supabase / Neon / Aiven)
2. **Part 2: Backend** — Render Web Service (Node.js/Express + Socket.IO)
3. **Part 3: Frontend** — Vercel (Vite + React SPA)
4. **Part 4: Linking & Verification** — Final environment connection and live score tests

---

## Part 1: Create PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** (top right) ➔ **PostgreSQL**.
3. Configure the database:
   - **Name**: `goalbeat-db`
   - **Database**: `goalbeat_db`
   - **User**: `goalbeat_user`
   - **Region**: `Oregon (US West)` *(Pick the same region as your web service)*
   - **Plan**: `Free`
4. Click **Create Database**.
5. Once created and status is **Available**:
   - Scroll down to **Connections**.
   - Copy the **Internal Database URL** (e.g. `postgres://goalbeat_user:password@dpg-xxx-a:5432/goalbeat_db`).
   *(Note: If your backend and DB are in the same Render region, the Internal Database URL is faster and completely free of bandwidth limits).*
   - If you ever connect from outside Render (e.g., your local machine), use the **External Database URL**.

*(Alternative: You can also use [Supabase](https://supabase.com) or [Neon.tech](https://neon.tech) — just copy their connection string).*

---

## Part 2: Deploy Backend to Render

### 2.1 Create the Web Service
1. In [Render Dashboard](https://dashboard.render.com), click **New +** ➔ **Web Service**.
2. Select your repository: **`dataqubit404/GoalBeatAI`**.
3. Configure settings:
   - **Name**: `goalbeat-ai-backend`
   - **Region**: `Oregon (US West)` *(Same as DB)*
   - **Branch**: `main`
   - **Root Directory**: leave empty
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: `Free`

### 2.2 Configure Environment Variables
Under **Environment Variables**, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `3001` | Server port |
| `DATABASE_URL` | *(Paste your Render Internal/External PostgreSQL URL)* | Starts with `postgres://` or `postgresql://` |
| `API_FOOTBALL_KEY` | *(Your API key)* | From [api-sports.io](https://dashboard.api-football.com) |
| `JWT_SECRET` | *(Click "Generate" or enter 32+ random characters)* | User session signing |
| `FRONTEND_URL` | `https://goalbeat-ai.vercel.app` | *(Can update once Vercel gives you your URL)* |

*(Note: If you use Render's Blueprint with `render.yaml`, Render will even automatically link the database to `DATABASE_URL` for you!)*

### 2.3 Deploy & Verify
1. Click **Create Web Service**.
2. Wait for the deploy log to show:
   ```
   ✅ PostgreSQL Database initialized
   ⚽ GoalBeat AI Backend running on port 3001
   Mode: production
   Health: http://localhost:3001/health
   ```
3. Copy your Render Web Service URL (e.g. `https://goalbeat-ai-backend.onrender.com`).
4. Test health in your browser: `https://your-backend.onrender.com/health` ➔ returns `{"status":"ok"}`.

---

## Part 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. Select `dataqubit404/GoalBeatAI` and click **Import**.
4. In the configuration screen:
   - Next to **Root Directory**, click **Edit** and choose the **`frontend`** directory.
   - **Framework Preset**: `Vite` (auto-detected).
5. Expand the **Environment Variables** section and add:

| Key | Value | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://YOUR-RENDER-BACKEND.onrender.com/api` | `https://goalbeat-ai-backend.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://YOUR-RENDER-BACKEND.onrender.com` | `https://goalbeat-ai-backend.onrender.com` |

> [!IMPORTANT]
> Include `/api` at the end of `VITE_API_URL`, but **do not** include `/api` on `VITE_SOCKET_URL`.

6. Click **Deploy**. Vercel will build and launch your site in ~30 seconds.
7. Copy your live Vercel URL (e.g., `https://goalbeat-ai-xyz.vercel.app`).

---

## Part 4: Final Link & Verification

1. **Update Render CORS**:
   - Go to [Render Dashboard](https://dashboard.render.com) ➔ `goalbeat-ai-backend` ➔ **Environment**.
   - Set `FRONTEND_URL` = your live Vercel URL (e.g. `https://goalbeat-ai-xyz.vercel.app` — no trailing slash).
   - Render will auto-restart with CORS active.
2. **Open Your App**:
   - Open your Vercel URL in your browser.
   - Open Developer Tools (`F12` ➔ Console tab): you should see `📡 Connected to Live Scores`.
3. **Test Database & Authentication**:
   - Click **Get Started** or **Sign In** ➔ **Register**.
   - Create a test account.
   - You will be registered and logged in immediately — verifying that your **Render PostgreSQL** tables (`users`, `favorite_leagues`, etc.) are working!

---

## 🛠️ Local Testing (Optional)
To test your PostgreSQL connection from your terminal before deploying:
```bash
cd backend
DATABASE_URL="your-postgresql-url" node scripts/test-db.js
```
