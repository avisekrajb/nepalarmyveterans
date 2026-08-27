import React from 'react';
import { useScroll } from '../context/ScrollContext';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const { isVisible, scrollToTop } = useScroll();

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50 bg-[#FCC202] text-army p-3 rounded-full shadow-lg hover:bg-[#e6b002] transition-all duration-300 hover:scale-110 animate-bounce"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTop;