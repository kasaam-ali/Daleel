'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('daleel-theme') as 'dark' | 'light' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('daleel-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] opacity-40" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle color theme"
      className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5" strokeWidth={1.75} />
      ) : (
        <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />
      )}
    </button>
  );
}
