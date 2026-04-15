import path from "node:path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    environment: "jsdom",
    environmentMatchGlobs: [
      ["**/src/api/**/*.test.ts", "node"],
      ["**/src/http/**/*.test.ts", "node"],
      ["**/src/api-env.test.ts", "node"],
      ["**/src/client-env.test.ts", "node"],
      ["**/src/app/issues/**/actions.test.ts", "node"],
    ],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/api/db/seed.ts",
        "src/test/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/**",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      reporter: ["text", "html"],
    },
  },
})
