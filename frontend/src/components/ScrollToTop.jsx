import React from 'react';
import { useScroll } from '../context/ScrollContext';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const { isVisible, scrollToTop } = useScroll();

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-gold text-white p-3 rounded-full shadow-lg hover:bg-gold-dark transition-all duration-300 hover:scale-110 animate-bounce"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTop;