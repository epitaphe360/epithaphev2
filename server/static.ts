import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const cwd = process.cwd();
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    console.log('[static] CWD:', cwd);
  }

  // Try multiple possible paths for the public directory
  const possiblePaths = [
    path.resolve(cwd, "dist", "public"),           // Railway: /app/dist/public
    path.resolve(cwd, "public"),                   // /app/public
    path.join(__dirname, "public"),                // Relative to script
    path.join(__dirname, "..", "public"),          // One level up from script
    path.join(__dirname, "..", "dist", "public"),  // /app/dist/public from __dirname
  ];

  const distPath = possiblePaths.find(p => fs.existsSync(p));

  if (!distPath) {
    console.error('[static] ❌ Public directory not found. Tried:', possiblePaths.join(', '));
    // Don't crash - serve a simple error page instead
    app.use("*", (_req, res) => {
      res.status(500).send(`
        <h1>Static files not found</h1>
        <p>CWD: ${cwd}</p>
        <p>Tried: ${possiblePaths.join(', ')}</p>
      `);
    });
    return;
  }

  if (isDev) {
    console.log('[static] ✅ Serving from:', distPath);
  }

  // Serve static files with proper options
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
    index: 'index.html'
  }));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
