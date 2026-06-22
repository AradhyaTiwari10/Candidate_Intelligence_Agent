import React, { useState } from "react";
import { ActionExplanation, ReasoningTrace } from "../explainability/explanation-result";
import { ConfidenceResult } from "../confidence/confidence-result";
import { ConfidenceCard } from "./confidence-card";
import { ReasoningTimeline } from "./reasoning-timeline";
import { ActionExplanationCard } from "./action-explanation-card";
import { Activity, ShieldAlert, Sparkles } from "lucide-react";

interface AgentInsightPanelProps {
  readonly explanation: ActionExplanation | null;
  readonly trace: ReasoningTrace | null;
  readonly confidence: ConfidenceResult | null;
}

export function AgentInsightPanel({
  explanation,
  trace,
  confidence,
}: AgentInsightPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "certainty">("pipeline");

  return (
    <div className="bg-[#0E121B]/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-5 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-violet-500/5 rounded-full blur-[80px]"></div>

      {/* Header and selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 gap-3 z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-violet-400" />
          <div>
            <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              Agent Explanation & Insight
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time planner inspection log</p>
          </div>
        </div>

        {/* Mini Tab selector */}
        <div className="flex bg-slate-950/60 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab("pipeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
              activeSubTab === "pipeline"
                ? "bg-slate-800 text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Reasoning Trace
          </button>
          <button
            onClick={() => setActiveSubTab("certainty")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
              activeSubTab === "certainty"
                ? "bg-slate-800 text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <ShieldAlert className="h-3 w-3" />
            Planner Certainty
          </button>
        </div>
      </div>

      {/* Content Rendering based on Tab */}
      <div className="space-y-5 z-10 flex-1">
        {activeSubTab === "pipeline" ? (
          <div className="grid grid-cols-1 gap-5">
            <ReasoningTimeline trace={trace} />
            <ActionExplanationCard explanation={explanation} />
          </div>
        ) : (
          <ConfidenceCard result={confidence} />
        )}
      </div>
    </div>
  );
}
