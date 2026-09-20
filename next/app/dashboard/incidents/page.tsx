"use client";

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function IncidentsPage() {
  const { data, error, mutate } = useSWR('/api/incidents', fetcher, { refreshInterval: 5000 });
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isGeneratingRCA, setIsGeneratingRCA] = useState(false);

  const incidents = data?.incidents || [];
  
  const handleIncidentSelect = (incident: any) => {
    setSelectedIncident(incident);
  };

  const handleGenerateRCA = async () => {
    if (!selectedIncident) return;
    setIsGeneratingRCA(true);
    try {
      const response = await fetch(`/api/incidents/${selectedIncident.id}/rca`, {
        method: 'POST',
      });
      const updatedIncident = await response.json();
      setSelectedIncident(updatedIncident);
      mutate(); // Refresh list
    } catch (err) {
      console.error('Failed to generate RCA', err);
    } finally {
      setIsGeneratingRCA(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full space-y-7">
        {/*  00 / INCIDENT TRIAGE & ENGINE  */}
        <section className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">00 / INCIDENT MANAGEMENT & ENGINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="font-mono text-[11px] text-rose-400 tracking-wider uppercase">
                {incidents.filter((i: any) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length} Sev-1 Critical Active
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <h1 className="text-xl md:text-2xl font-mono text-white tracking-tight">Incident & Anomaly Queue</h1>
              <p className="font-mono text-[12px] text-zinc-400 leading-relaxed">
                Deterministic failure correlation, automated cluster triage, and Bedrock LLM synthesis across federated Beckn participants.
              </p>
            </div>
          </div>
        </section>

        {/*  01 & 02 / INCIDENT QUEUE + DETAIL DUAL SPLIT  */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/*  LEFT PANEL: 01 / INCIDENT QUEUE  */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">01 / Incident Queue</span>
            </div>
            <div className="flex flex-col space-y-2">
              {incidents.length === 0 ? (
                <div className="p-3.5 text-zinc-500 text-[11px] font-mono text-center">No active incidents</div>
              ) : (
                incidents.map((incident: any) => (
                  <div 
                    key={incident.id} 
                    onClick={() => handleIncidentSelect(incident)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-colors space-y-1.5 ${selectedIncident?.id === incident.id ? 'bg-zinc-900 border-zinc-700' : 'bg-[#08080a] hover:bg-[#0e0e11]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${incident.severity === 'CRITICAL' ? 'bg-rose-500' : incident.severity === 'HIGH' ? 'bg-secondary' : 'bg-outline'}`}></span>
                        <span className="font-mono text-[11px] text-zinc-400">{incident.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${incident.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-zinc-900 text-zinc-400'}`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="font-mono text-[12px] text-zinc-300 line-clamp-1">
                      {incident.title}
                    </p>
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-1">
                      <span>{new Date(incident.detectedAt).toLocaleString()}</span>
                      {incident.metadata?.rca && (
                        <span className="text-zinc-300 flex items-center gap-1 text-[9px]">
                          <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
                          RCA Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/*  RIGHT PANEL: 02 / INCIDENT DETAIL & BEDROCK ROOT CAUSE  */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">02 / Incident Detail & Root Cause Analysis</span>
              <span className="font-mono text-[11px] text-zinc-500">{selectedIncident ? `ID: ${selectedIncident.id}` : ''}</span>
            </div>
            
            {selectedIncident ? (
              <div className="p-5 rounded-xl bg-[#0e0e11] shadow-md space-y-4">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-medium ${selectedIncident.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-zinc-900 text-white'}`}>
                    {selectedIncident.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-500">DETECTED: {new Date(selectedIncident.detectedAt).toLocaleString()}</span>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-mono text-white tracking-tight">
                    {selectedIncident.title}
                  </h2>
                  <p className="font-mono text-[12px] text-zinc-400 leading-relaxed mt-1">
                    {selectedIncident.description}
                  </p>
                </div>

                {/*  Amazon Bedrock Root Cause Analysis Card  */}
                {selectedIncident.metadata?.rca ? (
                  <div className="relative rounded-xl bg-zinc-900 p-5 shadow-lg overflow-hidden space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-zinc-300 text-[18px]">psychology</span>
                        <span className="font-mono text-[11px] text-zinc-300 tracking-wide">AI ROOT CAUSE ANALYSIS</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">Generated: {new Date(selectedIncident.metadata.rca.generatedAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="font-mono text-[11px] text-zinc-300 leading-relaxed">
                      {selectedIncident.metadata.rca.evidence.rootCause}
                    </p>
                    <div className="space-y-2 pt-1">
                      <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Recommended Action</div>
                      <div className="flex items-start gap-2 text-zinc-400 bg-[#08080a]/60 p-2 rounded text-[11px] font-mono">
                        <span className="text-primary font-bold">→</span>
                        <span className="text-white">{selectedIncident.metadata.rca.evidence.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button 
                      onClick={handleGenerateRCA}
                      disabled={isGeneratingRCA}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-[12px] font-mono transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                      <span>{isGeneratingRCA ? 'Generating RCA...' : 'Generate AI Root Cause Analysis'}</span>
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                  <button 
                    onClick={async () => {
                      await fetch(`/api/incidents/${selectedIncident.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'RESOLVED' }), headers: { 'Content-Type': 'application/json' } });
                      mutate();
                      setSelectedIncident({...selectedIncident, status: 'RESOLVED'});
                    }}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded text-[12px] font-mono transition-colors"
                  >
                    Resolve Incident
                  </button>
                  <button 
                    onClick={async () => {
                      await fetch(`/api/incidents/${selectedIncident.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'IGNORED' }), headers: { 'Content-Type': 'application/json' } });
                      mutate();
                      setSelectedIncident({...selectedIncident, status: 'IGNORED'});
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/[0.08] rounded text-[12px] font-mono transition-colors"
                  >
                    Ignore Anomaly
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] border border-white/[0.07] rounded-xl bg-[#0e0e11] text-zinc-500 font-mono text-[12px]">
                Select an incident from the queue to view details.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
