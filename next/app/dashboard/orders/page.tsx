
export default function OrdersTracePage() {
  return (
    <>
      
{/*  View Title & Monospace Context Strip  */}
<div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/[0.07] pb-4 gap-3">
<div>
<div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
            00 / OBSERVABILITY ENGINE
          </div>
<h1 className="text-xl md:text-2xl font-semibold tracking-[-0.03em] text-white">
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
{/*  Card 1  */}
<div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
<div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
<span>Monitored Orders</span>
<span className="text-zinc-600">FIG 1.1</span>
</div>
<div className="my-2">
<span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">184,920</span>
</div>
<div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
<span>+14.2% DoD</span>
<span className="text-zinc-600">160k target</span>
</div>
</div>
{/*  Card 2  */}
<div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
<div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
<span>Global SLA Breach</span>
<span className="text-zinc-600">FIG 1.2</span>
</div>
<div className="my-2">
<span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">1.48%</span>
</div>
<div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
<span>Target &lt; 1.00%</span>
<span className="text-zinc-600">2,736 drops</span>
</div>
</div>
{/*  Card 3  */}
<div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
<div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
<span>P95 Gateway Latency</span>
<span className="text-zinc-600">FIG 1.3</span>
</div>
<div className="my-2">
<span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">312ms</span>
</div>
<div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
<span>-28ms vs avg</span>
<span className="text-zinc-600">/search → /confirm</span>
</div>
</div>
{/*  Card 4  */}
<div className="bg-[#0e0e11] p-5 flex flex-col justify-between min-h-[140px]">
<div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
<span>Active Exceptions</span>
<span className="text-zinc-600">FIG 1.4</span>
</div>
<div className="my-2 flex items-baseline gap-2">
<span className="font-mono text-3xl md:text-[34px] font-semibold tracking-[-0.04em] text-white">3</span>
<span className="text-[11px] font-mono text-zinc-400">Sev-1 (1)</span>
</div>
<div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-white/[0.04]">
<span>MTTR 4.2m</span>
<span className="text-zinc-600">Auto-triage</span>
</div>
</div>
</div>
</section>
{/*  SECTION 02 / LATENCY TIMELINE & NETWORK TOPOLOGY  */}
<section className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">02 / LATENCY TIMELINE</span>
<div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
<span>P50: <strong className="font-normal text-zinc-300">180ms</strong></span>
<span>P95: <strong className="font-normal text-white">312ms</strong></span>
<span>P99: <strong className="font-normal text-zinc-400">840ms</strong></span>
</div>
</div>
<div className="border border-white/[0.07] rounded bg-[#0e0e11] p-5">
<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-white/[0.04] gap-2">
<div>
<h2 className="text-[14px] font-medium text-white tracking-tight">Network Latency Distribution</h2>
<p className="text-[12px] text-zinc-500">Aggregated gateway transit time over core Beckn protocol action webhooks</p>
</div>
<div className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase">
              SCALE: 0 - 2,400MS
            </div>
</div>
{/*  Refined Linear-style Monochromatic Line Graph  */}
<div className="relative w-full h-64 overflow-hidden">
<svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 240">
<defs>
<pattern height="40" id="minimal-grid" patternUnits="userSpaceOnUse" width="80">
<path d="M 80 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
</pattern>
</defs>
<rect fill="url(#minimal-grid)" height="240" width="800" />
{/*  Subtle horizontal axis reference lines  */}
<line stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="2 4" strokeWidth="1" x1="30" x2="790" y1="40" y2="40" />
<text fill="#52525b" fontFamily="JetBrains Mono" fontSize="9" x="35" y="36">2400ms</text>
{/*  SLA Threshold line: stark, restrained dashed white/gray  */}
<line stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="790" y1="80" y2="80" />
<text fill="#a1a1aa" fontFamily="JetBrains Mono" fontSize="9" x="680" y="75">SLA LIMIT (2,000ms)</text>
<line stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" x1="30" x2="790" y1="120" y2="120" />
<text fill="#52525b" fontFamily="JetBrains Mono" fontSize="9" x="35" y="116">1200ms</text>
<line stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" x1="30" x2="790" y1="160" y2="160" />
<text fill="#52525b" fontFamily="JetBrains Mono" fontSize="9" x="35" y="156">600ms</text>
<line stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" x1="30" x2="790" y1="200" y2="200" />
<text fill="#52525b" fontFamily="JetBrains Mono" fontSize="9" x="35" y="196">0ms</text>
{/*  Crisp Silver / White Vector Path  */}
<path d="M 30,195 
                       C 90,192 130,187 180,181 
                       C 230,175 270,167 310,162 
                       C 350,157 390,182 430,170 
                       C 470,158 500,94  540,92 
                       C 570,90  600,152 640,162 
                       C 680,172 730,167 780,163" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="1.25"></path>
{/*  Single Discrete Focal Point Pin  */}
<circle cx="540" cy="92" fill="#ffffff" r="3" />
<circle cx="540" cy="92" r="7" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
<line stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="2 2" strokeWidth="1" x1="540" x2="540" y1="92" y2="52" />
{/*  Subtle HUD Tag for Peak  */}
<rect fill="#141418" height="18" rx="2" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" width="130" x="475" y="34" />
<text fill="#ffffff" fontFamily="JetBrains Mono" fontSize="9" x="483" y="46">PEAK: 1,840ms (20:12)</text>
{/*  Current Live Ingestion Pin  */}
<circle cx="780" cy="163" fill="#ffffff" r="2.5" />
</svg>
{/*  Bottom Time Axis Labels  */}
<div className="absolute bottom-1 left-9 right-4 flex justify-between font-mono text-[10px] text-zinc-500 pointer-events-none">
<span>00:00</span>
<span>04:00</span>
<span>08:00</span>
<span>12:00</span>
<span>16:00</span>
<span>20:00</span>
<span className="text-white">NOW (22:48)</span>
</div>
</div>
</div>
</section>
{/*  SECTION 03 / PROTOCOL STREAM & RECENT EXCEPTIONS  */}
<section className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">03 / PROTOCOL STREAM &amp; EXCEPTIONS</span>
<span className="text-[10px] font-mono text-zinc-600">HTTP/JSON SCHEMA v1.2</span>
</div>
<div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
{/*  Left Table: Beckn Endpoints Trace (8 Cols)  */}
<div className="xl:col-span-8 border border-white/[0.07] rounded bg-[#0e0e11] overflow-hidden">
<div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="text-[13px] font-medium text-white tracking-tight">Endpoint Ingestion Performance</span>
<span className="text-[10px] font-mono text-zinc-500">6 TARGETS</span>
</div>
<span className="text-[10px] font-mono text-zinc-500">THRESHOLD: ≤ 500MS</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-mono text-[11px] border-collapse">
<thead>
<tr className="border-b border-white/[0.06] text-zinc-500 uppercase text-[10px] tracking-wider">
<th className="px-4 py-2.5 font-normal">Action</th>
<th className="px-4 py-2.5 font-normal">Throughput</th>
<th className="px-4 py-2.5 font-normal">P95 Latency</th>
<th className="px-4 py-2.5 font-normal">Error</th>
<th className="px-4 py-2.5 font-normal text-right">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-white/[0.04] text-zinc-300">
<tr className="hover:bg-white/[0.02] transition-colors">
<td className="px-4 py-3 text-white font-medium">/search</td>
<td className="px-4 py-3 text-zinc-400">1,420 rps</td>
<td className="px-4 py-3">210ms</td>
<td className="px-4 py-3 text-zinc-400">0.04%</td>
<td className="px-4 py-3 text-right text-zinc-400">NOMINAL</td>
</tr>
<tr className="hover:bg-white/[0.02] transition-colors">
<td className="px-4 py-3 text-white font-medium">/on_search</td>
<td className="px-4 py-3 text-zinc-400">3,890 rps</td>
<td className="px-4 py-3">412ms</td>
<td className="px-4 py-3 text-zinc-400">0.12%</td>
<td className="px-4 py-3 text-right text-zinc-400">NOMINAL</td>
</tr>
<tr className="hover:bg-white/[0.02] transition-colors">
<td className="px-4 py-3 text-white font-medium">/select</td>
<td className="px-4 py-3 text-zinc-400">640 rps</td>
<td className="px-4 py-3">195ms</td>
<td className="px-4 py-3 text-zinc-400">0.08%</td>
<td className="px-4 py-3 text-right text-zinc-400">NOMINAL</td>
</tr>
<tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
<td className="px-4 py-3 text-white font-medium">/init</td>
<td className="px-4 py-3 text-zinc-400">315 rps</td>
<td className="px-4 py-3 text-white font-semibold">890ms</td>
<td className="px-4 py-3 text-zinc-300">2.18%</td>
<td className="px-4 py-3 text-right text-zinc-300">DEGRADED</td>
</tr>
<tr className="hover:bg-white/[0.02] transition-colors">
<td className="px-4 py-3 text-white font-medium">/confirm</td>
<td className="px-4 py-3 text-zinc-400">285 rps</td>
<td className="px-4 py-3">340ms</td>
<td className="px-4 py-3 text-zinc-400">0.45%</td>
<td className="px-4 py-3 text-right text-zinc-400">NOMINAL</td>
</tr>
<tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.02]">
<td className="px-4 py-3 text-white font-medium flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
<span>/on_status</span>
</td>
<td className="px-4 py-3 text-zinc-400">198 rps</td>
<td className="px-4 py-3 text-white font-semibold">1,820ms</td>
<td className="px-4 py-3 text-white">4.92%</td>
<td className="px-4 py-3 text-right text-white">BREACH</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Right Column: Minimalist Incident Terminal Feed (4 Cols)  */}
<div className="xl:col-span-4 border border-white/[0.07] rounded bg-[#0e0e11] flex flex-col justify-between">
<div>
<div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
<span className="text-[13px] font-medium text-white tracking-tight">Recent Exceptions</span>
<span className="text-[10px] font-mono text-zinc-500">18 TOTAL</span>
</div>
{/*  Stream entries  */}
<div className="divide-y divide-white/[0.04]">
{/*  Incident 1  */}
<div className="p-3.5 hover:bg-white/[0.02] transition-colors">
<div className="flex items-center justify-between text-[10px] font-mono mb-1">
<span className="text-white font-medium uppercase tracking-wider">[SEV-1 CRITICAL]</span>
<span className="text-zinc-500">14:22:01</span>
</div>
<div className="text-[12px] text-zinc-200 tracking-tight font-mono">
                    Dropped /on_status callback for ORDER_992184
                  </div>
<div className="mt-1.5 text-[10px] font-mono text-zinc-500 flex justify-between">
<span>Participant</span>
<span className="text-zinc-400">Shadowfax BPP</span>
</div>
</div>
{/*  Incident 2  */}
<div className="p-3.5 hover:bg-white/[0.02] transition-colors">
<div className="flex items-center justify-between text-[10px] font-mono mb-1">
<span className="text-zinc-400 font-medium uppercase tracking-wider">[SEV-2 WARNING]</span>
<span className="text-zinc-500">14:18:40</span>
</div>
<div className="text-[12px] text-zinc-200 tracking-tight font-mono">
                    Confirmation delay &gt; 180s on Food Delivery
                  </div>
<div className="mt-1.5 text-[10px] font-mono text-zinc-500 flex justify-between">
<span>Participant</span>
<span className="text-zinc-400">ONDC-BAP-01</span>
</div>
</div>
{/*  Incident 3  */}
<div className="p-3.5 hover:bg-white/[0.02] transition-colors">
<div className="flex items-center justify-between text-[10px] font-mono mb-1">
<span className="text-white font-medium uppercase tracking-wider">[SEV-1 CRITICAL]</span>
<span className="text-zinc-500">14:05:12</span>
</div>
<div className="text-[12px] text-zinc-200 tracking-tight font-mono">
                    Ed25519 signature verification failure on /on_select
                  </div>
<div className="mt-1.5 text-[10px] font-mono text-zinc-500 flex justify-between">
<span>Participant</span>
<span className="text-zinc-400">Mystore BPP</span>
</div>
</div>
{/*  Incident 4  */}
<div className="p-3.5 hover:bg-white/[0.02] transition-colors">
<div className="flex items-center justify-between text-[10px] font-mono mb-1">
<span className="text-zinc-500 font-medium uppercase tracking-wider">[INFO]</span>
<span className="text-zinc-500">13:52:33</span>
</div>
<div className="text-[12px] text-zinc-400 tracking-tight font-mono">
                    Kafka partition rebalance lag spike (140ms)
                  </div>
<div className="mt-1.5 text-[10px] font-mono text-zinc-500 flex justify-between">
<span>Participant</span>
<span className="text-zinc-400">Gateway Worker 04</span>
</div>
</div>
</div>
</div>
{/*  Bottom Button in Stark Monochrome style  */}
<div className="p-3 border-t border-white/[0.06]">
<a className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-zinc-300 hover:text-white transition-colors text-[11px] font-mono" href="#">
<span>View Full Incident Queue</span>
<span>→</span>
</a>
</div>
</div>
</div>
</section>
{/*  SECTION 04 / ROOT CAUSE DIAGNOSTIC  */}
<section className="space-y-3 pb-8">
<div className="flex items-center justify-between">
<span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">04 / AUTOMATED DIAGNOSTIC</span>
<span className="text-[10px] font-mono text-zinc-500">CONFIDENCE 98%</span>
</div>
<div className="border border-white/[0.07] rounded bg-[#0e0e11] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
<div className="space-y-1 max-w-2xl">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-white"></span>
<span className="text-[13px] font-medium text-white tracking-tight">
                Diagnostic: Gateway Sync Desynchronization
              </span>
</div>
<p className="text-[12px] text-zinc-400 leading-relaxed font-mono">
              BPP callback timeouts in Shadowfax cluster correlate with sudden ACK latency &gt; 2500ms on AWS ap-south-1 availability zone 1b.
            </p>
</div>
<div className="flex items-center gap-2 font-mono text-[11px] w-full md:w-auto justify-end">
<button className="px-3 py-1.5 rounded border border-white/[0.08] bg-[#141417] text-zinc-300 hover:text-white hover:border-white/20 transition-colors">
              Trace Graph
            </button>
<button className="px-3 py-1.5 rounded bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
              Trigger Reroute
            </button>
</div>
</div>
</section>

    </>
  );
}
