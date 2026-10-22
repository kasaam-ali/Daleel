'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  RotateCcw,
  ArrowRight,
  Info,
  Building,
  DollarSign,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { EvidenceSealIllustration } from '@/components/shared/DaleelLogo';
import { Language } from '@/lib/types';

interface SourceReference {
  title: string;
  section: string;
  authority: 'FBR' | 'SECP' | 'Finance Act' | 'Provincial';
  url: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceReference[];
  followUps?: string[];
  timestamp: string;
  feedback?: 'positive' | 'negative' | null;
}

interface ChatInterfaceProps {
  language?: Language;
  initialQuery?: string;
}

export default function ChatInterface({ language = 'en', initialQuery = '' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>(initialQuery);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const showToast = (text: string) => {
    setActiveToast(text);
    setTimeout(() => setActiveToast(null), 2200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'positive' | 'negative') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, feedback: msg.feedback === type ? null : type } : msg
      )
    );
    showToast(type === 'positive' ? 'Feedback recorded' : 'Feedback recorded');
  };

  const editorialPrompts = [
    {
      q: 'How is salary tax calculated for this tax year?',
      category: 'Salaried',
      icon: DollarSign,
    },
    {
      q: 'What should I do after receiving an FBR notice?',
      category: 'Notices',
      icon: AlertTriangle,
    },
    {
      q: 'What tax applies to my freelance income under Section 154A?',
      category: 'Freelancer',
      icon: Sparkles,
    },
    {
      q: 'How can I check my Active Taxpayer List (ATL) status?',
      category: 'ATL Status',
      icon: ShieldCheck,
    },
    {
      q: 'How does withholding tax work when selling property (Sec 236C)?',
      category: 'Property',
      icon: Building,
    },
    {
      q: 'What documents do I need to prepare my annual tax return?',
      category: 'Checklist',
      icon: FileText,
    },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const existing = localStorage.getItem('daleel_recent_chats');
      const list = existing ? JSON.parse(existing) : [];
      const updated = [{ id: userMessage.id, title: query.slice(0, 42), timestamp: 'Just now' }, ...list.slice(0, 8)];
      localStorage.setItem('daleel_recent_chats', JSON.stringify(updated));
    } catch (e) {}

    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = '';
      let sources: SourceReference[] = [
        {
          title: 'Income Tax Ordinance, 2001',
          section: 'First Schedule, Part I',
          authority: 'FBR',
          url: 'https://fbr.gov.pk',
        },
        {
          title: 'Finance Act 2024-2025',
          section: 'Federal Gazette of Pakistan',
          authority: 'Finance Act',
          url: 'https://finance.gov.pk',
        },
      ];
      let followUps: string[] = [
        'How do I file Form 114 on the IRIS portal?',
        'What are the statutory late filing penalties?',
      ];

      if (lower.includes('freelance') || lower.includes('154a') || lower.includes('export')) {
        responseText = language === 'en'
          ? `### Taxation on IT & IT-Enabled Services (Section 154A)\n\nUnder **Section 154A of the Income Tax Ordinance 2001**, export proceeds of computer software and IT services realized via banking channels are subject to **Final Withholding Tax**:\n\n* **0.25% Final Tax**: Applicable if registered with the **Pakistan Software Export Board (PSEB)** and proceeds are remitted through banking channels with a Proceeds Realization Certificate (PRC).\n* **1.0% Final Tax**: Applicable if foreign remittances are received without valid PSEB registration.\n* **Provincial Sales Tax**: IT exports are zero-rated (0% sales tax) across provincial revenue authorities (PRA, SRB, KPRA, BRA).\n\n> Domestic revenue earned from Pakistani local clients is not covered under Section 154A and must be declared under normal business slabs.`
          : `### IT Freelancers Ka Tax Qanoon (Section 154A)\n\n**Income Tax Ordinance 2001 ke Section 154A** ke mutabiq export proceeds par Final Tax lagta hai:\n\n* **0.25% Final Tax**: Agar aap **PSEB (Pakistan Software Export Board)** se registered hain aur PRC certificate bank se hasil karte hain.\n* **1.0% Final Tax**: Agar aap PSEB registered nahi hain.\n* **Provincial Sales Tax**: IT services export par tamam soobon mein **0% sales tax** hai.\n\n> Local Pakistani clients se ki gayi aamdani par regular business slabs lagte hain.`;

        sources.push({
          title: 'FBR Circular No. 04 of 2024',
          section: 'Clarification on IT Export Regime',
          authority: 'FBR',
          url: 'https://fbr.gov.pk',
        });
        followUps = [
          'What are the documentation steps for PSEB registration?',
          'What is a Proceeds Realization Certificate (PRC)?',
        ];
      } else if (lower.includes('salary') || lower.includes('slab') || lower.includes('calculated')) {
        responseText = language === 'en'
          ? `### Salaried Tax Slabs (Finance Act 2024-2025)\n\nFor resident salaried individuals (salary comprising >75% of taxable income), progressive slabs apply:\n\n1. **Up to PKR 600,000 / year (PKR 50,000/month)**: **0% (Tax Exempt)**.\n2. **PKR 600,001 to 1,200,000**: **5%** of the amount exceeding PKR 600,000.\n3. **PKR 1,200,001 to 2,200,000**: **PKR 30,000 + 15%** of amount exceeding PKR 1,200,000.\n4. **PKR 2,200,001 to 3,200,000**: **PKR 180,000 + 25%** of amount exceeding PKR 2,200,000.\n5. **PKR 3,200,001 to 4,100,000**: **PKR 430,000 + 30%** of amount exceeding PKR 3,200,000.\n6. **Above PKR 4,100,000**: **PKR 700,000 + 35%** of amount exceeding PKR 4,100,000.\n\n* **High-Income Surcharge**: A 10% surcharge applies on income tax if taxable income exceeds PKR 10 million.`
          : `### Salaried Tax Slabs (Finance Act 2024-2025)\n\nSalaried afrad ke liye saalana tax slabs darj zail hain:\n\n1. **600,000 PKR tak (50,000 mahana)**: **0% (Tax Exempt)**.\n2. **600,001 se 1,200,000**: 600,000 se ooper wali raqam par **5%**.\n3. **1,200,001 se 2,200,000**: **30,000 PKR + 15%**.\n4. **2,200,001 se 3,200,000**: **180,000 PKR + 25%**.\n5. **3,200,001 se 4,100,000**: **430,000 PKR + 30%**.\n6. **4,100,000 se ooper**: **700,000 PKR + 35%**.\n\n* Saalana 10 Million PKR se zayid income par 10% surcharge lagta hai.`;
        followUps = [
          'Calculate my take-home salary on PKR 250,000/month',
          'What tax credits can I claim to reduce salary tax?',
        ];
      } else if (lower.includes('notice') || lower.includes('114') || lower.includes('122')) {
        responseText = language === 'en'
          ? `### Protocol for Responding to an FBR Notice\n\nReceiving a statutory notice from FBR requires disciplined compliance to prevent ex-parte assessment orders:\n\n1. **Identify the Statutory Section**:\n   * **Section 114(4)**: Non-filing of annual tax return notice.\n   * **Section 122(9) / 122(5A)**: Show Cause Notice proposing amendment of assessment or additions.\n   * **Section 176**: Summons for accounts, invoices, or bank ledgers.\n2. **Verify the Due Date**:\n   * Notices typically mandate compliance within **10 to 15 calendar days**. Never allow this deadline to elapse without response.\n3. **Submit via IRIS**:\n   * Written legal explanation and documentary evidence must be uploaded through the FBR IRIS portal.`
          : `### FBR Notice Par Legal Iqdaamat\n\nFBR notice milne par darj zail marahil mukammal karein:\n\n1. **Notice Ka Section Dekhein**:\n   * **Section 114(4)**: Return file na karne ka notice.\n   * **Section 122(9)**: Assessment amendment ya extra tax ka show cause notice.\n   * **Section 176**: Bank statements aur hisab kitab talab karne ka summons.\n2. **Deedline Check Karein**:\n   * Aam taur par **10 se 15 din** ki mohlat hoti hai.\n3. **IRIS Portal Par Reply Karein**:\n   * iris.fbr.gov.pk par ja kar written reply aur documents jama karwayen.`;
        sources.push({
          title: 'Income Tax Rules 2002',
          section: 'Notices and Adjournments',
          authority: 'FBR',
          url: 'https://iris.fbr.gov.pk',
        });
        followUps = [
          'What is the statutory penalty for non-compliance under Section 182?',
          'How do I file an online adjournment request for extra time?',
        ];
      } else if (lower.includes('property') || lower.includes('236k') || lower.includes('236c')) {
        responseText = language === 'en'
          ? `### Advance Tax on Immovable Property (Sections 236K & 236C)\n\nUnder current Finance Act provisions, advance tax rates depend directly on your **Active Taxpayer List (ATL)** status:\n\n* **Purchasing Property (Section 236K)**:\n  * **Active Filer**: **3%** of FBR valuation table rate.\n  * **Non-Filer**: **10.5% to 15%** (Penal advance withholding).\n* **Selling Property (Section 236C)**:\n  * **Active Filer**: **3%**.\n  * **Non-Filer**: **10%**.\n* Both advance taxes are adjustable against final income tax liability when filing Form 114.`
          : `### Property Khareed Aur Farokht Par Advance Tax (236K aur 236C)\n\nProperty par filer aur non-filer rates darj zail hain:\n\n* **Property Khareedna (Section 236K)**:\n  * **Filer**: **3%** advance tax.\n  * **Non-Filer**: **10.5% se 15%** (Penal rate).\n* **Property Bechna (Section 236C)**:\n  * **Filer**: **3%**.\n  * **Non-Filer**: **10%**.\n* Yeh advance tax saalana return mein adjust ho sakta hai.`;
        followUps = [
          'What are the Capital Gains Tax (CGT) holding period rules?',
          'How is FBR DC valuation rate determined?',
        ];
      } else {
        responseText = language === 'en'
          ? `### Legal Guidance: "${query}"\n\nUnder the **Income Tax Ordinance 2001** and **SECP Companies Act 2017**:\n\n* **Active Taxpayer List (ATL)**: Status is updated within 24 to 48 hours of filing the annual tax return (Form 114). Status can be verified via SMS by sending \`ATL <CNIC>\` to **9966**.\n* **Exempt Income**: Resident individuals earning under PKR 600,000/year remain tax-exempt from salary deductions.\n* **Record Retention**: Statutory law requires keeping bank records and CPR payments for a minimum of **6 tax years**.`
          : `### Qanooni Rehnumai: "${query}"\n\n**Income Tax Ordinance 2001** ke tehat:\n\n* **Active Taxpayer List (ATL)**: Return file karne ke 24-48 ghanton mein naam ATL mein active hota hai. SMS se check karne ke liye 9966 par CNIC bhein.\n* **Tax-Exempt Limit**: Saalana 600,000 PKR tak salary par koi tax nahi hai.\n* **Records**: Qanoon ke mutabiq hisab kitab **6 saal** tak sambhalna zaroori hai.`;
      }

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: responseText,
        sources,
        followUps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsStreaming(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full max-w-3xl mx-auto px-4 sm:px-6">
      {/* Toast Feedback */}
      {activeToast && (
        <div className="fixed top-18 right-6 z-50 px-3 py-1.5 rounded-md bg-[var(--text-primary)] text-[var(--bg-card)] text-xs font-medium shadow-md border border-[var(--border-hairline)] flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
          <span>{activeToast}</span>
        </div>
      )}

      {/* ================= WELCOME SCREEN ================= */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-16 text-center space-y-7 max-w-xl mx-auto">
          <EvidenceSealIllustration />

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Tax questions, answered with evidence.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
              DaleelAI assists taxpayers, freelancers, and businesses in understanding Pakistani tax statutes, FBR notices, and SECP filings with statutory citations.
            </p>
          </div>

          {/* Clean Bento Grid of Editorial Prompts */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1">
            {editorialPrompts.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.q)}
                  className="group p-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-active)] transition-all text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col justify-between gap-1.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#087F5B] dark:text-[#10B981] flex items-center gap-1 font-semibold">
                      <Icon className="w-3 h-3" strokeWidth={1.75} />
                      {prompt.category}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-primary)] leading-snug">
                    {prompt.q}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= CONVERSATION THREAD ================= */
        <div className="flex-1 overflow-y-auto py-6 space-y-5">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                  <span>{isUser ? 'Taxpayer' : 'Daleel Evidence'}</span>
                  <span>·</span>
                  <span>{message.timestamp}</span>
                </div>

                <div
                  className={`w-full max-w-2xl rounded-xl p-4 md:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-[var(--text-primary)] font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                      : 'surface-card text-[var(--text-primary)] space-y-3.5'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2.5">
                    {message.content.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-hairline)] pb-1.5 tracking-tight">
                            {para.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (para.startsWith('> ')) {
                        return (
                          <div key={pIdx} className="p-2.5 rounded-lg bg-[var(--warning-surface)] border border-[var(--warning-border)] text-[var(--warning-text)] text-xs font-medium flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={1.75} />
                            <span>{para.replace('> ', '')}</span>
                          </div>
                        );
                      }
                      return <p key={pIdx} className="leading-relaxed">{para}</p>;
                    })}
                  </div>

                  {/* Sourced Citations */}
                  {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border-hairline)] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] font-semibold">
                        <span className="flex items-center gap-1 text-[#087F5B] dark:text-[#10B981]">
                          <ShieldCheck className="w-3 h-3" strokeWidth={1.75} />
                          <span>Statutory Authorities Cited</span>
                        </span>
                        <span>{message.sources.length} Sources</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {message.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-active)] transition-colors flex items-start justify-between gap-1.5 group"
                          >
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[#087F5B] dark:text-[#10B981] block font-semibold">
                                {src.authority} · {src.section}
                              </span>
                              <span className="text-xs text-[var(--text-primary)] truncate block group-hover:underline">
                                {src.title}
                              </span>
                            </div>
                            <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] shrink-0 mt-0.5" strokeWidth={1.5} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Toolbar */}
                  {!isUser && (
                    <div className="pt-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors cursor-pointer text-xs"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-[#087F5B]" strokeWidth={2} />
                        ) : (
                          <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                        )}
                        <span className="text-[11px] font-medium">{copiedId === message.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleFeedback(message.id, 'positive')}
                          className={`p-1 rounded hover:bg-[var(--bg-subtle)] transition-colors ${
                            message.feedback === 'positive' ? 'text-[#087F5B]' : 'text-[var(--text-tertiary)]'
                          }`}
                          aria-label="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'negative')}
                          className={`p-1 rounded hover:bg-[var(--bg-subtle)] transition-colors ${
                            message.feedback === 'negative' ? 'text-rose-600' : 'text-[var(--text-tertiary)]'
                          }`}
                          aria-label="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow-up Prompts */}
                {!isUser && message.followUps && message.followUps.length > 0 && (
                  <div className="w-full max-w-2xl flex flex-wrap items-center gap-1.5 pt-1">
                    {message.followUps.map((fUp, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSendMessage(fUp)}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        {fUp}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isStreaming && (
            <div className="flex items-center gap-2 pl-1 py-2 text-xs text-[#087F5B] dark:text-[#10B981] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#087F5B] dark:bg-[#10B981] animate-pulse" />
              <span>Grounding answer in FBR ordinances and circulars...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ================= COMPOSER ================= */}
      <div className="sticky bottom-3 z-20 pt-2 pb-1 bg-[var(--bg-app)]">
        <div className="relative rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-card)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] focus-within:border-[#087F5B] focus-within:ring-1 focus-within:ring-[#087F5B] transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'en'
                ? 'Ask about salary slabs, FBR notice sections, freelancer 0.25%, or SECP filings...'
                : 'FBR tax slabs, notice ka hal, freelancer tax, ya company registration ke baaray mein poochein...'
            }
            className="w-full pl-3.5 pr-12 py-3 bg-transparent border-none text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none resize-none min-h-[44px] max-h-[160px]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 bottom-2 w-7 h-7 rounded-lg bg-[#087F5B] dark:bg-[#10B981] hover:opacity-90 disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Send (Enter)"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-[var(--text-tertiary)] font-mono">
          <span>Sourced from Income Tax Ordinance 2001 · Not formal legal counsel</span>
          <span className="hidden sm:inline">↵ to send · ⇧↵ for newline</span>
        </div>
      </div>
    </div>
  );
}
