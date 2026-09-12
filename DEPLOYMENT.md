# 🚀 GoalBeat AI — Complete Production Deployment Guide

This guide gives you the exact, step-by-step instructions to deploy GoalBeat AI in 4 production parts:
1. **Part 1: Database** — Aiven MySQL (Managed Cloud Database with SSL)
2. **Part 2: Backend** — Render Web Service (Node.js/Express + Socket.IO)
3. **Part 3: Frontend** — Vercel (Vite + React SPA with edge routing)
4. **Part 4: Linking & Verification** — Final environment connection and live score tests

---

## 📋 Overview of What You Need
- A [GitHub account](https://github.com) where your code is pushed (`dataqubit404/GoalBeatAI`).
- An [Aiven.io](https://aiven.io) account (Free trial / Free credits available).
- A [Render.com](https://render.com) account (Free Web Service tier).
- A [Vercel.com](https://vercel.com) account (Free Hobby tier).
- An API Key from [API-Football (api-sports.io)](https://dashboard.api-football.com) or [RapidAPI](https://rapidapi.com).

---

## Part 1: Database Setup on Aiven (MySQL)

### 1.1 Create the MySQL Service
1. Log in to [Aiven Console](https://console.aiven.io/).
2. Click **Create Service**.
3. Select **MySQL**.
4. Choose cloud provider and region closest to your backend (e.g., **AWS Oregon** or **Google Cloud Oregon** matching Render's Oregon region).
5. Choose the **Free** tier (or Startup tier).
6. Give your service a name: `goalbeat-mysql`.
7. Click **Create Service** and wait 2–3 minutes until the status turns **Running**.

### 1.2 Copy Connection Credentials
In the service **Overview** tab:
1. Look at **Connection information**:
   - **Service URI**: e.g., `mysql://avnadmin:YOUR_PASSWORD@goalbeat-mysql-xyz.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED`
   - Or separate fields:
     - **Host**: `goalbeat-mysql-xyz.aivencloud.com`
     - **Port**: `12345`
     - **User**: `avnadmin`
     - **Password**: `(click show password and copy)`
     - **Database name**: `defaultdb`
2. **SSL Mode**: Aiven requires SSL by default. The backend has SSL preconfigured (`DB_SSL=true` and `DB_SSL_STRICT=false`).

---

## Part 2: Backend Deployment on Render

### 2.1 Create the Web Service
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository: `dataqubit404/GoalBeatAI`.
4. Configure the settings:
   - **Name**: `goalbeat-ai-backend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: leave empty or set to root (`.`)
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: `Free`

### 2.2 Configure Environment Variables
Under the **Environment Variables** section in Render, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode & SSL |
| `PORT` | `3001` | Server port |
| `DATABASE_URL` | `mysql://avnadmin:pass@host:port/defaultdb?ssl-mode=REQUIRED` | **Your full Aiven Service URI** |
| `DB_SSL` | `true` | Required for Aiven SSL |
| `API_FOOTBALL_KEY` | `YOUR_API_FOOTBALL_KEY` | From api-sports.io dashboard |
| `RAPIDAPI_KEY` | *(optional)* | Only if using RapidAPI |
| `JWT_SECRET` | *(Click "Generate" or random 32+ char string)* | For user login sessions |
| `FRONTEND_URL` | `https://goalbeat-ai.vercel.app` | *(You can update this after Vercel gives you your URL)* |

*(Note: If you prefer individual DB variables instead of `DATABASE_URL`, you can provide `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME=defaultdb`).*

### 2.3 Deploy & Check Logs
1. Click **Create Web Service**.
2. Watch the deployment log until you see:
   ```
   ✅ Database initialized
   ⚽ GoalBeat AI Backend running on port 3001
   Mode: production
   Health: http://localhost:3001/health
   ```
3. Copy your Render backend URL (e.g. `https://goalbeat-ai-backend.onrender.com`).
4. Test the health endpoint in your browser:
   `https://your-backend.onrender.com/health` ➔ should return `{"status":"ok", ...}`.

---

## Part 3: Frontend Deployment on Vercel

### 3.1 Import Project into Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. Select `dataqubit404/GoalBeatAI` and click **Import**.

### 3.2 Configure Build & Root Directory
1. In the **Configure Project** screen:
   - Click **Edit** next to **Root Directory**.
   - Select the `frontend` folder and click **Continue**.
2. **Framework Preset**: Vite (detected automatically).
3. **Build Command**: `vite build` (or `npm run build`).
4. **Output Directory**: `dist` (default).

### 3.3 Add Environment Variables
Expand the **Environment Variables** section and add:

| Key | Value | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://YOUR_RENDER_BACKEND.onrender.com/api` | `https://goalbeat-ai-backend.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://YOUR_RENDER_BACKEND.onrender.com` | `https://goalbeat-ai-backend.onrender.com` |

*(Important: Include `/api` at the end of `VITE_API_URL`, but do not include `/api` in `VITE_SOCKET_URL`).*

### 3.4 Deploy
1. Click **Deploy**.
2. Wait ~45 seconds for the Vite build to complete.
3. Once completed, Vercel will give you your live URL (e.g., `https://goalbeat-ai-xyz.vercel.app`).

---

## Part 4: Final Link & Verification

### 4.1 Update Backend with Your Vercel URL
1. Go back to your [Render Dashboard](https://dashboard.render.com).
2. Navigate to `goalbeat-ai-backend` ➔ **Environment**.
3. Set or update `FRONTEND_URL` to your exact Vercel URL:
   `FRONTEND_URL` = `https://your-actual-app.vercel.app` (without trailing slash).
4. Render will automatically redeploy with the updated CORS policy.

### 4.2 Verify Everything Works
1. **Open your Vercel URL** in your browser.
2. **Check Browser Console (F12)**:
   - Look for: `📡 Connected to Live Scores`
   - Check Network tab to confirm calls to `/api/leagues` succeed with status `200`.
3. **Test Database & Authentication**:
   - Click **Get Started / Register**.
   - Create a test account (e.g. `testuser`, `test@example.com`, `password123`).
   - If registration succeeds and you're logged in, **your Aiven MySQL DB is writing and reading data perfectly!**
4. **Test Real-time Socket / Mock Fallback**:
   - Check match scores or fixtures.
   - If free API quota is reached, the app automatically serves smooth fallback mock data without crashing.

---

## 🛠️ Quick Troubleshooting

- **CORS Error in Browser**:
  - Make sure `FRONTEND_URL` in Render matches your Vercel address.
  - Don't include trailing slashes (e.g. use `https://my-site.vercel.app`, NOT `https://my-site.vercel.app/`).
- **Render Free Tier Cold Starts**:
  - Render free tier spins down if inactive for 15 minutes. The very first request after inactivity might take 30–50 seconds to wake up.
- **Aiven Connection Timeout**:
  - In Aiven Console, ensure your IP or `0.0.0.0/0` (public access) is enabled in Advanced Configuration / Firewall rules (enabled by default for managed instances).
- **Testing Aiven DB from Local Terminal**:
  - Run:
    ```bash
    cd backend
    DATABASE_URL="your-aiven-uri" node scripts/test-db.js
    ```
