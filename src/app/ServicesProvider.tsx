import React, { createContext, useContext, useMemo } from 'react';
import { createServices, type Services } from './services';

const ServicesContext = createContext<Services | null>(null);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const services = useMemo(() => createServices(), []);
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
};

export function useServices(): Services {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used within ServicesProvider');
  return ctx;
}

