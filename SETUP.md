# ⚽ GoalBeat AI — Complete Setup Guide

## Project Structure

```
goalbeat-ai/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL config (local + Aiven)
│   ├── routes/
│   │   ├── leagues.js           # /api/leagues
│   │   ├── standings.js         # /api/standings
│   │   ├── matches.js           # /api/matches
│   │   ├── clubs.js             # /api/clubs
│   │   ├── players.js           # /api/players
│   │   ├── predict.js           # /api/predict
│   │   ├── compare.js           # /api/compare
│   │   └── search.js            # /api/search
│   ├── services/
│   │   ├── footballApi.js       # API-Football wrapper + cache
│   │   ├── predictionService.js # xG-based AI prediction engine
│   │   └── liveService.js       # Live score fetcher (Socket.IO)
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Express + Socket.IO entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Layout.jsx   # Navbar + search + notifications
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.jsx          # Storytelling scroll hero
│   │   │   │   ├── LeaguesPage.jsx       # League explorer + filters
│   │   │   │   ├── LeagueDashboardPage.jsx # Standings + fixtures + scorers
│   │   │   │   ├── ClubPage.jsx          # Club overview + squad + legends
│   │   │   │   ├── MatchPage.jsx         # Prediction + stats + lineups + timeline
│   │   │   │   ├── ComparePage.jsx       # 3-league comparison dashboard
│   │   │   │   ├── DashboardPage.jsx     # Personalized dashboard with widgets
│   │   │   │   └── SquadBuilderPage.jsx  # Drag-and-drop pitch builder
│   │   │   ├── features/
│   │   │   │   ├── StandingsTable.jsx    # Live standings with form badges
│   │   │   │   ├── FixturesList.jsx      # Expandable fixtures + inline prediction
│   │   │   │   ├── TopScorers.jsx        # Top scorers leaderboard
│   │   │   │   └── NotificationPanel.jsx # Notification dropdown
│   │   │   └── ui/
│   │   │       └── LoadingSkeleton.jsx   # Shimmer skeletons
│   │   ├── hooks/index.js        # useFetch, useStandings, useReveal, useParallax...
│   │   ├── lib/
│   │   │   ├── api.js            # Axios client + all API methods
│   │   │   └── constants.js      # 25+ leagues, formations, club legends
│   │   ├── store/useStore.js     # Zustand global state + localStorage persist
│   │   ├── styles/globals.css    # Tailwind + custom CSS (glass, pitch-lines...)
│   │   ├── App.jsx               # React Router routes
│   │   └── main.jsx              # Entry point
│   ├── .env.example
│   ├── index.html                # Google Fonts (Bebas Neue + DM Sans)
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
├── render.yaml                   # Render deploy config
├── package.json                  # Root monorepo scripts
└── SETUP.md                      # This file
```

---

## Step 1 — Get Your Free API Key

### Option A: api-sports.io (Recommended)
1. Go to **https://dashboard.api-football.com/register**
2. Register with email — **no credit card required**
3. Free tier: **100 requests/day forever**
4. After login → go to **"My Access"** → copy your API key
5. This key goes into `API_FOOTBALL_KEY` in your `.env`

### Option B: RapidAPI (Alternative)
1. Go to **https://rapidapi.com/api-sports/api/api-football**
2. Sign up → Subscribe to **"Basic" plan** (free, 100 req/day)
3. Copy your `X-RapidAPI-Key`
4. This key goes into `RAPIDAPI_KEY` and update `footballApi.js` headers

> **💡 Tip:** 100 req/day is enough for development. Each page load uses 2-4 requests.
> Use `node-cache` aggressively — results are cached 5-10 minutes by default.

---

## Step 2 — Setup MySQL Locally

```bash
# macOS with Homebrew
brew install mysql
brew services start mysql
mysql_secure_installation

# Ubuntu/Linux
sudo apt install mysql-server
sudo systemctl start mysql

# Windows — download MySQL installer from mysql.com
```

Create the database:
```sql
mysql -u root -p
CREATE DATABASE goalbeat_ai;
EXIT;
```

The schema is auto-created on first server start via `initializeDatabase()`.

---

## Step 3 — Environment Variables

```bash
# Backend
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3001
NODE_ENV=development

# From Step 1
API_FOOTBALL_KEY=your_key_here

# From Step 2
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=goalbeat_ai

FRONTEND_URL=http://localhost:5173
JWT_SECRET=any_long_random_string_here
```

```bash
# Frontend
cd frontend
cp .env.example .env
```

The frontend `.env` just needs `VITE_API_URL=/api` (default, no change needed for local dev).

---

## Step 4 — Install Dependencies

```bash
# From project root
npm run install:all

# OR manually:
cd backend && npm install
cd ../frontend && npm install
```

---

## Step 5 — Run Locally

```bash
# From project root — runs both frontend + backend concurrently
npm run dev
```

This starts:
- **Backend** → http://localhost:3001
- **Frontend** → http://localhost:5173

Test the backend:
```bash
curl http://localhost:3001/health
# → {"status":"ok","time":"..."}

curl "http://localhost:3001/api/leagues/39/standings"
# → Premier League standings JSON
```

---

## Step 6 — Verify It Works

1. Open **http://localhost:5173**
2. You should see the GoalBeat AI hero page
3. Click **"Explore Leagues"** → select **Premier League**
4. Wait ~2 seconds for API data to load
5. Standings should populate
6. Click a club → see club page
7. Click a fixture → expand to see AI prediction

---

## Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com/api
```

Or connect your GitHub repo to Vercel → auto-deploys on push.
Set **Root Directory** to `frontend`, **Build Command** to `npm run build`.

### Backend → Render

1. Go to **https://render.com** → New Web Service
2. Connect your GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add all env vars from your `.env` file in the Render dashboard
5. Under **Environment** → add `NODE_ENV=production`

### Database → Aiven MySQL (Free 30-day trial, then $19/mo)

1. Go to **https://aiven.io** → Create free account
2. New Service → MySQL → Free plan
3. Copy the connection details into your Render env vars:
   ```
   DB_HOST=your-instance.aivencloud.com
   DB_PORT=xxxxx
   DB_USER=avnadmin
   DB_PASSWORD=xxxxx
   DB_SSL=true
   ```

> **Free alternatives for DB:**
> - **PlanetScale** (MySQL-compatible, free tier) → https://planetscale.com
> - **Railway** (MySQL, $5 credit free) → https://railway.app
> - **Supabase** (PostgreSQL — requires changing mysql2 to pg) → https://supabase.com

---

## Feature Guide

### League Dashboard
- Visit `/league/39` for Premier League
- `/league/2` for Champions League
- All 25+ league IDs in `frontend/src/lib/constants.js`

### Club Page
- Click any team in standings → `/club/:id`
- Tabs: Overview, Squad, Stats, Form, Legends
- Legends link to Google search
- Add more legends in `constants.js → CLUB_LEGENDS`

### Match Prediction
- Click any upcoming fixture in the fixtures list
- Prediction uses: last 5 form + xG + home advantage (Poisson model)
- Or visit `/match/:fixtureId` for full page

### 3-League Comparison
- Click "Compare" on any league page → adds to compare
- Or go to `/compare` → add up to 3 leagues via picker
- Shows side-by-side standings + top scorers + bar chart

### Squad Builder
- Go to `/squad-builder`
- Search a team name → loads their real squad
- Drag players from sidebar onto pitch positions
- Click formation buttons to change shape (4-3-3, 4-2-3-1, etc.)
- Lineup strength bar shows completeness

### Notifications
- Currently shows stored notifications from Zustand
- For real notifications: use Socket.IO emit from backend
- Example: when live score updates, call `useStore.getState().addNotification({...})`

---

## Extending GoalBeat AI

### Add More Club Legends
Edit `frontend/src/lib/constants.js`:
```js
export const CLUB_LEGENDS = {
  40: [ // Liverpool ID
    { name: "Steven Gerrard", years: "1998–2015", goals: 186 },
  ],
  // Find team IDs from the API or standings
};
```

### Add More Leagues
Edit the `LEAGUES` array in `constants.js`:
```js
{ id: 307, slug: "saudi-pro-league", name: "Saudi Pro League", ... }
```

### Upgrade API Quota
- **api-sports.io Pro:** $15/month → 7,500 req/day
- **RapidAPI Basic:** Free → 100/day; Pro: $10/month → 500/day
- You can also use both keys as fallback

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| State | Zustand (with localStorage persist) |
| Routing | React Router 6 |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Cache | node-cache (in-memory) |
| Database | MySQL (local) / Aiven MySQL (prod) |
| API | API-Football (api-sports.io) — 100 req/day free |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Fonts | Bebas Neue + DM Sans (Google Fonts) |

---

## API Quota Management Tips

You get **100 free requests/day**. Here's how to stay within limits:

1. **Cache aggressively** — standings cache 5 min, league info 1 hour, scorers 10 min
2. **Don't auto-refresh** — only refresh on user action (click the refresh button)
3. **Use the curated LEAGUES list** — avoids unnecessary league search calls
4. **Prediction uses minimal calls** — 3 calls per fixture (fixture + 2 team history)
5. **Live scores** — only poll every 60 seconds via Socket.IO interval
6. **Development** — use the same cached data, don't restart server constantly

> At 100 req/day you can comfortably browse 5-10 leagues per day in development.
> In production, upgrade to $15/month plan for 7,500 req/day.
