"use client";
// app/dashboard/layout.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitCommitHorizontal, 
  AlertTriangle, 
  Zap, 
  Settings,
  Activity,
  Terminal,
  ExternalLink,
  Search,
  ChevronRight
} from 'lucide-react';

/* =========================================================================
   ONDC Pulse — Design Tokens & Mandate
   - App Background: #08080a
   - Surface/Card Background: #0c0c0e
   - Borders: border-white/10
   - Fonts: font-sans (Inter), font-mono (JetBrains Mono) for data/IDs/logs
   - Accents: emerald-400 (healthy), rose-400 (error), cyan-400 (active)
   ========================================================================= */

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = '/dashboard' }: SidebarProps) {
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders Trace', href: '/dashboard/orders', icon: GitCommitHorizontal, badge: 'LIVE' },
    { name: 'Incidents', href: '/dashboard/incidents', icon: AlertTriangle, alertCount: 3 },
    { name: 'Simulator', href: '/dashboard/simulate', icon: Zap },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 h-screen bg-[#08080a] border-r border-white/10 flex flex-col justify-between select-none">
      {/* Top Section */}
      <div>
        {/* Brand Logo & Protocol Identifier */}
        <div className="h-14 flex items-center px-5 border-b border-white/10 gap-3 group cursor-pointer">
          <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-white font-mono">
              Pulse
            </span>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
              ONDC v1.2
            </span>
          </div>
        </div>

        {/* Global Search Trigger (Terminal style) */}
        <div className="px-3 pt-4 pb-2">
          <button 
            type="button"
            className="w-full h-8 px-2.5 rounded-md bg-[#0c0c0e] border border-white/10 flex items-center justify-between text-neutral-500 hover:border-white/20 hover:text-neutral-400 transition-colors text-xs font-sans"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <span>Filter order ID, BAP...</span>
            </span>
            <kbd className="font-mono text-[10px] bg-white/5 border border-white/10 px-1 py-0.5 rounded text-neutral-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2 py-2 space-y-0.5">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
            Core Engine
          </div>
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2 rounded-md text-xs font-sans transition-all ${
                  isActive
                    ? 'bg-white/5 text-white font-medium border border-white/10 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="font-mono text-[9px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}

                {item.alertCount && (
                  <span className="font-mono text-[10px] font-semibold text-rose-400 bg-rose-400/10 border border-rose-400/25 px-1.5 py-0.2 rounded-full">
                    {item.alertCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Technical Ingestion Telemetry Footer */}
      <div className="p-3 border-t border-white/10 bg-[#08080a]">
        <div className="p-2.5 rounded-md bg-[#0c0c0e] border border-white/10 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-neutral-400 font-sans flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              Ingest Daemon
            </span>
            <span className="font-mono text-[10px] text-emerald-400">v2.4.19-rc</span>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Kafka Lag:</span>
            <span className="text-neutral-300">12 msgs</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mt-0.5">
            <span>E2E Ingestion:</span>
            <span className="text-emerald-400">14ms p95</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="h-14 border-b border-white/10 bg-[#08080a] flex items-center justify-between px-6 flex-shrink-0 z-10">
      {/* Left: Gateway Node Status Badge */}
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0c0c0e] border border-white/10 text-xs font-mono text-neutral-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-neutral-400">Live Network:</span>
          <span className="text-white font-medium">GATEWAY_BLR_04</span>
        </div>

        {/* Telemetry pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>REGION: <span className="text-neutral-300">{process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}</span></span>
          <span className="text-white/20">/</span>
          <span>PROTOCOL: <span className="text-cyan-400">ONDC v1.2</span></span>
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3.5">
        <a 
          href="https://github.com/beckn/protocol-specifications" 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors font-sans px-2 py-1 rounded hover:bg-white/5"
        >
          <span>ONDC Spec Docs</span>
          <ExternalLink className="w-3 h-3 text-neutral-500" />
        </a>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* Minimalist Profile Circle */}
        <button 
          type="button" 
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full bg-[#0c0c0e] border border-white/10 hover:border-white/20 transition-colors"
          title="AWS Cognito: sre-ops@ondc-pulse.internal"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center font-mono text-[11px] font-semibold text-cyan-400">
            OP
          </div>
          <span className="text-xs font-mono text-neutral-300 hidden lg:inline">
            ops.cognito
          </span>
        </button>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#08080a] text-neutral-400 font-sans overflow-hidden antialiased">
      {/* Fixed Sidebar */}
      <Sidebar currentPath="/dashboard" />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        
        {/* Dynamic Page Children Container */}
        <main className="flex-1 bg-[#08080a] overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}