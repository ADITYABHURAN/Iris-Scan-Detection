# 🔧 Troubleshooting & FAQ

Common issues and solutions for the Iris Scan Authentication System.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Camera & Detection Issues](#camera--detection-issues)
3. [Backend Connection Issues](#backend-connection-issues)
4. [MongoDB Issues](#mongodb-issues)
5. [Authentication Issues](#authentication-issues)
6. [Deployment Issues](#deployment-issues)
7. [Performance Issues](#performance-issues)
8. [FAQ](#frequently-asked-questions)

---

## Installation Issues

### Error: "npm: command not found"

**Problem**: Node.js is not installed.

**Solution**:
1. Download Node.js from [nodejs.org](https://nodejs.org)
2. Install LTS version (includes npm)
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Error: "Cannot find module 'express'"

**Problem**: Dependencies not installed.

**Solution**:
```powershell
cd backend
npm install
```

### Error: "EACCES: permission denied"

**Problem**: Permission issues (common on Mac/Linux).

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $USER /usr/local/lib/node_modules
# Or use nvm (recommended)
```

---

## Camera & Detection Issues

### Camera Not Working

#### Issue 1: "Permission denied" or camera blocked

**Symptoms**:
- Black screen in webcam component
- Browser shows blocked camera icon

**Solutions**:
1. **Chrome**: Settings → Privacy and security → Site settings → Camera → Allow
2. **Firefox**: Click camera icon in address bar → Allow
3. **Edge**: Settings → Cookies and site permissions → Camera → Allow

4. Check Windows camera permissions:
   ```
   Settings → Privacy → Camera → Allow apps to access camera
   ```

#### Issue 2: Camera works but no detection

**Symptoms**:
- Video shows but no red dots on eyes
- Status: "No face detected"

**Solutions**:
1. **Improve lighting**: Face the light source
2. **Position face**: Center face in camera, 1-2 feet away
3. **Remove obstructions**: Take off glasses, move hair from eyes
4. **Wait for model**: Allow 2-3 seconds for TensorFlow model to load
5. **Check console**: Press F12, look for errors in Console tab

#### Issue 3: Detection is slow or laggy

**Symptoms**:
- Video freezes
- Red dots appear delayed

**Solutions**:
1. Close other browser tabs
2. Reduce detection frequency in `IrisScanAuth.js`:
   ```javascript
   // Change from 100ms to 200ms
   const interval = setInterval(() => {
     detectIris();
   }, 200); // Slower but more stable
   ```
3. Use a better-performing browser (Chrome recommended)
4. Check CPU usage (close background apps)

### Model Loading Issues

#### Error: "Failed to load model" or "Network error"

**Solutions**:
1. Check internet connection (TensorFlow.js loads models from CDN)
2. Clear browser cache
3. Try different network (firewall might block model URLs)
4. Check browser console for specific error

---

## Backend Connection Issues

### Error: "Network Error" or "Cannot connect to backend"

#### Issue 1: Backend not running

**Symptoms**:
- Frontend shows "No response from server"
- `http://localhost:5000/api/health` doesn't load

**Solutions**:
1. Start backend server:
   ```powershell
   cd backend
   npm start
   ```
2. Verify it's running:
   - Look for: "🚀 Server is running on port 5000"
3. Test health endpoint:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:5000/api/health
   ```

#### Issue 2: Wrong API URL

**Symptoms**:
- Frontend can't reach backend in production

**Solutions**:
1. Check `frontend/.env.development`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
2. For production, update `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```
3. Restart frontend after changing .env:
   ```powershell
   # Stop (Ctrl+C) then restart
   npm start
   ```

#### Issue 3: CORS Error

**Symptoms**:
- Browser console: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions**:
1. Update `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-frontend.vercel.app'
     ],
     credentials: true
   }));
   ```
2. Restart backend
3. For development, can temporarily use:
   ```javascript
   app.use(cors()); // Allow all origins (DEV ONLY)
   ```

#### Issue 4: Port already in use

**Error**: "EADDRINUSE: address already in use :::5000"

**Solutions**:
1. Find process using port 5000:
   ```powershell
   # Windows
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```powershell
   # Replace PID with actual process ID
   taskkill /PID <PID> /F
   ```
3. Or change port in `backend/.env`:
   ```env
   PORT=5001
   ```

---

## MongoDB Issues

### Error: "MongoDB connection failed"

#### Issue 1: Invalid connection string

**Symptoms**:
- "MongoParseError: Invalid connection string"

**Solutions**:
1. Check format in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/iris-auth?retryWrites=true&w=majority
   ```
2. Common mistakes:
   - Missing `mongodb+srv://` prefix
   - Incorrect password (URL encode special characters)
   - Wrong database name (should be `iris-auth`)
3. URL encode password if it contains special characters:
   ```
   Password: P@ssw0rd!
   Encoded: P%40ssw0rd%21
   ```

#### Issue 2: Network timeout

**Symptoms**:
- "MongoNetworkError: connection timeout"
- "ETIMEDOUT"

**Solutions**:
1. **MongoDB Atlas IP Whitelist**:
   - Login to MongoDB Atlas
   - Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Wait 2-3 minutes for changes to apply

2. **Check firewall**:
   - Corporate/school networks may block MongoDB ports
   - Try different network (mobile hotspot)

3. **Verify cluster is running**:
   - MongoDB Atlas → Clusters
   - Status should be "Active"

#### Issue 3: Authentication failed

**Symptoms**:
- "MongoServerError: Authentication failed"

**Solutions**:
1. **Check username/password**:
   - MongoDB Atlas → Database Access
   - Verify user exists
   - Reset password if needed
   - Update `.env` with new password

2. **Check database permissions**:
   - User should have "Read and write to any database"
   - Or at least access to `iris-auth` database

### Error: "User validation failed"

**Problem**: Data doesn't match schema.

**Solutions**:
1. Check embedding length:
   ```javascript
   console.log(irisEmbedding.length); // Should be 128
   ```
2. Verify all values are numbers:
   ```javascript
   const allNumbers = irisEmbedding.every(val => 
     typeof val === 'number' && !isNaN(val)
   );
   ```

---

## Authentication Issues

### Registration Issues

#### Error: "Username already exists"

**Problem**: Trying to register duplicate username.

**Solutions**:
1. Choose different username
2. Or delete existing user from MongoDB:
   - MongoDB Atlas → Browse Collections
   - Find user → Delete

#### Error: "Iris embedding must be exactly 128 dimensions"

**Problem**: Invalid embedding generated.

**Solutions**:
1. Ensure iris is properly detected (red dots visible)
2. Check browser console for errors
3. Try again with better face positioning

### Login Issues

#### Error: "User not found"

**Problem**: Username doesn't exist in database.

**Solutions**:
1. Register first before logging in
2. Check username spelling (case-insensitive)
3. Verify user exists in MongoDB

#### Error: "Authentication failed" with high similarity (70-79%)

**Problem**: Similarity below threshold (80%).

**Solutions**:
1. **Adjust threshold** (if needed) in `backend/controllers/authController.js`:
   ```javascript
   const SIMILARITY_THRESHOLD = 0.75; // Lower threshold
   ```
2. **Improve detection**:
   - Better lighting
   - Same distance from camera as registration
   - Remove glasses if worn during registration
3. **Re-register**:
   - Delete old user
   - Register again with optimal conditions

#### Similarity Score Always Low (<60%)

**Problem**: Inconsistent iris detection.

**Solutions**:
1. **Environmental consistency**:
   - Same lighting conditions
   - Same camera
   - Same distance
2. **Check embedding quality**:
   ```javascript
   // In IrisScanAuth.js, log embedding
   console.log('Embedding:', irisEmbedding);
   ```
   - Should not be all zeros
   - Should have varied values
3. **Model not fully loaded**:
   - Wait 3-5 seconds after "Ready" status
   - Try detection multiple times

---

## Deployment Issues

### Vercel Deployment

#### Error: "Build failed" or "Command not found"

**Solutions**:
1. Check `vercel.json` configuration
2. Ensure correct build command in settings
3. Set root directory to `frontend`
4. Verify `package.json` has build script:
   ```json
   "scripts": {
     "build": "react-scripts build"
   }
   ```

#### Frontend deployed but can't connect to backend

**Solutions**:
1. Set environment variable in Vercel:
   - Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
2. Redeploy after adding variables
3. Check browser console for actual API URL being used

### Render Deployment

#### Backend keeps sleeping (free tier)

**Problem**: Render free tier sleeps after 15 minutes.

**Solutions**:
1. **Upgrade to paid tier** ($7/month) for always-on
2. **Use uptime monitor** (UptimeRobot) to ping every 14 minutes
3. **Use Railway** instead (better free tier)

#### Error: "Application failed to respond"

**Solutions**:
1. Check build logs in Render dashboard
2. Verify environment variables are set
3. Ensure `npm start` is correct start command
4. Check if MongoDB connection works:
   - View logs for "Connected to MongoDB" message

### Railway Deployment

#### Error: "Build failed"

**Solutions**:
1. Check build logs
2. Ensure `package.json` is in correct directory
3. Set root directory if needed
4. Verify Node.js version compatibility

---

## Performance Issues

### Slow Detection

**Symptoms**:
- Detection takes >1 second per frame
- UI lags

**Solutions**:
1. Reduce detection frequency:
   ```javascript
   const interval = setInterval(() => {
     detectIris();
   }, 200); // Instead of 100ms
   ```
2. Clear browser cache
3. Close other tabs/applications
4. Use Chrome (best TensorFlow.js performance)

### High CPU Usage

**Solutions**:
1. Stop detection when not needed:
   ```javascript
   handleStopDetection();
   ```
2. Reduce canvas drawing complexity
3. Lower video resolution in `Webcam` component:
   ```javascript
   videoConstraints={{
     width: 320,  // Lower resolution
     height: 240,
     facingMode: 'user'
   }}
   ```

### Slow Backend Response

**Solutions**:
1. Check MongoDB Atlas region (use closest)
2. Add database indexes (already done)
3. Monitor Render/Railway performance
4. Upgrade to paid tier if consistently slow

---

## Frequently Asked Questions

### General Questions

**Q: Can I use this for production?**

A: This is designed as an educational/proof-of-concept system. For production:
- Add liveness detection (anti-spoofing)
- Implement JWT sessions
- Add rate limiting
- Use dedicated security audits
- Consider privacy regulations (GDPR, CCPA)

**Q: How accurate is iris recognition?**

A: With proper conditions:
- Same person: 85-99% similarity
- Different person: 20-70% similarity
- Threshold at 80% provides good balance

**Q: Can I adjust the similarity threshold?**

A: Yes, edit `backend/controllers/authController.js`:
```javascript
const SIMILARITY_THRESHOLD = 0.80; // Adjust as needed
```

**Q: Does it work with glasses?**

A: Depends on glasses:
- Clear lenses: Usually works
- Reflective/tinted: May cause issues
- Recommendation: Register and login with same conditions

**Q: Can someone login with my photo?**

A: Current implementation is vulnerable to photo attacks. For production:
- Add liveness detection (blink detection)
- Use 3D depth sensing
- Implement challenge-response

**Q: How many users can it support?**

A: MongoDB free tier: ~500,000 users (512 MB storage, ~1 KB per user)

**Q: Can I use a different ML model?**

A: Yes! You can swap TensorFlow.js FaceMesh for:
- Custom trained models
- Face-api.js
- Azure Face API
- AWS Rekognition

### Technical Questions

**Q: Why 128 dimensions for embedding?**

A: Balance between:
- Uniqueness (higher dimensions = more unique)
- Performance (lower dimensions = faster)
- Storage (128 floats = ~512 bytes)

**Q: Why cosine similarity instead of Euclidean distance?**

A: Cosine similarity:
- Measures angle, not magnitude
- More robust to scaling differences
- Better for high-dimensional vectors
- Range [-1, 1] easier to interpret

**Q: Can I store embeddings in a different database?**

A: Yes! Options:
- PostgreSQL (with vector extension)
- Pinecone (vector database)
- Weaviate (vector search engine)
- Redis (with RedisAI)

**Q: How to improve accuracy?**

A:
1. Use more facial landmarks (full face, not just iris)
2. Increase embedding dimensions (128 → 256)
3. Use deep learning models (FaceNet, ArcFace)
4. Add temporal consistency (multiple frames)
5. Ensemble multiple models

**Q: Is the system real-time?**

A: Yes, detection runs at ~10 FPS (100ms per frame)

**Q: Can I add multiple faces per user?**

A: Yes, modify schema:
```javascript
irisEmbeddings: [[Number]], // Array of arrays
```
Store multiple embeddings and match against all.

---

## Debugging Tips

### Frontend Debugging

1. **Check browser console** (F12):
   - Look for errors in Console tab
   - Check Network tab for failed requests
   - View Application tab for storage

2. **Add console logs**:
   ```javascript
   console.log('Iris embedding:', irisEmbedding);
   console.log('API response:', response);
   ```

3. **React DevTools**:
   - Install React DevTools extension
   - Inspect component state

### Backend Debugging

1. **Check server logs**:
   - Terminal shows all requests
   - Look for error stack traces

2. **Add logging**:
   ```javascript
   console.log('Received request:', req.body);
   console.log('Similarity:', similarity);
   ```

3. **Test with Postman**:
   - Send test requests manually
   - Verify responses

4. **MongoDB debugging**:
   ```javascript
   // In controller
   const users = await User.find({});
   console.log('All users:', users);
   ```

---

## Still Having Issues?

### Checklist

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install` in both directories)
- [ ] MongoDB Atlas configured correctly
- [ ] `.env` file created with correct values
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Camera permissions granted
- [ ] CORS configured for your domain
- [ ] Environment variables set in Vercel/Render

### Getting Help

1. **Check console errors** (frontend and backend)
2. **Review logs** (server terminal, Render/Vercel dashboards)
3. **Test each component** individually
4. **Search error messages** online
5. **Create minimal reproduction** of issue

---

## Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Iris similarity below threshold |
| 404 | Not Found | User doesn't exist, register first |
| 409 | Conflict | Username already exists |
| 500 | Server Error | Check backend logs |

---

**Updated**: November 2024

**For more help**: Review README.md, SETUP_GUIDE.md, and ARCHITECTURE.md
