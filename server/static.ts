import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  console.log('🔧 Setting up static file serving...');
  console.log('📁 Current working directory:', process.cwd());
  console.log('📁 __dirname:', __dirname);
  
  // List contents of potential directories
  const cwd = process.cwd();
  try {
    console.log('📂 Contents of cwd:', fs.readdirSync(cwd));
    if (fs.existsSync(path.join(cwd, 'dist'))) {
      console.log('📂 Contents of dist:', fs.readdirSync(path.join(cwd, 'dist')));
    }
  } catch (e) {
    console.log('⚠️ Could not list directory contents:', e);
  }
  
  // Try multiple possible paths for the public directory
  const possiblePaths = [
    path.resolve(cwd, "dist", "public"),           // Railway: /app/dist/public
    path.resolve(cwd, "public"),                   // /app/public
    path.join(__dirname, "public"),                // Relative to script
    path.join(__dirname, "..", "public"),          // One level up from script
    path.join(__dirname, "..", "dist", "public"),  // /app/dist/public from __dirname
  ];
  
  console.log('🔍 Checking paths:', possiblePaths);
  
  const distPath = possiblePaths.find(p => {
    const exists = fs.existsSync(p);
    console.log(`  ${exists ? '✅' : '❌'} ${p}`);
    return exists;
  });
  
  if (!distPath) {
    console.error('❌ Could not find public directory!');
    // Don't crash - serve a simple error page instead
    app.use("*", (_req, res) => {
      res.status(500).send(`
        <h1>Static files not found</h1>
        <p>CWD: ${cwd}</p>
        <p>__dirname: ${__dirname}</p>
        <p>Tried: ${possiblePaths.join(', ')}</p>
      `);
    });
    return;
  }
  
  console.log('✅ Serving static files from:', distPath);
  
  // List contents of distPath
  try {
    console.log('📂 Contents of distPath:', fs.readdirSync(distPath));
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      console.log('📂 Contents of assets:', fs.readdirSync(assetsPath));
    }
  } catch (e) {
    console.log('⚠️ Could not list distPath contents:', e);
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
