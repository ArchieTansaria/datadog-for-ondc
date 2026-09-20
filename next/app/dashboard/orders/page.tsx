"use client";

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrdersTracePage() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR('/api/v1/orders', fetcher, { refreshInterval: 5000 });

  const orders = data?.data || [];

  return (
    <>
      <div className="flex flex-col w-full space-y-10">
        {/*  00 / TRACE ENGINE & CONTROLS  */}
        <section className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">00 / TRACE ENGINE</span>
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
              <input className="w-full bg-transparent border-0 p-0 text-zinc-200 font-mono text-[11px] placeholder:text-zinc-600 focus:ring-0 focus:outline-none" placeholder="Filter by Order ID, Transaction ID, BAP/BPP participant key..." type="text" />
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
                <button className="flex-1 py-1 text-center rounded text-zinc-500 hover:text-zinc-300 transition-colors" type="button">ERRORS</button>
              </div>
            </div>
          </div>
        </section>
        
        {/*  01 / ACTIVE ORDER STREAMS (High Density Telemetry Table)  */}
        <section className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">01 / ACTIVE ORDER STREAMS</span>
              <span className="text-zinc-700">·</span>
              <span className="font-mono text-[11px] text-zinc-400">Showing {orders.length} inflight</span>
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center text-zinc-500">Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center text-zinc-500">No active orders</td>
                  </tr>
                ) : (
                  orders.map((order: any) => {
                    const hasIncident = order.incidents && order.incidents.length > 0;
                    const date = new Date(order.lastEventAt || order.createdAt);
                    const timeString = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
                    
                    return (
                      <tr 
                        key={order.id}
                        onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                        className="hover:bg-white/[0.04] text-zinc-400 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-4 text-zinc-500">{timeString}</td>
                        <td className="py-2.5 px-4 text-zinc-300 flex items-center gap-1.5">
                          {hasIncident ? (
                            <span className="w-1 h-1 bg-rose-500 rounded-full"></span>
                          ) : (
                            <span className="w-1 h-1 bg-white/[0.2] rounded-full"></span>
                          )}
                          <span className={hasIncident ? "text-white font-medium" : ""}>{order.ondcOrderId || order.id.substring(0, 12)}</span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-600 truncate max-w-[140px]" title={order.transactionId}>{order.transactionId}</td>
                        <td className="py-2.5 px-4 text-zinc-400">{order.sellerId || '--'}</td>
                        <td className="py-2.5 px-4 text-zinc-300">
                          <span className={hasIncident ? "text-rose-400 font-medium" : "text-zinc-300"}>
                            {order.currentState}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">--</td>
                        <td className="py-2.5 px-4 text-right">
                          {hasIncident ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-rose-500/30 text-rose-300 text-[10px] tracking-wide">
                              SLA BREACH
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-white/[0.08] text-zinc-300 text-[10px]">
                              NOMINAL
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
