/** Design reminder — Crimson Pulse: subjective state is a restrained clinical intake field, not a wellness interaction. */
import { useState } from "react";
import { CircleDot } from "lucide-react";

const intakeStates = [
  { id: "baseline", label: "Baseline" },
  { id: "calm", label: "Calm" },
  { id: "low-affect", label: "Low affect" },
  { id: "fatigue", label: "Fatigue" },
  { id: "positive", label: "Positive" },
];

interface MoodTrackerProps { onMoodSelect?: (mood: string) => void; }

export default function MoodTracker({ onMoodSelect }: MoodTrackerProps) {
  const [selected, setSelected] = useState<string | null>("baseline");
  const handleSelect = (state: string) => { setSelected(state); onMoodSelect?.(state); };
  return <div className="space-y-3"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.14em] text-red-300/60">Clinical intake</p><span className="text-xs font-medium text-white/60">Subjective state</span></div><span className="text-[10px] text-white/25">non-diagnostic</span></div><div className="grid grid-cols-5 gap-1.5">{intakeStates.map((state) => { const active = selected === state.id; return <button key={state.id} type="button" onClick={() => handleSelect(state.id)} className={`min-h-14 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 ${active ? "bg-red-500/12 border-red-500/35 shadow-[0_0_18px_rgba(239,68,68,0.12)]" : "bg-black/20 border-white/5 hover:bg-white/[0.06]"}`}><CircleDot size={active ? 13 : 11} className={active ? "text-red-400" : "text-white/25"} /><span className={`text-[9px] leading-none ${active ? "text-red-200" : "text-white/35"}`}>{state.label}</span></button>; })}</div></div>;
}
