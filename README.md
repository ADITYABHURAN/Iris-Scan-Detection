# 🔒 Iris Scan Detection and Authentication System

A complete biometric authentication system using iris recognition, built with the MERN stack (MongoDB, Express, React, Node.js). This system uses real-time iris detection via MediaPipe FaceMesh and TensorFlow.js to capture unique iris patterns and authenticate users with high accuracy.

## 🌟 Features

- **Real-time Iris Detection**: Uses MediaPipe FaceMesh for accurate iris landmark detection
- **Biometric Authentication**: 128-dimensional iris embedding vectors for unique identification
- **Cosine Similarity Matching**: Advanced vector comparison for authentication
- **Secure Storage**: MongoDB for encrypted iris pattern storage
- **Modern UI**: Responsive React interface with real-time webcam preview
- **RESTful API**: Express.js backend with clear API endpoints
- **Production Ready**: Deployment configurations for Vercel and Render/Railway

## 📁 Project Structure

```
Iris Scan Detection/
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── IrisScanAuth.js     # Main iris scan component
│   │   │   └── IrisScanAuth.css    # Component styles
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── utils/
│   │   │   └── irisProcessing.js   # Iris embedding extraction
│   │   ├── App.js                   # Main app component
│   │   ├── App.css                  # App styles
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   ├── .env.development         # Development environment variables
│   ├── .env.production          # Production environment variables
│   ├── package.json             # Frontend dependencies
│   └── vercel.json              # Vercel deployment config
│
├── backend/                     # Express API server
│   ├── controllers/
│   │   └── authController.js    # Authentication business logic
│   ├── models/
│   │   └── User.js              # MongoDB user schema
│   ├── routes/
│   │   └── authRoutes.js        # API route definitions
│   ├── utils/
│   │   └── vectorMath.js        # Cosine similarity & vector operations
│   ├── .env.example             # Environment variables template
│   ├── server.js                # Express server entry point
│   ├── package.json             # Backend dependencies
│   ├── render.yaml              # Render deployment config
│   ├── railway.json             # Railway deployment config
│   └── Procfile                 # Heroku deployment config
│
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Modern web browser** with webcam access

### 1️⃣ Clone the Repository

```bash
cd "c:\Users\Aditya Bhuran\OneDrive - Pace University\Desktop\Iris Scan Detection"
```

### 2️⃣ Backend Setup

#### Install Dependencies

```powershell
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/iris-auth?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**To get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<username>` and `<password>`

#### Start Backend Server

```powershell
npm start
```

Server should be running at `http://localhost:5000`

Test it: Visit `http://localhost:5000/api/health`

### 3️⃣ Frontend Setup

Open a **new terminal window**:

#### Install Dependencies

```powershell
cd frontend
npm install
```

#### Start React Development Server

```powershell
npm start
```

Frontend should open at `http://localhost:3000`

### 4️⃣ Using the Application

1. **Allow Camera Access**: When prompted, allow the browser to access your webcam
2. **Register a User**:
   - Click "Register New User" tab
   - Enter a username
   - Click "Start Detection"
   - Position your face clearly in the camera
   - Wait for red dots to appear on your eyes (iris detected)
   - Click "Capture & Register"
3. **Login**:
   - Click "Login" tab
   - Enter your username
   - Click "Start Detection"
   - Position your face in the camera
   - Click "Capture & Login"
   - System will authenticate based on iris similarity (threshold: 80%)

## 🧠 How It Works

### Frontend (React + TensorFlow.js)

1. **Webcam Capture**: `react-webcam` captures live video feed
2. **Face Detection**: TensorFlow.js FaceMesh model detects 478 facial landmarks
3. **Iris Extraction**: Landmarks 468-477 represent iris points (5 per eye)
4. **Embedding Generation**: 128-dimensional vector created from:
   - Raw iris coordinates
   - Iris center positions
   - Iris diameters
   - Inter-point distances
   - Angles and aspect ratios
   - Statistical features (variance, symmetry)
5. **API Communication**: Axios sends embedding to backend

**Key File**: `frontend/src/utils/irisProcessing.js`
- `extractIrisEmbedding()`: Generates 128-dimensional vector
- Features include: coordinates, distances, angles, symmetry metrics

### Backend (Node.js + Express + MongoDB)

1. **Registration** (`POST /api/register`):
   - Validates username and embedding
   - Checks for duplicate users
   - Stores embedding in MongoDB
   
2. **Authentication** (`POST /api/login`):
   - Retrieves stored embedding
   - Calculates cosine similarity
   - Returns match result (threshold: 80%)

**Key File**: `backend/utils/vectorMath.js`
- `cosineSimilarity()`: Compares two vectors
- Formula: `cos(θ) = (A · B) / (||A|| × ||B||)`
- Returns value: 1 (identical) to -1 (opposite)

### Database Schema

**User Model** (`backend/models/User.js`):
```javascript
{
  username: String (unique, required),
  irisEmbedding: [Number] (128 dimensions),
  createdAt: Date,
  lastLogin: Date
}
```

## 🔧 API Endpoints

### Health Check
```
GET /api/health
Response: { status: "OK", message: "...", timestamp: "..." }
```

### Register User
```
POST /api/register
Body: {
  "username": "john_doe",
  "irisEmbedding": [128 numbers...]
}
Response: {
  "success": true,
  "message": "User registered successfully",
  "user": { "username": "john_doe", "createdAt": "..." }
}
```

### Login User
```
POST /api/login
Body: {
  "username": "john_doe",
  "irisEmbedding": [128 numbers...]
}
Response: {
  "success": true,
  "message": "Authentication successful",
  "similarity": "94.52",
  "user": { "username": "john_doe", "lastLogin": "..." }
}
```

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```powershell
   cd frontend
   vercel
   ```

3. **Follow prompts**:
   - Link to your Vercel account
   - Configure project settings
   - Deploy!

4. **Set Environment Variables** in Vercel Dashboard:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com/api`)

5. **Update** `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

### Backend Deployment (Render)

1. **Go to** [Render.com](https://render.com)
2. **Create New Web Service**
3. **Connect GitHub Repository** (or deploy manually)
4. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=mongodb+srv://...
     PORT=10000 (Render default)
     JWT_SECRET=your_secret_key
     NODE_ENV=production
     ```
5. **Deploy**
6. **Copy your Render URL** (e.g., `https://iris-auth-backend.onrender.com`)

### Backend Deployment (Railway)

1. **Go to** [Railway.app](https://railway.app)
2. **Create New Project** → "Deploy from GitHub"
3. **Select Repository**
4. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   PORT=$PORT (Railway auto-assigns)
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   ```
5. **Deploy**
6. **Generate Domain** in Railway settings

### Alternative: Heroku

```powershell
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## 🔐 Security Considerations

1. **HTTPS Required**: Always use HTTPS in production for secure data transmission
2. **Environment Variables**: Never commit `.env` files to version control
3. **MongoDB Security**: Enable IP whitelisting and strong passwords
4. **Rate Limiting**: Consider adding rate limiting to prevent brute force attacks
5. **CORS Configuration**: Update CORS settings for production domains
6. **Embedding Storage**: Iris embeddings are stored as numerical vectors (not raw images)

## 🧪 Testing

### Test Backend Locally

```powershell
cd backend
npm start
```

Visit: `http://localhost:5000/api/health`

### Test Frontend Locally

```powershell
cd frontend
npm start
```

Visit: `http://localhost:3000`

### Manual API Testing (Postman/cURL)

**Register**:
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","irisEmbedding":[0.1,0.2,...]}'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","irisEmbedding":[0.1,0.2,...]}'
```

## 📊 Similarity Threshold

The default authentication threshold is **80%** (0.80 cosine similarity).

**Adjust in**: `backend/controllers/authController.js`

```javascript
const SIMILARITY_THRESHOLD = 0.80; // Change this value
```

**Recommended ranges**:
- **0.75-0.80**: Lenient (may allow more false positives)
- **0.80-0.85**: Balanced (recommended)
- **0.85-0.95**: Strict (may reject valid users)

## 🐛 Troubleshooting

### Camera Not Working
- Ensure browser has camera permissions
- Use HTTPS in production (HTTP may block camera access)
- Try different browsers (Chrome recommended)

### "Cannot connect to backend"
- Check if backend server is running
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in `backend/server.js`

### "MongoDB connection error"
- Verify MongoDB URI in `.env`
- Check network IP is whitelisted in MongoDB Atlas
- Ensure cluster is running

### "Iris not detected"
- Ensure good lighting
- Position face clearly in camera
- Wait for model to load completely
- Check browser console for errors

## 📚 Technologies Used

### Frontend
- **React** 18.2.0 - UI framework
- **TensorFlow.js** 4.11.0 - Machine learning
- **@tensorflow-models/face-landmarks-detection** 1.0.2 - Face/iris detection
- **react-webcam** 7.1.1 - Camera access
- **axios** 1.6.0 - HTTP client

### Backend
- **Express** 4.18.2 - Web framework
- **MongoDB** (Mongoose 8.0.0) - Database
- **Node.js** - Runtime environment

### Deployment
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting
- **MongoDB Atlas** - Database hosting

## 📖 Additional Resources

- [MediaPipe FaceMesh Documentation](https://google.github.io/mediapipe/solutions/face_mesh.html)
- [TensorFlow.js Face Landmarks](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Render Deployment Docs](https://render.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack and advanced biometric technology.

## 🎯 Future Enhancements

- [ ] Add JWT token-based sessions
- [ ] Implement multi-factor authentication
- [ ] Add user profile management
- [ ] Support for multiple iris enrollments per user
- [ ] Real-time liveness detection
- [ ] Admin dashboard for user management
- [ ] Mobile app (React Native)
- [ ] Performance analytics and logging

---

**Need Help?** Check the troubleshooting section or open an issue on GitHub.

**Ready to Deploy?** Follow the deployment sections for Vercel (frontend) and Render/Railway (backend).

**Happy Coding! 🚀**
