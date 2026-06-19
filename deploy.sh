#!/bin/bash
# Run this on the VPS after first setup: bash deploy.sh
set -e

APP_DIR="/var/www/octavia"

echo "→ Pulling latest code..."
cd $APP_DIR
git pull origin main

echo "→ Installing dependencies..."
npm install
npm --prefix client install
npm --prefix server install

echo "→ Building React app..."
npm run build

echo "→ Restarting server..."
pm2 restart octavia || pm2 start "npm run start" --name octavia

echo "✓ Deploy complete"
pm2 status
