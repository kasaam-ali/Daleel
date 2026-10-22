import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import DaleelLogo from '@/components/shared/DaleelLogo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)]/60 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <DaleelLogo size="md" />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Autonomous fiscal and statutory intelligence engine engineered for Pakistani taxpayers, IT freelancers, and corporate filers.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[var(--text-tertiary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#10B981]" />
              <span>Independent compliance engine</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] font-mono mb-3">
              Compliance Suite
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/chat" className="hover:text-[var(--text-primary)] transition-colors">
                  Research Assistant (Bilingual)
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-[var(--text-primary)] transition-colors">
                  Salary & Freelancer Calculator
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[var(--text-primary)] transition-colors">
                  Filer vs Non-Filer WHT Rates
                </Link>
              </li>
              <li>
                <Link href="/notice" className="hover:text-[var(--text-primary)] transition-colors">
                  FBR Notice Explainer (OCR)
                </Link>
              </li>
              <li>
                <Link href="/checklist" className="hover:text-[var(--text-primary)] transition-colors">
                  NTN & SECP Checklists
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] font-mono mb-3">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <a
                  href="https://iris.fbr.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>FBR IRIS Portal</span>
                  <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)]" />
                </a>
              </li>
              <li>
                <a
                  href="https://eservices.secp.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>SECP eServices</span>
                  <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)]" />
                </a>
              </li>
              <li>
                <a
                  href="https://fbr.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>Active Taxpayer List (ATL)</span>
                  <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)]" />
                </a>
              </li>
              <li>
                <a
                  href="https://pseb.org.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>PSEB IT Exporter Portal</span>
                  <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Statutory Reference */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] font-mono mb-3">
              Statutory Basis
            </h4>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
                Grounding based on Income Tax Ordinance 2001, Sales Tax Act 1990, Companies Act 2017, and Finance Act 2024-2025 schedules.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[var(--text-tertiary)] space-y-1">
                <div>TAX YEAR: 2024-2025</div>
                <div>RATE CARD: TENTH SCHEDULE AMENDED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Statutory Legal Disclaimer Box */}
        <div className="mb-8 p-4 sm:p-5 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 backdrop-blur-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[11px] font-mono text-amber-700 dark:text-amber-400">
                  Statutory Legal & Tax Disclaimer (قانو نی انتباہ)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  Informational Only
                </span>
              </div>
              <p className="leading-relaxed text-[11px] sm:text-xs text-[var(--text-secondary)]">
                DaleelAI is an independent legal-technology and educational intelligence platform. <strong>DaleelAI is NOT affiliated with, authorized, or endorsed by the Federal Board of Revenue (FBR) or the Government of Pakistan</strong>. All calculations, simulated notice explanations, and AI responses are generated for general guidance and preliminary educational reference based on the Income Tax Ordinance 2001 and Finance Act 2024–2025. They <strong>do NOT constitute certified legal, financial, or tax advisory services</strong>, nor do they create an advocate-client relationship. For statutory filings, audit defenses, or formal legal disputes, always consult a licensed Chartered Accountant (ICAP) or High Court Tax Advocate.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border-hairline)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© 2026 DaleelAI Pakistan. Built for Pakistani taxpayers, freelancers, and businesses.</p>
            <span className="hidden sm:inline text-[var(--border-hairline)]">•</span>
            <p className="text-[11px] font-medium text-[var(--text-secondary)]">
              Made with <span className="text-emerald-500">❤️</span> by{' '}
              <a
                href="https://github.com/kasaam-ali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-primary)] hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors underline decoration-dotted underline-offset-2"
              >
                Kasaam Ali
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy & Compliance</span>
            <span>•</span>
            <span>Income Tax Ordinance 2001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
