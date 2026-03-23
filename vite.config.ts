import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      // Force une seule instance React (évite useState null)
      "react": path.resolve(import.meta.dirname, "node_modules/react"),
      "react-dom": path.resolve(import.meta.dirname, "node_modules/react-dom"),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // GrapesJS : 1MB+ isolé dans son chunk (dépendances internes propres)
          if (id.includes('/node_modules/grapesjs')) return 'grapesjs';

          // Tout le reste de node_modules → vendor (react, radix, three, zustand…)
          // On évite ainsi tout cycle entre sous-chunks
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom/client',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion',
      'axios',
      '@tanstack/react-query',
      'wouter',
      'react-helmet-async',
    ],
  },
  server: {
    port: 3000,
    fs: {
      strict: true,
      allow: ['..'], // ✅ Allow access to parent directory (cms-dashboard)
      deny: ["**/.*"],
    },
  },
});
