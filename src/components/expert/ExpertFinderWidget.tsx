'use client';

import React, { useState } from 'react';
import { VERIFIED_EXPERTS } from '@/lib/tax-engine';
import { VerifiedExpert, Language } from '@/lib/types';
import { 
  UserCheck, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Phone, 
  Briefcase, 
  Search,
  MessageSquare,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ExpertFinderWidgetProps {
  language?: Language;
}

export default function ExpertFinderWidget({ language = 'en' }: ExpertFinderWidgetProps) {
  const [caseDescription, setCaseDescription] = useState<string>('');
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const handleClassifyCase = () => {
    const text = caseDescription.toLowerCase();
    if (text.includes('notice') || text.includes('122') || text.includes('show cause') || text.includes('audit') || text.includes('111')) {
      setDetectedCategory('Tax Audit & Show Cause Defense');
    } else if (text.includes('freelance') || text.includes('pseb') || text.includes('remote') || text.includes('usd') || text.includes('dollar')) {
      setDetectedCategory('Freelancers & Tech Exporters');
    } else if (text.includes('secp') || text.includes('company') || text.includes('pvt') || text.includes('incorporat')) {
      setDetectedCategory('SECP Corporate Compliance');
    } else if (text.includes('sales tax') || text.includes('pra') || text.includes('srb') || text.includes('strn') || text.includes('pos')) {
      setDetectedCategory('Sales Tax & Provincial Authorities');
    } else {
      setDetectedCategory('General FBR Tax Advisory');
    }
  };

  const filteredExperts = VERIFIED_EXPERTS.filter((expert) => {
    if (selectedCity !== 'All' && !expert.city.includes(selectedCity)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Smart Intake & Case Matcher Hub */}
      <div className="surface-card p-5 sm:p-6 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
              CLASSIFIER INTEL
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
              ICAP & High Court Bar Directory
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            {language === 'en' ? 'Verified Tax Practitioner Directory & Case Matcher' : 'Mustanad CA Aur Tax Advocates'}
          </h3>

          <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {language === 'en'
              ? 'Describe your tax situation or legal notice to match with vetted Chartered Accountants and High Court Advocates in Pakistan.'
              : 'Apna masla darj karein taake relevant Chartered Accountant ya High Court Tax Lawyer se rabta ho sake.'}
          </p>
        </div>

        {/* Search Command Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClassifyCase()}
              placeholder={
                language === 'en'
                  ? 'e.g. Received FBR notice for Section 122(5A) unexplained deposits...'
                  : 'e.g. Section 122 ka audit notice aya hai ya company register karwani hai...'
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[#087F5B] dark:focus:border-[#10B981] transition-colors"
            />
          </div>

          <button
            onClick={handleClassifyCase}
            className="px-4 py-2.5 rounded-lg text-xs font-medium bg-[#087F5B] dark:bg-[#10B981] hover:bg-[#066447] text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.985] shrink-0"
          >
            <span>{language === 'en' ? 'Classify Case' : 'Case Check Karein'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Classification Output */}
        {detectedCategory && (
          <div className="p-3.5 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--accent-text)]">Classified Specialization:</span>
              <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-[var(--bg-card)] text-[var(--accent-text)] border border-[var(--accent-border)]">
                {detectedCategory}
              </span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Showing verified practitioners with audited track records.
            </span>
          </div>
        )}
      </div>

      {/* Directory Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-[var(--text-tertiary)] font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            City:
          </span>
          {['All', 'Karachi', 'Lahore', 'Islamabad', 'Faisalabad'].map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-[#087F5B] dark:border-[#10B981] bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-[var(--text-tertiary)] font-mono self-start sm:self-auto">
          {filteredExperts.length} Verified Professionals Listed
        </span>
      </div>

      {/* Verified Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExperts.map((expert) => (
          <div
            key={expert.id}
            className="surface-card p-5 space-y-4 hover:border-[var(--border-active)] transition-all flex flex-col justify-between"
          >
            {/* Top Details */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                    {expert.name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">{expert.title}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#087F5B] dark:text-[#10B981]" />
                    <span>{expert.firm}</span>
                  </p>
                </div>

                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-xs font-mono font-medium">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="tabular-nums font-semibold text-[var(--text-primary)]">{expert.rating}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">({expert.reviewsCount})</span>
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--accent-surface)] text-[var(--accent-text)] border border-[var(--accent-border)] font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  {expert.verificationBadge}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
                  <MapPin className="w-3 h-3 text-[var(--text-tertiary)]" />
                  {expert.city}
                </span>

                <span className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)] font-mono tabular-nums">
                  {expert.experienceYears}+ Yrs Practice
                </span>
              </div>

              {/* Specialization Tags */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--text-tertiary)] block">
                  Core Practice Areas:
                </span>
                <div className="flex flex-wrap gap-1">
                  {expert.specialization.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee & Direct Contact Action */}
            <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-[var(--text-tertiary)] block">
                  Estimated Retainer:
                </span>
                <span className="text-xs font-mono font-medium text-[var(--text-primary)]">
                  {expert.feeRange}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${expert.phone}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-hairline)] transition-colors active:scale-[0.985]"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/${expert.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${expert.name}, I found your profile on DaleelAI regarding a tax advisory case.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#087F5B] dark:bg-[#10B981] hover:bg-[#066447] text-white transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.985]"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
