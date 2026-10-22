'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Calculator, 
  Scale, 
  FileText, 
  CheckSquare, 
  Users, 
  Bell, 
  Plus, 
  PanelLeftClose, 
  PanelLeft, 
  Menu, 
  X, 
  ShieldCheck, 
  Clock,
  Trash2,
  ChevronRight,
  Command
} from 'lucide-react';
import DaleelLogo, { DaleelMark } from '@/components/shared/DaleelLogo';
import ThemeToggle from '@/components/layout/ThemeToggle';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { Language } from '@/lib/types';

interface AppShellProps {
  children: React.ReactNode;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  pageTitle?: string;
  pageSubtitle?: string;
}

interface StoredChat {
  id: string;
  title: string;
  timestamp: string;
}

export default function AppShell({
  children,
  currentLang = 'en',
  onLanguageChange,
  pageTitle,
  pageSubtitle,
}: AppShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [recentChats, setRecentChats] = useState<StoredChat[]>([]);

  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('daleel_sidebar_collapsed');
      if (savedCollapsed !== null) {
        setSidebarCollapsed(savedCollapsed === 'true');
      }

      const storedHistory = localStorage.getItem('daleel_recent_chats');
      if (storedHistory) {
        setRecentChats(JSON.parse(storedHistory));
      } else {
        const defaultChats: StoredChat[] = [
          { id: 'c1', title: 'Freelancer Section 154A export tax rate', timestamp: 'Today' },
          { id: 'c2', title: 'Section 114 Notice reply checklist', timestamp: 'Yesterday' },
          { id: 'c3', title: 'Withholding tax on vehicle purchase (231B)', timestamp: '3d ago' },
        ];
        setRecentChats(defaultChats);
        localStorage.setItem('daleel_recent_chats', JSON.stringify(defaultChats));
      }
    } catch (e) {}
  }, []);

  const toggleSidebar = () => {
    const nextState = !sidebarCollapsed;
    setSidebarCollapsed(nextState);
    try {
      localStorage.setItem('daleel_sidebar_collapsed', String(nextState));
    } catch (e) {}
  };

  const deleteChatHistory = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = recentChats.filter((c) => c.id !== id);
    setRecentChats(updated);
    try {
      localStorage.setItem('daleel_recent_chats', JSON.stringify(updated));
    } catch (e) {}
  };

  const navigationGroups = [
    {
      group: 'Intelligence',
      items: [
        { href: '/chat', labelEn: 'Research Assistant', labelUr: 'Daleel AI Chat', icon: MessageSquare, badge: 'Live' },
      ],
    },
    {
      group: 'Statutory Tools',
      items: [
        { href: '/calculator', labelEn: 'Tax Calculator', labelUr: 'Tax Calculator', icon: Calculator, badge: 'FA24' },
        { href: '/compare', labelEn: 'Filer vs Non-Filer', labelUr: 'Filer vs Non-Filer', icon: Scale },
        { href: '/notice', labelEn: 'Notice Explainer', labelUr: 'Notice Explainer', icon: FileText, badge: 'OCR' },
        { href: '/checklist', labelEn: 'Filing Roadmaps', labelUr: 'Checklists', icon: CheckSquare },
        { href: '/find-expert', labelEn: 'Verified Counsel', labelUr: 'Counsel Directory', icon: Users },
        { href: '/notifications', labelEn: 'Gazette & SROs', labelUr: 'FBR Gazettes', icon: Bell },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden md:flex flex-col border-r border-[var(--border-hairline)] bg-[var(--bg-card)] transition-all duration-200 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-[68px]' : 'w-[250px]'
        }`}
      >
        {/* Brand & Collapse Header */}
        <div className="h-14 px-3.5 flex items-center justify-between border-b border-[var(--border-hairline)]">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            {sidebarCollapsed ? (
              <DaleelMark size="sm" />
            ) : (
              <DaleelLogo size="sm" showText={true} />
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="p-2.5">
          <Link
            href="/chat"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-xs transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] ${
              pathname === '/chat'
                ? 'bg-[#087F5B] dark:bg-[#10B981] text-white'
                : 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-hairline)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            {!sidebarCollapsed && <span>{currentLang === 'en' ? 'New Research' : 'Naya Sawal'}</span>}
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1.5 space-y-5">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-0.5">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] px-2.5 py-1 block font-semibold">
                  {group.group}
                </span>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? item.labelEn : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold border border-[var(--accent-border)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent-text)]' : 'text-[var(--text-tertiary)]'}`} strokeWidth={1.5} />
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1">
                        {currentLang === 'en' ? item.labelEn : item.labelUr}
                      </span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-tertiary)] border border-[var(--border-hairline)] font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Local Client-Side History */}
          {!sidebarCollapsed && recentChats.length > 0 && (
            <div className="space-y-1 pt-3 border-t border-[var(--border-hairline)]">
              <div className="flex items-center justify-between px-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  <span>Recent</span>
                </span>
                <span className="text-[9px] font-mono text-[var(--text-tertiary)]">Local</span>
              </div>

              <div className="space-y-0.5">
                {recentChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat?q=${encodeURIComponent(chat.title)}`}
                    className="group flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <span className="truncate max-w-[170px]">{chat.title}</span>
                    <button
                      onClick={(e) => deleteChatHistory(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 transition-opacity"
                      title="Delete"
                      aria-label="Delete recent search"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between">
          {onLanguageChange && (
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          )}
          <ThemeToggle />
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-[270px] max-w-[85vw] h-full bg-[var(--bg-card)] border-r border-[var(--border-hairline)] flex flex-col z-50 shadow-2xl">
            <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border-hairline)]">
              <DaleelLogo size="sm" showText={true} />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-3">
              <Link
                href="/chat"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-xs bg-[#087F5B] text-white"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{currentLang === 'en' ? 'New Research' : 'Naya Sawal'}</span>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
              {navigationGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] px-2 block font-semibold">
                    {group.group}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] font-semibold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#087F5B]" strokeWidth={1.5} />
                        <span>{currentLang === 'en' ? item.labelEn : item.labelUr}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[var(--border-hairline)] flex items-center justify-between">
              {onLanguageChange && (
                <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* ================= WORKSPACE VIEWPORT ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Command Bar */}
        <header className="h-14 px-4 md:px-6 border-b border-[var(--border-hairline)] bg-[var(--bg-card)] flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-1.5 text-xs">
              <Link href="/" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                Daleel
              </Link>
              {pageTitle && (
                <>
                  <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" strokeWidth={1.5} />
                  <span className="font-semibold text-[var(--text-primary)]">{pageTitle}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Authority Pill & Command Badge */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-[10px] text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#087F5B] dark:bg-[#10B981] animate-pulse" />
              <span>FBR Ordinance 2001 & SECP Sourced</span>
            </div>

            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)] transition-colors"
            >
              <Command className="w-3 h-3" strokeWidth={1.5} />
              <span>Research</span>
              <kbd className="font-mono text-[9px] px-1 py-0.2 rounded bg-[var(--bg-card)] border border-[var(--border-hairline)]">⌘K</kbd>
            </Link>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
