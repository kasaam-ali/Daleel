'use client';

import React, { useState } from 'react';
import { calculateSalaryTax, calculateFreelancerTax } from '@/lib/tax-engine';
import { 
  Calculator, 
  Wallet, 
  Sparkles, 
  Building, 
  ShieldCheck, 
  Check, 
  Info,
  Calendar
} from 'lucide-react';
import { Language } from '@/lib/types';

interface TaxCalculatorWidgetProps {
  language?: Language;
}

export default function TaxCalculatorWidget({ language = 'en' }: TaxCalculatorWidgetProps) {
  const [activeTab, setActiveTab] = useState<'salary' | 'freelancer' | 'property'>('salary');
  const [taxYear] = useState<string>('2024-2025');

  // Salary Calculator State
  const [salaryFrequency, setSalaryFrequency] = useState<'monthly' | 'annual'>('monthly');
  const [salaryInput, setSalaryInput] = useState<number>(150000);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const annualSalary = salaryFrequency === 'monthly' ? salaryInput * 12 : salaryInput;
  const salaryResult = calculateSalaryTax(annualSalary);

  // Freelancer Calculator State
  const [freelancerIncomeUSD, setFreelancerIncomeUSD] = useState<number>(1500);
  const [usdRate, setUsdRate] = useState<number>(280);
  const [isPsebRegistered, setIsPsebRegistered] = useState<boolean>(true);
  const freelancerResult = calculateFreelancerTax(freelancerIncomeUSD, usdRate, isPsebRegistered);

  // Property Calculator State
  const [propertyPrice, setPropertyPrice] = useState<number>(15000000);
  const [isFiler, setIsFiler] = useState<boolean>(true);
  const [propertyAction, setPropertyAction] = useState<'buy' | 'sell'>('buy');
  const propertyRate = propertyAction === 'buy' ? (isFiler ? 0.03 : 0.12) : (isFiler ? 0.03 : 0.10);
  const propertyTaxAmount = Math.round(propertyPrice * propertyRate);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 180);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Header Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('salary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'salary'
                ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] shadow-sm border border-[var(--border-hairline)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{language === 'en' ? 'Salaried Individuals' : 'Salaried'}</span>
          </button>

          <button
            onClick={() => setActiveTab('freelancer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'freelancer'
                ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] shadow-sm border border-[var(--border-hairline)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{language === 'en' ? 'IT Freelancers' : 'Freelancers'}</span>
            <span className="text-[9px] font-mono px-1 rounded bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold">
              0.25%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('property')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'property'
                ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] shadow-sm border border-[var(--border-hairline)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{language === 'en' ? 'Property Advance Tax' : 'Property (236C/K)'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[var(--text-tertiary)] font-mono self-end sm:self-auto">
          <Calendar className="w-3 h-3" strokeWidth={1.5} />
          <span>Finance Act {taxYear}</span>
        </div>
      </div>

      {/* ================= 1. SALARIED MODE ================= */}
      {activeTab === 'salary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 surface-card p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {language === 'en' ? 'Income Parameters' : 'Aamdani Ka Hisab'}
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Gross regular taxable compensation
                </p>
              </div>

              <div className="flex p-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                <button
                  onClick={() => setSalaryFrequency('monthly')}
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition-all cursor-pointer ${
                    salaryFrequency === 'monthly'
                      ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] font-semibold shadow-sm'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSalaryFrequency('annual')}
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition-all cursor-pointer ${
                    salaryFrequency === 'annual'
                      ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] font-semibold shadow-sm'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block font-semibold">
                {salaryFrequency === 'monthly' ? 'Monthly Gross Salary' : 'Annual Gross Salary'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-[var(--text-tertiary)]">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={salaryInput || ''}
                  onChange={(e) => setSalaryInput(Number(e.target.value) || 0)}
                  className="w-full pl-14 pr-3 py-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-base font-semibold font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#087F5B] focus:bg-[var(--bg-card)] transition-colors tabular-nums"
                  placeholder="150,000"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Presets:</span>
              <div className="flex flex-wrap gap-1">
                {[60000, 100000, 150000, 250000, 450000, 800000].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setSalaryFrequency('monthly');
                      setSalaryInput(val);
                    }}
                    className="px-2 py-0.5 rounded text-[11px] font-mono border border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {(val / 1000).toFixed(0)}k/mo
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[var(--accent-text)] text-xs flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#087F5B] dark:text-[#10B981]" strokeWidth={1.75} />
              <p className="leading-relaxed text-[11px]">
                <strong>Exemption:</strong> First PKR 600,000/year (PKR 50,000/month) is 0% tax exempt under First Schedule Division I.
              </p>
            </div>

            <button
              onClick={handleRecalculate}
              disabled={isCalculating}
              className="w-full py-2.5 rounded-lg font-medium text-xs bg-[#087F5B] dark:bg-[#10B981] hover:opacity-90 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{isCalculating ? 'Computing...' : 'Recalculate Tax'}</span>
            </button>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-7 surface-card p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {language === 'en' ? 'Statutory Calculation Summary' : 'Tax Khulaasa'}
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Finance Act 2024 progressive brackets
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-tertiary)] border border-[var(--border-hairline)]">
                {salaryResult.slabDescription.split(' ')[0]}
              </span>
            </div>

            {/* Figures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Monthly Tax
                </span>
                <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 block tabular-nums">
                  PKR {salaryResult.monthlyTax.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  Annual: {salaryResult.annualTax.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Monthly Take-Home
                </span>
                <span className="text-lg font-bold font-mono text-[#087F5B] dark:text-[#10B981] block tabular-nums">
                  PKR {salaryResult.takeHomeMonthly.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  Annual: {(salaryResult.takeHomeMonthly * 12).toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Effective Rate
                </span>
                <span className="text-lg font-bold font-mono text-[var(--text-primary)] block tabular-nums">
                  {salaryResult.effectiveRate}%
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  Of gross salary
                </span>
              </div>
            </div>

            {/* Slices Breakdown */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] font-semibold block">
                Progressive Slabs Breakdown:
              </span>
              <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden divide-y divide-[var(--border-hairline)] text-xs">
                {salaryResult.breakdown.map((item, bIdx) => (
                  <div key={bIdx} className="p-2.5 px-3 bg-[var(--bg-card)] flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[var(--text-primary)] block text-xs">
                        PKR {item.slabRange}
                      </span>
                      <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                        Taxable: {item.taxableAmountInSlab.toLocaleString()} @ {item.ratePercent}%
                      </span>
                    </div>

                    <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                      PKR {item.taxAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
              <span>Calculations reflect Federal Income Tax Ordinance 2001. Excludes voluntary funds.</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. FREELANCER MODE ================= */}
      {activeTab === 'freelancer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 surface-card p-5 space-y-5">
            <div className="pb-3 border-b border-[var(--border-hairline)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                IT Export Proceeds
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Section 154A final tax withholding
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block font-semibold">
                Monthly Inward Remittance (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-[var(--text-tertiary)]">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={freelancerIncomeUSD || ''}
                  onChange={(e) => setFreelancerIncomeUSD(Number(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-base font-semibold font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#087F5B] focus:bg-[var(--bg-card)] transition-colors tabular-nums"
                  placeholder="1500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Conversion Rate
                </label>
                <input
                  type="number"
                  value={usdRate}
                  onChange={(e) => setUsdRate(Number(e.target.value) || 280)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-xs font-mono font-semibold text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  PSEB Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsPsebRegistered(!isPsebRegistered)}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    isPsebRegistered
                      ? 'border-[var(--accent-border)] bg-[var(--accent-surface)] text-[var(--accent-text)]'
                      : 'border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]'
                  }`}
                >
                  <Check className="w-3 h-3" strokeWidth={2} />
                  <span>{isPsebRegistered ? 'Registered (0.25%)' : 'Unregistered (1.0%)'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[var(--accent-text)] text-xs space-y-0.5">
              <span className="font-semibold block text-[11px]">PSEB Statutory Advantage:</span>
              <p className="text-[11px] leading-relaxed">
                Registered freelancers save 75% tax at realization. Final deduction certificate is issued by your bank upon PRC submission.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 surface-card p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Net Realization Summary
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Final tax deduction via banking channels
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent-surface)] text-[var(--accent-text)] border border-[var(--accent-border)] font-semibold">
                Rate: {freelancerResult.taxRatePercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Monthly Tax (Final)
                </span>
                <span className="text-lg font-bold font-mono text-[#087F5B] dark:text-[#10B981] block tabular-nums">
                  PKR {freelancerResult.monthlyTax.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  Annual: PKR {freelancerResult.annualTax.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Monthly Net Take-Home
                </span>
                <span className="text-lg font-bold font-mono text-[#087F5B] dark:text-[#10B981] block tabular-nums">
                  PKR {freelancerResult.takeHomeMonthly.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  (~${Math.round(freelancerResult.takeHomeMonthly / usdRate)} USD)
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] font-semibold block">
                Statutory Compliance Rules:
              </span>
              <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                {freelancerResult.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-[11px]">
                    <Check className="w-3 h-3 text-[#087F5B] shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. PROPERTY MODE ================= */}
      {activeTab === 'property' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 surface-card p-5 space-y-5">
            <div className="pb-3 border-b border-[var(--border-hairline)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Property Consideration
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                FBR valuation table or DC rate
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block font-semibold">
                Valuation / Consideration (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-[var(--text-tertiary)]">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={propertyPrice || ''}
                  onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                  className="w-full pl-14 pr-3 py-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-base font-semibold font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#087F5B] focus:bg-[var(--bg-card)] transition-colors tabular-nums"
                  placeholder="15,000,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Transaction Side
                </label>
                <div className="flex p-0.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                  <button
                    onClick={() => setPropertyAction('buy')}
                    className={`flex-1 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                      propertyAction === 'buy'
                        ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] font-semibold shadow-sm'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    Buying (236K)
                  </button>
                  <button
                    onClick={() => setPropertyAction('sell')}
                    className={`flex-1 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                      propertyAction === 'sell'
                        ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] font-semibold shadow-sm'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    Selling (236C)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  ATL Filer Status
                </label>
                <div className="flex p-0.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                  <button
                    onClick={() => setIsFiler(true)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                      isFiler
                        ? 'bg-[var(--bg-card)] text-[#087F5B] dark:text-[#10B981] font-semibold shadow-sm'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    Filer
                  </button>
                  <button
                    onClick={() => setIsFiler(false)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                      !isFiler
                        ? 'bg-rose-600 text-white font-semibold shadow-sm'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    Non-Filer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 surface-card p-5 space-y-4">
            <div className="pb-3 border-b border-[var(--border-hairline)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Advance Withholding Tax
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Payable before mutation or transfer
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                {propertyAction === 'buy' ? 'Purchaser Advance Tax (Sec 236K)' : 'Seller Advance Tax (Sec 236C)'}
              </span>
              <span className={`text-2xl font-bold font-mono block tabular-nums ${isFiler ? 'text-[#087F5B] dark:text-[#10B981]' : 'text-rose-600 dark:text-rose-400'}`}>
                PKR {propertyTaxAmount.toLocaleString()}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                Statutory Rate: {(propertyRate * 100).toFixed(1)}% of registered valuation
              </span>
            </div>

            {!isFiler && (
              <div className="p-3 rounded-lg bg-[var(--danger-surface)] border border-[var(--danger-border)] text-xs text-[var(--danger-text)] space-y-0.5">
                <span className="font-semibold block text-[11px]">Non-Filer Penalty Exposure:</span>
                <p className="text-[11px] leading-relaxed">
                  As an active filer, tax would only be PKR {(propertyPrice * 0.03).toLocaleString()}. Non-filer status results in a direct penalty difference of PKR {(propertyTaxAmount - propertyPrice * 0.03).toLocaleString()}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
