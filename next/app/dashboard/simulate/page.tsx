'use client';

import React, { useState, useEffect, useRef } from 'react';

const Toggle = ({ label, description, enabled, onChange, colorClass = "bg-white" }: { label: string, description: string, enabled: boolean, onChange: (val: boolean) => void, colorClass?: string }) => {
  return (
    <div className="flex items-start justify-between p-4 rounded-xl bg-[#0e0e11] border border-white/[0.08] hover:border-white/[0.15] transition-colors cursor-pointer group" onClick={() => onChange(!enabled)}>
      <div className="space-y-1.5 pr-4">
        <div className="font-mono text-[13px] text-white tracking-tight">{label}</div>
        <div className="font-mono text-[11px] text-zinc-500 leading-relaxed">{description}</div>
      </div>
      <button 
        type="button" 
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? colorClass : 'bg-zinc-800'}`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export default function SimulatorPage() {
  const [dropAssignment, setDropAssignment] = useState(false);
  const [delayConfirm, setDelayConfirm] = useState(false);
  const [duplicateConfirm, setDuplicateConfirm] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<{timestamp: string, message: string, level: string}[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([{ timestamp: new Date().toISOString(), message: 'Initializing synthetic trace...', level: 'info' }]);
    
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dropAssignment, delayConfirm, duplicateConfirm })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to start simulation');
      }

      setLogs(prev => [...prev, { timestamp: new Date().toISOString(), message: `Synthetic order dispatched. Transaction ID: ${data.transactionId}`, level: 'info' }]);

      // Poll for status
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/simulate/${data.transactionId}`);
          const statusData = await statusRes.json();
          
          if (statusData.logs) {
            setLogs([{ timestamp: new Date().toISOString(), message: `Tracking Transaction: ${data.transactionId}`, level: 'info' }, ...statusData.logs]);
          }

          if (statusData.status === 'COMPLETED' || statusData.status === 'FAILED') {
            clearInterval(pollInterval);
            setIsRunning(false);
            setLogs(prev => [...prev, { timestamp: new Date().toISOString(), message: `Simulation finished with status: ${statusData.status}`, level: statusData.status === 'FAILED' ? 'error' : 'success' }]);
          }
        } catch (err) {
          console.error('Polling failed:', err);
        }
      }, 3000);

      // Timeout after 60s
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isRunning) {
          setIsRunning(false);
          setLogs(prev => [...prev, { timestamp: new Date().toISOString(), message: 'Simulation polling timed out (60s).', level: 'warn' }]);
        }
      }, 60000);

    } catch (err: any) {
      setLogs(prev => [...prev, { timestamp: new Date().toISOString(), message: err.message, level: 'error' }]);
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-7">
      <section className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">00 / SANDBOX ENGINE</span>
            <span className="font-mono text-[11px] text-zinc-400">::</span>
            <span className="font-mono text-[11px] text-zinc-500">Fault Injection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-cyan-400 tracking-wider uppercase">Simulator Active</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="text-xl md:text-2xl font-mono text-white tracking-tight">Fault Injection &amp; Simulator</h1>
            <p className="font-mono text-[12px] leading-relaxed text-zinc-400">
              Run synthetic ONDC transactions with deterministic failure injection. Validate telemetry alerts, idempotency locks, and SLA breach handlers in real-time.
            </p>
          </div>
          
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className={`px-5 py-2.5 rounded-lg font-mono text-[13px] transition-all flex items-center gap-2 shadow-sm ${isRunning ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white hover:bg-zinc-200 text-black font-medium'}`}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Executing Trace...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Run Synthetic Order</span>
              </>
            )}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Toggle 
          label="Drop /on_status Callback" 
          description="Silently discard logistics provider assignment callback to simulate a frozen queue." 
          enabled={dropAssignment} 
          onChange={setDropAssignment}
          colorClass="bg-rose-500"
        />
        <Toggle 
          label="Delay /on_confirm by 5m" 
          description="Force a 300s timeout during order confirmation to breach participant SLAs." 
          enabled={delayConfirm} 
          onChange={setDelayConfirm}
          colorClass="bg-rose-500"
        />
        <Toggle 
          label="Duplicate /on_confirm" 
          description="Inject multiple identical confirm callbacks to test network idempotency rules." 
          enabled={duplicateConfirm} 
          onChange={setDuplicateConfirm}
          colorClass="bg-orange-500"
        />
      </section>

      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">01 / Execution Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-zinc-500 hover:text-white transition-colors font-mono text-[11px]" onClick={() => setLogs([])}>Clear</button>
          </div>
        </div>

        <div className="relative rounded-xl bg-[#09090b] border border-white/[0.08] p-4 shadow-inner overflow-hidden min-h-[320px] flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div 
            ref={terminalRef}
            className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] md:text-[12px]"
          >
            {logs.length === 0 ? (
              <div className="text-zinc-600 h-full flex items-center justify-center italic">
                Waiting for execution...
              </div>
            ) : (
              logs.map((log, i) => {
                let colorClass = "text-zinc-300";
                if (log.level === 'warn') colorClass = "text-orange-400";
                if (log.level === 'error') colorClass = "text-rose-400";
                if (log.level === 'success') colorClass = "text-emerald-400";
                if (log.level === 'info') colorClass = "text-zinc-400";
                
                return (
                  <div key={i} className="flex gap-2 font-mono">
                    <span className="text-zinc-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`shrink-0 ${colorClass}`}>[{log.level.toUpperCase()}]</span>
                    <span className={`${log.level === 'error' ? "text-rose-200" : "text-zinc-300"}`}>{log.message}</span>
                  </div>
                );
              })
            )}
            
            {isRunning && (
              <div className="flex items-center gap-2 text-zinc-500 font-mono mt-2">
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
