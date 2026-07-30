import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import path from "path";
import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },

  preview: {
    host: "0.0.0.0",
    port: 3000,
  },

  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
  },
});