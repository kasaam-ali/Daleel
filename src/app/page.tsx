'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaxCalculatorWidget from '@/components/calculator/TaxCalculatorWidget';
import ComparisonMatrix from '@/components/compare/ComparisonMatrix';
import NoticeExplainerWidget from '@/components/notice/NoticeExplainerWidget';
import ChecklistWidget from '@/components/checklist/ChecklistWidget';
import ExpertFinderWidget from '@/components/expert/ExpertFinderWidget';
import NotificationFeed from '@/components/notifications/NotificationFeed';
import ChatInterface from '@/components/chat/ChatInterface';
import { Language } from '@/lib/types';
import { 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Calculator, 
  FileText, 
  CheckSquare, 
  Users, 
  Bell, 
  Search,
  Sparkles,
  Cpu,
  Lock,
  Layers
} from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<Language>('en');
  const [activeModule, setActiveModule] = useState<'calculator' | 'notice' | 'compare' | 'chat' | 'checklist' | 'expert' | 'notifications'>('calculator');
  const [heroQuery, setHeroQuery] = useState('');

  const moduleTabs = [
    { id: 'calculator', labelEn: 'Tax Calculator', labelUr: 'Tax Calculator', icon: Calculator },
    { id: 'notice', labelEn: 'Notice Explainer', labelUr: 'Notice Explainer', icon: FileText, badge: 'OCR' },
    { id: 'compare', labelEn: 'Filer vs Non-Filer', labelUr: 'Filer vs Non-Filer', icon: Scale },
    { id: 'chat', labelEn: 'Research Assistant', labelUr: 'AI Research Assistant', icon: Sparkles, badge: 'Live' },
    { id: 'checklist', labelEn: 'Checklists', labelUr: 'Checklists', icon: CheckSquare },
    { id: 'expert', labelEn: 'Find CA / Lawyer', labelUr: 'Find CA / Lawyer', icon: Users },
    { id: 'notifications', labelEn: 'Gazette SROs', labelUr: 'Gazette SROs', icon: Bell },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)]">
      <Navbar currentLang={lang} onLanguageChange={setLang} />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-[var(--border-hairline)] bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-surface)] text-[var(--accent-text)] border border-[var(--accent-border)] text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {lang === 'en'
                ? 'Updated for Finance Act 2024-2025 · FBR & SECP Grounded'
                : 'Finance Act 2024-2025 Ke Mutabiq Updated · FBR Aur SECP Ready'}
            </span>
          </div>

          {/* Main Title & Editorial Subtitle */}
          <div className="space-y-3.5 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[var(--text-primary)] leading-[1.12]">
              {lang === 'en' ? (
                <>
                  Pakistan&apos;s Agentic Tax & Compliance <span className="text-[#087F5B] dark:text-[#10B981]">Intelligence Engine</span>
                </>
              ) : (
                <>
                  Pakistan Ka Pehla <span className="text-[#087F5B] dark:text-[#10B981]">AI Tax Assistant</span> — FBR Aur SECP Compliance Aasan
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {lang === 'en'
                ? 'Deconstruct FBR notices, calculate salaried and IT freelancer taxes, verify filer benefits, and execute business compliance workflows in English & Roman Urdu.'
                : 'FBR notices ka aasan hal, salary aur freelance tax calculation, filer vs non-filer bachatt, aur business registration — sab kuch ek jagah.'}
            </p>
          </div>

          {/* Linear-Style Command Query Input */}
          <div className="max-w-2xl mx-auto space-y-2.5">
            <div className="surface-card p-1.5 flex items-center gap-2 rounded-xl">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] ml-2.5 shrink-0" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && heroQuery.trim()) {
                    window.location.href = `/chat?q=${encodeURIComponent(heroQuery)}`;
                  }
                }}
                placeholder={
                  lang === 'en'
                    ? 'Ask any tax question (e.g. "How to claim 0.25% PSEB tax on IT exports?")'
                    : 'Koi bhi tax sawal poochein (e.g. "Freelancer 0.25% tax kaise de?")'
                }
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none"
              />
              <Link
                href={`/chat?q=${encodeURIComponent(heroQuery || 'How to become a filer in Pakistan?')}`}
                className="px-4 py-2 rounded-lg bg-[#087F5B] dark:bg-[#10B981] hover:bg-[#066447] text-white font-medium text-xs sm:text-sm transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] flex items-center gap-1.5 shrink-0 active:scale-[0.985]"
              >
                <span>{lang === 'en' ? 'Research' : 'Poochein'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Prompt Quick Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-[var(--text-tertiary)]">
              <span className="font-mono">{lang === 'en' ? 'Common inquiries:' : 'Aam sawalaat:'}</span>
              {[
                'Salary tax 150k monthly',
                'Freelancer Section 154A (0.25%)',
                'Section 114(4) FBR Notice',
                'Property purchase 236K rate',
              ].map((pill, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setHeroQuery(pill)}
                  className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-hairline)] transition-colors cursor-pointer font-mono"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Statutory KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4 text-left">
            <div className="surface-card p-3.5 space-y-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#087F5B] dark:text-[#10B981] block">
                0.25%
              </span>
              <span className="text-xs text-[var(--text-secondary)] block">
                IT Export Tax (Sec 154A)
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                PSEB Registered Rate
              </span>
            </div>

            <div className="surface-card p-3.5 space-y-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#087F5B] dark:text-[#10B981] block">
                PKR 600K
              </span>
              <span className="text-xs text-[var(--text-secondary)] block">
                Exempt Threshold
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                Annual Salary Slab 1
              </span>
            </div>

            <div className="surface-card p-3.5 space-y-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 block">
                Up to 400%
              </span>
              <span className="text-xs text-[var(--text-secondary)] block">
                Non-Filer Surcharge
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                Tenth Schedule Penalties
              </span>
            </div>

            <div className="surface-card p-3.5 space-y-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#087F5B] dark:text-[#10B981] block">
                100% Sourced
              </span>
              <span className="text-xs text-[var(--text-secondary)] block">
                Statutory Citations
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                Official FBR Ordinances
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7 CORE MODULES INTERACTIVE SUITE */}
      <section className="py-12 bg-[var(--bg-app)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {lang === 'en' ? 'Comprehensive Fiscal Intelligence Suite' : 'DaleelAI Ke 7 Tareen Features'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {lang === 'en'
                ? 'Switch between deterministic calculators, notice vision OCR, compliance matrices, and verified professionals.'
                : 'Tool select karein aur foran tax calculate karein, notice check karein, ya checklist complete karein.'}
            </p>
          </div>

          {/* Module Selector Segmented Navigation Bar */}
          <div className="flex items-center justify-start md:justify-center gap-1 overflow-x-auto pb-2 scrollbar-none">
            {moduleTabs.map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'border-[#087F5B] dark:border-[#10B981] bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold shadow-sm'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#087F5B] dark:text-[#10B981]' : 'text-[var(--text-tertiary)]'}`} />
                  <span>{lang === 'en' ? mod.labelEn : mod.labelUr}</span>
                  {'badge' in mod && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono font-medium bg-[var(--bg-subtle)] text-[var(--text-tertiary)] border border-[var(--border-hairline)]">
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Module Live Container */}
          <div className="transition-all duration-200">
            {activeModule === 'calculator' && <TaxCalculatorWidget language={lang} />}
            {activeModule === 'notice' && <NoticeExplainerWidget language={lang} />}
            {activeModule === 'compare' && <ComparisonMatrix language={lang} />}
            {activeModule === 'chat' && <ChatInterface language={lang} />}
            {activeModule === 'checklist' && <ChecklistWidget language={lang} />}
            {activeModule === 'expert' && <ExpertFinderWidget language={lang} />}
            {activeModule === 'notifications' && <NotificationFeed language={lang} />}
          </div>
        </div>
      </section>

      {/* WHY DALEELAI IS DIFFERENT (ARCHITECTURAL BENTO) */}
      <section className="py-14 border-t border-[var(--border-hairline)] bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {lang === 'en' ? 'Architectural Differentiation' : 'DaleelAI Kyun Munfarid Hai?'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {lang === 'en'
                ? 'Standard LLMs hallucinate on Pakistani statutory tax sections. DaleelAI combines deterministic tax engines with verified ordinance grounding.'
                : 'Aam AI bots Pakistan ke tax qanoon mein ghaltiyan karte hain. DaleelAI khaas taur par FBR aur SECP ke qawaneen par trained hai.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="surface-card p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] flex items-center justify-center text-[#087F5B] dark:text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                {lang === 'en' ? 'Zero Hallucination Grounding' : 'Official References Se Verified'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {lang === 'en'
                  ? 'Every answer links directly to verified sections of the Income Tax Ordinance 2001, Sales Tax Act 1990, and SECP Companies Act 2017.'
                  : 'Har jawab ke peeche Income Tax Ordinance 2001 aur FBR circulars ka mustanad hawala hota hai.'}
              </p>
            </div>

            <div className="surface-card p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] flex items-center justify-center text-[#087F5B] dark:text-[#10B981]">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                {lang === 'en' ? 'Deterministic Client Calculators' : 'Bina Kisi Dair Ke Live Calculation'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {lang === 'en'
                  ? 'No waiting for slow AI completions when you just need your tax bill. Instant, deterministic calculations with Finance Act 2024-2025 slabs.'
                  : 'Fauran salary, freelancer, aur property ka tax calculate karein bina kisi intezar ke.'}
              </p>
            </div>

            <div className="surface-card p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] flex items-center justify-center text-[#087F5B] dark:text-[#10B981]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                {lang === 'en' ? 'Local-First Privacy Architecture' : 'Mukammal Raazdari (Local-First)'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {lang === 'en'
                  ? 'No mandatory login or personal account creation. Financial inputs and simulation results remain stored strictly within your browser local session.'
                  : 'Aap ka data kisi server par store nahi hota. Tamam tax inputs aap ke browser mein mehfooz rehte hain.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
