import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCookie, setCookie, hasConsentedToCookies } from "@/lib/cookies";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check cookies first if consent given, otherwise localStorage, default to dark
    if (hasConsentedToCookies()) {
      const cookieTheme = getCookie("theme") as Theme;
      if (cookieTheme) return cookieTheme;
    }
    
    // Fallback to localStorage for backward compatibility
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    
    // Save to cookies if consent given, otherwise localStorage
    if (hasConsentedToCookies()) {
      setCookie("theme", theme);
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
