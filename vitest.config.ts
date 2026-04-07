import { defineConfig } from "vitest/config";
import path from "path";
import dns from "dns";

// Force DNS to return IPv6 when IPv4 is not available (Supabase AAAA-only)
dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["server/**/*.ts", "shared/**/*.ts"],
      exclude: ["server/vite.ts", "server/static.ts", "server/dev-routes.ts"],
    },
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "shared"),
      "@": path.resolve(__dirname, "client/src"),
    },
  },
});
