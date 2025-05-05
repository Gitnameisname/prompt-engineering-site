import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "black" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "black";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "black">("light");

  // 로컬스토리지에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "black" || saved === "system") {
      setTheme(saved);
    }
  }, []);

  // 테마 적용 및 감지
  useEffect(() => {
    const apply = (t: Theme) => {
      const final = t === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "black" : "light")
        : t;

      document.documentElement.setAttribute("data-theme", final); // CSS용
      setResolvedTheme(final);
    };

    apply(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
