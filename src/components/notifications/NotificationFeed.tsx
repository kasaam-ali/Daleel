'use client';

import React, { useState } from 'react';
import { FBR_NOTIFICATIONS } from '@/lib/tax-engine';
import { FBRNotification, Language } from '@/lib/types';
import { Bell, Calendar, Tag, ExternalLink, Filter, FileText, CheckCircle2 } from 'lucide-react';

interface NotificationFeedProps {
  language?: Language;
}

export default function NotificationFeed({ language = 'en' }: NotificationFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredNotifications = FBR_NOTIFICATIONS.filter((notif) => {
    if (selectedCategory !== 'All' && notif.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Filter and Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-[var(--text-tertiary)] font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {['All', 'Income Tax', 'Sales Tax', 'Corporate'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-[#087F5B] dark:border-[#10B981] bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Federal Gazette Sync Active
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className="surface-card p-5 space-y-4 hover:border-[var(--border-active)] transition-all"
          >
            {/* Header Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-hairline)]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-hairline)]">
                  {notif.sroNumber}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--accent-surface)] text-[var(--accent-text)] border border-[var(--accent-border)] font-medium">
                  {notif.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] font-mono">
                <Calendar className="w-3 h-3" />
                <span>Published: {notif.date}</span>
              </div>
            </div>

            {/* Gazette Title */}
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--text-primary)]">
              {language === 'en' ? notif.title : notif.titleUr}
            </h3>

            {/* AI Executive Plain-Language Brief */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                {language === 'en' ? 'Statutory Plain-Language Summary' : 'Qanooni Khulaasa'}
              </span>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {language === 'en' ? notif.summaryEn : notif.summaryUr}
              </p>
            </div>

            {/* Footer Stakeholders & Download Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono text-[var(--text-tertiary)] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#087F5B] dark:text-[#10B981]" />
                  Impacts:
                </span>
                {notif.impactOn.map((group, gIdx) => (
                  <span
                    key={gIdx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-hairline)]"
                  >
                    {group}
                  </span>
                ))}
              </div>

              {notif.downloadUrl && (
                <a
                  href={notif.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#087F5B] dark:text-[#10B981] hover:underline transition-colors ml-auto shrink-0"
                >
                  <FileText className="w-3 h-3" />
                  <span>View Official Gazette PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
