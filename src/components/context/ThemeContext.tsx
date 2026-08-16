import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const defaultThemeContext: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {
    // Default function.
    // The real function is supplied by ThemeProvider.
  },
};

export const ThemeContext =
  createContext<ThemeContextType>(
    defaultThemeContext
  );

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme =
        localStorage.getItem("ccng_theme");

      if (
        savedTheme === "light" ||
        savedTheme === "dark"
      ) {
        return savedTheme;
      }
    } catch {
      // Ignore localStorage errors.
    }

    return "light";
  });

  useEffect(() => {
    const root =
      document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem(
        "ccng_theme",
        theme
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((currentTheme) =>
      currentTheme === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}