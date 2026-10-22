'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaxCalculatorWidget from '@/components/calculator/TaxCalculatorWidget';
import { Language } from '@/lib/types';
import { Calculator } from 'lucide-react';

export default function CalculatorPage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)]">
      <Navbar currentLang={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
              CALCULATION ENGINE
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              Finance Act 2024-2025 · First Schedule
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {lang === 'en' ? 'Pakistan Tax Calculator' : 'Pakistan Tax Calculator (Salaried & Freelancers)'}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
            {lang === 'en'
              ? 'Calculate accurate monthly and annual tax for salaried employees, 0.25% PSEB IT freelancers, and property transactions.'
              : 'Salaried mulaazmat, IT freelancers, aur property ka latest FBR tax foran calculate karein.'}
          </p>
        </div>

        <TaxCalculatorWidget language={lang} />
      </main>

      <Footer />
    </div>
  );
}
