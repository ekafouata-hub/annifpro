"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const themeKey = "anniv-reminder-theme";
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeKey, theme);
  subscribers.forEach((callback) => callback());
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeKey);
    const initialTheme: Theme = storedTheme === "light" ? "light" : "dark";
    if (getThemeSnapshot() !== initialTheme) {
      applyTheme(initialTheme);
    }
  }, []);

  function chooseTheme(nextTheme: Theme) {
    applyTheme(nextTheme);
  }

  return (
    <div
      role="group"
      aria-label="Thème d’affichage"
      className="inline-flex shrink-0 rounded-xl border border-slate-700 bg-slate-900 p-1 text-xs"
    >
      <button
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => chooseTheme("light")}
        className={`rounded-lg px-3 py-1.5 font-medium transition ${
          theme === "light" ? "bg-sky-400 text-slate-950" : "text-slate-300 hover:text-white"
        }`}
      >
        Clair
      </button>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => chooseTheme("dark")}
        className={`rounded-lg px-3 py-1.5 font-medium transition ${
          theme === "dark" ? "bg-sky-400 text-slate-950" : "text-slate-300 hover:text-white"
        }`}
      >
        Sombre
      </button>
    </div>
  );
}