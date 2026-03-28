#!/bin/bash

# ARTIFICIAL v4 Deployment Script
# ================================

set -e

echo "🎮 ARTIFICIAL v4 Deployment"
echo "==========================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in
echo "📋 Checking Firebase login status..."
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase:"
    firebase login
fi

# Build the app
echo ""
echo "🔨 Building production bundle..."
npm run build

# Deploy
echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at:"
echo "   https://artificial-games.web.app"
echo "   https://artificial-games.firebaseapp.com"
echo ""
