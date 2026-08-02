import React from 'react';
import { motion } from 'framer-motion';

// Shimmer effect CSS
const shimmerStyles = `
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton-pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Base Skeleton
export const SkeletonBase = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

// Text Skeleton
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`skeleton-shimmer rounded ${i === 0 ? 'h-4 w-full' : 'h-3 w-3/4'}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

// Avatar Skeleton
export const SkeletonAvatar = ({ size = 'w-12 h-12', className = '' }) => (
  <div className={`skeleton-shimmer rounded-full ${size} ${className}`} />
);

// Card Skeleton
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-xl overflow-hidden shadow-sm ${className}`}>
    <div className="skeleton-shimmer h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton-shimmer h-4 w-3/4 rounded" />
      <div className="skeleton-shimmer h-3 w-1/2 rounded" />
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-full rounded" />
        <div className="skeleton-shimmer h-3 w-5/6 rounded" />
      </div>
    </div>
  </div>
);

// Grid Skeleton
export const SkeletonGrid = ({ columns = 4, count = 8, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// Hero Skeleton
export const SkeletonHero = () => (
  <div className="min-h-[100svh] flex flex-col items-center justify-center p-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="skeleton-shimmer h-12 w-3/4 rounded-lg" />
        <div className="skeleton-shimmer h-8 w-2/3 rounded-lg" />
        <div className="space-y-3">
          <div className="skeleton-shimmer h-4 w-full rounded" />
          <div className="skeleton-shimmer h-4 w-5/6 rounded" />
          <div className="skeleton-shimmer h-4 w-4/5 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton-shimmer aspect-square rounded-xl" />
              <div className="skeleton-shimmer h-3 w-3/4 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="skeleton-shimmer aspect-[4/3] rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Notice Skeleton
export const SkeletonNotice = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="skeleton-shimmer h-48 w-full" />
        <div className="p-4 space-y-3">
          <div className="skeleton-shimmer h-3 w-20 rounded-full" />
          <div className="skeleton-shimmer h-4 w-3/4 rounded" />
          <div className="space-y-2">
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="skeleton-shimmer h-3 w-5/6 rounded" />
            <div className="skeleton-shimmer h-3 w-4/5 rounded" />
          </div>
          <div className="skeleton-shimmer h-4 w-24 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Gallery Skeleton
export const SkeletonGallery = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-shimmer aspect-square rounded-xl" />
    ))}
  </div>
);

// Leadership Skeleton
export const SkeletonLeadership = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="skeleton-shimmer aspect-square" />
        <div className="p-3 space-y-2 text-center">
          <div className="skeleton-shimmer h-3 w-3/4 rounded mx-auto" />
          <div className="skeleton-shimmer h-2 w-1/2 rounded mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

// Committee Skeleton
export const SkeletonCommittee = ({ count = 18 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="skeleton-shimmer aspect-square" />
        <div className="p-3 space-y-2 text-center">
          <div className="skeleton-shimmer h-3 w-3/4 rounded mx-auto" />
          <div className="skeleton-shimmer h-2 w-1/2 rounded mx-auto" />
          <div className="skeleton-shimmer h-2 w-2/3 rounded mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

// Events Skeleton
export const SkeletonEvents = ({ count = 6 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="skeleton-shimmer h-48 md:w-48 md:h-auto" />
          <div className="p-4 flex-1 space-y-3">
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer h-3 w-1/2 rounded" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-3 w-full rounded" />
              <div className="skeleton-shimmer h-3 w-5/6 rounded" />
            </div>
            <div className="flex gap-4">
              <div className="skeleton-shimmer h-3 w-24 rounded" />
              <div className="skeleton-shimmer h-3 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// FAQ Skeleton
export const SkeletonFAQ = ({ count = 6 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="skeleton-shimmer h-4 w-3/4 rounded" />
          <div className="skeleton-shimmer h-4 w-4 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Training Skeleton
export const SkeletonTraining = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
        <div className="flex items-start gap-4">
          <div className="skeleton-shimmer h-12 w-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="flex gap-3">
              <div className="skeleton-shimmer h-3 w-16 rounded" />
              <div className="skeleton-shimmer h-3 w-16 rounded" />
              <div className="skeleton-shimmer h-3 w-16 rounded" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Add styles to document
const SkeletonStyles = () => (
  <style>{shimmerStyles}</style>
);

// Main Skeleton component with all exports
const Skeleton = {
  Base: SkeletonBase,
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
  Card: SkeletonCard,
  Grid: SkeletonGrid,
  Hero: SkeletonHero,
  Notice: SkeletonNotice,
  Gallery: SkeletonGallery,
  Leadership: SkeletonLeadership,
  Committee: SkeletonCommittee,
  Events: SkeletonEvents,
  FAQ: SkeletonFAQ,
  Training: SkeletonTraining,
  Styles: SkeletonStyles,
};

export default Skeleton;