import React, { useState } from 'react';
import './App.css';
import IrisScanAuth from './components/IrisScanAuth';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import useSessionTimeout from './hooks/useSessionTimeout';
import audioFeedback from './utils/audioFeedback';

function AppContent() {
  const [mode, setMode] = useState('register');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const { isActive, timeRemaining, extendSession } = useSessionTimeout(5);

  // Handle session timeout
  React.useEffect(() => {
    if (!isActive) {
      alert('⏱️ Session expired due to inactivity. Please refresh to continue.');
    }
  }, [isActive]);

  // Handle sound toggle
  React.useEffect(() => {
    audioFeedback.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (soundEnabled) audioFeedback.playClick();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      {/* Control Bar */}
      <div className="control-bar">
        <button 
          className="icon-button" 
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button 
          className="icon-button" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <div className="session-timer" title="Session timeout">
          ⏱️ {formatTime(timeRemaining)}
          {timeRemaining < 60 && (
            <button 
              className="extend-btn" 
              onClick={extendSession}
              style={{ marginLeft: '10px', fontSize: '12px' }}
            >
              Extend
            </button>
          )}
        </div>
      </div>

      <header className="App-header">
        <h1>🔒 Iris Scan Authentication System</h1>
        <p>Secure biometric authentication using iris recognition</p>
      </header>
      
      <div className="mode-selector">
        <button 
          className={mode === 'register' ? 'active' : ''}
          onClick={() => handleModeChange('register')}
        >
          Register New User
        </button>
        <button 
          className={mode === 'login' ? 'active' : ''}
          onClick={() => handleModeChange('login')}
        >
          Login
        </button>
      </div>

      <IrisScanAuth mode={mode} soundEnabled={soundEnabled} />
      
      <footer className="App-footer">
        <p>Powered by MediaPipe Iris Detection & MERN Stack</p>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>
          🌙 Dark Mode • 🔊 Audio Feedback • ⏱️ Auto-logout • 📱 Mobile Ready
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
