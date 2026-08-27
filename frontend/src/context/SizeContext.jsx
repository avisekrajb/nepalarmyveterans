import React, { createContext, useState, useContext, useEffect } from 'react';

const SizeContext = createContext();

export const useSize = () => {
  const context = useContext(SizeContext);
  if (!context) {
    throw new Error('useSize must be used within a SizeProvider');
  }
  return context;
};

export const SizeProvider = ({ children }) => {
  // Default font size (1 = 100%)
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseFloat(saved) : 1;
  });

  // Minimum and maximum limits
  const MIN_SIZE = 0.75; // 75%
  const MAX_SIZE = 1.25; // 125%
  const STEP = 0.05; // 5% steps

  useEffect(() => {
    // Apply font size to root element
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const increaseSize = () => {
    setFontSize(prev => Math.min(prev + STEP, MAX_SIZE));
  };

  const decreaseSize = () => {
    setFontSize(prev => Math.max(prev - STEP, MIN_SIZE));
  };

  const resetSize = () => {
    setFontSize(1);
  };

  return (
    <SizeContext.Provider value={{ 
      fontSize, 
      increaseSize, 
      decreaseSize, 
      resetSize,
      MIN_SIZE,
      MAX_SIZE,
      STEP
    }}>
      {children}
    </SizeContext.Provider>
  );
};

export default SizeContext;