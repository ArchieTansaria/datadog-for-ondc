
export default function IncidentsPage() {
  return (
    <>
      <div className="flex flex-col w-full space-y-7">
{/*  00 / INCIDENT TRIAGE & ENGINE  */}
<section className="flex flex-col space-y-4">
<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
<div className="flex items-baseline gap-2.5">
<span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 tracking-widest">00 / INCIDENT MANAGEMENT &amp; ENGINE</span>
<span className="font-mono text-[11px] text-zinc-400">::</span>
<span className="font-mono text-[11px] text-zinc-500">Beckn Protocol Core v1.2</span>
<span className="text-zinc-600">·</span>
<span className="font-mono text-[11px] text-zinc-500">ap-south-1 (AWS Mumbai)</span>
</div>
<div className="flex items-center gap-2">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
<span className="font-mono text-[11px] text-rose-400 tracking-wider uppercase">3 Sev-1 Critical Active</span>
</div>
</div>
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
<div className="space-y-1.5 max-w-3xl">
<h1 className="text-xl md:text-2xl font-semibold tracking-[-0.03em] text-zinc-300 tracking-tight font-medium">Incident &amp; Anomaly Queue</h1>
<p className="text-[13px] leading-relaxed text-zinc-400 leading-relaxed">
          Deterministic failure correlation, automated cluster triage, and Bedrock LLM synthesis across federated Beckn participants.
        </p>
</div>
<div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
<button className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] leading-relaxed transition-colors flex items-center gap-1.5 shadow-sm" type="button">
<span className="material-symbols-outlined text-zinc-500 text-[16px]">done_all</span>
<span>Bulk Acknowledge</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-white hover:bg-white-fixed text-black text-[12px] leading-relaxed transition-colors flex items-center gap-1.5 shadow-sm" type="button">
<span className="material-symbols-outlined text-[16px]">file_download</span>
<span>Export Postmortem</span>
</button>
</div>
</div>
{/*  Filters & Query Bar  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-1">
<div className="md:col-span-8 relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-zinc-500 text-[16px]">filter_list</span>
<input className="w-full bg-[#08080a] text-white placeholder:text-zinc-600 font-mono text-[11px] pl-9 pr-14 py-2 rounded-lg focus:outline-none focus:bg-[#0e0e11] transition-colors shadow-sm" placeholder="Filter incidents by code, BAP/BPP, domain, or trace ID..." type="text" value="bpp.shadowfax.in"/>
<div className="absolute right-2.5 flex items-center gap-1 font-mono text-[10px] text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900">
<span>ESC</span>
<span>↵</span>
</div>
</div>
<div className="md:col-span-4 flex items-center bg-[#08080a] p-1 rounded-lg gap-1">
<button className="flex-1 text-center py-1 rounded bg-zinc-900 text-white font-mono text-[10px]">
          ALL (18)
        </button>
<button className="flex-1 text-center py-1 rounded text-rose-400 font-mono text-[10px] hover:bg-[#0e0e11] transition-colors">
          CRIT (3)
        </button>
<button className="flex-1 text-center py-1 rounded text-zinc-400 font-mono text-[10px] hover:bg-[#0e0e11] transition-colors">
          HIGH (5)
        </button>
<button className="flex-1 text-center py-1 rounded text-zinc-500 font-mono text-[10px] hover:bg-[#0e0e11] transition-colors">
          WARN (10)
        </button>
</div>
</div>
</section>
{/*  01 & 02 / INCIDENT QUEUE + DETAIL DUAL SPLIT  */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
{/*  LEFT PANEL: 01 / INCIDENT QUEUE (~42% desktop)  */}
<div className="lg:col-span-5 flex flex-col space-y-3">
<div className="flex items-center justify-between px-1">
<span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 uppercase tracking-wider">01 / Incident Queue</span>
<span className="font-mono text-[11px] text-zinc-600">SYNCED: 1s AGO</span>
</div>
<div className="flex flex-col space-y-2">
{/*  Item 1: Selected / Active Incident  */}
<div className="group relative p-3.5 rounded-xl bg-[#0e0e11] cursor-pointer shadow-md transition-all hover:bg-zinc-950">
<div className="flex items-center justify-between mb-1.5">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
<span className="font-mono text-[11px] font-medium text-zinc-300">INC-2025-08491</span>
</div>
<span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300">SEV-1 CRITICAL</span>
</div>
<p className="text-base font-medium text-white leading-tight mb-2">
            15 Orders failed at /on_confirm (Timeout &gt; 120s)
          </p>
<div className="grid grid-cols-2 gap-y-1 font-mono text-[10px] text-zinc-400">
<div>PARTICIPANT: <span className="text-white">bpp.shadowfax.in</span></div>
<div>IMPACT: <span className="text-rose-400 font-medium">15 Orders (₹24.8k)</span></div>
<div>FIRST SEEN: <span className="text-white">14:21:40 UTC</span></div>
<div>DURATION: <span className="text-zinc-500">14m 22s</span></div>
</div>
<div className="mt-2.5 pt-2 flex items-center justify-between text-zinc-500 text-[11px] font-mono">
<span className="text-zinc-300 flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">auto_awesome</span>
              Bedrock RCA Ready
            </span>
<span className="text-zinc-500">BAP: bap.buyerapp.io</span>
</div>
</div>
{/*  Item 2  */}
<div className="p-3.5 rounded-xl bg-[#08080a] hover:bg-[#0e0e11] transition-colors cursor-pointer space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
<span className="font-mono text-[11px] text-zinc-400">INC-2025-08489</span>
</div>
<span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-rose-400">CRITICAL</span>
</div>
<p className="text-[13px] leading-relaxed text-white line-clamp-1">
            Ed25519 signature verification failure on /on_select
          </p>
<div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-1">
<span>mystore.retail.in</span>
<span>42 Orders · 14:05:12 UTC</span>
</div>
</div>
{/*  Item 3  */}
<div className="p-3.5 rounded-xl bg-[#08080a] hover:bg-[#0e0e11] transition-colors cursor-pointer space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="font-mono text-[11px] text-zinc-400">INC-2025-08477</span>
</div>
<span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400">HIGH</span>
</div>
<p className="text-[13px] leading-relaxed text-white line-clamp-1">
            Cascading 504 Gateway Timeout during /init state transition
          </p>
<div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-1">
<span>dunzo.logistics.bpp</span>
<span>8 Orders · 13:48:02 UTC</span>
</div>
</div>
{/*  Item 4  */}
<div className="p-3.5 rounded-xl bg-[#08080a] hover:bg-[#0e0e11] transition-colors cursor-pointer space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="font-mono text-[11px] text-zinc-400">INC-2025-08462</span>
</div>
<span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400">HIGH</span>
</div>
<p className="text-[13px] leading-relaxed text-white line-clamp-1">
            Invalid ACK format schema violation (context.action mismatch)
          </p>
<div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-1">
<span>zomato.quick.bap</span>
<span>27 Orders · 13:12:55 UTC</span>
</div>
</div>
{/*  Item 5  */}
<div className="p-3.5 rounded-xl bg-[#08080a] hover:bg-[#0e0e11] transition-colors cursor-pointer space-y-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
<span className="font-mono text-[11px] text-zinc-500">INC-2025-08450</span>
</div>
<span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-500">WARNING</span>
</div>
<p className="text-[13px] leading-relaxed text-zinc-400 line-clamp-1">
            Kafka partition rebalance lag spike (&gt;140ms)
          </p>
<div className="flex items-center justify-between font-mono text-[10px] text-zinc-600 pt-1">
<span>Infra Gateway 04</span>
<span>Broker 2b · 12:44:19 UTC</span>
</div>
</div>
</div>
</div>
{/*  RIGHT PANEL: 02 / INCIDENT DETAIL & BEDROCK ROOT CAUSE (~58% desktop)  */}
<div className="lg:col-span-7 flex flex-col space-y-4">
<div className="flex items-center justify-between px-1">
<span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 uppercase tracking-wider">02 / Incident Detail &amp; Root Cause Analysis</span>
<span className="font-mono text-[11px] text-zinc-500">ID: INC-2025-08491</span>
</div>
{/*  Incident Header Bar  */}
<div className="p-5 rounded-xl bg-[#0e0e11] shadow-md space-y-4">
<div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
<span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">SEV-1 CRITICAL</span>
<span className="px-2 py-0.5 rounded bg-zinc-900 text-white">15 ORDERS IMPACTED</span>
<span className="px-2 py-0.5 rounded bg-zinc-900 text-white">GMV AT RISK: ₹24,850</span>
<span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-500">DETECTED: 14:21:40 UTC</span>
</div>
<div>
<h2 className="text-lg md:text-xl font-medium tracking-tight text-zinc-300 tracking-tight">
            Logistics State Machine Lockout: /on_status Timeout
          </h2>
<p className="text-[13px] leading-relaxed text-zinc-400 mt-1">
            Target BPP failed to deliver asynchronous callback payload within strict protocol bounds, stranding active buyer state transitions.
          </p>
</div>
{/*  STAR FEATURE: Amazon Bedrock Root Cause Analysis Card  */}
<div className="relative rounded-xl bg-zinc-900 p-5 shadow-lg overflow-hidden space-y-3.5">
{/*  Subtle top subtle shimmer accent line  */}
<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-tertiary/40 to-transparent"></div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-zinc-300 text-[18px]">psychology</span>
<span className="font-mono text-[11px] text-zinc-300 tracking-wide">AMAZON BEDROCK / CLAUDE 3.5 SONNET</span>
<span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-400">CONFIDENCE 99.4%</span>
</div>
<span className="font-mono text-[10px] text-zinc-500">Synthesized in 1.4s · Bedrock Serverless</span>
</div>
<p className="text-[13px] leading-relaxed text-white leading-relaxed">
            The logistics assignment callback (<code className="font-mono text-zinc-300 px-1 rounded bg-zinc-950">/on_status</code>) failed to arrive within the configured 2-minute SLA for 15 orders routed through Participant <span className="font-mono text-zinc-300">bpp.shadowfax.in</span>. This indicates a downstream gateway timeout or dispatch queue deadlock in availability zone <span className="font-mono text-white">ap-south-1b</span>. The BAP correctly attempted 3 exponential backoff retries before entering terminal SLA breach state.
          </p>
{/*  Contributing Factors Checklist  */}
<div className="space-y-2 pt-1">
<div className="font-mono text-[10px] tracking-widest uppercase uppercase tracking-wider text-zinc-500">Key Contributing Factors &amp; Telemetry Correlation</div>
<div className="space-y-1.5 font-mono text-[11px]">
<div className="flex items-start gap-2 text-zinc-400 bg-[#08080a]/60 p-2 rounded">
<span className="text-rose-400 font-bold">✕</span>
<span className="text-white"><span className="text-zinc-500">Primary vector:</span> Downstream HTTP 504 from microservice <code className="text-zinc-300">fleet-alloc-prod-delhi</code></span>
</div>
<div className="flex items-start gap-2 text-zinc-400 bg-[#08080a]/60 p-2 rounded">
<span className="text-primary font-bold">~</span>
<span className="text-white"><span className="text-zinc-500">Correlation:</span> Matches a 340% traffic spike during Delhi-NCR quick-commerce lunch peak</span>
</div>
<div className="flex items-start gap-2 text-zinc-400 bg-[#08080a]/60 p-2 rounded">
<span className="text-primary font-bold">→</span>
<span className="text-white"><span className="text-zinc-500">Recommended Action:</span> Reroute logistics fulfillment to <code className="text-zinc-300">bpp.dunzo.network</code> or <code className="text-zinc-300">bpp.ola.direct</code></span>
</div>
</div>
</div>
</div>
{/*  Action Bar  */}
<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
<div className="flex items-center gap-2">
<button className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] leading-relaxed transition-colors shadow-sm" type="button">
              Acknowledge
            </button>
<button className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[12px] leading-relaxed transition-colors flex items-center gap-1.5 shadow-sm" type="button">
<span className="material-symbols-outlined text-[16px] text-rose-400">notifications_active</span>
<span>Escalate to SNS</span>
</button>
<button className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[12px] leading-relaxed transition-colors shadow-sm" type="button">
              View Affected Orders (15)
            </button>
</div>
<button className="px-4 py-1.5 rounded-lg bg-white hover:bg-white-fixed text-black text-[12px] leading-relaxed transition-colors flex items-center gap-1.5 shadow-sm font-medium" type="button">
<span className="material-symbols-outlined text-[16px]">alt_route</span>
<span>Automated Reroute</span>
</button>
</div>
</div>
</div>
</section>
{/*  03 / AFFECTED PAYLOAD & TRACE SAMPLES  */}
<section className="flex flex-col space-y-3">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-2">
<span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 uppercase tracking-wider">03 / Mitigation Audit Trail &amp; Trace Samples</span>
<span className="font-mono text-[11px] text-zinc-600">·</span>
<span className="font-mono text-[11px] text-zinc-500">Correlation Window: 14:15 - 14:35 UTC</span>
</div>
<div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500">
<button className="hover:text-zinc-300 transition-colors flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">content_copy</span>
          Copy Traces
        </button>
<button className="hover:text-zinc-300 transition-colors flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">open_in_new</span>
          Export (OTel)
        </button>
</div>
</div>
<div className="rounded-xl bg-[#08080a] p-4 shadow-md space-y-3">
{/*  Tabs  */}
<div className="flex items-center gap-4 border-b-0 font-mono text-[10px] pb-1 text-zinc-500">
<button className="text-zinc-300 font-medium pb-1 relative">
          AFFECTED TRANSACTIONS (15)
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
</button>
<button className="hover:text-white transition-colors pb-1">ERROR STACK TRACE</button>
<button className="hover:text-white transition-colors pb-1">SNS DISPATCH LOG</button>
<button className="hover:text-white transition-colors pb-1">BPP HEARTBEAT</button>
</div>
{/*  Sample Orders Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left font-mono text-[11px]">
<thead>
<tr className="text-zinc-600 text-[11px] uppercase">
<th className="py-2 px-3 font-normal">Order ID</th>
<th className="py-2 px-3 font-normal">Transaction ID</th>
<th className="py-2 px-3 font-normal">Failure Point</th>
<th className="py-2 px-3 font-normal">Latency</th>
<th className="py-2 px-3 font-normal">Last Response</th>
<th className="py-2 px-3 font-normal text-right">Inspect</th>
</tr>
</thead>
<tbody className="divide-y-0 text-zinc-400">
<tr className="bg-[#0e0e11] hover:bg-zinc-950 transition-colors rounded">
<td className="py-2.5 px-3 text-zinc-300 font-medium">ord_992184_delhi</td>
<td className="py-2.5 px-3 text-zinc-500">txn_88b12f90-4c22-47d3...</td>
<td className="py-2.5 px-3 text-rose-400">/on_status (agent_assign)</td>
<td className="py-2.5 px-3 text-rose-400">124,800ms (SLA Breach)</td>
<td className="py-2.5 px-3 text-zinc-500">HTTP 504 GATEWAY_TIMEOUT</td>
<td className="py-2.5 px-3 text-right">
<button className="px-2 py-1 rounded bg-zinc-950 text-[11px] text-zinc-300 hover:bg-zinc-900 transition-colors">
                  Payload
                </button>
</td>
</tr>
<tr className="hover:bg-[#0e0e11] transition-colors">
<td className="py-2.5 px-3 text-white font-medium">ord_992185_delhi</td>
<td className="py-2.5 px-3 text-zinc-500">txn_40a71c88-12d9-4fa2...</td>
<td className="py-2.5 px-3 text-rose-400">/on_status (agent_assign)</td>
<td className="py-2.5 px-3 text-rose-400">120,450ms (SLA Breach)</td>
<td className="py-2.5 px-3 text-zinc-500">HTTP 504 GATEWAY_TIMEOUT</td>
<td className="py-2.5 px-3 text-right">
<button className="px-2 py-1 rounded bg-zinc-950 text-[11px] text-zinc-300 hover:bg-zinc-900 transition-colors">
                  Payload
                </button>
</td>
</tr>
<tr className="hover:bg-[#0e0e11] transition-colors">
<td className="py-2.5 px-3 text-white font-medium">ord_992186_delhi</td>
<td className="py-2.5 px-3 text-zinc-500">txn_71e98d12-98aa-41f3...</td>
<td className="py-2.5 px-3 text-rose-400">/on_status (agent_assign)</td>
<td className="py-2.5 px-3 text-rose-400">121,110ms (SLA Breach)</td>
<td className="py-2.5 px-3 text-zinc-500">HTTP 504 GATEWAY_TIMEOUT</td>
<td className="py-2.5 px-3 text-right">
<button className="px-2 py-1 rounded bg-zinc-950 text-[11px] text-zinc-300 hover:bg-zinc-900 transition-colors">
                  Payload
                </button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Compact Code Payload Preview  */}
<div className="mt-3 p-3 rounded-lg bg-background text-zinc-500 font-mono text-[11px] overflow-x-auto">
<span className="text-zinc-300">{"{"}&quot;context&quot;:</span> {"{"}&quot;domain&quot;: "nic2004:52110", "action": "on_status", "bpp_id": "bpp.shadowfax.in", "timestamp": "2025-02-27T14:21:40.102Z"}, <span className="text-rose-400">&quot;error":</span> {"{"}&quot;type&quot;: "GATEWAY_TIMEOUT", "code": "30005", "message": "Participant callback deadline exceeded: 120000ms&quot;{"}"{"}"} <span className="text-zinc-300">{"}"}</span>
</div>
</div>
</section>
</div>
    </>
  );
}
