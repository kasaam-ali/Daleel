'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatInterface from '@/components/chat/ChatInterface';
import { Language } from '@/lib/types';

export default function ChatPage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)]">
      <Navbar currentLang={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="space-y-1.5 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[#087F5B] dark:text-[#10B981] text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>FBR & SECP Sourced Corpus</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {lang === 'en' ? 'Ask DaleelAI Assistant' : 'DaleelAI Se Sawal Poochein'}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {lang === 'en'
              ? 'Real-time answers grounded in Pakistani tax laws, with direct links to official ordinance sections.'
              : 'Pakistan ke tax qawaneen aur FBR circulars ke hawala jaat ke sath foran rehnumai.'}
          </p>
        </div>

        <ChatInterface language={lang} />
      </main>

      <Footer />
    </div>
  );
}
