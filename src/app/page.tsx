"use client";

import React, { useState, useEffect } from "react";
import { useAppStore, sampleCompanies } from "@/stores/useAppStore";
import { getAnalyticsEvents, AnalyticsEvent } from "@/features/analytics/analytics";
import { AgentInsightPanel } from "@/features/explainability-ui/agent-insight-panel";
import {
  Bot,
  Building2,
  Sparkles,
  User,
  Target,
  HelpCircle,
  Activity,
  FileText,
  Settings,
  Brain,
  Compass,
  TrendingUp,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  ChevronRight,
  Menu,
  X,
  Plus,
  Search,
  Zap,
  Network,
  ShieldAlert,
} from "lucide-react";

export default function Dashboard() {
  const {
    companyContext,
    recruiterPersona,
    candidates,
    activeCandidateId,
    plannerState,
    messages,
    journalEntries,
    actionExplanation,
    activeReasoningTrace,
    activeConfidenceResult,
    generatedResponse,
    multiAgentResults,
    coordinatorRecommendation,
    analysisError,
    setActiveCandidateId,
    addMessage,
    addJournalEntry,
    setPlannerState,
    bootstrapAgent,
    processCandidateMessage,
  } = useAppStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"intelligence" | "chat">("intelligence");
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getAnalyticsEvents());
  }, [messages, multiAgentResults]);

  // Get active candidate details
  const activeCandidate = candidates.find((c) => c.id === activeCandidateId) || candidates[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    processCandidateMessage(activeCandidate.id, chatInput);
    setChatInput("");
  };

  // Helper for RecommendationType badge color
  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case "ADDRESS_OBJECTION":  return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "ASK_COMPENSATION":   return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "ASK_REMOTE":         return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "QUALIFY_EXPERIENCE": return "bg-violet-500/20 text-violet-300 border-violet-500/30";
      case "BOOK_CALL":          return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default:                   return "bg-slate-700/40 text-slate-300 border-slate-600/40";
    }
  };

  // Role → icon + accent
  const getAgentMeta = (role: string) => {
    switch (role) {
      case "SOURCER":    return { icon: <Search className="h-3.5 w-3.5" />, accent: "text-blue-400", border: "border-blue-500/20" };
      case "QUALIFIER":  return { icon: <Target className="h-3.5 w-3.5" />, accent: "text-violet-400", border: "border-violet-500/20" };
      case "ENGAGEMENT": return { icon: <Zap className="h-3.5 w-3.5" />, accent: "text-emerald-400", border: "border-emerald-500/20" };
      default:           return { icon: <Brain className="h-3.5 w-3.5" />, accent: "text-slate-400", border: "border-slate-600/20" };
    }
  };

  // Helper for score color coding
  const getScoreColor = (score: number, type: "positive" | "negative" = "positive") => {
    if (type === "positive") {
      if (score >= 85) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      if (score >= 70) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    } else {
      if (score >= 70) return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      if (score >= 40) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0D14]">
      {/* MOBILE HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F131E] border-b border-slate-800 w-full md:hidden absolute top-0 z-30 h-16">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-violet-400 animate-pulse" />
          <span className="font-bold text-white tracking-wider text-sm">PSVIEW AGENT STUDIO</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md text-slate-400 hover:text-white focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0E121B] border-r border-slate-900 flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-900/50 bg-[#0F131F]">
          <div className="p-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-tight text-sm leading-none">PSVIEW Agent Studio</h1>
            <span className="text-[10px] text-violet-400 font-medium tracking-widest uppercase">Milestone 2</span>
          </div>
        </div>

        {/* Sidebar Navigation Options */}
        <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Bootstrap Agent Context
            </div>
            <div className="flex flex-col gap-1.5">
              {Object.keys(sampleCompanies).map((name) => (
                <button
                  key={name}
                  onClick={() => bootstrapAgent(sampleCompanies[name])}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all border text-left ${
                    companyContext?.companyName === name
                      ? "bg-violet-950/30 border-violet-500/40 text-violet-300 font-semibold"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="truncate font-semibold">{name}</div>
                    <div className="text-[9px] text-slate-500 truncate">
                      {sampleCompanies[name].industry}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Selection List */}
          <div>
            <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Candidate Pool
            </div>
            <div className="flex flex-col gap-1">
              {candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => {
                    setActiveCandidateId(candidate.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
                    candidate.id === activeCandidateId
                      ? "bg-violet-900/20 border border-violet-500/30 text-slate-100 font-medium"
                      : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-1 rounded bg-slate-800 text-slate-300">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs truncate">{candidate.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{candidate.title}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recruiter Persona Details */}
        {recruiterPersona && (
          <div className="p-4 border-t border-slate-900/80 bg-[#0A0D14]/80">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2.5">
              Active Agent Identity
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-xs">
                  {recruiterPersona.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{recruiterPersona.name}</div>
                  <div className="text-[9px] text-slate-400 truncate">{recruiterPersona.role}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-800/40 pt-2">
                <strong>Tone:</strong> {recruiterPersona.communicationStyle}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] text-emerald-400 font-mono tracking-wider">
                  STAGE: {plannerState?.stage}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        {/* HEADER BAR */}
        <header className="h-16 bg-[#0E121B] border-b border-slate-900 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden md:inline">
              Recruiting Intelligence Terminal
            </span>
            <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Target Role:</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-violet-400 font-medium font-mono text-[11px]">
                {activeCandidate.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Planner Stream:</span>
              <span className="text-emerald-400 font-mono font-medium">ONLINE</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* TOP CARDS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Company Mission card */}
            <div className="bg-[#0E121B]/40 backdrop-blur border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Building2 className="h-4 w-4 text-violet-400" />
                <span>Mission & Focus</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light flex-1">
                &ldquo;{companyContext?.mission}&rdquo;
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-900/50">
                {companyContext?.cultureTraits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800/80 text-slate-400"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Recruiter Persona Details */}
            <div className="bg-[#0E121B]/40 backdrop-blur border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Bot className="h-4 w-4 text-emerald-400" />
                <span>Persona Objective</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light flex-1">
                {recruiterPersona?.objective}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-900/50 flex justify-between items-center text-[10px] text-slate-400">
                <span>Tone Style:</span>
                <span className="font-mono text-violet-400">{recruiterPersona?.communicationStyle}</span>
              </div>
            </div>

            {/* Current System Phase Card */}
            <div className="bg-[#0E121B]/40 backdrop-blur border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Target className="h-4 w-4 text-amber-400" />
                <span>Autonomous Pipeline</span>
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Candidate:</span>
                  <span className="text-slate-200 font-medium">{activeCandidate.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active Phase:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono text-[10px] font-bold">
                    {plannerState?.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Search Confidence:</span>
                  <span className="text-emerald-400 font-mono font-bold">{plannerState?.confidence}%</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Status Check:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Optimal
                </span>
              </div>
            </div>
          </div>

          {/* MAIN GRID WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDE: CANDIDATE INTELLIGENCE OR CHAT */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-[#0E121B]/30 p-1.5 rounded-lg border">
                <button
                  onClick={() => setActiveTab("intelligence")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "intelligence"
                      ? "bg-slate-800 text-slate-100 border-slate-700 shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Candidate Intelligence Profile
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "chat"
                      ? "bg-slate-800 text-slate-100 border-slate-700 shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  Agent Chat Log
                </button>
              </div>

              {activeTab === "intelligence" ? (
                /* INTELLIGENCE VIEW */
                <div className="space-y-6">
                  {/* Candidate Overview Header Card */}
                  <div className="bg-[#0E121B]/80 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-violet-600/5 rounded-full blur-3xl"></div>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-lg">
                        {activeCandidate.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-100">{activeCandidate.name}</h2>
                        <p className="text-xs text-slate-400">{activeCandidate.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{activeCandidate.company}</p>
                      </div>
                    </div>

                    {/* Gauges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-900/60">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Interest Score</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border ${getScoreColor(activeCandidate.interestScore)}`}>
                            {activeCandidate.interestScore}%
                          </span>
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${activeCandidate.interestScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Role Fit</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border ${getScoreColor(activeCandidate.roleFit)}`}>
                            {activeCandidate.roleFit}%
                          </span>
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className="bg-violet-500 h-full rounded-full"
                              style={{ width: `${activeCandidate.roleFit}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Startup Appetite</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border ${getScoreColor(activeCandidate.startupAppetite)}`}>
                            {activeCandidate.startupAppetite}%
                          </span>
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className="bg-sky-500 h-full rounded-full"
                              style={{ width: `${activeCandidate.startupAppetite}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Mission Alignment</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border ${getScoreColor(activeCandidate.missionAlignment)}`}>
                            {activeCandidate.missionAlignment}%
                          </span>
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className="bg-purple-500 h-full rounded-full"
                              style={{ width: `${activeCandidate.missionAlignment}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Salary Sensitivity</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border ${getScoreColor(activeCandidate.salarySensitivity, "negative")}`}>
                            {activeCandidate.salarySensitivity}%
                          </span>
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${activeCandidate.salarySensitivity}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Dropout Risk</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border ${getScoreColor(activeCandidate.dropoutRisk, "negative")}`}>
                            {activeCandidate.dropoutRisk}%
                          </span>
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className="bg-rose-500 h-full rounded-full"
                              style={{ width: `${activeCandidate.dropoutRisk}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Observations and Hypotheses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Observations */}
                    <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-xl p-5">
                      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3.5 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        Key Observations
                      </h3>
                      <ul className="space-y-3">
                        {activeCandidate.observations.map((obs, idx) => (
                          <li key={idx} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-blue-500/40">
                            {obs}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hypotheses */}
                    <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-xl p-5">
                      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3.5 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-violet-400" />
                        Formulated Hypotheses
                      </h3>
                      <ul className="space-y-3">
                        {activeCandidate.hypotheses.map((hyp, idx) => (
                          <li key={idx} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-violet-500/40">
                            {hyp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Motivations & Concerns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Motivations */}
                    <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-xl p-5">
                      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3.5 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-emerald-400" />
                        Candidate Motivations
                      </h3>
                      <ul className="space-y-3">
                        {activeCandidate.motivations.map((mot, idx) => (
                          <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 font-mono mt-0.5">•</span>
                            <span>{mot}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Concerns */}
                    <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-xl p-5">
                      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3.5 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                        Identified Concerns
                      </h3>
                      <ul className="space-y-3">
                        {activeCandidate.concerns.map((con, idx) => (
                          <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                            <span className="text-rose-400 font-mono mt-0.5">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                /* CHAT LOG VIEW */
                <div className="bg-[#0E121B]/60 border border-slate-800/80 rounded-2xl flex flex-col h-[520px]">
                  {/* Chat Message Box */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${
                          msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            msg.role === "user"
                              ? "bg-slate-800 text-slate-300 border border-slate-700"
                              : msg.role === "system"
                              ? "bg-slate-900 border border-slate-800 text-slate-500"
                              : "bg-violet-900/30 text-violet-400 border border-violet-500/20"
                          }`}
                        >
                          {msg.role === "user" ? "U" : msg.role === "system" ? "S" : "A"}
                        </div>
                        <div
                          className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                            msg.role === "user"
                              ? "bg-slate-900 border-slate-800 text-slate-200"
                              : msg.role === "system"
                              ? "bg-[#090C12] border-[#101421] text-slate-400 font-mono"
                              : "bg-[#110D1F]/50 border-violet-900/30 text-slate-300"
                          }`}
                        >
                          {msg.content}
                          <div className="text-[9px] text-slate-500 text-right mt-1.5">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-900 bg-[#0C101A]">
                    <div className="flex items-center gap-2 bg-slate-950 rounded-lg border border-slate-800 px-3 py-1.5">
                      <input
                        type="text"
                        placeholder={`Talk to Agent ${recruiterPersona?.name || "Aria Mercer"} about ${activeCandidate.name}...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-100 placeholder-slate-500"
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white transition"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: AUTONOMOUS AGENT PLANNER STATE & THINKING STREAM */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Planner State Card */}
              <div className="bg-[#0E121B]/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="h-4.5 w-4.5 text-amber-400" />
                    <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                      Autonomous Planner State
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                    {plannerState?.stage} PHASE
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* Current Objective */}
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Objective</div>
                    <div className="mt-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-light">
                      {plannerState?.currentObjective}
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Current Reasoning</div>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      {plannerState?.reasoning}
                    </p>
                  </div>

                  {/* Next Planned Action */}
                  <div className="p-3.5 rounded-lg bg-violet-950/10 border border-violet-500/30">
                    <div className="text-[10px] text-violet-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
                      Next Action Hypothesis
                    </div>
                    <div className="mt-1.5 text-xs text-slate-200 leading-relaxed font-medium">
                      {plannerState?.nextAction}
                    </div>
                  </div>

                  {/* Missing Information */}
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5">
                      Missing Information (Requires Discovery)
                    </div>
                    <div className="space-y-1.5">
                      {plannerState?.missingInformation.map((info, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-800/40">
                          <HelpCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Insight Panel (Timeline, Confidence, Explanation) */}
              <AgentInsightPanel
                explanation={actionExplanation}
                trace={activeReasoningTrace}
                confidence={activeConfidenceResult}
              />

              {/* Generated Recruiter Response Card */}
              {generatedResponse && (
                <div className="bg-[#0E121B]/80 border border-violet-500/20 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-violet-500/5 rounded-full blur-[80px]"></div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                      <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                        Generated Recruiter Response
                      </span>
                    </div>
                    <span className="text-[9px] font-mono bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-bold">
                      LLM VERIFIED
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-all cursor-pointer hover:border-slate-700 transition-colors">
                    {generatedResponse}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    Tip: Click message text to select all for copy/outreach.
                  </p>
                </div>
              )}


              {/* Agent Journal Thinking Stream */}
              <div className="bg-[#0E121B]/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-violet-400" />
                    <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                      Agent Journal (Thinking Feed)
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">NEWEST FIRST</span>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/70 relative">
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                        <Clock className="h-3 w-3" />
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider block">
                            Observation
                          </span>
                          <span className="text-xs text-slate-200 mt-0.5 block">{entry.observation}</span>
                        </div>
                        <div className="border-t border-slate-800/40 pt-2 grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                              Inference
                            </span>
                            <span className="text-slate-400 mt-0.5 block font-light leading-relaxed">
                              {entry.inference}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-violet-400 uppercase tracking-wider block">
                              Hypothesis
                            </span>
                            <span className="text-slate-400 mt-0.5 block font-light leading-relaxed">
                              {entry.hypothesis}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-slate-800/40 pt-2">
                          <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                            Decided Action
                          </span>
                          <span className="text-xs text-slate-300 mt-0.5 block font-medium">
                            {entry.action}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ============================================================
               RECRUITING CONSENSUS ENGINE — M9.6
               ============================================================ */}
          <section
            id="consensus-engine-panel"
            className="bg-[#0E121B]/80 border border-slate-800/80 rounded-2xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-900/80 bg-[#0C1018]/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20">
                  <Network className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-200 tracking-wider">
                    Recruiting Consensus Engine
                  </span>
                  <span className="block text-[9px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">
                    Multi-Agent Recommendation Review
                  </span>
                </div>
              </div>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                  coordinatorRecommendation
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-slate-800/60 border-slate-700/40 text-slate-500"
                }`}
              >
                {coordinatorRecommendation ? "LIVE" : "PENDING"}
              </span>
            </div>

            {analysisError && (
              <div
                id="analysis-error-banner"
                className="mx-5 mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                <span>Analysis subsystem temporarily unavailable.</span>
              </div>
            )}

            {coordinatorRecommendation ? (
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* ── Sub-Agent Grid (left) ── */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5 sm:col-span-3 lg:col-span-1">
                    Sub-Agent Signals
                  </div>

                  {multiAgentResults.map((result) => {
                    const meta = getAgentMeta(result.agent);
                    return (
                      <div
                        key={result.agent}
                        id={`agent-card-${result.agent.toLowerCase()}`}
                        className={`bg-[#0C1018]/70 border rounded-xl p-4 flex flex-col gap-2.5 ${meta.border}`}
                      >
                        {/* Role label */}
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${meta.accent}`}>
                          {meta.icon}
                          {result.agent}
                        </div>

                        {/* Type badge */}
                        <span
                          className={`self-start text-[10px] font-bold px-2 py-0.5 rounded border font-mono tracking-wide ${
                            getRecommendationTypeColor(result.recommendationType)
                          }`}
                        >
                          {result.recommendationType}
                        </span>

                        {/* Text */}
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {result.recommendationText}
                        </p>

                        {/* Confidence bar */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1">
                            <span>Confidence</span>
                            <span className="font-mono text-slate-300 font-semibold">{result.confidence}%</span>
                          </div>
                          <div className="h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
                            <div
                              className={`h-full rounded-full transition-all ${
                                result.confidence >= 85 ? "bg-emerald-500" :
                                result.confidence >= 70 ? "bg-violet-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Coordinator Panel (right) ── */}
                <div
                  id="coordinator-panel"
                  className="lg:col-span-7 bg-[#0D1020]/80 border border-violet-500/20 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Glow */}
                  <div className="absolute top-0 right-0 h-32 w-40 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-violet-400" />
                      <span className="text-xs uppercase font-bold text-slate-200 tracking-wider">
                        Coordinator Recommendation
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border font-bold ${
                        getRecommendationTypeColor(coordinatorRecommendation.recommendationType)
                      }`}
                    >
                      {coordinatorRecommendation.recommendationType}
                    </span>
                  </div>

                  {/* Recommendation text */}
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {coordinatorRecommendation.recommendationText}
                  </p>

                  {/* Confidence bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                      <span className="uppercase font-semibold">Decision Confidence</span>
                      <span className="font-mono text-slate-200 font-bold text-xs">{coordinatorRecommendation.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
                      <div
                        className={`h-full rounded-full transition-all ${
                          coordinatorRecommendation.confidence >= 85 ? "bg-emerald-500" :
                          coordinatorRecommendation.confidence >= 70 ? "bg-violet-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${coordinatorRecommendation.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Priority reason */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-widest">Selected via</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-900/30 border border-violet-500/20 text-violet-300">
                      {coordinatorRecommendation.priorityReason}
                    </span>
                  </div>

                  {/* Rationale */}
                  <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-violet-400" />
                      Coordinator Rationale
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed italic">
                      {coordinatorRecommendation.rationale}
                    </p>
                  </div>

                  {/* Selection Trace */}
                  <div
                    id="selection-trace-block"
                    className="bg-[#0E121B]/60 border border-slate-800/60 rounded-xl p-4 space-y-3"
                  >
                    {/* Header */}
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/40">
                      <TrendingUp className="h-3 w-3 text-slate-400" />
                      Selection Trace
                    </div>

                    {/* Winner + Tie-Break row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold tracking-widest mb-1">Winner</div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-900/30 border border-violet-500/20 text-violet-300">
                          {coordinatorRecommendation.selectedBy}
                        </span>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold tracking-widest mb-1">Tie-Break</div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            coordinatorRecommendation.tieBreakRule === "PRIORITY_RANK"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : coordinatorRecommendation.tieBreakRule === "CONFIDENCE"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-sky-500/10 border-sky-500/20 text-sky-400"
                          }`}
                        >
                          {coordinatorRecommendation.tieBreakRule}
                        </span>
                      </div>
                    </div>

                    {/* Ranked Candidates list */}
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-semibold tracking-widest mb-2">Ranked Candidates</div>
                      <div className="space-y-1.5">
                        {coordinatorRecommendation.rankedCandidates.map((rc) => (
                          <div
                            key={rc.agent}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                              rc.finalPosition === 1
                                ? "bg-violet-900/10 border-violet-500/20"
                                : "bg-slate-900/30 border-slate-800/40"
                            }`}
                          >
                            {/* Position number */}
                            <span
                              className={`text-[10px] font-mono font-black w-4 shrink-0 ${
                                rc.finalPosition === 1 ? "text-violet-400" : "text-slate-600"
                              }`}
                            >
                              {rc.finalPosition}.
                            </span>

                            {/* Agent + Type */}
                            <div className="flex-1 min-w-0">
                              <div className={`text-[10px] font-bold uppercase tracking-widest ${
                                rc.finalPosition === 1 ? "text-slate-200" : "text-slate-400"
                              }`}>
                                {rc.agent}
                              </div>
                              <div className={`text-[9px] font-mono mt-0.5 ${
                                getRecommendationTypeColor(rc.recommendationType).split(" ")[1]
                              }`}>
                                {rc.recommendationType}
                              </div>
                            </div>

                            {/* Rank + Confidence */}
                            <div className="text-right shrink-0">
                              <div className="text-[9px] text-slate-500 font-mono">Rank {rc.rank}</div>
                              <div className={`text-[9px] font-mono font-semibold ${
                                rc.confidence >= 85 ? "text-emerald-400" :
                                rc.confidence >= 70 ? "text-violet-400" : "text-amber-400"
                              }`}>
                                {rc.confidence}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Disagreements block — only if non-empty */}
                  {coordinatorRecommendation.detectedDisagreements.length > 0 && (
                    <div
                      id="disagreements-block"
                      className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20"
                    >
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-400 uppercase font-bold tracking-widest mb-2">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Detected Agent Disagreements
                      </div>
                      <ul className="space-y-1.5">
                        {coordinatorRecommendation.detectedDisagreements.map((d, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-amber-200/80 leading-relaxed pl-3 border-l-2 border-amber-500/30"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty state */
              <div
                id="consensus-empty-state"
                className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center"
              >
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40">
                  <Network className="h-8 w-8 text-slate-700" />
                </div>
                <p className="text-sm font-semibold text-slate-400">
                  No multi-agent review available yet.
                </p>
                <p className="text-xs text-slate-600 max-w-xs">
                  Send a message in the Agent Chat Log to trigger a full multi-agent consensus review.
                </p>
              </div>
            )}
          </section>

          {/* ============================================================
               SYSTEM ANALYTICS — M10.3
               ============================================================ */}
          <section
            id="system-analytics-panel"
            className="bg-[#0E121B]/80 border border-slate-800/80 rounded-2xl overflow-hidden mt-6"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-900/80 bg-[#0C1018]/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-600/10 border border-emerald-500/20">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-200 tracking-wider">
                    System Analytics
                  </span>
                  <span className="block text-[9px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">
                    Demo Insights & Metrics
                  </span>
                </div>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                No analytics data yet.
              </div>
            ) : (
              <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-[#0C1018]/60 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Candidates Processed
                  </span>
                  <span className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                    {events.filter(e => e.event === "candidate_processed").length}
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#0C1018]/60 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Multi-Agent Reviews
                  </span>
                  <span className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                    {events.filter(e => e.event === "multi_agent_review_completed").length}
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#0C1018]/60 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Disagreements
                  </span>
                  <span className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                    {events
                      .filter(e => e.event === "coordinator_disagreement_detected")
                      .reduce((sum, e) => sum + (Number(e.payload?.count) || 0), 0)}
                  </span>
                </div>

                {/* Metric 4 */}
                <div className="bg-[#0C1018]/60 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Book Calls
                  </span>
                  <span className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                    {events.filter(e => e.event === "recommendation_selected" && e.payload?.type === "BOOK_CALL").length}
                  </span>
                </div>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
