import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle, Unlock } from 'lucide-react';
import { logoAPI } from '../services/api';

const RightClickProtection = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logos, setLogos] = useState({ leftLogo: { url: '' }, rightLogo: { url: '' } });
  const [success, setSuccess] = useState(false);

  const CORRECT_PASSWORD = '789456';

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const { data } = await logoAPI.getHeaderLogos();
      setLogos(data);
    } catch (error) {
      console.error('Failed to load logos:', error);
    }
  };

  useEffect(() => {
    // ==================== DISABLE RIGHT CLICK ====================
    const handleContextMenu = (e) => {
      // If authenticated, allow right-click
      if (isAuthenticated) {
        return true;
      }
      
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
      setPassword('');
      setError('');
      setSuccess(false);
      return false;
    };

    // ==================== DISABLE COPY ====================
    const handleCopy = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
        return false;
      }
      return true;
    };

    // ==================== DISABLE CUT ====================
    const handleCut = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
        return false;
      }
      return true;
    };

    // ==================== DISABLE PASTE ====================
    const handlePaste = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
        return false;
      }
      return true;
    };

    // ==================== DISABLE SELECTION ====================
    const handleSelectStart = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // ==================== KEYBOARD SHORTCUTS ====================
    const handleKeyDown = (e) => {
      // If authenticated, allow all shortcuts
      if (isAuthenticated) {
        return true;
      }

      // Disable Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U
      if (e.ctrlKey) {
        const blockedKeys = ['c', 'v', 'x', 'a', 'u', 's', 'p'];
        if (blockedKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
          return false;
        }
      }
      
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
        return false;
      }
      
      // Disable Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
        return false;
      }
      
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
        return false;
      }
    };

    // ==================== DISABLE DRAG ====================
    const handleDragStart = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // ==================== DISABLE DROP ====================
    const handleDrop = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // ==================== DISABLE IMAGE DRAG ====================
    const handleImageDrag = (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // Add all event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    
    // Disable/enable image dragging
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', handleImageDrag);
    });

    // CSS to disable text selection (only when not authenticated)
    const style = document.createElement('style');
    style.textContent = `
      .no-select {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      .allow-select {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Apply no-select class to body
    if (!isAuthenticated) {
      document.body.classList.add('no-select');
      document.body.classList.remove('allow-select');
    } else {
      document.body.classList.add('allow-select');
      document.body.classList.remove('no-select');
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      
      document.querySelectorAll('img').forEach(img => {
        img.removeEventListener('dragstart', handleImageDrag);
      });
      
      document.head.removeChild(style);
      document.body.classList.remove('no-select', 'allow-select');
    };
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setSuccess(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setShowModal(false);
        setPassword('');
        setError('');
        setSuccess(false);
      }, 800);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPassword('');
    setError('');
    setSuccess(false);
  };

  // Show unlock status if authenticated
  if (isAuthenticated) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm animate-fadeIn">
        <Unlock className="h-4 w-4" />
        <span>Content Unlocked - You can now copy and right-click</span>
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            localStorage.removeItem('contentUnlocked');
          }}
          className="ml-2 text-white/80 hover:text-white text-xs underline"
        >
          Lock
        </button>
      </div>
    );
  }

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-green-200">
        {/* Header with Logos */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            {/* Left Logo */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-green-300 flex items-center justify-center p-0.5">
              <img 
                src={logos?.leftLogo?.url || 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=Logo'} 
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=Logo';
                }}
              />
            </div>
            
            <div>
              <h2 className="text-white font-bold text-sm font-display">Nepal Army</h2>
              <p className="text-green-100 text-[10px] font-medium tracking-wider">Ex-Army Association</p>
            </div>
            
            {/* Right Logo */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-green-300 flex items-center justify-center p-0.5">
              <img 
                src={logos?.rightLogo?.url || 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=Flag'} 
                alt="Flag"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=Flag';
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-3.5 w-3.5 text-green-200" />
            <p className="text-green-100 text-xs font-medium">Protected Content</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 bg-green-50 p-2.5 rounded-lg border border-green-200 mb-3">
            <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-xs text-green-700">
              Enter password to view this content
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm text-gray-700 placeholder-gray-400"
                  placeholder="Enter password"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {error}
                </p>
              )}
              {success && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Correct! Unlocking...
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={success}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {success ? (
                  <>
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Unlock
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-400">
              🔒 Protected content. Unauthorized access prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightClickProtection;