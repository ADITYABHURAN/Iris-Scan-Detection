import React, { useState } from 'react';
import './App.css';
import IrisScanAuth from './components/IrisScanAuth';

function App() {
  const [mode, setMode] = useState('register'); // 'register' or 'login'

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔒 Iris Scan Authentication System</h1>
        <p>Secure biometric authentication using iris recognition</p>
      </header>
      
      <div className="mode-selector">
        <button 
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          Register New User
        </button>
        <button 
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Login
        </button>
      </div>

      <IrisScanAuth mode={mode} />
      
      <footer className="App-footer">
        <p>Powered by MediaPipe Iris Detection & MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
