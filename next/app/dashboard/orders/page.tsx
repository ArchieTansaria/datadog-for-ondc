
export default function OrdersTracePage() {
  return (
    <>
      <div className="flex flex-col w-full space-y-10">
{/*  00 / TRACE ENGINE & CONTROLS  */}
<section className="flex flex-col space-y-6">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-white/[0.08]">
<div className="space-y-1.5">
<div className="flex items-center gap-2">
<span className="font-mono text-[10px] tracking-widest uppercase tracking-widest text-zinc-500">00 / TRACE ENGINE</span>
<span className="text-zinc-700 font-mono text-[11px]">::</span>
<span className="font-mono text-[11px] text-zinc-400">Beckn Protocol v1.2</span>
<span className="text-zinc-700">·</span>
<span className="font-mono text-[11px] text-zinc-500">ap-south-1 (AWS Mumbai)</span>
</div>
<h1 className="text-xl md:text-2xl font-mono text-white tracking-tight">Order Lifecycle &amp; State Trace</h1>
<p className="font-mono text-[12px] leading-relaxed text-zinc-400 max-w-2xl">
          Deterministic execution logs, asynchronous callback resolution latencies, and distributed state machine verifications across federated BAP/BPP nodes.
        </p>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 border border-white/[0.08] text-zinc-400 font-mono text-[11px]">
<span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse"></span>
<span>STREAM LIVE</span>
</div>
<button className="px-3 py-1 bg-white text-zinc-950 text-[13px] leading-relaxed font-medium rounded hover:bg-zinc-200 transition-colors" type="button">
          Replay Trace
        </button>
</div>
</div>
{/*  Filter Bar & Search Utility  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-3">
<div className="md:col-span-8 flex items-center bg-zinc-950 border border-white/[0.08] rounded px-3 py-1.5 focus-within:border-white/20 transition-colors">
<span className="material-symbols-outlined text-zinc-500 text-[18px] mr-2.5">filter_list</span>
<input className="w-full bg-transparent border-0 p-0 text-zinc-200 font-mono text-[11px] placeholder:text-zinc-600 focus:ring-0 focus:outline-none" placeholder="Filter by Order ID, Transaction ID, BAP/BPP participant key..." type="text" value="ord_992184_delhi" />
<div className="flex items-center gap-1 ml-2">
<span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-[10px] font-mono text-zinc-500">ESC</span>
<span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-[10px] font-mono text-zinc-500">↵</span>
</div>
</div>
<div className="md:col-span-4 flex items-center justify-between gap-1 bg-zinc-950 border border-white/[0.08] rounded p-1">
<div className="flex items-center gap-1 font-mono text-[11px] w-full">
<button className="flex-1 py-1 text-center rounded bg-white/[0.08] text-zinc-200 font-medium" type="button">ALL</button>
<button className="flex-1 py-1 text-center rounded text-zinc-500 hover:text-zinc-300 transition-colors" type="button">RETAIL</button>
<button className="flex-1 py-1 text-center rounded text-zinc-500 hover:text-zinc-300 transition-colors" type="button">LOGISTICS</button>
<button className="flex-1 py-1 text-center rounded text-zinc-500 hover:text-zinc-300 transition-colors" type="button">ERRORS (1)</button>
</div>
</div>
</div>
</section>
{/*  01 / ACTIVE ORDER STREAMS (High Density Telemetry Table)  */}
<section className="flex flex-col space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="font-mono text-[10px] tracking-widest uppercase tracking-widest text-zinc-500">01 / ACTIVE ORDER STREAMS</span>
<span className="text-zinc-700">·</span>
<span className="font-mono text-[11px] text-zinc-400">Showing 5 of 8,421 inflight</span>
</div>
<div className="font-mono text-[11px] text-zinc-500">
        AUTO-REFRESH: <span className="text-zinc-300">1000ms</span>
</div>
</div>
<div className="overflow-x-auto border border-white/[0.08] bg-zinc-950 rounded">
<table className="w-full text-left font-mono text-[11px] border-collapse">
<thead>
<tr className="border-b border-white/[0.08] bg-zinc-900/40 text-[11px] text-zinc-500 tracking-wider">
<th className="py-2.5 px-4 font-normal">TIMESTAMP</th>
<th className="py-2.5 px-4 font-normal">ORDER ID</th>
<th className="py-2.5 px-4 font-normal">TRANSACTION ID</th>
<th className="py-2.5 px-4 font-normal">PARTICIPANT (BPP)</th>
<th className="py-2.5 px-4 font-normal">CURRENT STATE</th>
<th className="py-2.5 px-4 font-normal text-right">LATENCY</th>
<th className="py-2.5 px-4 font-normal text-right">STATUS</th>
</tr>
</thead>
<tbody className="divide-y divide-white/[0.04]">
{/*  Active / Inspected Row  */}
<tr className="bg-white/[0.04] text-zinc-100 hover:bg-white/[0.06] transition-colors cursor-pointer">
<td className="py-2.5 px-4 text-zinc-400">14:21:40.102</td>
<td className="py-2.5 px-4 font-medium text-white flex items-center gap-1.5">
<span className="w-1 h-1 bg-white rounded-full"></span>
<span>ord_992184_delhi</span>
</td>
<td className="py-2.5 px-4 text-zinc-500 truncate max-w-[140px]">txn_88b12f90...</td>
<td className="py-2.5 px-4 text-zinc-300">bpp.shadowfax.in</td>
<td className="py-2.5 px-4">
<span className="text-rose-400 font-medium">on_status (agent_assign)</span>
</td>
<td className="py-2.5 px-4 text-right text-rose-400 font-medium">124,800ms</td>
<td className="py-2.5 px-4 text-right">
<span className="inline-flex items-center px-1.5 py-0.5 rounded border border-rose-500/30 text-rose-300 text-[10px] tracking-wide">
                SLA BREACH
              </span>
</td>
</tr>
<tr className="hover:bg-white/[0.02] text-zinc-400 transition-colors cursor-pointer">
<td className="py-2.5 px-4 text-zinc-500">14:23:02.841</td>
<td className="py-2.5 px-4 text-zinc-300">ord_992185_blr</td>
<td className="py-2.5 px-4 text-zinc-600 truncate max-w-[140px]">txn_40a71c88...</td>
<td className="py-2.5 px-4 text-zinc-400">bpp.dunzo.network</td>
<td className="py-2.5 px-4 text-zinc-300">confirm</td>
<td className="py-2.5 px-4 text-right text-zinc-400">482ms</td>
<td className="py-2.5 px-4 text-right">
<span className="inline-flex items-center px-1.5 py-0.5 rounded border border-white/[0.08] text-zinc-300 text-[10px]">
                NOMINAL
              </span>
</td>
</tr>
<tr className="hover:bg-white/[0.02] text-zinc-400 transition-colors cursor-pointer">
<td className="py-2.5 px-4 text-zinc-500">14:22:58.119</td>
<td className="py-2.5 px-4 text-zinc-300">ord_992183_mum</td>
<td className="py-2.5 px-4 text-zinc-600 truncate max-w-[140px]">txn_71e98d12...</td>
<td className="py-2.5 px-4 text-zinc-400">bpp.magicpin.com</td>
<td className="py-2.5 px-4 text-zinc-300">init</td>
<td className="py-2.5 px-4 text-right text-zinc-400">310ms</td>
<td className="py-2.5 px-4 text-right">
<span className="inline-flex items-center px-1.5 py-0.5 rounded border border-white/[0.08] text-zinc-300 text-[10px]">
                NOMINAL
              </span>
</td>
</tr>
<tr className="hover:bg-white/[0.02] text-zinc-400 transition-colors cursor-pointer">
<td className="py-2.5 px-4 text-zinc-500">14:22:54.004</td>
<td className="py-2.5 px-4 text-zinc-300">ord_992182_hyd</td>
<td className="py-2.5 px-4 text-zinc-600 truncate max-w-[140px]">txn_18b2c451...</td>
<td className="py-2.5 px-4 text-zinc-400">bpp.ondc.zomato.in</td>
<td className="py-2.5 px-4 text-zinc-300">select</td>
<td className="py-2.5 px-4 text-right text-zinc-400">220ms</td>
<td className="py-2.5 px-4 text-right">
<span className="inline-flex items-center px-1.5 py-0.5 rounded border border-white/[0.08] text-zinc-300 text-[10px]">
                NOMINAL
              </span>
</td>
</tr>
<tr className="hover:bg-white/[0.02] text-zinc-400 transition-colors cursor-pointer">
<td className="py-2.5 px-4 text-zinc-500">14:22:49.620</td>
<td className="py-2.5 px-4 text-zinc-300">ord_992181_pun</td>
<td className="py-2.5 px-4 text-zinc-600 truncate max-w-[140px]">txn_99c33f44...</td>
<td className="py-2.5 px-4 text-zinc-400">bpp.ola.direct</td>
<td className="py-2.5 px-4 text-zinc-300">order_delivered</td>
<td className="py-2.5 px-4 text-right text-zinc-400">620ms</td>
<td className="py-2.5 px-4 text-right">
<span className="inline-flex items-center px-1.5 py-0.5 rounded border border-white/[0.08] text-zinc-300 text-[10px]">
                NOMINAL
              </span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
{/*  SPLIT WORKBENCH: STATE MACHINE TRACE (02) & PROTOCOL INSPECTOR (03)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
{/*  02 / STATE MACHINE EXECUTION TRACE (Timeline)  */}
<section className="lg:col-span-6 flex flex-col space-y-4">
<div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
<span className="font-mono text-[10px] tracking-widest uppercase tracking-widest text-zinc-500">02 / STATE MACHINE EXECUTION TRACE</span>
<span className="font-mono text-[11px] text-zinc-400">SPAN ID: sp_91a0c</span>
</div>
{/*  Active Inspection Header Card  */}
<div className="bg-zinc-950 border border-white/[0.08] rounded p-4 space-y-3 font-mono text-[11px]">
<div className="grid grid-cols-2 gap-y-2 text-[12px]">
<div>
<div className="text-zinc-600 text-[10px] uppercase">ORDER IDENTIFIER</div>
<div className="text-white font-medium">ord_992184_delhi</div>
</div>
<div>
<div className="text-zinc-600 text-[10px] uppercase">EXECUTION DURATION</div>
<div className="text-rose-400 font-medium">142.4s (Timeout: 120s)</div>
</div>
<div>
<div className="text-zinc-600 text-[10px] uppercase">BECKN TRANSACTION ID</div>
<div className="text-zinc-300 font-mono truncate">txn_88b12f90-4c22-47d3-9e5b-b98a0112</div>
</div>
<div>
<div className="text-zinc-600 text-[10px] uppercase">ROOT CAUSE DETERMINATION</div>
<div className="text-zinc-300 font-medium truncate">BPP Agent Allocation Timeout</div>
</div>
</div>
</div>
{/*  Execution Timeline  */}
<div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.1]">
{/*  Node 1: SEARCH  */}
<div className="relative flex items-start justify-between group">
<span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-400"></span>
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-mono text-[11px] font-medium text-white">SEARCH</span>
<span className="font-mono text-[11px] text-zinc-500">/search → /on_search</span>
</div>
<div className="font-mono text-[11px] text-zinc-500">bap.buyerapp.io ⇄ gateway.ondc.org</div>
</div>
<div className="text-right font-mono text-[11px]">
<div className="text-zinc-300">180ms</div>
<div className="text-zinc-600">14:21:40.102</div>
</div>
</div>
{/*  Node 2: SELECT  */}
<div className="relative flex items-start justify-between group">
<span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-400"></span>
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-mono text-[11px] font-medium text-white">SELECT</span>
<span className="font-mono text-[11px] text-zinc-500">/select → /on_select</span>
</div>
<div className="font-mono text-[11px] text-zinc-500">Quote generation verified</div>
</div>
<div className="text-right font-mono text-[11px]">
<div className="text-zinc-300">240ms</div>
<div className="text-zinc-600">14:21:40.342</div>
</div>
</div>
{/*  Node 3: INIT  */}
<div className="relative flex items-start justify-between group">
<span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-400"></span>
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-mono text-[11px] font-medium text-white">INIT</span>
<span className="font-mono text-[11px] text-zinc-500">/init → /on_init</span>
</div>
<div className="font-mono text-[11px] text-zinc-500">Billing &amp; fulfillment setup</div>
</div>
<div className="text-right font-mono text-[11px]">
<div className="text-zinc-300">410ms</div>
<div className="text-zinc-600">14:21:40.752</div>
</div>
</div>
{/*  Node 4: CONFIRM  */}
<div className="relative flex items-start justify-between group">
<span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-400"></span>
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-mono text-[11px] font-medium text-white">CONFIRM</span>
<span className="font-mono text-[11px] text-zinc-500">/confirm → /on_confirm</span>
</div>
<div className="font-mono text-[11px] text-zinc-500">Payment captured; order finalized</div>
</div>
<div className="text-right font-mono text-[11px]">
<div className="text-zinc-300">520ms</div>
<div className="text-zinc-600">14:21:41.272</div>
</div>
</div>
{/*  Node 5: ASSIGN (BREACHED NODE)  */}
<div className="relative p-3 rounded bg-zinc-950 border border-rose-500/40 -ml-3">
<span className="absolute -left-[17px] top-4 w-2.5 h-2.5 rounded-full bg-rose-500"></span>
<div className="space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="font-mono text-[11px] font-medium text-rose-300">ASSIGN</span>
<span className="font-mono text-[10px] text-rose-400/80 uppercase">/on_status (agent_assign)</span>
</div>
<span className="font-mono text-[11px] text-rose-400 font-medium">124,800ms</span>
</div>
<div className="p-2 bg-rose-950/20 border border-rose-500/20 rounded font-mono text-[11px] text-rose-200/90 leading-relaxed">
<div className="flex items-center gap-1.5 font-medium text-rose-300 mb-0.5">
<span className="material-symbols-outlined text-[14px]">warning</span>
<span>SLA Latency Breach: Threshold exceeded (&gt;30,000ms)</span>
</div>
              Callback /on_status dropped by participant <code className="text-white">bpp.shadowfax.in</code>. Retry packet exhausted after 3 attempts.
            </div>
<div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 pt-1">
<div>ERROR CODE: <span className="text-zinc-300">BPP_TIMEOUT_30008</span></div>
<div>RETRY EXHAUSTION: <span className="text-zinc-300">3 of 3 (EXP_BACKOFF)</span></div>
</div>
</div>
</div>
{/*  Node 6: DELIVER (PENDING / ABORTED)  */}
<div className="relative flex items-start justify-between group opacity-40">
<span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-700"></span>
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-mono text-[11px] font-medium text-zinc-400">DELIVER</span>
<span className="font-mono text-[11px] text-zinc-600">/on_status (order_delivered)</span>
</div>
<div className="font-mono text-[11px] text-zinc-600">State transition blocked by previous stage</div>
</div>
<div className="text-right font-mono text-[11px]">
<div className="text-zinc-600">--</div>
<div className="text-zinc-600">ABORTED</div>
</div>
</div>
</div>
</section>
{/*  03 / PROTOCOL PAYLOAD INSPECTOR  */}
<section className="lg:col-span-6 flex flex-col space-y-4">
<div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
<span className="font-mono text-[10px] tracking-widest uppercase tracking-widest text-zinc-500">03 / PROTOCOL PAYLOAD INSPECTOR</span>
<div className="flex items-center gap-2 font-mono text-[11px]">
<button className="text-zinc-400 hover:text-white transition-colors" type="button">Copy Payload</button>
<span className="text-zinc-700">|</span>
<button className="text-zinc-400 hover:text-white transition-colors" type="button">Export (OTel)</button>
</div>
</div>
{/*  Editor Window Frame  */}
<div className="border border-white/[0.08] bg-[#0c0c0e] rounded overflow-hidden flex flex-col">
{/*  Tab strip  */}
<div className="flex items-center justify-between bg-zinc-950 border-b border-white/[0.08] px-3">
<div className="flex items-center gap-4 text-[11px] font-mono">
<button className="py-2 text-white border-b border-white font-medium" type="button">RAW JSON</button>
<button className="py-2 text-zinc-500 hover:text-zinc-300 transition-colors" type="button">HEADERS</button>
<button className="py-2 text-zinc-500 hover:text-zinc-300 transition-colors" type="button">VALIDATION SCHEMA</button>
<button className="py-2 text-zinc-500 hover:text-zinc-300 transition-colors" type="button">AUDIT LOG</button>
</div>
<div className="font-mono text-[10px] text-zinc-500">SCHEMA: v1.2.0-STABLE</div>
</div>
{/*  JSON Body Display  */}
<div className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-zinc-300">
<pre className="m-0"><code>{'{'}
  <span className="text-zinc-500">&quot;context&quot;</span>: {'{'}
    <span className="text-zinc-500">&quot;domain&quot;</span>: <span className="text-zinc-200">&quot;nic2004:52110&quot;</span>,
    <span className="text-zinc-500">&quot;country&quot;</span>: <span className="text-zinc-200">&quot;IND&quot;</span>,
    <span className="text-zinc-500">&quot;city&quot;</span>: <span className="text-zinc-200">&quot;std:011&quot;</span>,
    <span className="text-zinc-500">&quot;action&quot;</span>: <span className="text-zinc-200">&quot;on_status&quot;</span>,
    <span className="text-zinc-500">&quot;core_version&quot;</span>: <span className="text-zinc-200">&quot;1.2.0&quot;</span>,
    <span className="text-zinc-500">&quot;bap_id&quot;</span>: <span className="text-zinc-200">&quot;bap.buyerapp.io&quot;</span>,
    <span className="text-zinc-500">&quot;bap_uri&quot;</span>: <span className="text-zinc-200">&quot;https://bap.buyerapp.io/beckn&quot;</span>,
    <span className="text-zinc-500">&quot;bpp_id&quot;</span>: <span className="text-zinc-200">&quot;bpp.shadowfax.in&quot;</span>,
    <span className="text-zinc-500">&quot;bpp_uri&quot;</span>: <span className="text-zinc-200">&quot;https://bpp.shadowfax.in/logistics/beckn&quot;</span>,
    <span className="text-zinc-500">&quot;transaction_id&quot;</span>: <span className="text-zinc-200">&quot;txn_88b12f90-4c22-47d3-9e5b-b98a0112&quot;</span>,
    <span className="text-zinc-500">&quot;message_id&quot;</span>: <span className="text-zinc-200">&quot;msg_9fa0b12-4011&quot;</span>,
    <span className="text-zinc-500">&quot;timestamp&quot;</span>: <span className="text-zinc-200">&quot;2025-02-27T14:21:40.102Z&quot;</span>
  {'}'},
  <span className="text-zinc-500">&quot;message&quot;</span>: {'{'}
    <span className="text-zinc-500">&quot;order&quot;</span>: {'{'}
      <span className="text-zinc-500">&quot;id&quot;</span>: <span className="text-zinc-200">&quot;ord_992184_delhi&quot;</span>,
      <span className="text-zinc-500">&quot;state&quot;</span>: <span className="text-rose-400 font-semibold">&quot;In-progress&quot;</span>,
      <span className="text-zinc-500">&quot;fulfillment&quot;</span>: {'{'}
        <span className="text-zinc-500">&quot;type&quot;</span>: <span className="text-zinc-200">&quot;Delivery&quot;</span>,
        <span className="text-zinc-500">&quot;state&quot;</span>: {'{'}
          <span className="text-zinc-500">&quot;descriptor&quot;</span>: {'{'}
            <span className="text-zinc-500">&quot;code&quot;</span>: <span className="text-rose-400">&quot;AGENT_ALLOCATION_PENDING&quot;</span>
          {'}'}
        {'}'},
        <span className="text-zinc-500">&quot;tracking&quot;</span>: <span className="text-zinc-400">false</span>
      {'}'}
    {'}'}
  {'}'},
  <span className="text-zinc-500">&quot;error&quot;</span>: {'{'}
    <span className="text-zinc-500">&quot;type&quot;</span>: <span className="text-zinc-200">&quot;CORE-ERROR&quot;</span>,
    <span className="text-zinc-500">&quot;code&quot;</span>: <span className="text-rose-400 font-semibold">&quot;BPP_TIMEOUT_30008&quot;</span>,
    <span className="text-zinc-500">&quot;path&quot;</span>: <span className="text-zinc-200">&quot;/message/order/fulfillment&quot;</span>,
    <span className="text-zinc-500">&quot;message&quot;</span>: <span className="text-rose-300">&quot;Downstream provider delivery fleet unresponsive. Exceeded 120s max threshold.&quot;</span>
  {'}'}
{'}'}</code></pre>
</div>
{/*  Footer Diagnostics  */}
<div className="border-t border-white/[0.08] bg-zinc-950/80 px-3 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
<span>PARSER STATUS: INVALID_ACK</span>
</div>
<div>ENCODING: UTF-8 / JSON</div>
</div>
</div>
</section>
</div>
{/*  04 / GATEWAY HOP TRACE (Network Telemetry Graph)  */}
<section className="flex flex-col space-y-4 pt-4 border-t border-white/[0.08]">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="font-mono text-[10px] tracking-widest uppercase tracking-widest text-zinc-500">04 / GATEWAY HOP TRACE</span>
<span className="text-zinc-700">·</span>
<span className="font-mono text-[11px] text-zinc-400">Physical Ingestion Topology</span>
</div>
<div className="font-mono text-[11px] text-zinc-500">
        TOTAL HOPS: <span className="text-zinc-300">4</span> | REPLAY BUFFER: <span className="text-zinc-300">OK</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-[11px]">
{/*  Hop 1  */}
<div className="bg-zinc-950 border border-white/[0.08] p-3 rounded space-y-2">
<div className="flex items-center justify-between text-[10px] text-zinc-500">
<span>HOP 01</span>
<span className="text-zinc-300">2ms</span>
</div>
<div className="text-white font-medium">BAP Gateway Ingress</div>
<div className="text-[11px] text-zinc-500 truncate">bap.buyerapp.io:443</div>
<div className="pt-1 text-[10px] text-zinc-400 border-t border-white/[0.04]">HTTP 200 (ACK)</div>
</div>
{/*  Hop 2  */}
<div className="bg-zinc-950 border border-white/[0.08] p-3 rounded space-y-2">
<div className="flex items-center justify-between text-[10px] text-zinc-500">
<span>HOP 02</span>
<span className="text-zinc-300">14ms</span>
</div>
<div className="text-white font-medium">ONDC Routing Core</div>
<div className="text-[11px] text-zinc-500 truncate">ap-south-1.gw.ondc.org</div>
<div className="pt-1 text-[10px] text-zinc-400 border-t border-white/[0.04]">SIGNATURE VERIFIED</div>
</div>
{/*  Hop 3  */}
<div className="bg-zinc-950 border border-white/[0.08] p-3 rounded space-y-2">
<div className="flex items-center justify-between text-[10px] text-zinc-500">
<span>HOP 03</span>
<span className="text-zinc-300">38ms</span>
</div>
<div className="text-white font-medium">BPP Adapter (Shadowfax)</div>
<div className="text-[11px] text-zinc-500 truncate">bpp.shadowfax.in/logistics</div>
<div className="pt-1 text-[10px] text-zinc-400 border-t border-white/[0.04]">ACKNOWLEDGED</div>
</div>
{/*  Hop 4 (Breach)  */}
<div className="bg-zinc-950 border border-rose-500/30 p-3 rounded space-y-2">
<div className="flex items-center justify-between text-[10px] text-rose-400">
<span>HOP 04 (ASYNC)</span>
<span>124,800ms</span>
</div>
<div className="text-rose-200 font-medium">Driver Dispatch Engine</div>
<div className="text-[11px] text-zinc-500 truncate">fleet-alloc-prod-delhi</div>
<div className="pt-1 text-[10px] text-rose-400 border-t border-white/[0.04]">CALLBACK TIMEOUT</div>
</div>
</div>
</section>
</div>
    </>
  );
}
