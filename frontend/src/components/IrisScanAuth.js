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

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { registerUser, loginUser } from '../services/api';
import { extractIrisEmbedding } from '../utils/irisProcessing';
import audioFeedback from '../utils/audioFeedback';
import './IrisScanAuth.css';

const IrisScanAuth = ({ mode, soundEnabled }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const lastDetectionRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Initialize MediaPipe FaceMesh
  useEffect(() => {
    const loadFaceMesh = async () => {
      try {
        setStatus('⏳ Loading AI model... Please wait (10-15 seconds)');
        console.log('🔧 Initializing MediaPipe FaceMesh...');
        
        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMesh.onResults((results) => {
          lastDetectionRef.current = results;
          drawResults(results);
        });

        console.log('✅ FaceMesh initialized successfully!');
        faceMeshRef.current = faceMesh;
        setModelLoaded(true);
        setStatus('✅ Model ready! Click "Start Detection" to begin.');
      } catch (error) {
        console.error('❌ Error loading FaceMesh:', error);
        setStatus(`❌ Error: ${error.message}`);
      }
    };

    loadFaceMesh();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  // Draw detection results on canvas
  const drawResults = useCallback((results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const video = webcamRef.current?.video;
    
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      console.log(`✅ Face detected! Landmarks: ${landmarks.length} points`);

      // Draw all face landmarks in green
      ctx.fillStyle = '#00ff00';
      landmarks.forEach((landmark) => {
        const x = landmark.x * canvas.width;
        const y = landmark.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      });

      // MediaPipe iris indices:
      // Left iris: indices 468-472
      // Right iris: indices 473-477
      const leftIrisIndices = [468, 469, 470, 471, 472];
      const rightIrisIndices = [473, 474, 475, 476, 477];

      ctx.fillStyle = '#ff0000';
      let irisCount = 0;

      // Draw left iris in red
      leftIrisIndices.forEach(idx => {
        if (landmarks[idx]) {
          const x = landmarks[idx].x * canvas.width;
          const y = landmarks[idx].y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          irisCount++;
        }
      });

      // Draw right iris in red
      rightIrisIndices.forEach(idx => {
        if (landmarks[idx]) {
          const x = landmarks[idx].x * canvas.width;
          const y = landmarks[idx].y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          irisCount++;
        }
      });

      console.log(`👁️ Iris points visible: ${irisCount}/10`);
      setStatus(`✅ Face & Iris Detected! (${irisCount}/10 iris points) Ready to capture.`);
    } else {
      console.log('❌ No face detected in current frame');
      setStatus('👤 No face detected. Move closer and look at camera.');
    }
  }, []);

  // Get current iris embedding from last detection
  const getCurrentIrisEmbedding = useCallback(() => {
    if (!lastDetectionRef.current || !lastDetectionRef.current.multiFaceLandmarks) {
      return null;
    }

    const landmarks = lastDetectionRef.current.multiFaceLandmarks[0];
    if (!landmarks || landmarks.length === 0) {
      return null;
    }

    // Convert MediaPipe landmarks to format expected by extractIrisEmbedding
    const keypoints = landmarks.map(lm => ({
      x: lm.x * (webcamRef.current?.video?.videoWidth || 640),
      y: lm.y * (webcamRef.current?.video?.videoHeight || 480),
      z: lm.z || 0
    }));

    const embedding = extractIrisEmbedding(keypoints);
    console.log(`🧬 Extracted embedding: ${embedding.length} dimensions`);
    return embedding;
  }, []);

  // Start/Stop MediaPipe camera when detection state changes
  useEffect(() => {
    if (isDetecting && modelLoaded && webcamRef.current && webcamRef.current.video) {
      console.log('▶️ Starting MediaPipe camera...');
      
      const video = webcamRef.current.video;
      
      // Ensure video is playing
      if (video.paused) {
        video.play().catch(err => console.error('Video play error:', err));
      }

      // Create and start camera
      const camera = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current && video.readyState >= 2) {
            await faceMeshRef.current.send({ image: video });
          }
        },
        width: 1280,
        height: 720
      });

      camera.start();
      cameraRef.current = camera;
      console.log('✅ MediaPipe camera started');
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
        console.log('⏹️ MediaPipe camera stopped');
      }
    };
  }, [isDetecting, modelLoaded]);

  // Start detection
  const handleStartDetection = () => {
    if (!modelLoaded) {
      setMessage('⏳ Please wait for the model to load first...');
      return;
    }
    console.log('🚀 User started detection');
    if (soundEnabled) audioFeedback.playStart();
    setIsDetecting(true);
    setMessage('');
    setStatus('🔍 Detecting... Look at the camera.');
  };

  // Stop detection
  const handleStopDetection = () => {
    console.log('⏸️ User stopped detection');
    if (soundEnabled) audioFeedback.playStop();
    setIsDetecting(false);
    setStatus('⏹️ Detection stopped. Click "Start Detection" to resume.');
  };

  // Capture and process iris for registration/login
  const handleCapture = async () => {
    if (!username.trim()) {
      setMessage('❌ Please enter a username.');
      return;
    }

    if (!lastDetectionRef.current || !lastDetectionRef.current.multiFaceLandmarks) {
      setMessage('❌ No face detected. Please wait for detection.');
      return;
    }

    setLoading(true);
    setMessage('📸 Capturing iris data...');

    try {
      // Get current iris embedding
      const irisEmbedding = getCurrentIrisEmbedding();

      if (!irisEmbedding || irisEmbedding.length !== 128) {
        setMessage('❌ Invalid iris data. Please try again.');
        if (soundEnabled) audioFeedback.playError();
        setLoading(false);
        return;
      }

      console.log('📤 Sending embedding to API...');

      // Call appropriate API based on mode
      if (mode === 'register') {
        setMessage('📝 Registering user...');
        const response = await registerUser(username, irisEmbedding);
        setMessage(`✅ ${response.message}`);
        if (soundEnabled) audioFeedback.playSuccess();
        setUsername('');
      } else {
        setMessage('🔐 Authenticating...');
        const response = await loginUser(username, irisEmbedding);
        setMessage(`✅ ${response.message} (Similarity: ${response.similarity}%)`);
        if (soundEnabled) audioFeedback.playSuccess();
        setUsername('');
      }
    } catch (error) {
      console.error('❌ Capture error:', error);
      setMessage(`❌ Error: ${error.message}`);
      if (soundEnabled) audioFeedback.playError();
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
            videoConstraints={{
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              facingMode: 'user',
              aspectRatio: { ideal: 1.777 }
            }}
            onUserMedia={() => {
              console.log('📹 Webcam ready!');
              if (soundEnabled) audioFeedback.playDetection();
              if (modelLoaded) {
                setStatus('✅ Ready! Click "Start Detection" to begin.');
              }
            }}
            onUserMediaError={(error) => {
              console.error('❌ Camera error:', error);
              if (soundEnabled) audioFeedback.playError();
              setStatus('❌ Camera access denied. Please allow camera in browser settings.');
            }}
            className="webcam"
            style={{ 
              width: '100%', 
              height: 'auto',
              display: 'block',
              maxWidth: '100%'
            }}
          />
          <canvas 
            ref={canvasRef} 
            className="canvas-overlay"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: 'auto',
              pointerEvents: 'none'
            }}
          />
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
              disabled={!modelLoaded}
              title={!modelLoaded ? 'Please wait for model to load...' : 'Start iris detection'}
            >
              {modelLoaded ? 'Start Detection' : 'Loading Model...'}
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
            <li>✅ Allow camera access when prompted</li>
            <li>⏳ Wait for "Model loaded!" status (10-15 seconds)</li>
            <li>🎬 Click "Start Detection"</li>
            <li>👤 Position your face 30-60cm from camera</li>
            <li>💡 Ensure good lighting (avoid backlighting)</li>
            <li>👁️ Wait for red dots to appear on your eyes</li>
            <li>📝 Enter your username</li>
            <li>✅ Click "Capture & {mode === 'register' ? 'Register' : 'Login'}"</li>
          </ol>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Troubleshooting:</strong>
            <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
              <li>Check browser console (F12) for detailed logs</li>
              <li>Ensure running on http://localhost (not https)</li>
              <li>Remove glasses for better detection</li>
              <li>Face camera directly (not at angle)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrisScanAuth;
