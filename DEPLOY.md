# 🚀 ARTIFICIAL v4 Deployment Guide

## Option 1: Firebase Hosting (Recommended)

Your app is pre-configured for Firebase. Follow these steps:

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
This opens a browser to authenticate with your Google account.

### Step 3: Extract and Install
```bash
unzip artificial-v4.zip
cd artificial-v4
npm install
```

### Step 4: Build & Deploy
```bash
npm run build
firebase deploy
```

Or use the included script:
```bash
./deploy.sh
```

### Your Live URLs
After deployment:
- **https://artificial-games.web.app**
- **https://artificial-games.firebaseapp.com**

---

## Option 2: Vercel (Free)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
unzip artificial-v4.zip
cd artificial-v4
npm install
vercel
```

Follow the prompts. Vercel auto-detects React and configures everything.

---

## Option 3: Netlify (Free)

### Via CLI
```bash
npm install -g netlify-cli
unzip artificial-v4.zip
cd artificial-v4
npm install
npm run build
netlify deploy --prod --dir=build
```

### Via Web Interface
1. Go to [netlify.com](https://netlify.com)
2. Drag the `build` folder to deploy

---

## Option 4: GitHub Pages (Free)

### Step 1: Create Repository
Create a new repo on GitHub

### Step 2: Update package.json
Add homepage field:
```json
"homepage": "https://yourusername.github.io/artificial-v4"
```

### Step 3: Install gh-pages
```bash
npm install gh-pages --save-dev
```

### Step 4: Add deploy scripts to package.json
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

### Step 5: Deploy
```bash
npm run deploy
```

---

## After Deployment

### 1. Test the App
- Open your deployed URL
- Click "Host a Game" 
- Verify you can create a room

### 2. Set Up API Key
- Click "⚠️ Set API Key" in the header
- Enter your OpenAI API key
- Test AI features in a game

### 3. Share with Your Group
Send participants:
- Your deployed URL
- Instructions to join with the game code

---

## Troubleshooting

### "Permission denied" on Firebase
Make sure you're logged into the correct Google account:
```bash
firebase logout
firebase login
```

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase rules error
Deploy rules separately:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
firebase deploy --only hosting
```

---

## Cost Summary

| Service | Free Tier |
|---------|-----------|
| Firebase Hosting | 10GB/month, 360MB/day |
| Firebase Firestore | 50K reads, 20K writes/day |
| Firebase Storage | 5GB storage, 1GB/day download |
| Vercel | 100GB bandwidth/month |
| Netlify | 100GB bandwidth/month |

**OpenAI costs** (not included in hosting):
- GPT-4o-mini: ~$0.15 per 1M tokens
- DALL-E 3: ~$0.04 per image

A typical game session costs $1-5 in API usage.
