import React from 'react';

export const Container = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export const Eyebrow = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark ${className}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
    {children}
  </span>
);