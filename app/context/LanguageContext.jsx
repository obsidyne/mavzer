"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { t } from "../lib/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("tr");

  // persist across page navigations
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "tr") setLang(saved);
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}