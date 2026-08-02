import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showToast, setShowToast] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowToast(false), 300);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache',
          timeout: 5000
        });
        if (!isOnline) {
          setIsOnline(true);
          setShowToast(true);
          setIsVisible(true);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setShowToast(false), 300);
          }, 4000);
        }
      } catch (error) {
        if (isOnline) {
          setIsOnline(false);
          setShowToast(true);
          setIsVisible(true);
        }
      }
    };

    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);

  if (!showToast) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            duration: 0.4
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] w-full max-w-md px-4"
        >
          <div className={`
            relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl
            ${isOnline 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-red-500 to-rose-600'
            }
            border border-white/20
          `}>
            {/* Animated background glow */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative p-4 flex items-center gap-4">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                ${isOnline ? 'bg-white/20' : 'bg-white/20'}
                backdrop-blur-sm
              `}>
                {isOnline ? (
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Wifi className="h-6 w-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: 180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <WifiOff className="h-6 w-6 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">
                  {isOnline ? '✅ Back Online' : '⚠️ You\'re Offline'}
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  {isOnline 
                    ? 'Your connection has been restored. Everything is working fine.' 
                    : 'Please check your internet connection. Some features may be unavailable.'
                  }
                </p>
              </div>

              {/* Refresh Button - Only show when offline */}
              {!isOnline && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 text-white animate-spin-slow" />
                </button>
              )}

              {/* Dismiss Button */}
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => setShowToast(false), 300);
                }}
                className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar for online toast */}
            {isOnline && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-white/40"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;