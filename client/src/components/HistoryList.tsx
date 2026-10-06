/**
 * HistoryList - Displays past assessment records
 * Design: Crimson Pulse — dark list with waveform thumbnails and risk badges
 */
import { getRiskColor, getRiskBgColor } from "@/lib/riskEngine";
import type { PatientRecord } from "@/lib/riskEngine";
import { Trash2 } from "lucide-react";
import ECGWaveform from "./ECGWaveform";

interface HistoryListProps {
  records: PatientRecord[];
  onSelect: (record: PatientRecord) => void;
  onDelete: (id: string) => void;
}

export default function HistoryList({ records, onSelect, onDelete }: HistoryListProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <p className="text-white/40 text-sm">No assessment records yet</p>
        <p className="text-white/25 text-xs mt-1">Complete a risk assessment to see history</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const color = getRiskColor(record.result.level);
        const bgColor = getRiskBgColor(record.result.level);
        const date = new Date(record.timestamp);
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        return (
          <div
            key={record.id}
            onClick={() => onSelect(record)}
            className="relative bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-all duration-200 hover:bg-white/[0.05] cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-white/50">{record.result.level}</span>
                </div>
                <span className="text-xs text-white/30">{dateStr}, {timeStr}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record.id);
                }}
                className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Waveform */}
            <div className="mb-3">
              <ECGWaveform
                width={300}
                height={50}
                color={color}
                heartRate={record.vitals.heartRate}
                animated={false}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white">{record.patientName}</span>
                <span className="text-xs text-white/40 ml-2">HR: {record.vitals.heartRate} bpm</span>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: bgColor,
                  color: color,
                }}
              >
                {record.result.score}/100
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
