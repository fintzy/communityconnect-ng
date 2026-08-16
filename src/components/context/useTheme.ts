import { useContext } from "react";
import {
  ThemeContext,
  type ThemeContextType,
} from "./ThemeContext";

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}