'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WHT_COMPARISON_DATA } from '@/lib/tax-engine';
import { 
  Scale, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  Info,
  ShieldCheck,
  TrendingDown,
  Calculator,
  ExternalLink
} from 'lucide-react';
import { Language } from '@/lib/types';

interface ComparisonMatrixProps {
  language?: Language;
}

export default function ComparisonMatrix({ language = 'en' }: ComparisonMatrixProps) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<number>(5000000);

  const selectedItem = WHT_COMPARISON_DATA[selectedCategoryIndex] || WHT_COMPARISON_DATA[0];

  // Dynamic percentage extraction from string like "3%" -> 0.03
  const parsePercent = (str: string, fallback: number): number => {
    const match = str.match(/([0-9.]+)\s*%/);
    return match ? parseFloat(match[1]) / 100 : fallback;
  };

  const filerRateDecimal = parsePercent(selectedItem.filerRate, 0.03);
  const nonFilerRateDecimal = parsePercent(selectedItem.nonFilerRate, 0.12);

  const calculatedFilerTax = Math.round(customAmount * filerRateDecimal);
  const calculatedNonFilerTax = Math.round(customAmount * nonFilerRateDecimal);
  const penaltyLoss = Math.max(0, calculatedNonFilerTax - calculatedFilerTax);
  const savingsPercent = calculatedNonFilerTax > 0 
    ? Math.round(((calculatedNonFilerTax - calculatedFilerTax) / calculatedNonFilerTax) * 100)
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* High-Signal Warning Callout Banner */}
      <div className="surface-card p-5 sm:p-6 border-[var(--border-hairline)] bg-[var(--bg-card)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--danger-surface)] text-[var(--danger-text)] border border-[var(--danger-border)]">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                {language === 'en' ? 'Statutory Penal Surcharge' : 'Qanooni Jurmana Zoon'}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                Finance Act 2024-2025 · Sec 100BA & 10th Sched.
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              {language === 'en'
                ? 'Non-Filers Incur Up to 400% Higher Withholding Tax on Standard Transactions'
                : 'Active Taxpayer List (ATL) Mein Na Hone Par 4 Guna Ziyada Tax Katoti'}
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {language === 'en'
                ? 'Absence from the FBR Active Taxpayers List triggers statutory non-adjustable penalties on banking transfers, property registrations, motor vehicles, and dividend withdrawals.'
                : 'FBR ki ATL list se baahir afraad par banking, gariyon, aur property par bhari ghair-qabil-e-wapsi withholding tax aaid hota hai.'}
            </p>
          </div>

          <Link
            href="/checklist"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-[#087F5B] dark:bg-[#10B981] hover:bg-[#066447] text-white transition-all shrink-0 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.985]"
          >
            <span>{language === 'en' ? 'Complete Filer Checklist' : 'Filer Banein Ki Checklist'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Penalty Simulator Workbench */}
      <div className="surface-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] flex items-center justify-center text-[#087F5B] dark:text-[#10B981]">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                {language === 'en' ? 'Live Withholding Surcharge Simulator' : 'Live Tax Katoti Simulator'}
              </h4>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                {language === 'en'
                  ? `Simulating impact on: ${selectedItem.category} (${selectedItem.section})`
                  : `Mawazna bara-e: ${selectedItem.category} (${selectedItem.section})`}
              </p>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[var(--text-tertiary)] font-mono mr-1">Presets:</span>
            {[1000000, 3000000, 5000000, 15000000].map((preset) => (
              <button
                key={preset}
                onClick={() => setCustomAmount(preset)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  customAmount === preset
                    ? 'bg-[#087F5B] dark:bg-[#10B981] text-white font-medium'
                    : 'bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-hairline)]'
                }`}
              >
                PKR {(preset / 1000000).toFixed(preset % 1000000 === 0 ? 0 : 1)}M
              </button>
            ))}
          </div>
        </div>

        {/* Input & Live Metric Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Custom Input */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)] flex items-center justify-between">
              <span>{language === 'en' ? 'Transaction Value (PKR)' : 'Transaction Raqam (PKR)'}</span>
              <span className="font-mono text-[var(--text-secondary)] normal-case">
                PKR {customAmount.toLocaleString()}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-tertiary)]">
                PKR
              </span>
              <input
                type="number"
                min="50000"
                step="50000"
                value={customAmount}
                onChange={(e) => setCustomAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-sm font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[#087F5B] dark:focus:border-[#10B981] transition-colors"
              />
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              {language === 'en'
                ? `Applicable law: Income Tax Ordinance Section ${selectedItem.section}.`
                : `Lagu qanoon: Income Tax Ordinance Section ${selectedItem.section}.`}
            </p>
          </div>

          {/* Metric Comparison Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filer Deduction */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Active Filer
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  {selectedItem.filerRate}
                </span>
              </div>
              <div className="text-base sm:text-lg font-semibold font-mono tabular-nums text-[var(--text-primary)]">
                PKR {calculatedFilerTax.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)] block">
                {language === 'en' ? 'Adjustable in annual return' : 'Salana return mein adjustable'}
              </span>
            </div>

            {/* Non-Filer Deduction */}
            <div className="p-3.5 rounded-xl bg-[var(--danger-surface)] border border-[var(--danger-border)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--danger-text)] uppercase tracking-wider">
                  Non-Filer
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-medium">
                  {selectedItem.nonFilerRate}
                </span>
              </div>
              <div className="text-base sm:text-lg font-semibold font-mono tabular-nums text-[var(--danger-text)]">
                PKR {calculatedNonFilerTax.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--danger-text)] opacity-80 block">
                {language === 'en' ? 'Unadjustable penal tax' : 'Ghair-qabil-e-wapsi katoti'}
              </span>
            </div>

            {/* Net Surcharge Penalty Loss */}
            <div className="p-3.5 rounded-xl bg-[var(--warning-surface)] border border-[var(--warning-border)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--warning-text)] uppercase tracking-wider">
                  Penalty Loss
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium">
                  -{savingsPercent}%
                </span>
              </div>
              <div className="text-base sm:text-lg font-semibold font-mono tabular-nums text-[var(--warning-text)]">
                PKR {penaltyLoss.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--warning-text)] opacity-80 block">
                {language === 'en' ? 'Avoidable excess tax' : 'Bachaayi ja sakti hai'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Comparison Data Table */}
      <div className="surface-card rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--border-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--bg-card)]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#087F5B] dark:text-[#10B981]" />
            <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
              {language === 'en'
                ? 'Statutory Withholding Tax Comparison Matrix'
                : 'Withholding Tax Rates Ka Tafseeli Mawazna'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] font-mono">
            <span>Income Tax Ordinance, 2001 (Updated 2024-25)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-hairline)] text-[var(--text-tertiary)] uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4 font-medium">{language === 'en' ? 'Category / Nature' : 'Shorba'}</th>
                <th className="py-3 px-4 font-medium">{language === 'en' ? 'Section' : 'Section'}</th>
                <th className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">
                  {language === 'en' ? 'Filer Rate' : 'Filer Rate'}
                </th>
                <th className="py-3 px-4 font-medium text-rose-600 dark:text-rose-400">
                  {language === 'en' ? 'Non-Filer Rate' : 'Non-Filer Rate'}
                </th>
                <th className="py-3 px-4 font-medium">{language === 'en' ? 'Sample Transaction' : 'Misaal'}</th>
                <th className="py-3 px-4 text-right font-medium text-[var(--text-primary)]">
                  {language === 'en' ? 'Non-Filer Surcharge Penalty' : 'Surcharge Nuqsaan'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {WHT_COMPARISON_DATA.map((item, index) => {
                const isSelected = selectedCategoryIndex === index;
                return (
                  <tr
                    key={index}
                    onClick={() => {
                      setSelectedCategoryIndex(index);
                      setCustomAmount(item.exampleBasis);
                    }}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-surface)] text-[var(--accent-text)]'
                        : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                            isSelected ? 'bg-[#087F5B] dark:bg-[#10B981]' : 'bg-[var(--border-active)]'
                          }`}
                        />
                        <div>
                          <span className="font-semibold text-[var(--text-primary)] block">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)] whitespace-nowrap">
                      Sec {item.section}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3 h-3" />
                        {item.filerRate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums font-medium text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-3 h-3" />
                        {item.nonFilerRate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-[var(--text-secondary)] whitespace-nowrap">
                      PKR {item.exampleBasis.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-mono tabular-nums font-semibold text-rose-600 dark:text-rose-400">
                        + PKR {item.difference.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Guidance Note */}
        <div className="p-3.5 px-4 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--text-tertiary)]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#10B981] shrink-0" />
            <span>
              {language === 'en'
                ? 'Rates apply under Tenth Schedule of the Income Tax Ordinance 2001 as amended by Finance Act 2024.'
                : 'Tamam rates Income Tax Ordinance 2001 ke 10th Schedule ke mutabiq darj hain.'}
            </span>
          </div>

          <a
            href="https://fbr.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <span>FBR Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
