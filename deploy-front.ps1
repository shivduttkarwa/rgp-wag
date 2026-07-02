# deploy-front.ps1
# Builds the React frontend locally then uploads to EC2.
# Run from project root: .\deploy-front.ps1
#
# Backend-only deploy (skip frontend build):
#   .\deploy-front.ps1 -SkipFrontend

param([switch]$SkipFrontend)

$PEM   = "D:\Shiv\EC2\rgp-prod-ec2-key.pem"
$EC2   = "ubuntu@54.252.235.169"
$PROJ  = "/home/ubuntu/rgp-wag"
$FRONT = Join-Path $PSScriptRoot "front"

$SSH_OPTS = "-i `"$PEM`" -o StrictHostKeyChecking=no"

function ssh_run($cmd) {
    Invoke-Expression "ssh $SSH_OPTS $EC2 `"$cmd`""
}

# ── 1. Frontend build + upload ────────────────────────────────────────────────
if (-not $SkipFrontend) {
    Write-Host ""
    Write-Host "[ 1/2 ] Building frontend locally..." -ForegroundColor Cyan
    Push-Location $FRONT
    npm run build
    $buildExit = $LASTEXITCODE
    Pop-Location

    if ($buildExit -ne 0) {
        Write-Host "Build failed. Nothing deployed." -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "[ 2/2 ] Uploading dist/ to EC2..." -ForegroundColor Cyan
    Invoke-Expression "ssh $SSH_OPTS $EC2 'rm -rf $PROJ/front/dist'"
    Invoke-Expression "scp $SSH_OPTS -r `"$FRONT\dist`" ${EC2}:${PROJ}/front/"
    Write-Host "        dist/ uploaded." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Skipping frontend build (-SkipFrontend)." -ForegroundColor Yellow
}

# ── 2. Backend: git pull + migrate + restart gunicorn ────────────────────────
Write-Host ""
Write-Host "[ backend ] Pulling latest + migrating + restarting..." -ForegroundColor Cyan

$backendCmd = "cd $PROJ && git pull && cd backend && .venv/bin/python manage.py migrate --noinput && .venv/bin/python manage.py collectstatic --noinput -v 0 && sudo systemctl restart rgp-gunicorn && echo 'Gunicorn restarted OK'"
Invoke-Expression "ssh $SSH_OPTS $EC2 '$backendCmd'"

Write-Host ""
Write-Host "Deploy complete!  http://54.252.235.169/" -ForegroundColor Green
