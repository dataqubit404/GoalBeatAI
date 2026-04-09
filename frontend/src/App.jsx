// GoalBeat AI — App Router
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import HomePage from "./components/pages/HomePage";
import LeaguesPage from "./components/pages/LeaguesPage";
import LeagueDashboardPage from "./components/pages/LeagueDashboardPage";
import ClubPage from "./components/pages/ClubPage";
import MatchPage from "./components/pages/MatchPage";
import ComparePage from "./components/pages/ComparePage";
import DashboardPage from "./components/pages/DashboardPage";
import SquadBuilderPage from "./components/pages/SquadBuilderPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/league/:id" element={<LeagueDashboardPage />} />
          <Route path="/club/:id" element={<ClubPage />} />
          <Route path="/match/:id" element={<MatchPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/squad-builder" element={<SquadBuilderPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
