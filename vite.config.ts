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
          // ⚠️ React DOIT rester dans un seul chunk — ne jamais le mettre dans vendor
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-dom-client/') || id.includes('scheduler')) return undefined;
          if (id.includes('three') || id.includes('@react-three')) return 'threejs';
          if (id.includes('grapesjs')) return 'grapesjs';
          if (id.includes('cms-dashboard')) return 'admin';
          if (id.includes('@radix-ui')) return 'ui';
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
