'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ComparisonMatrix from '@/components/compare/ComparisonMatrix';
import { Language } from '@/lib/types';

export default function ComparePage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)]">
      <Navbar currentLang={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-[var(--danger-surface)] text-[var(--danger-text)] border border-[var(--danger-border)]">
              PENAL SURCHARGES
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              Tenth Schedule · Income Tax Ordinance 2001
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {lang === 'en' ? 'Filer vs Non-Filer Tax Comparison' : 'Filer vs Non-Filer Tax Ka Mawazna'}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
            {lang === 'en'
              ? 'Analyze statutory penalties incurred by remaining an inactive non-filer on banking, property, and vehicle transactions.'
              : 'Jaaniye ke non-filer reh kar aap gaari, property, aur bank transactions par kitna extra tax bhar rahe hain.'}
          </p>
        </div>

        <ComparisonMatrix language={lang} />
      </main>

      <Footer />
    </div>
  );
}
