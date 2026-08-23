#!/bin/bash
set -e

APP_DIR="/opt/apps/textinfo-next"
BRANCH="main"
SERVICE="textinfo-next"

echo "🚀 Deploy started"

cd $APP_DIR

echo "📥 Pulling latest code..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building project..."
npm run build

echo "♻️ Restarting app..."
sudo systemctl restart $SERVICE

echo "✅ Deploy completed"
echo "You can check the app status with: sudo systemctl status $SERVICE"