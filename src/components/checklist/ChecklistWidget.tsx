'use client';

import React, { useState, useEffect } from 'react';
import { COMPLIANCE_CHECKLISTS } from '@/lib/tax-engine';
import { ComplianceChecklist, Language } from '@/lib/types';
import { 
  CheckSquare, 
  ExternalLink, 
  Clock, 
  FileCheck, 
  Check, 
  Building,
  User,
  Laptop,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface ChecklistWidgetProps {
  language?: Language;
}

export default function ChecklistWidget({ language = 'en' }: ChecklistWidgetProps) {
  const [selectedListId, setSelectedListId] = useState<string>(COMPLIANCE_CHECKLISTS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // LocalStorage persistence for user's task progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('daleel_completed_checklist_steps');
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const activeChecklist = COMPLIANCE_CHECKLISTS.find((l) => l.id === selectedListId) || COMPLIANCE_CHECKLISTS[0];
  const totalSteps = activeChecklist.steps.length;
  const finishedCount = activeChecklist.steps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = totalSteps > 0 ? Math.round((finishedCount / totalSteps) * 100) : 0;

  const toggleStep = (stepId: string) => {
    const updated = {
      ...completedSteps,
      [stepId]: !completedSteps[stepId],
    };
    setCompletedSteps(updated);
    try {
      localStorage.setItem('daleel_completed_checklist_steps', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleResetChecklist = () => {
    const updated = { ...completedSteps };
    activeChecklist.steps.forEach((s) => {
      delete updated[s.id];
    });
    setCompletedSteps(updated);
    try {
      localStorage.setItem('daleel_completed_checklist_steps', JSON.stringify(updated));
    } catch (e) {}
  };

  const getCategoryIcon = (category: ComplianceChecklist['category']) => {
    switch (category) {
      case 'freelancer':
        return <Laptop className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#10B981]" />;
      case 'corporate':
        return <Building className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Category Pills Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {COMPLIANCE_CHECKLISTS.map((list) => {
          const isSelected = list.id === selectedListId;
          return (
            <button
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'border-[#087F5B] dark:border-[#10B981] bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {getCategoryIcon(list.category)}
              <span>{language === 'en' ? list.title : list.titleUr}</span>
            </button>
          );
        })}
      </div>

      {/* Main Checklist Container */}
      <div className="surface-card p-5 sm:p-6 space-y-5">
        {/* Header and Progress Bar */}
        <div className="space-y-4 pb-5 border-b border-[var(--border-hairline)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
                  {activeChecklist.category.toUpperCase()} WORKFLOW
                </span>
                <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                  Official Statutory Roadmap
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                {language === 'en' ? activeChecklist.title : activeChecklist.titleUr}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                {activeChecklist.description}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0 space-y-1">
              <div className="flex items-center sm:justify-end gap-2">
                <span className="text-xs font-mono tabular-nums text-[var(--text-tertiary)]">
                  {finishedCount} of {totalSteps} Complete
                </span>
                <span className="text-sm font-mono font-semibold tabular-nums text-[#087F5B] dark:text-[#10B981]">
                  {progressPercent}%
                </span>
              </div>

              {finishedCount > 0 && (
                <button
                  onClick={handleResetChecklist}
                  className="inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset checklist</span>
                </button>
              )}
            </div>
          </div>

          {/* Hairline Progress Meter */}
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
            <div
              className="h-full bg-[#087F5B] dark:bg-[#10B981] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {activeChecklist.steps.map((step, index) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isDone
                    ? 'border-[var(--border-hairline)] bg-[var(--bg-subtle)]/60 opacity-80'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-card)] hover:border-[var(--border-active)] shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Custom Accessible Checkbox */}
                  <div
                    className={`w-4 h-4 rounded-[4px] border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#087F5B] dark:bg-[#10B981] border-[#087F5B] dark:border-[#10B981] text-white'
                        : 'border-[var(--border-active)] bg-[var(--bg-card)]'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                          STEP {index + 1}
                        </span>
                        <h4
                          className={`text-xs sm:text-sm font-semibold tracking-tight ${
                            isDone ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {language === 'en' ? step.title : step.titleUr}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] font-mono shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{step.estimatedTime}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {language === 'en' ? step.description : step.descriptionUr}
                    </p>

                    {/* Prerequisite Documents & External Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5">
                      {step.requiredDocuments.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--text-tertiary)] flex items-center gap-1">
                            <FileCheck className="w-3 h-3 text-[#087F5B] dark:text-[#10B981]" />
                            Required:
                          </span>
                          {step.requiredDocuments.map((doc, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      )}

                      {step.portalUrl && (
                        <a
                          href={step.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#087F5B] dark:text-[#10B981] hover:underline transition-colors ml-auto shrink-0"
                        >
                          <span>{step.portalName || 'Official Portal'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
