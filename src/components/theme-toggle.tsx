import React from 'react';
import { useTheme } from './theme-provider';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="btn-outline"
      onClick={toggleTheme}
      style={{ padding: '10px 14px', borderRadius: '12px' }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
};

export default ThemeToggle;

