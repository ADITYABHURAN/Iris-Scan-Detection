# 🚀 IRIS SCAN DETECTION - DEPLOYMENT GUIDE

## Prerequisites
1. Heroku account (https://signup.heroku.com/)
2. Netlify account (https://app.netlify.com/signup)
3. MongoDB Atlas cluster already set up ✅

---

## 📦 STEP 1: DEPLOY BACKEND TO HEROKU

### 1.1 Install Heroku CLI (if not installed)
Download from: https://devcenter.heroku.com/articles/heroku-cli

### 1.2 Login to Heroku
```powershell
heroku login
```

### 1.3 Create Heroku App
```powershell
cd backend
heroku create iris-scan-backend
```
(Note: If name is taken, Heroku will suggest an available name)

### 1.4 Set Environment Variables on Heroku
```powershell
heroku config:set MONGODB_URI="mongodb+srv://ADITYABHURAN:Neu@12341121@cluster0.mr4bp3i.mongodb.net/iris-auth?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="iris_scan_secret_key_2024"
heroku config:set NODE_ENV="production"
```

### 1.5 Deploy Backend
```powershell
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

If you get branch error, use:
```powershell
git push heroku master
```

### 1.6 Verify Backend Deployment
```powershell
heroku open
```
Your backend URL will be something like: `https://iris-scan-backend-xxxxx.herokuapp.com`

**Test the API:**
Visit: `https://your-heroku-app.herokuapp.com/api/health`

---

## 🌐 STEP 2: DEPLOY FRONTEND TO NETLIFY

### 2.1 Update Frontend Environment Variable
Create `frontend/.env.production` file:
```
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
```

Replace `your-heroku-app` with your actual Heroku app name.

### 2.2 Build Frontend
```powershell
cd ..\frontend
npm run build
```

### 2.3 Install Netlify CLI (if not installed)
```powershell
npm install -g netlify-cli
```

### 2.4 Login to Netlify
```powershell
netlify login
```

### 2.5 Deploy to Netlify
```powershell
netlify deploy --prod
```

When prompted:
- Choose: "Create & configure a new site"
- Site name: `iris-scan-auth` (or your preferred name)
- Publish directory: `build`

Your frontend URL will be: `https://iris-scan-auth.netlify.app`

---

## 🔧 STEP 3: UPDATE BACKEND CORS

After getting your Netlify URL, update backend CORS:

Edit `backend/server.js` - the CORS section should allow your Netlify domain:
```javascript
const corsOptions = {
  origin: [
    'https://iris-scan-auth.netlify.app',
    'https://your-actual-netlify-url.netlify.app'
  ],
  credentials: true
};
```

Then redeploy backend:
```powershell
cd backend
git add .
git commit -m "Update CORS for production"
git push heroku main
```

---

## ✅ STEP 4: TEST YOUR DEPLOYED APP

1. Open your Netlify URL: `https://iris-scan-auth.netlify.app`
2. Allow camera access
3. Test registration with a username
4. Test login with the same username

---

## 🐛 TROUBLESHOOTING

### Backend Issues
Check Heroku logs:
```powershell
heroku logs --tail
```

### Frontend Issues
Check browser console (F12) for errors

### Database Connection
Verify MongoDB Atlas:
- IP Whitelist: Add `0.0.0.0/0` to allow all IPs
- Database user: `ADITYABHURAN` with correct password

---

## 📝 QUICK DEPLOYMENT COMMANDS

**Backend (Heroku):**
```powershell
cd backend
git add .
git commit -m "Update"
git push heroku main
```

**Frontend (Netlify):**
```powershell
cd frontend
npm run build
netlify deploy --prod
```

---

## 🔐 IMPORTANT NOTES

1. **MongoDB Atlas**: Already configured ✅
2. **Heroku Free Tier**: Apps sleep after 30 min of inactivity (first request may be slow)
3. **Netlify Free Tier**: 300 build minutes/month
4. **Camera Access**: Only works over HTTPS (both platforms provide this)

---

## 📞 NEXT STEPS

1. Start with backend deployment (Step 1)
2. Get your Heroku URL
3. Update frontend environment variable with Heroku URL
4. Deploy frontend (Step 2)
5. Update backend CORS (Step 3)
6. Test everything! (Step 4)

---

Good luck! 🚀
