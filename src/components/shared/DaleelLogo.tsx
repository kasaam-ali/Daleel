import React from 'react';

interface DaleelLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function DaleelMark({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-6 h-6 rounded-md',
    md: 'w-8 h-8 rounded-lg',
    lg: 'w-10 h-10 rounded-xl',
  };

  const svgSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center bg-[#087F5B] dark:bg-[#10B981] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] border border-black/10 shrink-0 ${className}`}
      aria-label="DaleelAI Emblem"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgSizes[size]}
        aria-hidden="true"
      >
        {/* Crisp geometric Urdu Daal (د) with scale geometry */}
        <path
          d="M17 7.5C14.8 6.8 9.5 8.2 8.8 12.8C8.2 16.5 11 18.2 14.2 18.2C16.5 18.2 18.2 17.6 19 17.1"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="11.5" r="1.3" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function DaleelLogo({ size = 'md', showText = true, className = '' }: DaleelLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <DaleelMark size={size} />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-semibold tracking-tight text-[15px] text-[var(--text-primary)]">
              Daleel<span className="text-[#087F5B] dark:text-[#10B981]">AI</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)] font-medium">
              PK
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)] tracking-tight mt-0.5">
            Tax Compliance Intelligence
          </span>
        </div>
      )}
    </div>
  );
}

export function EvidenceSealIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] ${className}`}>
      <svg
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 text-[#087F5B] dark:text-[#10B981]"
        aria-hidden="true"
      >
        <rect x="14" y="10" width="44" height="52" rx="8" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="1.5" />
        <line x1="22" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="30" x2="50" y2="30" stroke="var(--border-active)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="37" x2="46" y2="37" stroke="var(--border-active)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="44" cy="48" r="10" fill="currentColor" />
        <path d="M40.5 48L42.5 50.5L47.5 45.5" stroke="var(--bg-card)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
