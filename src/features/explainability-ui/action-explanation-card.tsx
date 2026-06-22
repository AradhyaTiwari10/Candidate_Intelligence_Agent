import React from "react";
import { ActionExplanation } from "../explainability/explanation-result";
import { Target, HelpCircle, Lightbulb } from "lucide-react";

interface ActionExplanationCardProps {
  readonly explanation: ActionExplanation | null;
}

export function ActionExplanationCard({ explanation }: ActionExplanationCardProps) {
  if (!explanation) {
    return (
      <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-2xl p-5 text-center text-slate-500 text-xs py-10">
        No action explanation active. Process a candidate message to explain current step.
      </div>
    );
  }

  const { goal, reasoning, expectedOutcome } = explanation;

  return (
    <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Action Rationale</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Strategic alignment breakdown</p>
      </div>

      <div className="space-y-4">
        {/* Goal */}
        <div className="flex gap-3 items-start">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <Target className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Immediate Goal</span>
            <p className="text-xs text-slate-200 font-medium leading-relaxed mt-0.5">{goal}</p>
          </div>
        </div>

        {/* Reasoning */}
        <div className="flex gap-3 items-start">
          <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
            <HelpCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Decision Rationale</span>
            <p className="text-xs text-slate-400 leading-relaxed font-light mt-0.5">{reasoning}</p>
          </div>
        </div>

        {/* Expected Outcome */}
        <div className="flex gap-3 items-start">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Lightbulb className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Expected Outcome</span>
            <p className="text-xs text-emerald-400 font-medium leading-relaxed mt-0.5">{expectedOutcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
