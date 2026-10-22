import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070c09",
};

export const metadata: Metadata = {
  title: "DaleelAI (دلیل) — Pakistan Tax & Business Compliance AI Assistant",
  description: "AI-powered compliance companion for Pakistan. Understand FBR tax notices, calculate salary and freelancer taxes (Finance Act 2024-2025), compare filer vs non-filer penalties, and follow step-by-step registration checklists.",
  keywords: ["Pakistan Tax Calculator", "FBR Notice Explainer", "FBR Tax Filer", "Freelancer Tax Pakistan 154A", "SECP Company Registration", "DaleelAI", "Active Taxpayer List ATL"],
  authors: [{ name: "DaleelAI Pakistan" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('daleel-theme');
                if (stored) {
                  document.documentElement.setAttribute('data-theme', stored);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
