import { useState, useEffect } from "react";
import { MatchHistoryEntry, GameStats } from "./types";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useGameStats() {
  const [stats, setStats] = useLocalStorage<GameStats>("checkers-draft:stats", {
    totalGames: 0,
    p1Wins: 0,
    p2Wins: 0,
    draws: 0,
  });
  return { stats, setStats };
}

export function useMatchHistory() {
  const [history, setHistory] = useLocalStorage<MatchHistoryEntry[]>("checkers-draft:history", []);
  return { history, setHistory };
}
