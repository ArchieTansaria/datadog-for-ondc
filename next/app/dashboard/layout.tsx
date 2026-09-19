
import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#08080a] text-zinc-300 antialiased selection:bg-white selection:text-black min-h-screen">
      <header className="fixed top-0 left-0 right-0 h-12 bg-[#08080a]/90 backdrop-blur-md z-50 flex items-center justify-between px-5 border-b border-white/[0.07]">
<div className="flex items-center gap-5">
<a className="flex items-center gap-2 text-white group cursor-pointer" href="/dashboard">
<svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
</svg>
<span className="text-sm font-semibold tracking-tight text-white font-mono">Pulse</span>
</a>
<span className="text-white/[0.15]">/</span>
<div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
<span>ONDC Core v1.2</span>
<span className="text-zinc-600">·</span>
<span className="text-zinc-500">{process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}</span>
</div>
</div>
{/*  Center Search Palette Trigger  */}
<div className="hidden md:flex items-center w-80 max-w-sm">
<div className="relative flex items-center w-full">
<span className="material-symbols-outlined absolute left-2.5 text-zinc-600 text-[14px]">search</span>
<input className="w-full bg-[#111114] border border-white/[0.06] rounded px-2.5 pl-7 py-1 text-[12px] font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors" placeholder="Filter orders, transactions, traces..." type="text" />
<div className="absolute right-2 px-1 py-0.5 rounded border border-white/[0.08] bg-[#08080a] text-[9px] font-mono text-zinc-500 tracking-wider">
          ⌘K
        </div>
</div>
</div>
{/*  Right Controls  */}
<div className="flex items-center gap-4 text-[12px] font-mono">
<div className="hidden sm:flex items-center gap-2 text-zinc-500">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70"></span>
<span className="text-[11px] uppercase tracking-wider text-zinc-400">Ingesting Live</span>
</div>
<span className="text-white/[0.1] hidden sm:inline">|</span>
<div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
<span>LAG</span>
<span className="text-zinc-300">12ms</span>
</div>
<div className="w-6 h-6 rounded-full border border-white/[0.12] bg-[#141417] flex items-center justify-center text-[11px] text-zinc-300 font-mono">
        K
      </div>
</div>
</header>
      <aside className="fixed left-0 top-12 bottom-0 w-56 bg-[#08080a] border-r border-white/[0.07] z-40 flex flex-col justify-between p-3.5">
<div className="flex flex-col gap-6">
<div>
<div className="px-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600">Core Telemetry</div>
<nav className="flex flex-col space-y-0.5 text-[13px]">
<a className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/[0.05] text-white font-medium" href="/dashboard">
<span className="flex items-center gap-2">
<span className="w-1 h-1 rounded-full bg-white"></span>
              Overview
            </span>
<span className="text-[10px] font-mono text-zinc-500">LIVE</span>
</a>
<a className="flex items-center justify-between px-2.5 py-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors" href="/dashboard">
<span className="flex items-center gap-2">
<span className="w-1 h-1 rounded-full bg-transparent"></span>
              Orders Trace
            </span>
<span className="text-[10px] font-mono text-zinc-600">BAP/BPP</span>
</a>
<a className="flex items-center justify-between px-2.5 py-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors" href="/dashboard">
<span className="flex items-center gap-2">
<span className="w-1 h-1 rounded-full bg-transparent"></span>
              Exceptions &amp; AI
            </span>
<span className="w-1 h-1 rounded-full bg-zinc-400"></span>
</a>
<a className="flex items-center justify-between px-2.5 py-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors" href="/dashboard">
<span className="flex items-center gap-2">
<span className="w-1 h-1 rounded-full bg-transparent"></span>
              Simulation
            </span>
<span className="text-[10px] font-mono text-zinc-600">SBX</span>
</a>
</nav>
</div>
<div>
<div className="px-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600">Specifications</div>
<nav className="flex flex-col space-y-0.5 text-[13px]">
<a className="flex items-center px-2.5 py-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors" href="/dashboard">
            Protocol Docs
          </a>
<a className="flex items-center px-2.5 py-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors" href="/dashboard">
            Gateway Telemetry
          </a>
<a className="flex items-center px-2.5 py-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors" href="/dashboard">
            Audit Logs
          </a>
</nav>
</div>
</div>
<div className="px-2 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-zinc-500 space-y-1">
<div className="flex justify-between items-center">
<span>GATEWAY</span>
<span className="text-zinc-400">v2.4.19</span>
</div>
<div className="flex justify-between items-center text-zinc-600">
<span>UPTIME</span>
<span>99.98%</span>
</div>
</div>
</aside>
      
      <div className="pl-56 pt-12 min-h-screen bg-[#08080a]">
        <main className="max-w-[1340px] mx-auto p-6 md:p-8 space-y-9">
          {children}
        </main>
      </div>
    </div>
  );
}
