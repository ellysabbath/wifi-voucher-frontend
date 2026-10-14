// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "react";
            if (id.includes("react-dom")) return "react";
            if (id.includes("/react/")) return "react";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("date-fns")) return "dates";
            return "vendor";
          }
        },
      },
    },
  },
});