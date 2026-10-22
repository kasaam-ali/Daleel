'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_FBR_NOTICES } from '@/lib/tax-engine';
import { FBRNoticeSample, Language } from '@/lib/types';
import { 
  FileText, 
  UploadCloud, 
  Clock, 
  Check, 
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  FileSearch,
  ExternalLink
} from 'lucide-react';

interface NoticeExplainerWidgetProps {
  language?: Language;
}

export default function NoticeExplainerWidget({ language = 'en' }: NoticeExplainerWidgetProps) {
  const [selectedNotice, setSelectedNotice] = useState<FBRNoticeSample>(SAMPLE_FBR_NOTICES[1]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'ur'>('en');

  const handleSimulateUpload = (fileName: string, sample: FBRNoticeSample) => {
    setUploadedFileName(fileName);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setSelectedNotice(sample);
    }, 900);
  };

  const getRiskBadgeStyles = (level: FBRNoticeSample['riskLevel']) => {
    switch (level) {
      case 'critical':
        return {
          pill: 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]',
          dot: 'bg-rose-500',
          label: 'Critical Legal Risk'
        };
      case 'high':
        return {
          pill: 'bg-[var(--warning-surface)] text-[var(--warning-text)] border-[var(--warning-border)]',
          dot: 'bg-amber-500',
          label: 'High Severity Notice'
        };
      case 'medium':
        return {
          pill: 'bg-[var(--warning-surface)] text-[var(--warning-text)] border-[var(--warning-border)]',
          dot: 'bg-amber-400',
          label: 'Moderate Audit Risk'
        };
      default:
        return {
          pill: 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]',
          dot: 'bg-emerald-500',
          label: 'Standard Procedural Notice'
        };
    }
  };

  const riskStyle = getRiskBadgeStyles(selectedNotice.riskLevel);

  return (
    <div className="w-full space-y-6">
      {/* Upload & Inspection Hub */}
      <div className="surface-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] flex items-center justify-center text-[#087F5B] dark:text-[#10B981]">
              <FileSearch className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                {language === 'en' ? 'FBR Notice Document Inspection' : 'FBR Notice OCR Inspection'}
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                {language === 'en'
                  ? 'Extract legal sections, calculate reply deadlines, and assess statutory risk'
                  : 'Qanooni sections aur jawabi muddat ka fori AI tajzia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              OCR Vision Engine Active
            </span>
          </div>
        </div>

        {/* Dropzone Container */}
        <div 
          onClick={() => handleSimulateUpload('FBR_Notice_Sec122_Audit.pdf', SAMPLE_FBR_NOTICES[1])}
          className="group border border-dashed border-[var(--border-subtle)] hover:border-[#087F5B] dark:hover:border-[#10B981] rounded-xl p-6 sm:p-8 text-center transition-all bg-[var(--bg-subtle)]/40 hover:bg-[var(--bg-subtle)] cursor-pointer relative overflow-hidden"
        >
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-center mx-auto text-[#087F5B] dark:text-[#10B981] group-hover:scale-105 transition-transform shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                {uploadedFileName ? `Inspecting: ${uploadedFileName}` : 'Drop official FBR Notice PDF or photo here'}
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                Supports official IRIS notices, PDFs, scanned letters, and phone photos (Max 15MB)
              </p>
            </div>
          </div>

          {/* Preset Notice Selectors */}
          <div className="mt-5 pt-4 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11px] text-[var(--text-tertiary)] font-mono mr-1">
              {language === 'en' ? 'Or test sample notices:' : 'Ya common notice check karein:'}
            </span>
            {SAMPLE_FBR_NOTICES.map((sample) => {
              const isSelected = selectedNotice.id === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulateUpload(`Sample_${sample.section.replace(/\s+/g, '_')}.pdf`, sample);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#087F5B] dark:bg-[#10B981] text-white font-medium'
                      : 'bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-hairline)]'
                  }`}
                >
                  {sample.section}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis Output Deck */}
      {analyzing ? (
        <div className="surface-card p-10 sm:p-12 text-center space-y-4">
          <div className="w-6 h-6 border-2 border-[#087F5B] dark:border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              Parsing Document Hierarchy & Ordinance Sections...
            </p>
            <p className="text-[11px] font-mono text-[var(--text-tertiary)]">
              Cross-referencing Income Tax Ordinance 2001 · Extracting statutory time limits
            </p>
          </div>
        </div>
      ) : (
        <div className="surface-card p-5 sm:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-hairline)]">
                  {selectedNotice.section}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${riskStyle.pill}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${riskStyle.dot} animate-pulse`} />
                  {riskStyle.label}
                </span>

                <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                  Income Tax Ordinance, 2001
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                {selectedNotice.title}
              </h2>
            </div>

            {/* Deadline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--warning-surface)] text-[var(--warning-text)] border border-[var(--warning-border)] self-start md:self-auto shrink-0">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <div className="text-xs font-mono font-medium">
                <span>Statutory Deadline: </span>
                <span className="font-semibold tabular-nums">{selectedNotice.urgencyDays} Days</span>
              </div>
            </div>
          </div>

          {/* Bilingual Plain Language Explanation Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                Plain-Language Executive Summary
              </span>

              {/* Language Switcher for Summary */}
              <div className="flex items-center p-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                <button
                  onClick={() => setActiveLangTab('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    activeLangTab === 'en'
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveLangTab('ur')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    activeLangTab === 'ur'
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Roman Urdu
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-2">
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {activeLangTab === 'en' ? selectedNotice.summaryEn : selectedNotice.summaryUr}
              </p>
            </div>
          </div>

          {/* Action Required Stepper Protocol */}
          <div className="space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)] block">
              {language === 'en' ? 'Required Action Protocol' : 'Zaroori Iqdaamat'}
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {(language === 'en' ? selectedNotice.actionRequiredEn : selectedNotice.actionRequiredUr).map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)]"
                >
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[#087F5B] dark:text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-mono font-semibold">{idx + 1}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] leading-snug">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Penalties Alert */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--danger-surface)] border border-[var(--danger-border)] flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[var(--danger-text)] block">
                Statutory Penalties if Unanswered:
              </span>
              <p className="text-xs text-[var(--danger-text)] opacity-90 leading-relaxed">
                {selectedNotice.penaltyDetails}
              </p>
            </div>
          </div>

          {/* Expert Escalation Trigger */}
          {selectedNotice.riskLevel !== 'low' && (
            <div className="pt-4 border-t border-[var(--border-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[var(--text-primary)] block">
                  {language === 'en' ? 'Professional Representation Recommended' : 'Chartered Accountant Ki Zarurat'}
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {language === 'en'
                    ? 'Audit defenses and Section 122 show-cause notices require formal statutory reply submission via IRIS portal.'
                    : 'Section 122 aur audit notices ka reply IRIS portal par qanooni tareeqe se dena lazmi hai.'}
                </p>
              </div>

              <Link
                href="/find-expert"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#087F5B] dark:bg-[#10B981] hover:bg-[#066447] text-white transition-all shrink-0 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.985]"
              >
                <span>Find Qualified Tax Advocate / CA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
