/** Design reminder — Crimson Pulse: dark, legible medical-research form with conspicuous data provenance. */
import { useState } from "react";
import { ChevronDown, FlaskConical } from "lucide-react";
import type { PatientVitals, UciModelInputs } from "@/lib/riskEngine";

interface VitalsInputProps {
  onSubmit: (vitals: PatientVitals) => void;
  isSubmitting: boolean;
}

export default function VitalsInput({ onSubmit, isSubmitting }: VitalsInputProps) {
  const [form, setForm] = useState<Partial<PatientVitals>>({
    age: 0, heartRate: 72, systolicBP: 120, diastolicBP: 80, oxygenSaturation: 98, temperature: 37.0,
  });
  const [mlInputs, setMlInputs] = useState<UciModelInputs>({});
  const [showModelFields, setShowModelFields] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: keyof PatientVitals, value: string) => {
    const numberValue = parseFloat(value);
    setForm((previous) => ({ ...previous, [field]: Number.isNaN(numberValue) ? 0 : numberValue }));
    setErrors([]);
  };

  const updateMlInput = (field: keyof UciModelInputs, value: string) => {
    setMlInputs((previous) => ({ ...previous, [field]: value === "" ? undefined : Number(value) }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const vitals: PatientVitals = {
      age: form.age ?? 0, heartRate: form.heartRate ?? 72, systolicBP: form.systolicBP ?? 120,
      diastolicBP: form.diastolicBP ?? 80, oxygenSaturation: form.oxygenSaturation ?? 98,
      temperature: form.temperature ?? 37.0, respiratoryRate: form.respiratoryRate,
      weight: form.weight, height: form.height, mlInputs,
    };
    const validationErrors: string[] = [];
    if (vitals.age < 0 || vitals.age > 150) validationErrors.push("Age must be between 0 and 150");
    if (vitals.heartRate < 20 || vitals.heartRate > 300) validationErrors.push("Heart rate must be between 20 and 300 bpm");
    if (vitals.oxygenSaturation < 50 || vitals.oxygenSaturation > 100) validationErrors.push("Oxygen saturation must be between 50% and 100%");
    if (vitals.temperature < 28 || vitals.temperature > 45) validationErrors.push("Temperature must be between 28°C and 45°C");
    if (vitals.diastolicBP > vitals.systolicBP) validationErrors.push("Diastolic BP cannot exceed systolic BP");
    if (validationErrors.length) { setErrors(validationErrors); return; }
    onSubmit(vitals);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm font-body focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-200";
  const labelClass = "text-[11px] font-medium text-white/50 mb-1.5 block";
  const modelCoverage = 2 + Object.values(mlInputs).filter((value) => value !== undefined).length;

  return <form onSubmit={handleSubmit} className="space-y-4">
    <div><label className={labelClass}>Age (years)</label><input type="number" value={form.age || ""} onChange={(event) => handleChange("age", event.target.value)} placeholder="25" className={inputClass} /></div>
    <div><label className={labelClass}>Heart Rate (bpm)</label><input type="number" value={form.heartRate || ""} onChange={(event) => handleChange("heartRate", event.target.value)} placeholder="72" className={inputClass} /></div>
    <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Systolic BP (mmHg)</label><input type="number" value={form.systolicBP || ""} onChange={(event) => handleChange("systolicBP", event.target.value)} placeholder="120" className={inputClass} /></div><div><label className={labelClass}>Diastolic BP (mmHg)</label><input type="number" value={form.diastolicBP || ""} onChange={(event) => handleChange("diastolicBP", event.target.value)} placeholder="80" className={inputClass} /></div></div>
    <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>O₂ Saturation (%)</label><input type="number" value={form.oxygenSaturation || ""} onChange={(event) => handleChange("oxygenSaturation", event.target.value)} placeholder="98" className={inputClass} /></div><div><label className={labelClass}>Temperature (°C)</label><input type="number" step="0.1" value={form.temperature || ""} onChange={(event) => handleChange("temperature", event.target.value)} placeholder="37.0" className={inputClass} /></div></div>
    <div><label className={labelClass}>Respiratory Rate (breaths/min) <span className="text-white/30">optional</span></label><input type="number" value={form.respiratoryRate || ""} onChange={(event) => handleChange("respiratoryRate", event.target.value)} placeholder="16" className={inputClass} /></div>

    <div className="border border-cyan-400/15 bg-cyan-400/[0.035] rounded-xl overflow-hidden">
      <button type="button" onClick={() => setShowModelFields((visible) => !visible)} className="w-full px-4 py-3 flex items-center justify-between text-left"><span className="flex items-center gap-2 text-sm font-semibold text-cyan-100"><FlaskConical size={15} className="text-cyan-300" />UCI research-model inputs</span><ChevronDown size={16} className={`text-cyan-300 transition-transform ${showModelFields ? "rotate-180" : ""}`} /></button>
      <p className="px-4 pb-3 text-[11px] text-cyan-100/55">Optional study variables. Coverage: {modelCoverage}/13. Blank features are median-imputed only for a labelled preview.</p>
      {showModelFields && <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Sex coding</label><select value={mlInputs.sex ?? ""} onChange={(event) => updateMlInput("sex", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="0">Female (0)</option><option value="1">Male (1)</option></select></div>
        <div><label className={labelClass}>Chest pain type</label><select value={mlInputs.chestPainType ?? ""} onChange={(event) => updateMlInput("chestPainType", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="1">Typical angina</option><option value="2">Atypical angina</option><option value="3">Non-anginal pain</option><option value="4">Asymptomatic</option></select></div>
        <div><label className={labelClass}>Cholesterol (mg/dL)</label><input type="number" value={mlInputs.cholesterol ?? ""} onChange={(event) => updateMlInput("cholesterol", event.target.value)} className={inputClass} placeholder="240" /></div>
        <div><label className={labelClass}>Fasting glucose flag</label><select value={mlInputs.fastingBloodSugar ?? ""} onChange={(event) => updateMlInput("fastingBloodSugar", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="0">≤120 mg/dL</option><option value="1">&gt;120 mg/dL</option></select></div>
        <div><label className={labelClass}>Resting ECG</label><select value={mlInputs.restingEcg ?? ""} onChange={(event) => updateMlInput("restingEcg", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="0">Normal</option><option value="1">ST-T abnormality</option><option value="2">LV hypertrophy</option></select></div>
        <div><label className={labelClass}>Max exercise HR</label><input type="number" value={mlInputs.maxExerciseHeartRate ?? ""} onChange={(event) => updateMlInput("maxExerciseHeartRate", event.target.value)} className={inputClass} placeholder="150" /></div>
        <div><label className={labelClass}>Exercise angina</label><select value={mlInputs.exerciseAngina ?? ""} onChange={(event) => updateMlInput("exerciseAngina", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="0">No</option><option value="1">Yes</option></select></div>
        <div><label className={labelClass}>ST depression</label><input type="number" step="0.1" value={mlInputs.stDepression ?? ""} onChange={(event) => updateMlInput("stDepression", event.target.value)} className={inputClass} placeholder="1.2" /></div>
        <div><label className={labelClass}>ST slope</label><select value={mlInputs.stSlope ?? ""} onChange={(event) => updateMlInput("stSlope", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="1">Upsloping</option><option value="2">Flat</option><option value="3">Downsloping</option></select></div>
        <div><label className={labelClass}>Major vessels (0–3)</label><input type="number" min="0" max="3" value={mlInputs.majorVessels ?? ""} onChange={(event) => updateMlInput("majorVessels", event.target.value)} className={inputClass} placeholder="0" /></div>
        <div className="col-span-2"><label className={labelClass}>Thalassemia result</label><select value={mlInputs.thalassemia ?? ""} onChange={(event) => updateMlInput("thalassemia", event.target.value)} className={inputClass}><option value="">Not recorded</option><option value="3">Normal (3)</option><option value="6">Fixed defect (6)</option><option value="7">Reversible defect (7)</option></select></div>
      </div>}
    </div>
    {errors.length > 0 && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 space-y-1">{errors.map((error) => <p key={error} className="text-xs text-red-400">{error}</p>)}</div>}
    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3.5 rounded-xl text-sm hover:from-red-500 hover:to-red-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20">{isSubmitting ? "Assessing two layers…" : "Run Hybrid Assessment"}</button>
  </form>;
}
