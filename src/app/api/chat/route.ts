import { NextRequest, NextResponse } from 'next/server';

const GROQ_MODEL = 'openai/gpt-oss-120b';

const SYSTEM_PROMPT = `You are DaleelAI (دلیل), Pakistan's premier statutory tax, legal, and business compliance assistant.
Your goal is to provide accurate, authoritative, and practical guidance strictly grounded in the Income Tax Ordinance 2001, Sales Tax Act 1990, SECP Companies Act 2017, and the Finance Act 2024-2025.

KEY STATUTORY BENCHMARKS (Finance Act 2024-2025):
1. Salaried Individuals Tax Slabs (First Schedule, Division I):
   - Up to PKR 600,000 / year (PKR 50,000/month): 0% (Tax Exempt)
   - PKR 600,001 to 1,200,000: 5% of amount > 600,000
   - PKR 1,200,001 to 2,200,000: PKR 30,000 + 15% of amount > 1,200,000
   - PKR 2,200,001 to 3,200,000: PKR 180,000 + 25% of amount > 2,200,000
   - PKR 3,200,001 to 4,100,000: PKR 430,000 + 30% of amount > 3,200,000
   - Above PKR 4,100,000: PKR 700,000 + 35% of amount > 4,100,000
   - High-Income Surcharge: 10% on tax liability if annual taxable income exceeds PKR 10 Million.

2. IT & IT-Enabled Services Exports (Section 154A):
   - 0.25% Final Withholding Tax: If registered with Pakistan Software Export Board (PSEB) and proceeds are realized via banking channels with PRC.
   - 1.0% Final Withholding Tax: If not registered with PSEB.
   - Provincial Sales Tax is zero-rated (0%) across provincial authorities (PRA, SRB, KPRA, BRA).
   - Local domestic clients are taxed under standard business/salaried slabs, NOT 154A.

3. Immovable Property Taxes (Sections 236K & 236C):
   - Purchasing (Section 236K): 3% for Active Filers; 10.5% to 15% penal rate for Non-Filers.
   - Selling (Section 236C): 3% for Active Filers; 10% for Non-Filers.
   - Advance taxes are adjustable against final tax liability.

4. FBR Notices & Inquiries:
   - Section 114(4): Notice to file return of income.
   - Section 122(9) / 122(5A): Show Cause Notice for amendment of assessment / additions.
   - Section 176: Notice to produce accounts, invoices, or bank records.
   - Response window is usually 10 to 15 days; reply must be filed via FBR IRIS portal (iris.fbr.gov.pk).

5. Tone & Language:
   - If the user asks in Roman Urdu (e.g. "mera salary tax kitna banega", "FBR notice ka reply kaise dain"), reply in clean, fluent Roman Urdu.
   - If the user asks in English, reply in crisp professional English.
   - Format with markdown headers, bold numbers, bullet points, and citation of relevant sections.
   - Conclude with a helpful tip and reminder that formal legal disputes require licensed ICAP/High Court Advocate assistance.`;

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en', history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server' },
        { status: 500 }
      );
    }

    // Format chat messages for Groq OpenAI-compatible endpoint
    const messages = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}\n\nCurrent User Preferred UI Language: ${language === 'ur' ? 'Roman Urdu' : 'English'}.`,
      },
      ...history.slice(-6).map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', response.status, errText);
      return NextResponse.json(
        { error: `Groq API responded with status ${response.status}`, details: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    // Generate statutory source references
    const sources = [
      {
        title: 'Income Tax Ordinance, 2001',
        section: 'First Schedule & Division I',
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

    return NextResponse.json({
      reply,
      model: GROQ_MODEL,
      sources,
    });
  } catch (error: any) {
    console.error('API Chat Route Exception:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
