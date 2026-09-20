"use client";

import useSWR from 'swr';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OverviewPage() {
  const { data: metrics, error: metricsError } = useSWR('/api/dashboard/metrics', fetcher, { refreshInterval: 5000 });
  const { data: timeline, error: timelineError } = useSWR('/api/dashboard/timeline', fetcher, { refreshInterval: 5000 });

  return (
    <>
      {/*  View Title & Monospace Context Strip  */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/[0.07] pb-4 gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
            00 / OBSERVABILITY ENGINE
          </div>
          <h1 className="text-xl md:text-2xl font-mono text-white tracking-tight">
            Core Ingestion Overview
          </h1>
        </div>
        {/*  Filter Controls: Stark Monochrome Tabs  */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-white/[0.08] rounded p-0.5 bg-[#0e0e11] text-[11px] font-mono">
            <button className="px-2.5 py-1 rounded bg-white text-black font-medium">ALL</button>
            <button className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 transition-colors">RETAIL</button>
            <button className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 transition-colors">LOGISTICS</button>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 border border-white/[0.08] rounded bg-[#0e0e11] text-[11px] font-mono text-zinc-400">
            <span>24H</span>
          </div>
        </div>
      </div>
      
      {/*  SECTION 01 / METRICS  */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">01 / METRICS</span>
          <span className="text-[10px] font-mono text-zinc-600">WINDOW 24H · REFRESH 5S</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded border border-white/[0.07] overflow-hidden">
          
          {/*  Card 1: Monitored Orders  */}
          <div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>Monitored Orders</span>
              <span className="text-zinc-600">FIG 1.1</span>
            </div>
            <div className="my-2">
              <span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">
                {metrics && metrics.ordersCount !== undefined ? metrics.ordersCount.toLocaleString() : '...'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
              <span>Live System</span>
              <span className="text-zinc-600">last 24h</span>
            </div>
          </div>
          
          {/*  Card 2: SLA Breaches  */}
          <div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>SLA Breaches</span>
              <span className="text-zinc-600">FIG 1.2</span>
            </div>
            <div className="my-2">
              <span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">
                {metrics && metrics.slaBreachesCount !== undefined ? metrics.slaBreachesCount.toLocaleString() : '...'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
              <span>Target 0</span>
              <span className="text-zinc-600">auto-detected</span>
            </div>
          </div>
          
          {/*  Card 3: Active Exceptions  */}
          <div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>Active Exceptions</span>
              <span className="text-zinc-600">FIG 1.3</span>
            </div>
            <div className="my-2">
              <span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">
                {metrics && metrics.activeExceptionsCount !== undefined ? metrics.activeExceptionsCount.toLocaleString() : '...'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
              <span>SEV-1 / SEV-2</span>
              <span className="text-zinc-600">requires triage</span>
            </div>
          </div>

          {/*  Card 4  */}
          <div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>System Health</span>
              <span className="text-zinc-600">FIG 1.4</span>
            </div>
            <div className="my-2">
              <span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">
                {metrics && metrics.activeExceptionsCount !== undefined ? (metrics.activeExceptionsCount === 0 ? 'NOMINAL' : 'DEGRADED') : '...'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
              <span>Aggregated</span>
              <span className="text-zinc-600">Status</span>
            </div>
          </div>
          
        </div>
      </section>

      {/*  SECTION 02 / LATENCY TIMELINE  */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">02 / LATENCY TIMELINE</span>
          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
            <span>P95 Confirm Latency (24H)</span>
          </div>
        </div>
        <div className="border border-white/[0.07] rounded bg-[#0e0e11] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-white/[0.04] gap-2">
            <div>
              <h2 className="text-[14px] font-medium text-white tracking-tight">Network Latency Distribution</h2>
              <p className="text-[12px] text-zinc-500">Aggregated gateway transit time over core Beckn protocol action webhooks</p>
            </div>
          </div>
          
          <div className="relative w-full h-64 overflow-hidden">
            {Array.isArray(timeline) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141418', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: 12 }}
                    itemStyle={{ color: '#fff' }}
                    labelFormatter={(val: any) => val ? new Date(val as string | number).toLocaleString() : ''}
                  />
                  <ReferenceLine y={2000} label={{ position: 'top', value: 'SLA LIMIT (2000ms)', fill: '#a1a1aa', fontSize: 10 }} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="p95" stroke="#ffffff" strokeWidth={1.5} dot={false} activeDot={{ r: 4, fill: '#fff' }} />
                  <Line type="monotone" dataKey="p50" stroke="#52525b" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
                Loading timeline data...
              </div>
            )}
          </div>
        </div>
      </section>

      {/*  SECTION 03 / PROTOCOL STREAM & RECENT EXCEPTIONS  */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">03 / ACTIONS</span>
        </div>
        
        <div className="p-3 border border-white/[0.07] rounded bg-[#0e0e11]">
          <a className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-zinc-300 hover:text-white transition-colors text-[11px] font-mono" href="/dashboard/incidents">
            <span>View Full Incident Queue</span>
            <span>→</span>
          </a>
        </div>
      </section>

    </>
  );
}
