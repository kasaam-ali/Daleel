'use client';

import { Languages } from 'lucide-react';
import { Language } from '@/lib/types';

interface LanguageToggleProps {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export default function LanguageToggle({ currentLang, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={() => onToggle(currentLang === 'en' ? 'ur-roman' : 'en')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      title="Switch Language (English / Roman Urdu)"
    >
      <Languages className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#10B981]" strokeWidth={1.75} />
      <span>{currentLang === 'en' ? 'English' : 'Roman Urdu'}</span>
      <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase ml-0.5">
        [{currentLang === 'en' ? 'UR' : 'EN'}]
      </span>
    </button>
  );
}
