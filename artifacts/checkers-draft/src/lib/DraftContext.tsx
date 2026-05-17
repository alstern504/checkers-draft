import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { PowerUpId } from "./types";

type DraftContextType = {
  p1Powerups: PowerUpId[];
  setP1Powerups: (p: PowerUpId[]) => void;
  p2Powerups: PowerUpId[];
  setP2Powerups: (p: PowerUpId[]) => void;
};

const DraftContext = createContext<DraftContextType | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [p1Powerups, setP1Powerups] = useState<PowerUpId[]>(() => {
    if (typeof window !== "undefined") {
      const s = sessionStorage.getItem("draft:p1");
      return s ? JSON.parse(s) : [];
    }
    return [];
  });
  
  const [p2Powerups, setP2Powerups] = useState<PowerUpId[]>(() => {
    if (typeof window !== "undefined") {
      const s = sessionStorage.getItem("draft:p2");
      return s ? JSON.parse(s) : [];
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem("draft:p1", JSON.stringify(p1Powerups));
  }, [p1Powerups]);

  useEffect(() => {
    sessionStorage.setItem("draft:p2", JSON.stringify(p2Powerups));
  }, [p2Powerups]);

  return (
    <DraftContext.Provider value={{ p1Powerups, setP1Powerups, p2Powerups, setP2Powerups }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within DraftProvider");
  return ctx;
}
