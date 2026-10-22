'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ExpertFinderWidget from '@/components/expert/ExpertFinderWidget';
import { Language } from '@/lib/types';

export default function FindExpertPage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)]">
      <Navbar currentLang={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
              VERIFIED PRACTITIONERS
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              ICAP Fellows & High Court Bar
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {lang === 'en' ? 'Find a Chartered Accountant or Tax Lawyer' : 'Chartered Accountant Ya Tax Lawyer Talash Karein'}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
            {lang === 'en'
              ? 'Connect with vetted practitioners in Karachi, Lahore, Islamabad, and Faisalabad for complex audits, show cause notices, and corporate filings.'
              : 'Audit notices, show cause defense, aur company incorporation ke liye verified professionals se rabta karein.'}
          </p>
        </div>

        <ExpertFinderWidget language={lang} />
      </main>

      <Footer />
    </div>
  );
}
