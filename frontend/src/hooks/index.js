// GoalBeat AI — Custom React Hooks
import { useState, useEffect, useCallback, useRef } from "react";
import { footballAPI } from "../lib/api";

// ── Generic fetch hook ───────────────────────────────────────
export function useFetch(fetchFn, deps = [], options = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      if (isMounted.current) setData(result);
      return result;
    } catch (err) {
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    if (immediate) execute();
    return () => { isMounted.current = false; };
  }, deps);

  return { data, loading, error, refetch: execute };
}

// ── League standings ─────────────────────────────────────────
export function useStandings(leagueId, season) {
  return useFetch(
    () => footballAPI.getLeagueStandings(leagueId, season),
    [leagueId, season],
    { immediate: !!leagueId }
  );
}

// ── Top scorers ──────────────────────────────────────────────
export function useTopScorers(leagueId) {
  return useFetch(
    () => footballAPI.getTopScorers(leagueId),
    [leagueId],
    { immediate: !!leagueId }
  );
}

// ── Upcoming fixtures ─────────────────────────────────────────
export function useUpcomingFixtures(leagueId, next = 10) {
  return useFetch(
    () => footballAPI.getNextFixtures(leagueId, next),
    [leagueId, next],
    { immediate: !!leagueId }
  );
}

// ── Live matches ─────────────────────────────────────────────
export function useLiveMatches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const fetch = async () => {
      try {
        const res = await footballAPI.getLiveMatches();
        setData(res?.response || []);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    interval = setInterval(fetch, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}

// ── Match prediction ─────────────────────────────────────────
export function usePrediction(fixtureId) {
  return useFetch(
    () => footballAPI.predictMatch(fixtureId),
    [fixtureId],
    { immediate: !!fixtureId }
  );
}

// ── Club data ─────────────────────────────────────────────────
export function useClub(teamId) {
  return useFetch(
    () => footballAPI.getClub(teamId),
    [teamId],
    { immediate: !!teamId }
  );
}

// ── Intersection observer for scroll reveal ──────────────────
export function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Parallax scroll ──────────────────────────────────────────
export function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * speed;
      ref.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

// ── Search with debounce ─────────────────────────────────────
export function useSearch(delay = 350) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) { setResults(null); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await footballAPI.search(query);
        setResults(res);
      } catch (e) {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(timer.current);
  }, [query, delay]);

  return { query, setQuery, results, loading };
}
