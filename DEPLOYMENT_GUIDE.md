# 🌐 Deployment Guide

Complete guide for deploying your Iris Scan Authentication system to production.

## Overview

- **Frontend**: Deploy to Vercel (free, automatic HTTPS)
- **Backend**: Deploy to Render or Railway (free tier available)
- **Database**: MongoDB Atlas (free tier available)

---

## Part 1: MongoDB Atlas (Database)

### Already Covered in Setup
If you followed SETUP_GUIDE.md, your MongoDB Atlas is ready. Just ensure:
- ✅ Cluster is created
- ✅ Database user is created
- ✅ Network access allows all IPs (0.0.0.0/0)
- ✅ Connection string is saved

---

## Part 2: Backend Deployment (Render.com)

### Step 1: Prepare Backend for Deployment

1. Ensure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. Commit your code to GitHub:
```powershell
cd "c:\Users\Aditya Bhuran\OneDrive - Pace University\Desktop\Iris Scan Detection"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Iris Scan Authentication System"

# Create GitHub repository and push
# (Follow GitHub instructions to create a new repository)
git remote add origin https://github.com/YOUR_USERNAME/iris-scan-auth.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. **Sign up** at [Render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository
   - Choose "iris-scan-backend" or root directory

3. **Configure Service**:
   - **Name**: `iris-auth-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your location
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/iris-auth
   PORT = 10000
   JWT_SECRET = your_super_secret_key_change_this
   NODE_ENV = production
   ```

5. **Create Web Service**
   - Wait 3-5 minutes for deployment
   - Your backend will be at: `https://iris-auth-backend.onrender.com`

6. **Test Backend**:
   - Visit: `https://iris-auth-backend.onrender.com/api/health`
   - Should see: `{"status":"OK",...}`

### Step 3: Alternative - Deploy to Railway.app

1. **Sign up** at [Railway.app](https://railway.app)

2. **New Project**:
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure**:
   - Railway auto-detects Node.js
   - Set root directory to `backend` if needed

4. **Add Environment Variables**:
   - Go to "Variables" tab
   - Add:
     ```
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your_secret
     NODE_ENV=production
     ```

5. **Generate Domain**:
   - Settings → Generate Domain
   - You'll get: `https://your-app.railway.app`

6. **Test**: Visit `https://your-app.railway.app/api/health`

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

1. Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://iris-auth-backend.onrender.com/api
```
(Replace with your actual backend URL from Render/Railway)

2. Commit changes:
```powershell
git add .
git commit -m "Update production API URL"
git push
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (Your account)
# - Link to existing project? N
# - Project name? iris-scan-frontend
# - Directory? ./
# - Override settings? N

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard (Easier)

1. **Sign up** at [Vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**:
   - Add `REACT_APP_API_URL` = `https://iris-auth-backend.onrender.com/api`

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be at: `https://iris-scan-frontend.vercel.app`

### Step 3: Test Production App

1. Visit your Vercel URL: `https://iris-scan-frontend.vercel.app`
2. Allow camera access
3. Register a test user
4. Try logging in
5. Check similarity scores

---

## Part 4: Post-Deployment Configuration

### Update CORS (Backend)

Edit `backend/server.js`:

```javascript
const cors = require('cors');

// Update CORS configuration
app.use(cors({
  origin: [
    'https://iris-scan-frontend.vercel.app', // Your Vercel domain
    'http://localhost:3000' // For local development
  ],
  credentials: true
}));
```

Commit and push:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes.

### Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `iris-auth.yourdomain.com`)
3. Follow DNS configuration instructions

#### For Render (Backend):
1. Go to Settings → Custom Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records

---

## Part 5: Environment Variables Summary

### MongoDB Atlas
```
Connection String: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/iris-auth
```

### Backend (Render/Railway)
```
MONGODB_URI=mongodb+srv://...
PORT=10000 (Render) or $PORT (Railway)
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## Part 6: Monitoring & Maintenance

### Check Backend Logs

**Render**:
- Dashboard → Your Service → Logs tab

**Railway**:
- Project → Deployments → View Logs

### Check Frontend Logs

**Vercel**:
- Project → Deployments → View Function Logs

### MongoDB Monitoring

**Atlas**:
- Clusters → Metrics tab
- Monitor connections, operations, storage

### Health Checks

Set up automated monitoring:
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://www.pingdom.com) - Paid

Monitor:
- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-frontend.vercel.app`

---

## Part 7: Troubleshooting Deployment

### Backend Not Responding
1. Check Render/Railway logs for errors
2. Verify environment variables are set correctly
3. Test MongoDB connection string
4. Check if service is running (Render may sleep after 15 min of inactivity on free tier)

### Frontend Can't Connect to Backend
1. Verify `REACT_APP_API_URL` in Vercel environment variables
2. Check CORS settings in backend
3. Ensure backend is responding (visit `/api/health`)
4. Check browser console for errors (F12)

### CORS Errors
Update backend CORS to allow your Vercel domain:
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app'
}));
```

### MongoDB Connection Issues
1. Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
2. Verify connection string format
3. Check database user permissions

### Camera Not Working in Production
- Ensure you're using HTTPS (Vercel provides this automatically)
- Check browser permissions
- Test on multiple browsers

---

## Part 8: Costs

### Free Tier Limits

**MongoDB Atlas (Free)**:
- 512 MB storage
- Shared CPU
- ~Unlimited users for this app

**Render (Free)**:
- 750 hours/month
- Sleeps after 15 min inactivity
- 100 GB bandwidth/month

**Railway (Free)**:
- $5 credit/month
- Pay-as-you-go after credit

**Vercel (Free)**:
- Unlimited deployments
- 100 GB bandwidth/month
- 100 builds/day

### Upgrading (Optional)

If you need:
- **Always-on backend**: Render ($7/month) or Railway (~$5/month)
- **More database storage**: MongoDB Atlas ($9/month)
- **Custom domains**: Usually free on all platforms

---

## Part 9: Security Checklist

- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] MongoDB whitelist configured (0.0.0.0/0 or specific IPs)
- [ ] Strong JWT_SECRET generated
- [ ] Environment variables not in code
- [ ] CORS configured for production domains
- [ ] Rate limiting added (optional but recommended)
- [ ] Input validation enabled (already in code)
- [ ] Error messages don't expose sensitive info (already implemented)

---

## Part 10: Updates & Redeployment

### Update Backend Code

```powershell
# Make changes to backend files
git add .
git commit -m "Update backend feature"
git push
```

Render/Railway will **automatically redeploy** (usually takes 2-3 minutes).

### Update Frontend Code

```powershell
# Make changes to frontend files
git add .
git commit -m "Update frontend UI"
git push
```

Vercel will **automatically redeploy** (usually takes 1-2 minutes).

### Manual Redeploy

**Render**: Dashboard → Manual Deploy → Clear build cache & deploy

**Vercel**: Dashboard → Deployments → Redeploy

---

## Success! 🎉

Your Iris Scan Authentication System is now live in production!

**Your URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Backend Health: `https://your-backend.onrender.com/api/health`

**Share your app** and test it from different devices!

---

## Quick Reference Commands

### Local Development
```powershell
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm start
```

### Deploy Updates
```powershell
git add .
git commit -m "Your update message"
git push
```

### View Logs
- Render: Dashboard → Logs
- Railway: Project → Logs
- Vercel: Deployments → Function Logs

---

**Need Help?** Check the troubleshooting sections or review the main README.md.

**Congratulations on deploying your biometric authentication system! 🚀**
