import React from 'react';

type LenisProviderProps = {
  children: React.ReactNode;
};

/**
 * Placeholder provider to match the reference structure.
 * If you later add Lenis (smooth scrolling), wire it here.
 */
const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default LenisProvider;

