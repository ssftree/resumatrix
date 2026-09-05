import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Terminal, 
  Zap, 
  Wifi, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  ExternalLink, 
  Github, 
  Copy, 
  Check, 
  Mail, 
  BarChart3, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Layers,
  Radio
} from 'lucide-react';
import { AppTemplate, PortfolioConfig } from '../../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../portfolio.config';
import { safeExternalHref } from '../../utils/url';

interface TelemetryViewProps {
  config?: PortfolioConfig;
  onSwitchTemplate: (tpl: AppTemplate) => void;
  onOpenResumeModal?: () => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  config = DEFAULT_PORTFOLIO_CONFIG,
  onSwitchTemplate,
  onOpenResumeModal,
}) => {
  const profile = config.profile || DEFAULT_PORTFOLIO_CONFIG.profile;
  const contact = config.contact || DEFAULT_PORTFOLIO_CONFIG.contact;
  const skills = config.skills || DEFAULT_PORTFOLIO_CONFIG.skills;
  const experience = config.experience || DEFAULT_PORTFOLIO_CONFIG.experience;
  const projects = config.projects || DEFAULT_PORTFOLIO_CONFIG.projects;
  const system = config.system || DEFAULT_PORTFOLIO_CONFIG.system;

  const [tick, setTick] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState<number>(0);
  const [selectedClusterPod, setSelectedClusterPod] = useState<string>(skills[0]?.title || '');

  // Periodic heartbeat tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Generate simulated dynamic time-series data for the SVG telemetry chart
  const pointsCount = 24;
  const chartData = Array.from({ length: pointsCount }, (_, i) => {
    const base = 40 + Math.sin(i * 0.4 + tick * 0.2) * 20 + Math.cos(i * 0.8) * 15;
    return Math.max(15, Math.min(95, Math.round(base)));
  });

  const svgPoints = chartData
    .map((val, idx) => {
      const x = (idx / (pointsCount - 1)) * 500;
      const y = 140 - (val / 100) * 120;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,140 ${svgPoints} 500,140`;

  return (
    <div className="w-full min-h-screen bg-[#0b0f17] text-neutral-200 font-mono select-none antialiased pb-16">
      {/* Top Telemetry Ops Bar */}
      <header className="sticky top-0 z-30 bg-[#0d131f]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Left Cluster Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-white tracking-wider">
                ENGINEER_METRICS :: {profile.name.toUpperCase().replace(/\s+/g, '_')}
              </span>
            </div>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800 text-[11px]">
              CLUSTER: <strong className="text-emerald-400">prod-us-east-1</strong>
            </span>
            <span className="hidden sm:inline-block text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800 text-[11px]">
              SCRAPE_RATE: <strong className="text-cyan-400">15s</strong>
            </span>
          </div>

          {/* Right Status & Quick Jump */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SLA 99.99% • ALL SYSTEMS HEALTHY</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-neutral-400">
              <Clock className="w-3 h-3 text-neutral-500" />
              <span>UPTIME: {system.uptime || '2,190d 14h'}</span>
            </div>

            <button
              onClick={() => onSwitchTemplate('terminal')}
              className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1 transition-colors"
              title="Switch to CLI Terminal"
            >
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>CLI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        
        {/* ROW 1: PRIMARY TELEMETRY GAUGES */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* SLA Card */}
          <div className="p-4 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> System SLA
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/50">
                NOMINAL
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              99.998<span className="text-emerald-400 text-lg">%</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
              <span>Zero unplanned downtime in production</span>
            </p>
          </div>

          {/* QPS / Velocity Card */}
          <div className="p-4 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Commit / Fix Rate
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/50 px-1.5 py-0.2 rounded border border-cyan-800/50">
                +18.4% QPS
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              142.6 <span className="text-cyan-400 text-lg">req/min</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              High-velocity feature delivery & bug slaying
            </p>
          </div>

          {/* Turnaround Latency Card */}
          <div className="p-4 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> P99 Latency
              </span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/50">
                LOW JITTER
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              35 <span className="text-amber-400 text-lg">ms</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Rapid incident response & code turnarounds
            </p>
          </div>

          {/* Cluster Microservices Count */}
          <div className="p-4 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-purple-400" /> Active Pods
              </span>
              <span className="text-[10px] text-purple-400 font-bold bg-purple-950/50 px-1.5 py-0.2 rounded border border-purple-800/50">
                ONLINE
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              {skills.reduce((acc, c) => acc + c.skills.length, 0)} <span className="text-purple-400 text-lg">skills</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Multi-cluster full-stack capabilities
            </p>
          </div>
        </section>

        {/* ROW 2: LIVE METRIC TIME-SERIES & RESOURCE ALLOCATION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Grafana Telemetry Chart */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>METRIC: problem_solving_throughput_24h</span>
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Real-time engineering problem resolution & code execution velocity
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  LIVE STREAMING
                </span>
                <span className="text-neutral-500 font-mono text-[10px]">P95: 114 req/m</span>
              </div>
            </div>

            {/* SVG Waveform Visualizer */}
            <div className="relative w-full h-44 bg-[#090d16] rounded-lg border border-neutral-800/80 p-2 overflow-hidden flex flex-col justify-end">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-neutral-500" />
                ))}
              </div>

              <svg className="w-full h-32 overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Fill Area */}
                <polygon points={areaPoints} fill="url(#telemetryGrad)" />

                {/* Main Stroke */}
                <polyline
                  points={svgPoints}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Bottom timeline indicators */}
              <div className="flex justify-between text-[10px] text-neutral-500 pt-1 font-mono">
                <span>T-24h</span>
                <span>T-18h</span>
                <span>T-12h</span>
                <span>T-6h</span>
                <span>NOW (LIVE)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs pt-1">
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase">Avg Response</div>
                <div className="font-bold text-white text-sm mt-0.5">18.4 min</div>
              </div>
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase">Error Budget Left</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">99.8%</div>
              </div>
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase">Architecture Cache</div>
                <div className="font-bold text-cyan-400 text-sm mt-0.5">96.2% Hit</div>
              </div>
            </div>
          </div>

          {/* Cognitive Load & Energy Allocation (CPU/RAM) */}
          <div className="p-5 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg space-y-4">
            <div className="border-b border-neutral-800/80 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>RESOURCE_QUOTA :: Energy Alloc</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Current mental CPU/RAM distribution by engineering domain
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-neutral-300 text-[11px] mb-1">
                  <span className="font-semibold">Full-Stack & Distributed Systems</span>
                  <span className="font-mono text-cyan-400 font-bold">45%</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-900 overflow-hidden border border-neutral-800">
                  <div className="h-full bg-cyan-500 rounded" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 text-[11px] mb-1">
                  <span className="font-semibold">Low-Latency Tools & Systems (Go/Rust)</span>
                  <span className="font-mono text-emerald-400 font-bold">30%</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-900 overflow-hidden border border-neutral-800">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 text-[11px] mb-1">
                  <span className="font-semibold">AI Architecture & Vector Pipelines</span>
                  <span className="font-mono text-purple-400 font-bold">15%</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-900 overflow-hidden border border-neutral-800">
                  <div className="h-full bg-purple-500 rounded" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 text-[11px] mb-1">
                  <span className="font-semibold">Mentorship & OSS Craftsmanship</span>
                  <span className="font-mono text-amber-400 font-bold">10%</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-900 overflow-hidden border border-neutral-800">
                  <div className="h-full bg-amber-500 rounded" style={{ width: '10%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] space-y-1 text-neutral-400">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Radio className="w-3 h-3 text-emerald-400" /> Operational Status
              </div>
              <p className="text-neutral-400">
                {profile.status} • High concurrency bandwidth available for challenging technical roadmaps.
              </p>
            </div>
          </div>
        </section>

        {/* ROW 3: SKILLS AS MICROSERVICES (CLUSTER POD TOPOLOGY) */}
        <section className="p-5 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                <span>CLUSTER_NODES :: Microservice Capabilities</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Each skill pod represents an operational service runtime in production
              </p>
            </div>
            <span className="text-[11px] text-neutral-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
              Total Pods: <strong className="text-white">{skills.length} Categories</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map((cat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#0c101a] border border-neutral-800 hover:border-neutral-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-xs text-white truncate max-w-[130px]">{cat.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                    200 OK
                  </span>
                </div>

                <div className="space-y-1.5">
                  {cat.skills.map((s, sIdx) => (
                    <div key={sIdx} className="space-y-0.5">
                      <div className="flex justify-between text-[11px] text-neutral-300">
                        <span>{s.name}</span>
                        <span className="font-mono text-neutral-400 text-[10px]">{s.level}% capacity</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex justify-between text-[10px] text-neutral-500 font-mono border-t border-neutral-900">
                  <span>P99: {12 + idx * 4}ms</span>
                  <span>Uptime: 100%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ROW 4: PROJECTS AS PRODUCTION INGRESS DEPLOYMENTS */}
        <section className="p-5 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>INGRESS_ROUTES :: Production Deployed Workloads ({projects.length})</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Active user-facing software systems with live telemetry
              </p>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
              TRAFFIC: HEALTHY (0.00% ERRORS)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-lg bg-[#0c101a] border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        HTTP 200
                      </span>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        {p.title}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{p.tagline}</p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {p.year}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{p.description}</p>

                {/* Highlights telemetry */}
                <div className="p-2.5 rounded bg-black/40 border border-neutral-800/80 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    SLA & Impact Highlights:
                  </div>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 list-disc pl-4">
                    {p.highlights.slice(0, 2).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Stars: {p.stars || 120}+ • Latency: &lt;30ms
                  </span>
                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a
                        href={safeExternalHref(p.githubUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
                      >
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={safeExternalHref(p.demoUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ROW 5: CAREER MILESTONES AS DISTRIBUTED TRACES */}
        <section className="p-5 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>TRACE_SPAN_VIEWER :: Career Execution Chronology</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Audit trail of organizational impact and engineering leadership
              </p>
            </div>
            {onOpenResumeModal && (
              <button
                onClick={onOpenResumeModal}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs flex items-center gap-1.5 transition-colors self-start"
              >
                <span>Export Formal CV</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {experience.map((exp, idx) => {
              const isSelected = selectedSpan === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSpan(idx)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f1624] border-amber-500/50 shadow-md'
                      : 'bg-[#0c101a] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                        SPAN_0{idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        {exp.role} <span className="text-neutral-400 font-normal">@ {exp.company}</span>
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
                      <span>{exp.period}</span>
                      <span className="text-neutral-600">•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Span Details */}
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{exp.description}</p>

                  <div className="mt-3 pt-2 border-t border-neutral-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Production Impact:</div>
                    <ul className="text-xs text-neutral-300 space-y-1 list-disc pl-4">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.skills.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 text-[10px] font-mono"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROW 6: INCIDENT CHANNEL / CONTACT DISPATCH */}
        <section className="p-5 rounded-xl bg-[#111827]/70 border border-neutral-800/90 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>ALERT_CHANNEL :: Direct Engineering Dispatch</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Reach out to trigger an on-call collaboration or explore technical partnerships
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              CHANNEL OPEN
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-[#0c101a] border border-neutral-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-mono">PRIMARY INBOX:</div>
                <div className="font-bold text-sm text-white font-mono">{contact.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.email);
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Endpoint'}</span>
              </button>

              <a
                href={`mailto:${contact.email}`}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <span>Dispatch Email</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
