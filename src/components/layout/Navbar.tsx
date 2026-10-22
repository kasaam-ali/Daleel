'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calculator, 
  Scale, 
  FileText, 
  CheckSquare, 
  Users, 
  Bell, 
  Menu, 
  X, 
  MessageSquare,
  Command
} from 'lucide-react';
import DaleelLogo from '@/components/shared/DaleelLogo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { Language } from '@/lib/types';

interface NavbarProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function Navbar({ currentLang = 'en', onLanguageChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/chat', labelEn: 'Ask Daleel', labelUr: 'Daleel AI Chat', icon: MessageSquare, badge: 'Live' },
    { href: '/calculator', labelEn: 'Tax Calculator', labelUr: 'Tax Calculator', icon: Calculator },
    { href: '/compare', labelEn: 'Filer vs Non-Filer', labelUr: 'Filer vs Non-Filer', icon: Scale },
    { href: '/notice', labelEn: 'Notice Explainer', labelUr: 'Notice Explainer', icon: FileText, badge: 'OCR' },
    { href: '/checklist', labelEn: 'Checklists', labelUr: 'Checklists', icon: CheckSquare },
    { href: '/find-expert', labelEn: 'Find CA / Lawyer', labelUr: 'Find CA / Lawyer', icon: Users },
    { href: '/notifications', labelEn: 'Gazette SROs', labelUr: 'Gazette SROs', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-hairline)] bg-[var(--bg-app)]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <DaleelLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#087F5B] dark:text-[#10B981]' : 'text-[var(--text-tertiary)]'}`} />
                  <span>{currentLang === 'en' ? link.labelEn : link.labelUr}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono font-medium bg-[var(--bg-subtle)] text-[var(--text-tertiary)] border border-[var(--border-hairline)]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            {onLanguageChange && (
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
            )}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border-hairline)] bg-[var(--bg-card)] p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <span>{currentLang === 'en' ? link.labelEn : link.labelUr}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-tertiary)]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
