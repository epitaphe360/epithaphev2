# ============================================================
# Script de configuration automatique Railway
# Usage: .\setup-railway.ps1
# ============================================================

Write-Host "`n EPITAPHE360 — Configuration Railway automatique" -ForegroundColor Cyan
Write-Host "=" * 55

# --- 1. Login ---
Write-Host "`n[1/4] Connexion a Railway..." -ForegroundColor Yellow
railway login
if ($LASTEXITCODE -ne 0) { Write-Host "Echec login Railway" -ForegroundColor Red; exit 1 }
Write-Host "OK Connecte a Railway" -ForegroundColor Green

# --- 2. Init / Link projet ---
Write-Host "`n[2/4] Creation du projet Railway..." -ForegroundColor Yellow
Write-Host "Choisissez 'Create new project' dans le menu qui s'affiche."
railway init
if ($LASTEXITCODE -ne 0) { Write-Host "Echec init Railway" -ForegroundColor Red; exit 1 }
Write-Host "OK Projet Railway cree et lie" -ForegroundColor Green

# --- 3. Variables d'environnement ---
Write-Host "`n[3/4] Injection des variables d'environnement..." -ForegroundColor Yellow

$vars = @{
  # Base de donnees Supabase
  "DATABASE_URL"      = "postgresql://postgres:QQYTSEV9wlrBxJmV@db.cdqehuagpytwqzawqoyh.supabase.co:5432/postgres"
  # Securite JWT
  "JWT_SECRET"        = "epitaphe360-prod-secret-key-32chars-minimum-secure"
  "JWT_EXPIRES_IN"    = "7d"
  # Environnement
  "NODE_ENV"          = "production"
  "PORT"              = "5000"
  # URLs
  "SITE_URL"          = "https://epithaphev2.vercel.app"
  "CORS_ORIGIN"       = "https://epithaphev2.vercel.app"
  "ALLOWED_ORIGINS"   = "https://epithaphev2.vercel.app"
}

$setArgs = $vars.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }
railway variables set @setArgs
if ($LASTEXITCODE -ne 0) {
  Write-Host "Tentative variable par variable..." -ForegroundColor Yellow
  foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    railway variables set "$key=$value"
    Write-Host "  + $key" -ForegroundColor Gray
  }
}

Write-Host "OK Variables injectees" -ForegroundColor Green

# --- 4. Deploy ---
Write-Host "`n[4/4] Deploiement sur Railway..." -ForegroundColor Yellow
railway up --detach
if ($LASTEXITCODE -ne 0) { Write-Host "Echec deploy" -ForegroundColor Red; exit 1 }

Write-Host "`n DONE! Deployment Railway lance." -ForegroundColor Green
Write-Host "Verifiez le statut : railway status" -ForegroundColor Cyan
Write-Host "Voir les logs    : railway logs" -ForegroundColor Cyan
