import React from "react";
import { ConfidenceResult } from "../confidence/confidence-result";
import { ShieldCheck, AlertCircle, ShieldAlert, Award } from "lucide-react";

interface ConfidenceCardProps {
  readonly result: ConfidenceResult | null;
}

export function ConfidenceCard({ result }: ConfidenceCardProps) {
  if (!result) {
    return (
      <div className="bg-[#0E121B]/40 border border-slate-800/80 rounded-2xl p-5 text-center text-slate-500 text-xs py-10">
        No confidence profile active. Process a candidate message to qualify certainty.
      </div>
    );
  }

  const { confidence, strengths, uncertainties, confidenceFactors } = result;

  // Determine indicator color based on score
  const getMeterColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getTextColor = (val: number) => {
    if (val >= 80) return "text-emerald-400";
    if (val >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getBorderColor = (val: number) => {
    if (val >= 80) return "border-emerald-500/20 bg-emerald-500/5";
    if (val >= 50) return "border-amber-500/20 bg-amber-500/5";
    return "border-rose-500/20 bg-rose-500/5";
  };

  return (
    <div className={`border rounded-2xl p-5 space-y-5 transition-all duration-300 ${getBorderColor(confidence)}`}>
      {/* Header and circular/bar indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Planner Certainty</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Quantified decision validation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-mono font-black ${getTextColor(confidence)}`}>
            {confidence}%
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-bold">
            {confidence >= 80 ? "High" : confidence >= 50 ? "Medium" : "Low"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/40">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getMeterColor(confidence)}`}
          style={{ width: `${confidence}%` }}
        ></div>
      </div>

      {/* Confidence Factors list */}
      {confidenceFactors.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-slate-800/40">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Key Factors</span>
          <div className="space-y-1">
            {confidenceFactors.map((factor, idx) => (
              <div key={idx} className="text-[11px] text-slate-400 leading-normal flex items-start gap-1.5">
                <span className="text-violet-500 mt-0.5 font-mono text-[9px]">•</span>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Uncertainties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/40">
        {/* Strengths */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Strengths ({strengths.length})</span>
          </div>
          {strengths.length > 0 ? (
            <ul className="space-y-1.5">
              {strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-slate-300 leading-normal pl-2 border-l border-emerald-500/30 flex items-center gap-1">
                  <Award className="h-3 w-3 text-emerald-500/70 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-[10px] text-slate-600 block italic">No strengths identified.</span>
          )}
        </div>

        {/* Uncertainties */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Uncertainties ({uncertainties.length})</span>
          </div>
          {uncertainties.length > 0 ? (
            <ul className="space-y-1.5">
              {uncertainties.map((unc, idx) => (
                <li key={idx} className="text-xs text-slate-300 leading-normal pl-2 border-l border-amber-500/30 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 text-amber-500/70 shrink-0" />
                  <span>{unc}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-[10px] text-slate-600 block italic">Zero uncertainties flagged.</span>
          )}
        </div>
      </div>
    </div>
  );
}
