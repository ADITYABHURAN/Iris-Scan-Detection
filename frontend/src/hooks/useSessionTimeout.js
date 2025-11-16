import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for session timeout management
 * Auto-logout after specified inactivity period
 */
const useSessionTimeout = (timeoutMinutes = 5) => {
  const [isActive, setIsActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Reset time remaining
    setTimeRemaining(timeoutMinutes * 60);
    setIsActive(true);

    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set timeout for logout
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      console.log('⏱️ Session timeout - logging out');
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes]);

  useEffect(() => {
    // Events that reset the timer
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      if (isActive) {
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timer start
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, resetTimer]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const logout = useCallback(() => {
    setIsActive(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return {
    isActive,
    timeRemaining,
    extendSession,
    logout,
    resetTimer
  };
};

export default useSessionTimeout;
