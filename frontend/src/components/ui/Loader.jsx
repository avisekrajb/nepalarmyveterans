import React from 'react';
import { useSite } from '../../context/SiteContext';

/**
 * Loader — centered brand loader.
 * Shows the header's left logo in the middle of a rotating
 * green/yellow conic ring with a soft pulsing glow.
 */
export function Loader({ label = 'Loading...' }) {
  const { headerLogos } = useSite();

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 py-16">
      <div className="relative grid h-32 w-32 place-items-center">
        {/* Soft pulsing glow */}
        <span className="absolute h-32 w-32 rounded-full bg-green-400/10 blur-2xl loader-pulse" />

        {/* Static faint track */}
        <span className="absolute h-28 w-28 rounded-full border border-gray-100" />

        {/* Rotating green-yellow conic ring */}
        <span className="loader-ring absolute h-28 w-28 rounded-full" />

        {/* Reverse-spinning thin gold arc */}
        <span className="loader-arc absolute h-24 w-24 rounded-full" />

        {/* Center logo */}
        <img
          src={headerLogos?.leftLogo?.url || 'https://placehold.co/72x72/FFFFFF/1F3D2B?text=Logo'}
          alt="Logo"
          className="relative z-10 h-16 w-16 rounded-full bg-white object-contain shadow-md ring-1 ring-gray-100"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/72x72/FFFFFF/1F3D2B?text=Logo';
          }}
        />
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
        {label}
      </p>
    </div>
  );
}

export default Loader;
