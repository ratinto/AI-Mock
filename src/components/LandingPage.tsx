import React from 'react';
import Background from './Background';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Pricing from './Pricing';

type LandingPageProps = {
  onStart?: () => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <Background />
      <Navbar onStart={onStart ?? (() => {})} />
      <main>
        <Hero onStart={onStart ?? (() => {})} />
        <Features />
        <Pricing onStart={onStart ?? (() => {})} />
      </main>
    </div>
  );
};

export default LandingPage;

