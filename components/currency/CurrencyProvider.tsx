"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Currency } from "@/lib/currency";

type Ctx = { currency: Currency; setCurrency: (c: Currency) => void };

const CurrencyContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "abc-currency-session";

export function CurrencyProvider({
  defaultCurrency = "EUR",
  children,
}: {
  defaultCurrency?: Currency;
  children: ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.sessionStorage.getItem(STORAGE_KEY);
    } catch {}
    if (saved === "BAM" || saved === "EUR") setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore (private mode etc.) */
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
