import React from "react";
import { ReasoningTrace } from "../explainability/explanation-result";
import { ArrowRight, Compass, Sparkles, MessageSquare, Brain, Eye } from "lucide-react";

interface ReasoningTimelineProps {
  readonly trace: ReasoningTrace | null;
}

export function ReasoningTimeline({ trace }: ReasoningTimelineProps) {
  if (!trace) {
    return (
      <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-2xl p-5 text-center text-slate-500 text-xs py-10">
        No active reasoning trace. Process a candidate message to start the visual pipeline.
      </div>
    );
  }

  const { observations, inferences, hypotheses, plannerDecision, selectedAction } = trace;

  // Timeline nodes structure
  const nodes = [
    {
      title: "Observation",
      subtitle: "Message Signal Extraction",
      content: observations.length > 0 ? observations.join("; ") : "No key signals extracted.",
      icon: Eye,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      lineColor: "border-blue-500/20",
    },
    {
      title: "Inference",
      subtitle: "Contextual Deduction",
      content: inferences.length > 0 ? inferences.join("; ") : "Direct mapping deduction.",
      icon: MessageSquare,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      lineColor: "border-emerald-500/20",
    },
    {
      title: "Hypothesis",
      subtitle: "Predictive Assertion",
      content: hypotheses.length > 0 ? hypotheses.join("; ") : "General recruitment pattern.",
      icon: Brain,
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      lineColor: "border-violet-500/20",
    },
    {
      title: "Planner Decision",
      subtitle: "Active Recruiting Objective",
      content: plannerDecision || "Advance candidate stage goals.",
      icon: Compass,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      lineColor: "border-amber-500/20",
    },
    {
      title: "Selected Action",
      subtitle: "Target Engagement Step",
      content: selectedAction || "GENERATE_MESSAGE",
      icon: Sparkles,
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      lineColor: "border-transparent", // Last node, no line
    },
  ];

  return (
    <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Reasoning Trace</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Observe → Reason → Plan → Act visualization</p>
      </div>

      <div className="relative pl-6 space-y-6">
        {/* Timeline line */}
        <div className="absolute left-[33px] top-4 bottom-4 w-[2px] bg-slate-900 border-l border-slate-800"></div>

        {nodes.map((node, idx) => {
          const IconComp = node.icon;
          return (
            <div key={idx} className="relative flex gap-4 items-start group">
              {/* Node indicator with icon */}
              <div className={`absolute -left-6 z-10 p-1.5 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${node.iconColor}`}>
                <IconComp className="h-3.5 w-3.5" />
              </div>

              {/* Node contents */}
              <div className="flex-1 min-w-0 bg-slate-900/40 border border-slate-800/60 hover:border-slate-800 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                    {node.title}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {node.subtitle}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light mt-1.5 break-words">
                  {node.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
