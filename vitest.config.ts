import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.ts", "lib/**/*.tsx"],
      // Supabase wrappers are thin SDK adapters tested via integration — exclude from thresholds
      exclude: ["lib/supabase/**"],
      thresholds: {
        lines: 80,
      },
    },
    exclude: ["node_modules", ".next", "specs"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
