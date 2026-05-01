/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Terminal, Search, CreditCard, Code, CheckCircle2, ChevronRight, Globe, Layers, BookOpen } from 'lucide-react';

export default function App() {
  const endpoint = "/research";
  const price = "$1.00 USDC";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full max-w-5xl px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Active x402 Merchant
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Deep Research <span className="text-blue-600">Report API</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A high-performance research engine for autonomous agents. Structured reports synthesized from the best free sources, paid instantly via USDC on Base.
          </p>
        </motion.div>
      </header>

      {/* Stats/Info Grid */}
      <section className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: <CreditCard className="w-5 h-5" />, label: "Price per Research", value: price },
          { icon: <Globe className="w-5 h-5" />, label: "Network", value: "Base Mainnet" },
          { icon: <Layers className="w-5 h-5" />, label: "Settlement", value: "USDC (x402)" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="text-blue-600 mb-3">{stat.icon}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            <div className="text-lg font-bold text-slate-900">{stat.value}</div>
          </motion.div>
        ))}
      </section>

      {/* Documentation Main */}
      <main className="w-full max-w-5xl px-6 space-y-12 pb-24">
        
        {/* Endpoint Detail */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-900 rounded-lg text-white">
                <Terminal className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">API Endpoint</h2>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 overflow-x-auto">
              <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">POST</span>
              <code className="text-slate-800 font-mono text-sm break-all">
                {window.location.origin}{endpoint}
              </code>
            </div>

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-slate-400" />
              Request Body
            </h3>
            <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-sm mb-8 overflow-x-auto">
{`{
  "topic": "Future of solid-state batteries in 2026"
}`}
            </pre>

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-400" />
              Response Format
            </h3>
            <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-sm overflow-x-auto">
{`{
  "topic": "...",
  "summary": "Full summary text...",
  "key_findings": ["...", "...", "..."],
  "sources": [{ "title": "...", "url": "..." }],
  "report": "## Markdown Report Content...",
  "generated_at": "ISO8601"
}`}
            </pre>
          </div>
        </section>

        {/* Integration Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Search className="w-7 h-7 text-blue-600" />
              How it Works
            </h2>
            <ul className="space-y-4">
              {[
                "Instant search across DuckDuckGo, Wikipedia, and HackerNews.",
                "Deep scraping of relevant sources to capture high-context data.",
                "Multi-stage synthesis using Llama 3.3 70B (Groq).",
                "Built-in x402 payment verification for seamless agent usage."
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-slate-300 flex flex-col justify-center border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">ClawCredit Integration</h3>
            <p className="text-sm text-slate-400 mb-6">
              Autonomous agents can call this API directly using the ClawCredit protocol. No wallet management required on your side.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-800 p-2 rounded">
                <ChevronRight className="w-4 h-4 text-blue-400" />
                <span>credit.pay({`{ amount: 1.00, recipient: '...' }`})</span>
              </div>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                View Protocol Docs
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-slate-200 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Deep Research Report API. Built for the Autonomous Economy.
        </p>
      </footer>
    </div>
  );
}
