/**
 * Assess Page - Patient vital input and risk assessment
 * Design: Crimson Pulse — clean dark form with validation
 */
import { useState } from "react";
import VitalsInput from "@/components/VitalsInput";
import RiskResultCard from "@/components/RiskResultCard";
import BottomNav from "@/components/BottomNav";
import { assessRisk, validateVitals } from "@/lib/riskEngine";
import type { PatientVitals, RiskResult } from "@/lib/riskEngine";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AssessPageProps {
  onTabChange: (tab: string) => void;
  patientName: string;
}

export default function AssessPage({ onTabChange, patientName }: AssessPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    result: RiskResult;
    patientName: string;
  } | null>(null);
  const [recordLabel, setRecordLabel] = useState("");
  const utils = trpc.useUtils();
  const saveAssessment = trpc.assessments.create.useMutation({ onSuccess: () => { utils.assessments.list.invalidate(); } });

  const handleSubmit = async (vitals: PatientVitals) => {
    const name = recordLabel.trim() || patientName;
    setIsSubmitting(true);
    try {
      const assessment = assessRisk(vitals);
      await saveAssessment.mutateAsync({ patientName: name, riskScore: assessment.score, riskLevel: assessment.level, heartRate: vitals.heartRate, systolicBP: vitals.systolicBP, diastolicBP: vitals.diastolicBP, oxygenSaturation: vitals.oxygenSaturation, temperature: vitals.temperature, assessmentPayload: JSON.stringify({ vitals, result: assessment }) });
      setResult({
        result: assessment,
        patientName: name,
      });
      toast.success("Assessment saved to your private history.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Assessment could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-24">
        {/* Header */}
        <div className="px-5 pt-8 pb-4">
          <button
            onClick={() => {
              setResult(null);
            }}
            className="flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">New Assessment</span>
          </button>
        </div>

        <div className="px-5">
          <RiskResultCard
            result={result.result}
            patientName={result.patientName}
            onOpenModelLab={() => onTabChange("lab")}
          />
        </div>

        <BottomNav activeTab="results" onTabChange={onTabChange} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h2 className="text-xl font-bold text-white font-display">Risk Assessment</h2>
        <p className="text-sm text-white/40 mt-1">Rule-based vitals plus optional UCI research features</p>
      </div>

      {/* Patient Name Input */}
      <div className="px-5 mb-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <label className="text-xs font-medium text-white/50 mb-2 block">Record label <span className="text-white/25">(optional)</span></label>
          <input
            type="text"
            value={recordLabel}
            onChange={(e) => setRecordLabel(e.target.value)}
            placeholder={patientName}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-body focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
          />
        </div>
      </div>

      {/* Form */}
      <div className="px-5">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <VitalsInput onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-5 mt-4">
        <p className="text-[11px] text-white/20 text-center leading-relaxed">
          Layer 1 uses project-defined vital-sign rules. Layer 2 is an academic UCI Heart Disease model preview.
          Neither is a medical diagnosis; consult qualified healthcare professionals for clinical decisions.
        </p>
      </div>

      <BottomNav activeTab="assess" onTabChange={onTabChange} />
    </div>
  );
}
