# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **mazestepper-multiplayer** (or your choice)
- In which directory is your code located? **./ui**
- Want to override settings? **N**

4. **Deploy to Production**
```bash
vercel --prod
```

### Option 2: Deploy via GitHub

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Other
     - **Root Directory**: `./ui`
     - **Build Command**: (leave empty)
     - **Output Directory**: (leave empty)
   - Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ayushsaklani-min/mazelina)

## Configuration

The project includes:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `package.json` - Project metadata

## What Gets Deployed

Only the frontend files:
- `ui/index.html`
- `ui/app.js`
- `ui/style.css`

The Rust contract code and build artifacts are excluded.

## After Deployment

Your game will be live at:
```
https://mazestepper-multiplayer.vercel.app
```
(or your custom domain)

### Test the Deployment

1. Visit your Vercel URL
2. Click "Join Game"
3. Use arrow buttons to play
4. Open in multiple tabs to test multiplayer

## Environment Variables

No environment variables needed - the game runs entirely client-side!

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Issue: 404 Not Found
**Solution**: Make sure `vercel.json` is in the root directory

### Issue: Blank Page
**Solution**: Check browser console for errors. Ensure all files are in the `ui` folder.

### Issue: Game Not Working
**Solution**: The game works offline - no blockchain connection needed for demo mode.

## Updating Your Deployment

```bash
# Make changes to ui files
git add .
git commit -m "Update game"
git push

# Or redeploy directly
vercel --prod
```

## Cost

Vercel's free tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

Perfect for this project!
