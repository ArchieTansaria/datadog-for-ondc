import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 w-full">
      {/* SiteHeader */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#08080a]/80 border-b border-subtle transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="Pulse Home" className="flex items-center gap-2.5 group">
              <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span className="text-sm font-semibold tracking-tight text-white font-mono">Pulse</span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded border border-white/10 text-neutral-400 bg-white/[0.02]">ONDC</span>
            </Link>
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
              <a className="text-xs font-normal text-neutral-400 hover:text-white transition-colors duration-150" href="#features">Features</a>
              <a className="text-xs font-normal text-neutral-400 hover:text-white transition-colors duration-150" href="#topology">Architecture</a>
              <a className="text-xs font-normal text-neutral-400 hover:text-white transition-colors duration-150" href="#trace-log">Live Trace</a>
            </nav>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <Link className="hidden sm:inline-block text-neutral-400 hover:text-white transition-colors" href="/login">Sign in</Link>
            <Link className="inline-flex items-center gap-1.5 bg-white text-black px-3.5 py-1.5 rounded-full text-xs font-medium font-sans hover:bg-neutral-200 transition-all duration-150 shadow-sm active:scale-95" href="/dashboard">
              <span>Enter Console</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 16 16">
                <path d="M6 3.5L10.5 8L6 12.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* HeroSection */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 border-b border-subtle overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
        <div className="max-w-[1360px] mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-subtle bg-[#111114] mb-8">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[11px] tracking-wide text-neutral-400">AWS Serverless Engine</span>
            <span className="text-neutral-600">·</span>
            <span className="font-mono text-[11px] tracking-wide text-neutral-300">Demo Ready</span>
          </div>
          <div className="max-w-5xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] font-medium tracking-tightest text-neutral-100">
              <span className="text-white font-semibold">See inside every ONDC order.</span>
              <span className="text-neutral-500 font-normal block sm:inline"> Purpose-built observability for open network commerce.</span>
            </h1>
          </div>
          <p className="mt-8 max-w-2xl text-base md:text-lg text-neutral-400 font-normal leading-relaxed tracking-tight">
            From packet ingestion to state machine resolution, Pulse tracks every transaction, diagnoses SLA breaches in real-time, and surfaces root causes across buyer and seller protocols.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link className="h-10 px-5 rounded-md bg-white text-black text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center hover:bg-neutral-200 transition-colors shadow-sm" href="/dashboard">
              Get Started
            </Link>
            <a className="h-10 px-4 rounded-md border border-subtle bg-transparent text-neutral-300 text-xs font-medium hover:border-neutral-700 hover:text-white transition-all inline-flex items-center gap-1.5" href="#architecture">
              <span>Read Architecture Paper</span>
              <span className="text-neutral-500">↗</span>
            </a>
            <div className="sm:ml-4 flex items-center h-10 px-3.5 rounded-md border border-subtle bg-[#0c0c0e] font-mono text-[11px] text-neutral-300 gap-3 group">
              <span className="text-neutral-500">$</span>
              <span className="select-all">pulse-cli view-incidents</span>
              <button className="text-neutral-500 hover:text-neutral-200 transition-colors" title="Copy to clipboard">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect height="13" rx="2" ry="2" width="13" x="9" y="9"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Matrix */}
      <section className="border-b border-subtle bg-[#08080a]" id="features">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-subtle">
            <div className="p-8 lg:p-10 flex flex-col justify-between group hover:bg-[#0c0c0f] transition-colors duration-200">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[11px] text-neutral-500 tracking-widest uppercase">FIG 0.1</span>
                  <span className="font-mono text-[10px] text-neutral-600">STATE_STACK</span>
                </div>
                <div className="w-full h-56 flex items-center justify-center relative my-4">
                  <svg className="w-64 h-52 stroke-neutral-500 group-hover:stroke-neutral-300 transition-colors duration-300" fill="none" strokeWidth="1.1" viewBox="0 0 240 200">
                    <path d="M120 180 L30 135 L120 90 L210 135 Z" strokeDasharray="2 2" strokeOpacity="0.3"></path>
                    <path d="M30 135 L30 148 L120 193 L210 148 L210 135" strokeOpacity="0.4"></path>
                    <path d="M30 115 L30 128 L120 173 L210 128 L210 115" strokeOpacity="0.6"></path>
                    <path d="M30 95 L30 108 L120 153 L210 108 L210 95" strokeOpacity="0.8"></path>
                    <path d="M120 60 L30 105 L120 150 L210 105 Z" fill="#111114" fillOpacity="0.6" stroke="white" strokeWidth="1.3"></path>
                    <ellipse cx="120" cy="105" rx="38" ry="18" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.9"></ellipse>
                    <line stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.9" x1="86" x2="154" y1="105" y2="105"></line>
                    <line stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.9" x1="92" x2="148" y1="109" y2="109"></line>
                    <line stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.9" x1="99" x2="141" y1="113" y2="113"></line>
                  </svg>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-base font-medium tracking-tight text-white mb-2">Full-Lifecycle Tracing</h3>
                <p className="text-xs leading-relaxed text-neutral-400 font-normal">
                  Inspect state transitions across every participant — from /search to /confirm and logistics handoff with millisecond-level precision.
                </p>
              </div>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between group hover:bg-[#0c0c0f] transition-colors duration-200">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[11px] text-neutral-500 tracking-widest uppercase">FIG 0.2</span>
                  <span className="font-mono text-[10px] text-neutral-600">SLA_ENGINE</span>
                </div>
                <div className="w-full h-56 flex items-center justify-center relative my-4">
                  <svg className="w-64 h-52 stroke-neutral-500 group-hover:stroke-neutral-300 transition-colors duration-300" fill="none" strokeWidth="1.1" viewBox="0 0 240 200">
                    <g transform="translate(100, 30)">
                      <path d="M20 0 L40 10 L20 20 L0 10 Z" fill="#121214" stroke="white" strokeWidth="1.2"></path>
                      <path d="M0 10 L0 26 L20 36 L40 26 L40 10" stroke="white" strokeWidth="1.1"></path>
                      <line stroke="white" strokeWidth="1.1" x1="20" x2="20" y1="20" y2="36"></line>
                      <circle cx="20" cy="10" fill="white" r="1.5"></circle>
                    </g>
                    <g transform="translate(30, 80)">
                      <path d="M25 0 L50 12 L25 24 L0 12 Z" fill="#121214"></path>
                      <path d="M0 12 L0 34 L25 46 L50 34 L50 12"></path>
                      <line x1="25" x2="25" y1="24" y2="46"></line>
                    </g>
                    <g transform="translate(145, 85)">
                      <path d="M25 0 L50 12 L25 24 L0 12 Z" fill="#121214"></path>
                      <path d="M0 12 L0 34 L25 46 L50 34 L50 12"></path>
                      <line x1="25" x2="25" y1="24" y2="46"></line>
                    </g>
                    <g transform="translate(90, 120)">
                      <path d="M30 0 L60 15 L30 30 L0 15 Z" fill="#151518" stroke="white" strokeWidth="1.2"></path>
                      <path d="M0 15 L0 42 L30 57 L60 42 L60 15" stroke="white" strokeWidth="1.2"></path>
                      <line stroke="white" strokeWidth="1.2" x1="30" x2="30" y1="30" y2="57"></line>
                      <circle cx="26" cy="13" fill="#71717a" r="1"></circle>
                      <circle cx="30" cy="15" fill="#71717a" r="1"></circle>
                      <circle cx="34" cy="17" fill="#71717a" r="1"></circle>
                    </g>
                    <line strokeDasharray="2 3" strokeOpacity="0.4" x1="120" x2="55" y1="66" y2="92"></line>
                    <line strokeDasharray="2 3" strokeOpacity="0.4" x1="120" x2="170" y1="66" y2="97"></line>
                    <line strokeDasharray="2 3" strokeOpacity="0.4" x1="55" x2="120" y1="126" y2="135"></line>
                    <line strokeDasharray="2 3" strokeOpacity="0.4" x1="170" x2="150" y1="131" y2="140"></line>
                  </svg>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-base font-medium tracking-tight text-white mb-2">State Machine Integrity</h3>
                <p className="text-xs leading-relaxed text-neutral-400 font-normal">
                  Real-time state validation against ONDC specifications. Pinpoints missing callbacks, invalid transitions, and SLA latency breaches instantly.
                </p>
              </div>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between group hover:bg-[#0c0c0f] transition-colors duration-200">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[11px] text-neutral-500 tracking-widest uppercase">FIG 0.3</span>
                  <span className="font-mono text-[10px] text-neutral-600">AI_EXPLAINER</span>
                </div>
                <div className="w-full h-56 flex items-center justify-center relative my-4">
                  <svg className="w-64 h-52 stroke-neutral-500 group-hover:stroke-neutral-300 transition-colors duration-300" fill="none" strokeWidth="1.1" viewBox="0 0 240 200">
                    <g opacity="0.4">
                      <path d="M190 60 L215 72 L215 130 L190 118 Z"></path>
                      <path d="M175 70 L200 82 L200 140 L175 128 Z"></path>
                      <path d="M160 80 L185 92 L185 150 L160 138 Z"></path>
                    </g>
                    <g opacity="0.7">
                      <path d="M145 90 L170 102 L170 160 L145 148 Z"></path>
                      <path d="M130 100 L155 112 L155 170 L130 158 Z"></path>
                      <path d="M115 110 L140 122 L140 180 L115 168 Z"></path>
                    </g>
                    <g stroke="white" strokeWidth="1.2">
                      <path d="M100 120 L125 132 L125 190 L100 178 Z" fill="#121214"></path>
                      <path d="M85 130 L110 142 L110 196 L85 184 Z" fill="#141417"></path>
                      <path d="M70 140 L95 152 L95 200 L70 188 Z" fill="#18181c"></path>
                    </g>
                    <line opacity="0.5" stroke="#71717a" strokeDasharray="3 3" strokeWidth="0.8" x1="20" x2="220" y1="180" y2="80"></line>
                    <circle cx="125" cy="132" fill="white" r="2"></circle>
                  </svg>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-base font-medium tracking-tight text-white mb-2">AI-Powered Explanations</h3>
                <p className="text-xs leading-relaxed text-neutral-400 font-normal">
                  Eliminate hours of manual log parsing. Bedrock-powered models isolate cascading bottlenecks and auto-suggest corrective protocol actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DeploymentGrid */}
      <section className="py-24 border-b border-subtle bg-[#08080a]" id="topology">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-3">02 / AWS ARCHITECTURE</div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
              Cloud-native ingestion, built for infinite scale.
            </h2>
            <p className="mt-4 text-sm text-neutral-400 font-normal leading-relaxed">
              We build scalable serverless pipelines running entirely in your AWS environment. Seamlessly process massive flash sales with zero operations overhead.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-subtle bg-[#0c0c0e] p-7 flex flex-col justify-between relative group hover:border-neutral-700 transition-colors">
              <span className="absolute top-2 left-2 text-neutral-700 font-mono text-[10px]">┌</span>
              <span className="absolute top-2 right-2 text-neutral-700 font-mono text-[10px]">┐</span>
              <span className="absolute bottom-2 left-2 text-neutral-700 font-mono text-[10px]">└</span>
              <span className="absolute bottom-2 right-2 text-neutral-700 font-mono text-[10px]">┘</span>
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-6">
                  <span className="font-medium text-white">API Gateway Ingestion</span>
                  <span className="text-neutral-600">001</span>
                </div>
                <div className="py-8 flex justify-center items-center">
                  <svg className="w-36 h-36 stroke-neutral-400 group-hover:stroke-white transition-colors" fill="none" strokeWidth="1" viewBox="0 0 100 100">
                    <polygon points="50 15 85 30 50 45 15 30" strokeWidth="1.2"></polygon>
                    <polygon points="50 35 85 50 50 65 15 50"></polygon>
                    <polygon points="50 55 85 70 50 85 15 70"></polygon>
                    <line x1="15" x2="15" y1="30" y2="70"></line>
                    <line x1="85" x2="85" y1="30" y2="70"></line>
                    <line x1="50" x2="50" y1="45" y2="85"></line>
                    <circle cx="50" cy="30" fill="currentColor" r="1"></circle>
                    <circle cx="50" cy="50" fill="currentColor" r="1"></circle>
                    <circle cx="50" cy="70" fill="currentColor" r="1"></circle>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                Direct payload ingestion via Amazon API Gateway with millisecond latency.
              </p>
            </div>

            <div className="border border-subtle bg-[#0c0c0e] p-7 flex flex-col justify-between relative group hover:border-neutral-700 transition-colors">
              <span className="absolute top-2 left-2 text-neutral-700 font-mono text-[10px]">┌</span>
              <span className="absolute top-2 right-2 text-neutral-700 font-mono text-[10px]">┐</span>
              <span className="absolute bottom-2 left-2 text-neutral-700 font-mono text-[10px]">└</span>
              <span className="absolute bottom-2 right-2 text-neutral-700 font-mono text-[10px]">┘</span>
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-6">
                  <span className="font-medium text-white">Event-Driven Pipeline</span>
                  <span className="text-neutral-600">002</span>
                </div>
                <div className="py-8 flex justify-center items-center">
                  <svg className="w-36 h-36 stroke-neutral-400 group-hover:stroke-white transition-colors" fill="none" strokeWidth="1" viewBox="0 0 100 100">
                    <polygon points="50 15 85 32 85 68 50 85 15 68 15 32" strokeDasharray="2 2"></polygon>
                    <polygon points="50 28 72 40 72 60 50 72 28 60 28 40" strokeWidth="1.2"></polygon>
                    <circle cx="50" cy="50" fill="#141418" r="4" stroke="currentColor"></circle>
                    <line strokeOpacity="0.5" x1="50" x2="50" y1="15" y2="28"></line>
                    <line strokeOpacity="0.5" x1="85" x2="72" y1="68" y2="60"></line>
                    <line strokeOpacity="0.5" x1="15" x2="28" y1="68" y2="60"></line>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                Decoupled state processing using EventBridge, SQS, and AWS Lambda.
              </p>
            </div>

            <div className="border border-subtle bg-[#0c0c0e] p-7 flex flex-col justify-between relative group hover:border-neutral-700 transition-colors">
              <span className="absolute top-2 left-2 text-neutral-700 font-mono text-[10px]">┌</span>
              <span className="absolute top-2 right-2 text-neutral-700 font-mono text-[10px]">┐</span>
              <span className="absolute bottom-2 left-2 text-neutral-700 font-mono text-[10px]">└</span>
              <span className="absolute bottom-2 right-2 text-neutral-700 font-mono text-[10px]">┘</span>
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-6">
                  <span className="font-medium text-white">Aurora Canonical Storage</span>
                  <span className="text-neutral-600">003</span>
                </div>
                <div className="py-8 flex justify-center items-center">
                  <svg className="w-36 h-36 stroke-neutral-400 group-hover:stroke-white transition-colors" fill="none" strokeWidth="1" viewBox="0 0 100 100">
                    <polygon points="25 30 75 30 75 62 25 62" strokeWidth="1.1"></polygon>
                    <polygon points="15 72 85 72 75 62 25 62"></polygon>
                    <line strokeWidth="1.2" x1="32" x2="44" y1="42" y2="42"></line>
                    <line strokeDasharray="1.5 1.5" x1="32" x2="68" y1="50" y2="50"></line>
                    <line strokeWidth="1.5" x1="45" x2="55" y1="67" y2="67"></line>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                Unified order state machine tracking backed by highly available Aurora PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LiveTraceConsole */}
      <section className="py-20 border-b border-subtle bg-[#08080a]" id="trace-log">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-2">TELEMETRY STREAM</div>
              <h3 className="text-2xl font-normal tracking-tight text-white">Deterministic ONDC protocol tracing</h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131317] border border-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>NETWORK: LIVE (GATEWAY_BLR_04)</span>
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-subtle bg-[#0b0b0e] overflow-hidden font-mono text-xs leading-relaxed shadow-2xl">
            <div className="px-4 py-3 bg-[#111115] border-b border-subtle flex items-center justify-between text-neutral-400 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
                <span className="ml-2 text-neutral-400 text-[11px]">session_id: tx_9281a0b3f_prod</span>
              </div>
              <div className="text-[11px] text-neutral-500">FILTER: error,warn,crit</div>
            </div>
            <div className="p-5 space-y-3 divide-y divide-white/[0.03] overflow-x-auto text-[11px] md:text-xs">
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-neutral-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-600">14:02:11.004</span>
                  <span className="text-emerald-400 font-medium">POST</span>
                  <span className="text-white">/search</span>
                  <span className="text-neutral-500">domain:nic2004:52110</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-500 text-[11px]">
                  <span>ttl: 30s</span>
                  <span className="text-emerald-400/80">ACK [200 OK]</span>
                  <span className="font-mono text-neutral-400">12ms</span>
                </div>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-neutral-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-600">14:02:11.412</span>
                  <span className="text-emerald-400 font-medium">POST</span>
                  <span className="text-white">/on_search</span>
                  <span className="text-neutral-500">bpp_id: seller-network.cloud</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-500 text-[11px]">
                  <span>items: 48</span>
                  <span className="text-emerald-400/80">ACK [200 OK]</span>
                  <span className="font-mono text-neutral-400">42ms</span>
                </div>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-neutral-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-600">14:02:13.190</span>
                  <span className="text-neutral-300 font-medium">POST</span>
                  <span className="text-white">/init</span>
                  <span className="text-neutral-500">settlement:NEFT</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-500 text-[11px]">
                  <span>sig: ed25519_valid</span>
                  <span className="text-emerald-400/80">ACK [200 OK]</span>
                  <span className="font-mono text-neutral-400">18ms</span>
                </div>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-rose-950/20 px-3 py-2 -mx-3 rounded border border-rose-500/20 text-neutral-300 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">14:02:18.902</span>
                  <span className="text-rose-400 font-semibold">[TIMEOUT]</span>
                  <span className="text-white">/on_confirm</span>
                  <span className="text-rose-300/80">LSP callback missing (&gt;120s SLA violation)</span>
                </div>
                <div className="flex items-center gap-3 text-rose-300 text-[11px]">
                  <Link href="/dashboard/incidents" className="underline cursor-pointer hover:text-white">Explain with Bedrock ↗</Link>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">CRIT_30002</span>
                </div>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-neutral-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-600">14:02:19.010</span>
                  <span className="text-cyan-400 font-medium">INCIDENT</span>
                  <span className="text-white">/record</span>
                  <span className="text-neutral-500">flagged missing assignment for Order ID: ORDER123</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-500 text-[11px]">
                  <span className="text-cyan-400">STORED_AURORA</span>
                  <span className="font-mono text-neutral-400">9ms</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-2.5 bg-[#09090c] border-t border-subtle flex items-center justify-between text-[11px] text-neutral-500">
              <span>Buffer: 100,000 evt/sec</span>
              <span>ONDC Retail Spec: v1.2.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* ArchitectureSpecs */}
      <section className="py-24 border-b border-subtle bg-[#08080a]" id="architecture">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-3">03 / PERFORMANCE INVARIANTS</div>
              <h3 className="text-3xl font-normal tracking-tight text-white leading-tight">
                Engineered for uncompromising high throughput.
              </h3>
              <p className="mt-4 text-sm text-neutral-400 font-normal leading-relaxed">
                Open commerce networks experience massive transaction spikes during flash sales and category drops. Pulse processes protocol frames through scalable pipelines with guaranteed latency thresholds.
              </p>
              <div className="mt-8 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-2.5 border-b border-subtle">
                  <span className="text-neutral-400">Architecture</span>
                  <span className="text-white">Fully Serverless</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-subtle">
                  <span className="text-neutral-400">Storage Engine</span>
                  <span className="text-white">Aurora PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-subtle">
                  <span className="text-neutral-400">ML Engine</span>
                  <span className="text-white">Amazon Bedrock</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border border-subtle bg-[#0c0c0e] p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-neutral-500 uppercase">Event Fidelity</span>
                  <div className="text-3xl font-medium tracking-tight text-white mt-4 font-mono">99.99%</div>
                </div>
                <p className="mt-6 text-[11px] text-neutral-500 font-mono">Guaranteed delivery with SQS and EventBridge.</p>
              </div>
              <div className="border border-subtle bg-[#0c0c0e] p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-neutral-500 uppercase">Processing Lag</span>
                  <div className="text-3xl font-medium tracking-tight text-white mt-4 font-mono">&lt; 15ms</div>
                </div>
                <p className="mt-6 text-[11px] text-neutral-500 font-mono">State machine validation with API Gateway.</p>
              </div>
              <div className="border border-subtle bg-[#0c0c0e] p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-neutral-500 uppercase">Order Scale</span>
                  <div className="text-3xl font-medium tracking-tight text-white mt-4 font-mono">20M+</div>
                </div>
                <p className="mt-6 text-[11px] text-neutral-500 font-mono">Daily transactions monitored across grocery, retail & mobility.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MinimalCallToAction */}
      <section className="py-24 bg-[#08080a] relative" id="console">
        <div className="max-w-[1360px] mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Ready to gain full visibility into your ONDC orders?
          </h2>
          <p className="mt-4 text-sm text-neutral-400 max-w-lg mx-auto font-normal">
            Deploy Pulse into your AWS environment in under 15 minutes. Start diagnosing schema drift and callback drops today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link className="h-10 px-6 rounded-md bg-white text-black text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center hover:bg-neutral-200 transition-colors shadow-sm" href="/dashboard">
              Enter Dashboard
            </Link>
            <Link className="h-10 px-6 rounded-md border border-subtle bg-[#0f0f12] text-neutral-300 text-xs font-medium hover:border-neutral-700 hover:text-white transition-all inline-flex items-center justify-center" href="/dashboard/simulate">
              Run Demo Simulation
            </Link>
          </div>
        </div>
      </section>

      {/* SiteFooter */}
      <footer className="border-t border-subtle bg-[#070709] py-12 text-neutral-500 font-mono text-xs">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-subtle">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span className="text-white font-medium">Pulse Systems</span>
              </div>
              <span className="text-neutral-700">|</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-neutral-400 text-[11px]">AWS Stack Nominal</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-[11px] text-neutral-400">
              <a className="hover:text-white transition-colors" href="#">ONDC v1.2 Spec</a>
              <a className="hover:text-white transition-colors" href="#">AWS CDK</a>
              <a className="hover:text-white transition-colors" href="#">GitHub</a>
              <a className="hover:text-white transition-colors" href="#">Privacy</a>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-neutral-600">
            <p>© 2026 Pulse Network Observability Inc. Built for Open Network for Digital Commerce.</p>
            <p className="font-mono">core.ondc.v1.2 // serverless</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
