# 📊 Project Structure Visualization

```
Iris Scan Detection/
│
├── 📄 README.md                    # Main documentation
├── 📄 SETUP_GUIDE.md               # Step-by-step setup instructions
├── 📄 DEPLOYMENT_GUIDE.md          # Production deployment guide
├── 📄 ARCHITECTURE.md              # Technical architecture details
├── 📄 TROUBLESHOOTING.md           # Common issues and solutions
├── 📄 PROJECT_STRUCTURE.md         # This file
│
├── 📁 frontend/                    # React Application (Port 3000)
│   │
│   ├── 📁 public/
│   │   └── index.html              # HTML template
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── IrisScanAuth.js     # ⭐ Main iris scanning component
│   │   │   └── IrisScanAuth.css    # Component styles
│   │   │
│   │   ├── 📁 services/
│   │   │   └── api.js              # 🔌 API calls to backend
│   │   │
│   │   ├── 📁 utils/
│   │   │   └── irisProcessing.js   # 🧠 Iris embedding extraction (128D vector)
│   │   │
│   │   ├── App.js                  # Main app component
│   │   ├── App.css                 # App styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   │
│   ├── .env.development            # Dev environment variables
│   ├── .env.production             # Production environment variables
│   ├── .gitignore                  # Git ignore rules
│   ├── package.json                # Frontend dependencies
│   └── vercel.json                 # Vercel deployment config
│
├── 📁 backend/                     # Express API Server (Port 5000)
│   │
│   ├── 📁 controllers/
│   │   └── authController.js       # 🔐 Authentication logic
│   │       ├── register()          # Store iris embedding
│   │       └── login()             # Compare iris embeddings
│   │
│   ├── 📁 models/
│   │   └── User.js                 # 💾 MongoDB user schema
│   │       ├── username: String
│   │       ├── irisEmbedding: [Number] (128D)
│   │       ├── createdAt: Date
│   │       └── lastLogin: Date
│   │
│   ├── 📁 routes/
│   │   └── authRoutes.js           # 🛣️ API route definitions
│   │       ├── POST /api/register
│   │       └── POST /api/login
│   │
│   ├── 📁 utils/
│   │   └── vectorMath.js           # 📐 Cosine similarity calculations
│   │       ├── cosineSimilarity()
│   │       ├── euclideanDistance()
│   │       └── validateEmbedding()
│   │
│   ├── .env                        # ⚠️ CREATE THIS (see .env.example)
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   ├── server.js                   # ⚙️ Express server entry point
│   ├── package.json                # Backend dependencies
│   ├── render.yaml                 # Render deployment config
│   ├── railway.json                # Railway deployment config
│   └── Procfile                    # Heroku deployment config
│
└── 📁 (MongoDB Atlas)              # Cloud Database
    └── Collection: users
        └── Documents:
            ├── { username: "user1", irisEmbedding: [128 numbers], ... }
            ├── { username: "user2", irisEmbedding: [128 numbers], ... }
            └── ...
```

---

## 🔄 Data Flow Diagram

### Registration Flow:
```
User Input (Username)
    ↓
Webcam Capture
    ↓
TensorFlow.js FaceMesh Detection (478 landmarks)
    ↓
Iris Extraction (10 points: indices 468-477)
    ↓
Embedding Generation (128 dimensions)
    ↓
POST /api/register { username, irisEmbedding }
    ↓
Validation (length, format, uniqueness)
    ↓
MongoDB Storage
    ↓
Success Response
    ↓
UI Confirmation
```

### Login Flow:
```
User Input (Username)
    ↓
Webcam Capture
    ↓
TensorFlow.js FaceMesh Detection
    ↓
Iris Extraction
    ↓
Embedding Generation (128 dimensions)
    ↓
POST /api/login { username, irisEmbedding }
    ↓
Fetch Stored Embedding from MongoDB
    ↓
Cosine Similarity Calculation
    ↓
Compare to Threshold (80%)
    ↓
Authentication Result (Success/Fail)
    ↓
Update lastLogin (if success)
    ↓
Response with Similarity Score
    ↓
UI Display Result
```

---

## 📦 Dependencies Map

### Frontend Dependencies:
```
react (18.2.0)
  └── UI framework

react-dom (18.2.0)
  └── React DOM renderer

react-scripts (5.0.1)
  └── Build tooling

@tensorflow/tfjs (4.11.0)
  └── Machine learning runtime

@tensorflow-models/face-landmarks-detection (1.0.2)
  └── MediaPipe FaceMesh model

react-webcam (7.1.1)
  └── Camera access

axios (1.6.0)
  └── HTTP client
```

### Backend Dependencies:
```
express (4.18.2)
  └── Web framework

mongoose (8.0.0)
  └── MongoDB ODM

cors (2.8.5)
  └── CORS middleware

dotenv (16.3.1)
  └── Environment variables

bcryptjs (2.4.3)
  └── Password hashing (future use)

jsonwebtoken (9.0.2)
  └── JWT tokens (future use)

nodemon (3.0.1) [dev]
  └── Auto-restart on changes
```

---

## 🎯 Key Files Reference

### Must Read First:
1. **README.md** - Overview and main documentation
2. **SETUP_GUIDE.md** - Installation instructions
3. **backend/.env.example** - Required environment variables

### For Development:
1. **frontend/src/components/IrisScanAuth.js** - Main UI component
2. **frontend/src/utils/irisProcessing.js** - Embedding extraction logic
3. **backend/controllers/authController.js** - Authentication logic
4. **backend/utils/vectorMath.js** - Similarity calculations

### For Deployment:
1. **DEPLOYMENT_GUIDE.md** - Full deployment instructions
2. **frontend/vercel.json** - Vercel configuration
3. **backend/render.yaml** - Render configuration
4. **backend/.env** - Production environment variables

### For Troubleshooting:
1. **TROUBLESHOOTING.md** - Common issues and solutions
2. **ARCHITECTURE.md** - Technical deep dive

---

## 🔍 File Locations Quick Reference

### Configuration Files:
```
Frontend Config:
  ├── frontend/package.json           # Dependencies
  ├── frontend/.env.development       # Dev API URL
  ├── frontend/.env.production        # Prod API URL
  └── frontend/vercel.json            # Vercel settings

Backend Config:
  ├── backend/package.json            # Dependencies
  ├── backend/.env                    # ⚠️ YOU MUST CREATE
  └── backend/server.js               # Server setup
```

### Core Logic Files:
```
Iris Detection & Embedding:
  └── frontend/src/utils/irisProcessing.js

API Communication:
  └── frontend/src/services/api.js

Authentication:
  └── backend/controllers/authController.js

Vector Comparison:
  └── backend/utils/vectorMath.js

Database Schema:
  └── backend/models/User.js
```

### UI Files:
```
Main App:
  ├── frontend/src/App.js
  └── frontend/src/App.css

Iris Scan Component:
  ├── frontend/src/components/IrisScanAuth.js
  └── frontend/src/components/IrisScanAuth.css

HTML Template:
  └── frontend/public/index.html
```

---

## 📝 File Size Reference

```
Total Project Size: ~100 MB (with node_modules)
Without node_modules: ~500 KB

Frontend:
  ├── node_modules/: ~60 MB
  ├── src/: ~50 KB
  └── build/: ~2 MB (after build)

Backend:
  ├── node_modules/: ~30 MB
  └── src/: ~20 KB

Documentation: ~150 KB
```

---

## 🗂️ Where to Find What

### "I want to change the UI"
📁 `frontend/src/components/IrisScanAuth.css`
📁 `frontend/src/App.css`

### "I want to modify iris detection"
📁 `frontend/src/utils/irisProcessing.js`
Function: `extractIrisEmbedding()`

### "I want to change similarity threshold"
📁 `backend/controllers/authController.js`
Line: `const SIMILARITY_THRESHOLD = 0.80;`

### "I want to add new API endpoints"
📁 `backend/routes/authRoutes.js` (add route)
📁 `backend/controllers/authController.js` (add logic)

### "I want to modify database schema"
📁 `backend/models/User.js`

### "I want to change MongoDB connection"
📁 `backend/.env`
Variable: `MONGODB_URI`

### "I want to deploy to production"
📄 Read: `DEPLOYMENT_GUIDE.md`
📁 Config: `frontend/vercel.json` (frontend)
📁 Config: `backend/render.yaml` (backend)

---

## 💡 Quick Tips

### To add a new field to user profile:
1. Update `backend/models/User.js` (schema)
2. Update `backend/controllers/authController.js` (save logic)
3. Update `frontend/src/components/IrisScanAuth.js` (UI)
4. Update `frontend/src/services/api.js` (API call)

### To improve accuracy:
1. Modify `frontend/src/utils/irisProcessing.js` (add more features)
2. Increase embedding dimensions (e.g., 128 → 256)
3. Adjust `SIMILARITY_THRESHOLD` in backend

### To add JWT authentication:
1. Update `backend/controllers/authController.js` (generate token)
2. Create middleware: `backend/middleware/auth.js`
3. Apply to protected routes
4. Store token in frontend (localStorage)
5. Send token in API headers

---

## 🎨 Color Scheme (for customization)

```css
Primary: #667eea (Purple)
Secondary: #764ba2 (Deep Purple)
Success: #28a745 (Green)
Error: #dc3545 (Red)
Warning: #ffc107 (Yellow)
Info: #17a2b8 (Cyan)
```

Found in:
- `frontend/src/App.css`
- `frontend/src/components/IrisScanAuth.css`
- `frontend/src/index.css`

---

## 📚 Learning Path

### Beginner:
1. Read **README.md**
2. Follow **SETUP_GUIDE.md**
3. Run the application locally
4. Explore the UI

### Intermediate:
1. Read **ARCHITECTURE.md**
2. Study `irisProcessing.js` (embedding extraction)
3. Study `vectorMath.js` (cosine similarity)
4. Modify UI components

### Advanced:
1. Read **TROUBLESHOOTING.md**
2. Follow **DEPLOYMENT_GUIDE.md**
3. Deploy to production
4. Add new features (JWT, liveness detection)
5. Optimize performance

---

## 🔗 External Resources

### Models Downloaded (Auto):
- TensorFlow.js FaceMesh: ~10 MB
- Downloaded from: `https://tfhub.dev/mediapipe/`
- Cached in browser

### APIs Used:
- Frontend ↔ Backend: REST API (JSON)
- Backend ↔ MongoDB: Mongoose ODM
- Camera: WebRTC (getUserMedia)

---

**Last Updated**: November 2024

**Maintained by**: Your Name

**License**: MIT
