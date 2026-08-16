import {  Sun,  Moon,} from "lucide-react";
import { useTheme } from "../components/context/useTheme";

export default function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        relative
        flex
        items-center
        gap-1
        p-1
        rounded-full
        border
        border-[#D4AF37]/30
        bg-white/5
        hover:bg-white/10
        transition-all
      "
    >
      <span
        className={`
          w-7
          h-7
          rounded-full
          flex
          items-center
          justify-center
          transition-all
          ${
            theme === "light"
              ? "bg-[#D4AF37] text-[#0F4C3A]"
              : "text-white/60"
          }
        `}
      >
        <Sun className="w-4 h-4" />
      </span>

      <span
        className={`
          w-7
          h-7
          rounded-full
          flex
          items-center
          justify-center
          transition-all
          ${
            theme === "dark"
              ? "bg-[#D4AF37] text-[#0F4C3A]"
              : "text-white/60"
          }
        `}
      >
        <Moon className="w-4 h-4" />
      </span>
    </button>
  );
}