/**
 * Audio Feedback Utility
 * Plays sounds for different events
 */

class AudioFeedback {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    
    try {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // Success sound - ascending tone
  playSuccess() {
    this.playTone(523.25, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2), 200); // G5
  }

  // Error sound - descending tone
  playError() {
    this.playTone(400, 0.1);
    setTimeout(() => this.playTone(300, 0.15), 100);
  }

  // Detection sound - single beep
  playDetection() {
    this.playTone(800, 0.05);
  }

  // Click sound
  playClick() {
    this.playTone(600, 0.03);
  }

  // Start detection sound
  playStart() {
    this.playTone(440, 0.1); // A4
    setTimeout(() => this.playTone(554.37, 0.1), 120); // C#5
  }

  // Stop detection sound
  playStop() {
    this.playTone(554.37, 0.1);
    setTimeout(() => this.playTone(440, 0.1), 120);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

const audioFeedbackInstance = new AudioFeedback();
export default audioFeedbackInstance;
