# Iris Scan Authentication System

A biometric authentication system using iris recognition with the MERN stack. Features real-time iris detection using MediaPipe FaceMesh and TensorFlow.js.

## Features

- Real-time iris detection and authentication
- 128-dimensional iris embedding vectors
- Cosine similarity matching for user verification
- MongoDB storage for user data
- Responsive React interface
- RESTful API backend

## Project Structure

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

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB Atlas account
- Web browser with webcam

### Backend Setup

Install dependencies:
```bash
cd backend
npm install
```

Create `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iris-auth
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start server:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Using the Application

1. Allow camera access
2. Register: Enter username, detect iris, capture
3. Login: Enter username, detect iris, authenticate

## How It Works

### Frontend
- Webcam captures video
- TensorFlow.js FaceMesh detects 478 facial landmarks
- Extract iris landmarks (indices 468-477)
- Generate 128-dimensional embedding vector
- Send to backend API

### Backend
- Store embeddings in MongoDB
- Compare embeddings using cosine similarity
- Authenticate if similarity > 80%

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/register` - Register new user
- `POST /api/login` - Authenticate user

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Render/Railway)
Deploy via dashboard and set environment variables

## Technologies

- React, TensorFlow.js, MediaPipe FaceMesh
- Node.js, Express, MongoDB
- Vercel, Render/Railway

## License

MIT
