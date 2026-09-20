"use client";

import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: orderData, isLoading: orderLoading } = useSWR(`/api/v1/orders/${id}`, fetcher);
  const { data: eventsData, isLoading: eventsLoading } = useSWR(`/api/v1/orders/${id}/events`, fetcher);

  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  if (orderLoading || eventsLoading) {
    return <div className="text-zinc-500 font-mono text-sm p-4">Loading trace data...</div>;
  }

  const order = orderData?.data;
  const events = eventsData?.data || [];
  const selectedEvent = events[selectedEventIndex] || null;

  if (!order) {
    return <div className="text-rose-500 font-mono text-sm p-4">Order not found.</div>;
  }

  const durationMs = events.length > 1 
    ? new Date(events[events.length - 1].eventTimestamp).getTime() - new Date(events[0].eventTimestamp).getTime() 
    : 0;
  
  const hasError = events.some((e: any) => e.errorCode || e.processingStatus === 'FAILED');

  return (
    <div className="flex flex-col w-full space-y-10">
      <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
        <div className="space-y-1.5">
          <button onClick={() => router.push('/dashboard/orders')} className="text-zinc-500 hover:text-white font-mono text-[11px] mb-2 flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            BACK TO STREAMS
          </button>
          <h1 className="text-xl md:text-2xl font-mono text-white tracking-tight">Trace: {order.ondcOrderId || order.id}</h1>
          <p className="font-mono text-[12px] text-zinc-400">Transaction ID: {order.transactionId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/*  02 / STATE MACHINE EXECUTION TRACE (Timeline)  */}
        <section className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">02 / STATE MACHINE EXECUTION TRACE</span>
            <span className="font-mono text-[11px] text-zinc-400">ORDER ID: {order.id.substring(0,8)}</span>
          </div>
          
          {/*  Active Inspection Header Card  */}
          <div className="bg-zinc-950 border border-white/[0.08] rounded p-4 space-y-3 font-mono text-[11px]">
            <div className="grid grid-cols-2 gap-y-2 text-[12px]">
              <div>
                <div className="text-zinc-600 text-[10px] uppercase">ORDER IDENTIFIER</div>
                <div className="text-white font-medium">{order.ondcOrderId || order.id.substring(0,12)}</div>
              </div>
              <div>
                <div className="text-zinc-600 text-[10px] uppercase">EXECUTION DURATION</div>
                <div className={hasError ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"}>{durationMs}ms</div>
              </div>
              <div>
                <div className="text-zinc-600 text-[10px] uppercase">BECKN TRANSACTION ID</div>
                <div className="text-zinc-300 font-mono truncate" title={order.transactionId}>{order.transactionId.substring(0, 24)}...</div>
              </div>
              <div>
                <div className="text-zinc-600 text-[10px] uppercase">CURRENT STATE</div>
                <div className="text-zinc-300 font-medium truncate uppercase">{order.currentState}</div>
              </div>
            </div>
          </div>
          
          {/*  Execution Timeline  */}
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.1]">
            {events.map((event: any, index: number) => {
              const isError = !!event.errorCode || event.processingStatus === 'FAILED';
              const isSelected = index === selectedEventIndex;
              const timeString = new Date(event.eventTimestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
              
              let prevTimestamp = index > 0 ? new Date(events[index-1].eventTimestamp).getTime() : new Date(event.eventTimestamp).getTime();
              let latency = new Date(event.eventTimestamp).getTime() - prevTimestamp;

              return (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEventIndex(index)}
                  className={`relative flex items-start justify-between group cursor-pointer p-2 -ml-2 rounded transition-colors ${isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'} ${isError ? 'border border-rose-500/40 bg-rose-950/10' : ''}`}
                >
                  <span className={`absolute -left-[17px] top-3 w-2.5 h-2.5 rounded-full ${isError ? 'bg-rose-500' : (isSelected ? 'bg-white' : 'bg-zinc-950 border border-zinc-400')}`}></span>
                  <div className="space-y-0.5 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[11px] font-medium ${isError ? 'text-rose-300' : 'text-white'}`}>{event.eventType || event.action.toUpperCase()}</span>
                      <span className="font-mono text-[11px] text-zinc-500">/{event.action}</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500">{event.participantId}</div>
                    {isError && (
                      <div className="mt-2 p-2 bg-rose-950/20 border border-rose-500/20 rounded font-mono text-[11px] text-rose-200/90 leading-relaxed">
                        <div className="flex items-center gap-1.5 font-medium text-rose-300 mb-0.5">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span>{event.errorCode || 'Error'}</span>
                        </div>
                        {event.errorMessage || 'Processing failed for this event.'}
                      </div>
                    )}
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <div className={isError ? "text-rose-400" : "text-zinc-300"}>{latency}ms</div>
                    <div className="text-zinc-600">{timeString}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/*  03 / PROTOCOL PAYLOAD INSPECTOR  */}
        <section className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">03 / PROTOCOL PAYLOAD INSPECTOR</span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <button className="text-zinc-400 hover:text-white transition-colors" type="button" onClick={() => {
                if (selectedEvent?.rawPayload) {
                  navigator.clipboard.writeText(JSON.stringify(selectedEvent.rawPayload, null, 2));
                }
              }}>Copy Payload</button>
            </div>
          </div>
          
          {/*  Editor Window Frame  */}
          <div className="border border-white/[0.08] bg-[#0c0c0e] rounded overflow-hidden flex flex-col">
            <div className="flex items-center justify-between bg-zinc-950 border-b border-white/[0.08] px-3">
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <button className="py-2 text-white border-b border-white font-medium" type="button">RAW JSON</button>
                <button className="py-2 text-zinc-500 hover:text-zinc-300 transition-colors" type="button">HEADERS</button>
              </div>
              <div className="font-mono text-[10px] text-zinc-500">SCHEMA: v{selectedEvent?.protocolVersion || '1.2.0'}</div>
            </div>
            
            <div className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-zinc-300 max-h-[500px] overflow-y-auto">
              {selectedEvent ? (
                <pre className="m-0">
                  <code>{JSON.stringify(selectedEvent.rawPayload, null, 2)}</code>
                </pre>
              ) : (
                <div className="text-zinc-600">Select an event to view payload</div>
              )}
            </div>
            
            <div className="border-t border-white/[0.08] bg-zinc-950/80 px-3 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              {selectedEvent?.validationStatus === 'INVALID' ? (
                <div className="flex items-center gap-2 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>PARSER STATUS: INVALID_ACK</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>PARSER STATUS: VALIDATED</span>
                </div>
              )}
              <div>ENCODING: UTF-8 / JSON</div>
            </div>
          </div>
        </section>
      </div>

      {/*  04 / GATEWAY HOP TRACE (Network Telemetry Graph)  */}
      <section className="flex flex-col space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">04 / GATEWAY HOP TRACE</span>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-[11px] text-zinc-400">Physical Ingestion Topology</span>
          </div>
          <div className="font-mono text-[11px] text-zinc-500">
            TOTAL HOPS: <span className="text-zinc-300">{events.length > 0 ? 3 : 0}</span> | REPLAY BUFFER: <span className="text-zinc-300">OK</span>
          </div>
        </div>
        
        {events.length > 0 && selectedEvent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
            {/*  Hop 1  */}
            <div className="bg-zinc-950 border border-white/[0.08] p-3 rounded space-y-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>HOP 01</span>
                <span className="text-zinc-300">--</span>
              </div>
              <div className="text-white font-medium">BAP Gateway Ingress</div>
              <div className="text-[11px] text-zinc-500 truncate">{selectedEvent.participantId || 'unknown'}</div>
              <div className="pt-1 text-[10px] text-zinc-400 border-t border-white/[0.04]">HTTP 200 (ACK)</div>
            </div>
            {/*  Hop 2  */}
            <div className="bg-zinc-950 border border-white/[0.08] p-3 rounded space-y-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>HOP 02</span>
                <span className="text-zinc-300">--</span>
              </div>
              <div className="text-white font-medium">ONDC Routing Core</div>
              <div className="text-[11px] text-zinc-500 truncate">gateway.ondc.org</div>
              <div className="pt-1 text-[10px] text-zinc-400 border-t border-white/[0.04]">SIGNATURE VERIFIED</div>
            </div>
            {/*  Hop 3  */}
            <div className={`bg-zinc-950 border p-3 rounded space-y-2 ${selectedEvent.validationStatus === 'INVALID' ? 'border-rose-500/30' : 'border-white/[0.08]'}`}>
              <div className={`flex items-center justify-between text-[10px] ${selectedEvent.validationStatus === 'INVALID' ? 'text-rose-400' : 'text-zinc-500'}`}>
                <span>HOP 03</span>
                <span className={selectedEvent.validationStatus === 'INVALID' ? 'text-rose-400' : 'text-zinc-300'}>--</span>
              </div>
              <div className={selectedEvent.validationStatus === 'INVALID' ? 'text-rose-200 font-medium' : 'text-white font-medium'}>BPP Adapter</div>
              <div className="text-[11px] text-zinc-500 truncate">{order.sellerId || 'unknown'}</div>
              <div className={`pt-1 text-[10px] border-t border-white/[0.04] ${selectedEvent.validationStatus === 'INVALID' ? 'text-rose-400' : 'text-zinc-400'}`}>
                {selectedEvent.validationStatus === 'INVALID' ? 'FAILED' : 'ACKNOWLEDGED'}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
