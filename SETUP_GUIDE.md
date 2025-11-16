# 🚀 Quick Setup Guide

## Step-by-Step Installation (Windows)

### 1. Backend Setup

Open PowerShell in the backend directory:

```powershell
# Navigate to backend folder
cd "c:\Users\Aditya Bhuran\OneDrive - Pace University\Desktop\Iris Scan Detection\backend"

# Install dependencies
npm install

# Create .env file from example
Copy-Item .env.example .env

# Edit .env file (you'll need to add your MongoDB URI)
notepad .env
```

**In .env file, update:**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/iris-auth
```

**Start the backend server:**
```powershell
npm start
```

Expected output:
```
🚀 Server is running on port 5000
✅ Connected to MongoDB successfully
📍 Health check: http://localhost:5000/api/health
```

### 2. Frontend Setup

Open a NEW PowerShell window:

```powershell
# Navigate to frontend folder
cd "c:\Users\Aditya Bhuran\OneDrive - Pace University\Desktop\Iris Scan Detection\frontend"

# Install dependencies
npm install

# Start the development server
npm start
```

Your browser should automatically open to `http://localhost:3000`

### 3. MongoDB Atlas Setup (If you don't have a MongoDB URI)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project called "IrisAuth"
4. Build a Database → Choose FREE tier (M0)
5. Create cluster (leave default settings)
6. **Security Quickstart**:
   - Username: `irisadmin` (or your choice)
   - Password: Generate strong password (save it!)
   - Click "Create User"
7. **Network Access**:
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
8. **Connect**:
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `iris-auth`

Example:
```
mongodb+srv://irisadmin:MyPassword123@cluster0.abcde.mongodb.net/iris-auth?retryWrites=true&w=majority
```

Paste this into your `backend/.env` file as `MONGODB_URI`

### 4. Test the Application

1. Open http://localhost:3000
2. Allow camera access when prompted
3. Click "Register New User"
4. Enter username: `testuser`
5. Click "Start Detection"
6. Wait for red dots on your eyes
7. Click "Capture & Register"
8. You should see: ✅ User registered successfully

Now test login:
1. Click "Login" tab
2. Enter username: `testuser`
3. Click "Start Detection"
4. Click "Capture & Login"
5. You should see: ✅ Authentication successful (Similarity: XX%)

## Common Commands

### Backend Commands
```powershell
cd backend

# Install dependencies
npm install

# Start server (production mode)
npm start

# Start server (development mode with auto-restart)
npm run dev

# Install development dependencies
npm install --save-dev nodemon
```

### Frontend Commands
```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

## File Locations Reference

All files are located in:
```
c:\Users\Aditya Bhuran\OneDrive - Pace University\Desktop\Iris Scan Detection\
```

### Backend Files (backend/)
- `server.js` - Main Express server
- `models/User.js` - MongoDB user schema
- `controllers/authController.js` - Authentication logic
- `routes/authRoutes.js` - API routes
- `utils/vectorMath.js` - Cosine similarity calculations
- `.env` - Environment variables (YOU MUST CREATE THIS)
- `package.json` - Dependencies

### Frontend Files (frontend/)
- `src/App.js` - Main application component
- `src/components/IrisScanAuth.js` - Iris scanning component
- `src/utils/irisProcessing.js` - Embedding extraction
- `src/services/api.js` - Backend API calls
- `src/index.js` - React entry point
- `package.json` - Dependencies

## Troubleshooting

### Error: "Cannot find module 'express'"
```powershell
cd backend
npm install
```

### Error: "MongoDB connection failed"
- Check your MONGODB_URI in `.env`
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Verify username and password are correct

### Error: "EADDRINUSE: address already in use"
Backend port 5000 is already in use. Stop the other process or change port:
```powershell
# In backend/.env, change:
PORT=5001
```

### Camera Not Working
- Use Chrome browser (recommended)
- Check camera permissions in browser settings
- Try HTTPS instead of HTTP (for production)

### "No face detected"
- Ensure good lighting
- Position face directly in front of camera
- Wait 2-3 seconds for model to load
- Check browser console (F12) for errors

## Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/iris-auth
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env.development)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Next Steps

After local setup works:
1. Read the main README.md for detailed explanations
2. Review the deployment section for production setup
3. Customize the similarity threshold if needed
4. Add additional security features
5. Deploy to Vercel (frontend) and Render (backend)

## Quick Test Commands

Test backend health:
```powershell
# PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/health
```

Or open in browser: http://localhost:5000/api/health

Test frontend: http://localhost:3000

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review console logs (F12 in browser)
3. Check backend terminal for error messages
4. Verify all dependencies are installed
5. Ensure MongoDB Atlas is configured correctly

Good luck! 🚀
