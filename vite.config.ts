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
      // Force une seule instance React (Ã©vite useState null)
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
          // GrapesJS : 1MB+ isolÃ© dans son chunk (dÃ©pendances internes propres)
          if (id.includes('/node_modules/grapesjs')) return 'grapesjs';
          if (id.includes('/node_modules/three') || id.includes('/node_modules/@react-three')) return 'vendor-three';
          if (id.includes('/node_modules/react') || id.includes('/node_modules/wouter')) return 'vendor-react';
          if (id.includes('/node_modules/framer-motion')) return 'vendor-framer';
          if (id.includes('/node_modules/lucide-react') || id.includes('/node_modules/@radix-ui')) return 'vendor-ui';
          if (id.includes('node_modules')) return 'vendor-core';
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
      allow: ['..'], // âœ… Allow access to parent directory (cms-dashboard)
      deny: ["**/.*"],
    },
  },
});

