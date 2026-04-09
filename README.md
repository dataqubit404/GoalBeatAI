# GoalBeat AI ⚽️

> **Intelligence for the Beautiful Game.** Every Goal. Every Stat. Flat Data.

GoalBeat AI is a premium, high-performance football data and tactical analysis platform. It combines beautiful, glassmorphic UI design with deep data visualization to provide fans and analysts with unmatched insights into leagues, clubs, and tactical formations.

## 🌟 Key Features

* **Match Intelligence & Predictions**: AI-fueled statistical predictions for upcoming fixtures (Win/Draw/Loss probabilities).
* **Tactical Squad Builder**: A fully interactive drag-and-drop pitch to build, analyze, and compare starting XIs and formations using `@dnd-kit/core`.
* **League Explorer**: Comprehensive dashboards for top global leagues, featuring dynamic standings, top scorers, and fixture tracking.
* **Side-by-Side Comparison**: Select multiple leagues and contrast them using synchronized charts and data tables.
* **Fallback API Architecture**: A robust offline-first fallback system ensuring the app remains fully functional with high-fidelity mock data even when API rate limits are hit.
* **Premium Dark UI**: Built with custom Tailwind tokens, massive typography overlays (`font-matchday`), mesh gradients, and framer-motion micro-animations.

## 🛠 Tech Stack

**Frontend Architecture:**
* **Framework**: React 18 & Vite
* **Routing**: React Router DOM (v6)
* **Styling**: Tailwind CSS (Custom Dark/Glassmorphism theme) 
* **Animations**: Framer Motion
* **Drag & Drop**: @dnd-kit/core (Used in Squad Builder)
* **Charts**: Recharts

**Backend Architecture:**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Data Provider**: API-Football

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* API-Football Key (Add to `.env` or run using fallback mock data mode)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd goalbeat--ai
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   # Copy environment variables
   cp .env.example .env 
   npm start
   ```

3. **Setup the Frontend:**
   ```bash
   # Open a new terminal tab
   cd frontend
   npm install
   npm run dev
   ```

4. **View the Application:**
   Open your browser and navigate to `http://localhost:5173`.

---

## 🎨 Asset Configuration

GoalBeat uses a modular asset approach. You can easily swap core imagery by replacing files in the `public` directory:
* **Auth Background**: Place your custom background at `frontend/public/images/auth/background.jpg`
* **Story/Hero Screens**: Replace `frontend/public/images/story/story1.jpg`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is proprietary and confidential. © 2026 GoalBeat AI. All Rights Reserved.
