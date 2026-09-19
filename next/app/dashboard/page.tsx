'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';

/* =========================================================================
   ONDC Pulse — Linear Minimalist Data Structures
   ========================================================================= */

// Latency Curve Simulation (24h Aggregate Gateway Transit)
const latencyTimelineData = [
  { time: '00:00', latency: 120 },
  { time: '02:00', latency: 140 },
  { time: '04:00', latency: 160 },
  { time: '06:00', latency: 220 },
  { time: '08:00', latency: 310 },
  { time: '10:00', latency: 380 },
  { time: '12:00', latency: 320 },
  { time: '14:00', latency: 290 },
  { time: '16:00', latency: 460 },
  { time: '18:00', latency: 920 },
  { time: '20:00', latency: 1840 }, // Peak Dinner Rush
  { time: '22:00', latency: 540 },
  { time: 'NOW (22:48)', latency: 360 },
];

// Protocol Ingestion Action Matrix
const endpointPerformance = [
  { action: '/search', throughput: '1,420 rps', p95: '210ms', error: '0.04%', status: 'NOMINAL' },
  { action: '/on_search', throughput: '3,890 rps', p95: '412ms', error: '0.12%', status: 'NOMINAL' },
  { action: '/select', throughput: '640 rps', p95: '195ms', error: '0.08%', status: 'NOMINAL' },
  { action: '/init', throughput: '315 rps', p95: '890ms', error: '2.18%', status: 'DEGRADED' },
  { action: '/confirm', throughput: '285 rps', p95: '340ms', error: '0.45%', status: 'NOMINAL' },
  { action: '/on_status', throughput: '198 rps', p95: '1,820ms', error: '4.92%', status: 'BREACH', isBreach: true },
];

// Recent Terminal-Style Exceptions Feed
const recentExceptions = [
  {
    severity: 'SEV-1 CRITICAL',
    time: '14:22:01',
    description: 'Dropped /on_status callback for ORDER_992184',
    participant: 'Shadowfax BPP',
  },
  {
    severity: 'SEV-2 WARNING',
    time: '14:18:40',
    description: 'Confirmation delay > 180s on Food Delivery',
    participant: 'ONDC-BAP-01',
  },
  {
    severity: 'SEV-1 CRITICAL',
    time: '14:05:12',
    description: 'Ed25519 signature verification failure on /on_select',
    participant: 'Mystore BPP',
  },
  {
    severity: 'INFO',
    time: '13:52:33',
    description: 'Kafka partition rebalance lag spike (140ms)',
    participant: 'Gateway Worker 04',
  },
];

export default function OverviewPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RETAIL' | 'LOGISTICS'>('ALL');

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-300 font-sans p-6 sm:p-8 space-y-10 selection:bg-white selection:text-black">
      
      {/* 00 / HEADER & SCOPE CONTROLS */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase mb-1">
            00 / OBSERVABILITY ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Core Ingestion Overview
          </h1>
        </div>

        {/* Minimal segmented filter pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="inline-flex border border-white/15 bg-neutral-950 p-0.5">
            {(['ALL', 'RETAIL', 'LOGISTICS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 transition-colors ${
                  activeFilter === tab 
                    ? 'bg-white text-black font-medium' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="px-3 py-1 border border-white/15 text-neutral-400 bg-neutral-950">
            24H
          </div>
        </div>
      </section>

      {/* 01 / METRICS (FIG 1.1 - 1.4) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
          <span>01 / METRICS</span>
          <span>WINDOW 24H · REFRESH 5S</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-neutral-950/60">
          
          {/* FIG 1.1: Monitored Orders */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span className="uppercase">Monitored Orders</span>
              <span>FIG 1.1</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-mono">
              184,920
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/5 pt-3">
              <span>+14.2% DoD</span>
              <span className="text-neutral-500">160k target</span>
            </div>
          </div>

          {/* FIG 1.2: SLA Breach Rate */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span className="uppercase">Global SLA Breach</span>
              <span>FIG 1.2</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-mono">
              1.48%
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/5 pt-3">
              <span>Target &lt; 1.00%</span>
              <span className="text-neutral-500">2,736 drops</span>
            </div>
          </div>

          {/* FIG 1.3: P95 Gateway Latency */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span className="uppercase">P95 Gateway Latency</span>
              <span>FIG 1.3</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-mono">
              312<span className="text-xl text-neutral-400 font-normal">ms</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/5 pt-3">
              <span>-28ms vs avg</span>
              <span className="text-neutral-500">/search → /confirm</span>
            </div>
          </div>

          {/* FIG 1.4: Active Exceptions */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span className="uppercase">Active Exceptions</span>
              <span>FIG 1.4</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-mono flex items-baseline gap-2">
              <span>3</span>
              <span className="text-xs text-neutral-400 font-normal">Sev-1 (1)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/5 pt-3">
              <span>MTTR 4.2m</span>
              <span className="text-neutral-500">Auto-triage</span>
            </div>
          </div>

        </div>
      </section>

      {/* 02 / LATENCY TIMELINE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
          <span>02 / LATENCY TIMELINE</span>
          <span>P50: 180MS &nbsp; P95: 312MS &nbsp; P99: 840MS</span>
        </div>

        <div className="border border-white/10 bg-neutral-950/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
            <div>
              <span className="text-white font-medium">Network Latency Distribution</span>
              <p className="text-neutral-500 mt-0.5 font-sans">
                Aggregated gateway transit time over core Beckn protocol action webhooks
              </p>
            </div>
            <span className="text-neutral-500">SCALE: 0 - 2,400MS</span>
          </div>

          {/* Monochrome Chart Canvas */}
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="monochromeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <XAxis 
                  dataKey="time" 
                  stroke="#333338" 
                  tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#27272a' }}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis 
                  stroke="#333338" 
                  tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#27272a' }}
                  axisLine={{ stroke: '#27272a' }}
                  domain={[0, 2400]}
                  ticks={[0, 600, 1200, 2400]}
                  tickFormatter={(v) => `${v}ms`}
                />

                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0c', 
                    borderColor: 'rgba(255,255,255,0.15)', 
                    borderRadius: '0px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                />

                {/* Strict SLA Limit Line */}
                <ReferenceLine 
                  y={2000} 
                  stroke="#52525b" 
                  strokeDasharray="2 2" 
                  label={{ 
                    value: 'SLA LIMIT (2,000ms)', 
                    fill: '#71717a', 
                    fontSize: 10, 
                    position: 'top', 
                    fontFamily: 'monospace' 
                  }} 
                />

                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#ffffff" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#monochromeGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 03 / PROTOCOL STREAM & EXCEPTIONS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
          <span>03 / PROTOCOL STREAM &amp; EXCEPTIONS</span>
          <span>HTTP/JSON SCHEMA V1.2</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Endpoint Ingestion Matrix */}
          <div className="lg:col-span-8 border border-white/10 bg-neutral-950/60 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/5">
              <span className="text-white font-medium">Endpoint Ingestion Performance</span>
              <span className="text-neutral-500">THRESHOLD: ≤ 500MS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-neutral-500 border-b border-white/10">
                    <th className="py-2 font-normal uppercase">Action</th>
                    <th className="py-2 font-normal uppercase">Throughput</th>
                    <th className="py-2 font-normal uppercase">P95 Latency</th>
                    <th className="py-2 font-normal uppercase">Error</th>
                    <th className="py-2 font-normal uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {endpointPerformance.map((row) => (
                    <tr key={row.action} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-neutral-200 flex items-center gap-2">
                        {row.isBreach && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        <span>{row.action}</span>
                      </td>
                      <td className="py-3 text-neutral-400">{row.throughput}</td>
                      <td className={`py-3 ${row.isBreach ? 'text-white font-semibold' : 'text-neutral-300'}`}>
                        {row.p95}
                      </td>
                      <td className="py-3 text-neutral-400">{row.error}</td>
                      <td className="py-3 text-right">
                        <span className={`text-[10px] tracking-wider uppercase font-mono ${
                          row.status === 'BREACH' 
                            ? 'text-white underline underline-offset-4' 
                            : row.status === 'DEGRADED' 
                            ? 'text-neutral-300' 
                            : 'text-neutral-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Clean Terminal Exceptions List */}
          <div className="lg:col-span-4 border border-white/10 bg-neutral-950/60 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/5">
                <span className="text-white font-medium">Recent Exceptions</span>
                <span className="text-neutral-500">18 TOTAL</span>
              </div>

              <div className="space-y-3 font-mono">
                {recentExceptions.map((exc, idx) => (
                  <div key={idx} className="p-3 border border-white/5 bg-black space-y-1.5 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white font-semibold">[{exc.severity}]</span>
                      <span className="text-neutral-500">{exc.time}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-snug">
                      {exc.description}
                    </p>
                    <div className="text-[10px] text-neutral-500 pt-1 flex items-center justify-between">
                      <span>Participant</span>
                      <span className="text-neutral-400">{exc.participant}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="button" 
              className="w-full py-2 border border-white/15 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Full Incident Queue</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </section>

      {/* 04 / AUTOMATED DIAGNOSTIC BANNER */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
          <span>04 / AUTOMATED DIAGNOSTIC</span>
          <span>CONFIDENCE 98%</span>
        </div>

        <div className="border border-white/15 bg-neutral-950 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-white">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="font-semibold">Diagnostic: Gateway Sync Desynchronization</span>
            </div>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              BPP callback timeouts in Shadowfax cluster correlate with sudden ACK latency &gt; 2500ms on AWS ap-south-1 availability zone 1b.
            </p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs shrink-0">
            <button 
              type="button"
              className="px-3 py-1.5 border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 transition-colors"
            >
              Trace Graph
            </button>
            <button 
              type="button"
              className="px-3.5 py-1.5 bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
            >
              Trigger Reroute
            </button>
          </div>
        </div>
      </section>

    </div>
  );
  }