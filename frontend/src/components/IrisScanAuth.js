/**
 * IRIS SCAN AUTHENTICATION COMPONENT
 * Location: frontend/src/components/IrisScanAuth.js
 * 
 * This is the main component that handles:
 * - Webcam capture
 * - Iris detection using MediaPipe FaceMesh
 * - Embedding extraction from iris landmarks
 * - User registration and login via API calls
 */

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs';
import { registerUser, loginUser } from '../services/api';
import { extractIrisEmbedding } from '../utils/irisProcessing';
import './IrisScanAuth.css';

const IrisScanAuth = ({ mode }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize FaceMesh detector
  useEffect(() => {
    const loadDetector = async () => {
      try {
        setStatus('Loading AI model...');
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: 'tfjs',
          refineLandmarks: true, // Essential for iris detection
          maxFaces: 1
        };
        
        const faceDetector = await faceLandmarksDetection.createDetector(
          model,
          detectorConfig
        );
        
        setDetector(faceDetector);
        setStatus('Ready! Position your face in the camera.');
      } catch (error) {
        console.error('Error loading model:', error);
        setStatus('Error loading model. Please refresh the page.');
      }
    };

    loadDetector();
  }, []);

  // Main iris detection function
  const detectIris = async () => {
    if (
      !detector ||
      !webcamRef.current ||
      !webcamRef.current.video ||
      webcamRef.current.video.readyState !== 4
    ) {
      return null;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // Detect face landmarks
      const faces = await detector.estimateFaces(video, { flipHorizontal: false });

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (faces.length > 0) {
        const face = faces[0];
        
        // Draw face mesh
        if (face.keypoints) {
          ctx.fillStyle = '#00ff00';
          face.keypoints.forEach((keypoint) => {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 1, 0, 2 * Math.PI);
            ctx.fill();
          });
        }

        // Highlight iris landmarks (indices 468-477 for face-landmarks-detection)
        // Left iris: 468-472, Right iris: 473-477
        const leftIrisIndices = [468, 469, 470, 471, 472];
        const rightIrisIndices = [473, 474, 475, 476, 477];

        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;

        // Draw left iris
        leftIrisIndices.forEach(idx => {
          if (face.keypoints[idx]) {
            const point = face.keypoints[idx];
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        // Draw right iris
        rightIrisIndices.forEach(idx => {
          if (face.keypoints[idx]) {
            const point = face.keypoints[idx];
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        // Extract iris embedding
        const irisEmbedding = extractIrisEmbedding(face.keypoints);
        
        setStatus('Iris detected! Ready to capture.');
        return irisEmbedding;
      } else {
        setStatus('No face detected. Please position your face in the camera.');
        return null;
      }
    } catch (error) {
      console.error('Detection error:', error);
      return null;
    }
  };

  // Continuous detection loop
  useEffect(() => {
    if (isDetecting && detector) {
      const interval = setInterval(() => {
        detectIris();
      }, 100); // Run detection every 100ms

      return () => clearInterval(interval);
    }
  }, [isDetecting, detector]);

  // Start detection
  const handleStartDetection = () => {
    setIsDetecting(true);
    setMessage('');
  };

  // Stop detection
  const handleStopDetection = () => {
    setIsDetecting(false);
    setStatus('Detection stopped.');
  };

  // Capture and process iris for registration/login
  const handleCapture = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username.');
      return;
    }

    setLoading(true);
    setMessage('Capturing iris data...');

    try {
      // Capture iris embedding
      const irisEmbedding = await detectIris();

      if (!irisEmbedding || irisEmbedding.length === 0) {
        setMessage('No iris detected. Please try again.');
        setLoading(false);
        return;
      }

      // Call appropriate API based on mode
      if (mode === 'register') {
        setMessage('Registering user...');
        const response = await registerUser(username, irisEmbedding);
        setMessage(`✅ ${response.message}`);
        setUsername('');
      } else {
        setMessage('Authenticating...');
        const response = await loginUser(username, irisEmbedding);
        setMessage(`✅ ${response.message} (Similarity: ${response.similarity}%)`);
        setUsername('');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iris-scan-container">
      <div className="camera-section">
        <div className="video-wrapper">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: 'user'
            }}
            className="webcam"
          />
          <canvas ref={canvasRef} className="canvas-overlay" />
        </div>
        
        <div className="status-bar">
          <span className={isDetecting ? 'status-active' : 'status-inactive'}>
            {status}
          </span>
        </div>
      </div>

      <div className="control-section">
        <h2>{mode === 'register' ? 'Register New User' : 'Login'}</h2>
        
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
          disabled={loading}
        />

        <div className="button-group">
          {!isDetecting ? (
            <button 
              onClick={handleStartDetection}
              className="btn btn-primary"
              disabled={!detector}
            >
              Start Detection
            </button>
          ) : (
            <button 
              onClick={handleStopDetection}
              className="btn btn-secondary"
            >
              Stop Detection
            </button>
          )}

          <button
            onClick={handleCapture}
            className="btn btn-success"
            disabled={!isDetecting || !username.trim() || loading}
          >
            {loading ? 'Processing...' : `Capture & ${mode === 'register' ? 'Register' : 'Login'}`}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            <li>Allow camera access when prompted</li>
            <li>Position your face clearly in the camera</li>
            <li>Wait for iris detection (red dots on eyes)</li>
            <li>Enter your username</li>
            <li>Click "Capture & {mode === 'register' ? 'Register' : 'Login'}"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default IrisScanAuth;
