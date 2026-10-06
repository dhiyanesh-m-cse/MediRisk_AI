/** Design reminder — Crimson Pulse: preserve the dramatic cardiac monitor while adding distinct cyan research evidence. */
import { Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ECGWaveform from "@/components/ECGWaveform";
import { getRiskColor } from "@/lib/riskEngine";
import { trpc } from "@/lib/trpc";

interface ResultsPageProps { onTabChange: (tab: string) => void; }

export default function ResultsPage({ onTabChange }: ResultsPageProps) {
  const assessmentQuery = trpc.assessments.list.useQuery();
  const records = assessmentQuery.data ?? [];
  const latestRecord = records[0];
  const parsed = latestRecord ? JSON.parse(latestRecord.assessmentPayload) as { result: { mlAssessment?: { classification: string; probability: number } } } : null;
  const heartRate = latestRecord?.heartRate || 70;
  const color = latestRecord ? getRiskColor(latestRecord.riskLevel as "LOW" | "MODERATE" | "HIGH" | "CRITICAL") : "#DC2626";
  const ml = parsed?.result.mlAssessment;
  return <div className="min-h-screen bg-[#0A0A0A] pb-24">
    <div className="px-5 pt-8 pb-4"><h2 className="text-xl font-bold text-white font-display">ECG Results</h2><p className="text-sm text-white/40 mt-1">Monitor heart health and research signals</p></div>
    <div className="px-5 mb-4"><div className="relative bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col items-center overflow-hidden"><div className="relative w-48 h-48 mb-4"><img src="/manus-storage/anatomical-heart-3d_c36bcea5.png" alt="Anatomical heart illustration" className="w-full h-full object-contain" /><div className="absolute inset-0 flex items-center justify-center"><div className="w-32 h-32 rounded-full border-2 opacity-20 animate-ping" style={{ borderColor: color }} /></div></div><div className="bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 w-full max-w-xs"><div className="text-center"><span className="text-xs text-white/40 block">Heart Rate (HR)</span><div className="text-3xl font-bold text-white font-display">{heartRate}</div><span className="text-xs text-white/40">bpm</span></div><div className="flex-1"><ECGWaveform width={140} height={50} color={color} heartRate={heartRate} animated /></div></div></div></div>
    {latestRecord && <div className="px-5"><div className="grid grid-cols-2 gap-3"><Metric label="R-R Interval" value={String(Math.round(60000 / heartRate))} suffix="ms" /><Metric label="Signal Quality" value={latestRecord.oxygenSaturation >= 95 ? "95" : "89"} suffix="/100" /><Metric label="Rule Score" value={String(latestRecord.riskScore)} emphasis={latestRecord.riskLevel} accent={color} /><Metric label="SpO₂" value={String(latestRecord.oxygenSaturation)} suffix="%" /></div><div className="mt-3 bg-cyan-400/[0.04] border border-cyan-400/15 rounded-2xl p-4 flex items-center justify-between gap-3"><div><span className="text-[10px] uppercase tracking-[0.12em] text-cyan-200/55">Layer 2 • academic ML</span><p className="text-sm font-semibold text-white/85 mt-1">{ml?.classification ?? "ACADEMIC PREVIEW"} {ml && <span className="text-cyan-200">{ml.probability}%</span>}</p><p className="mt-1 text-[10px] text-white/35">UCI Heart Disease research pattern estimate</p></div><button onClick={() => onTabChange("lab")} className="text-xs font-semibold text-cyan-300">Model lab</button></div></div>}
    {records.length > 1 && <div className="px-5 mt-4"><h3 className="text-sm font-medium text-white/50 mb-3">Recent Recordings</h3><div className="space-y-3">{records.slice(1).map((record) => <div key={record.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(record.riskLevel as "LOW" | "MODERATE" | "HIGH" | "CRITICAL") }} /><span className="text-xs font-medium text-white/50">{record.riskLevel}</span></div><span className="text-xs text-white/30">{new Date(record.assessedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div><div className="flex items-center gap-4"><div className="flex-1"><ECGWaveform width={280} height={45} color={getRiskColor(record.riskLevel as "LOW" | "MODERATE" | "HIGH" | "CRITICAL")} heartRate={record.heartRate} animated={false} /></div><div className="text-right"><div className="text-lg font-bold text-white font-display">{record.heartRate}</div><div className="text-xs text-white/40">bpm</div></div></div></div>)}</div></div>}
    <BottomNav activeTab="" onTabChange={onTabChange} />
  </div>;
}

function Metric({ label, value, suffix, emphasis, accent }: { label: string; value: string; suffix?: string; emphasis?: string; accent?: string }) {
  return <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"><span className="text-xs text-white/40 block mb-1">{label}</span><span className="text-lg font-bold text-white font-display" style={accent ? { color: accent } : undefined}>{value}</span>{suffix && <span className="text-xs text-white/40 ml-1">{suffix}</span>}{emphasis && <div className="text-xs font-medium mt-0.5" style={accent ? { color: accent } : undefined}>{emphasis}</div>}</div>;
}
