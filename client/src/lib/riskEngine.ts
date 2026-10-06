/**
 * MediRisk - Risk Assessment Engine
 * 
 * Calculates a risk score (0-100) based on patient health parameters.
 * Uses a weighted scoring model across multiple vital signs.
 * 
 * Scoring weights:
 * - Age: 15%
 * - Heart Rate: 20%
 * - Systolic BP: 20%
 * - Diastolic BP: 15%
 * - Oxygen Saturation: 15%
 * - Temperature: 15%
 * 
 * Risk Classification:
 * 0-30: LOW RISK
 * 31-60: MODERATE RISK
 * 61-80: HIGH RISK
 * 81-100: CRITICAL RISK
 */
import { predictUciHeartDiseasePattern } from "./mlPredictor";

export interface PatientVitals {
  age: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
  mlInputs?: UciModelInputs;
}

export interface UciModelInputs {
  sex?: number;
  chestPainType?: number;
  cholesterol?: number;
  fastingBloodSugar?: number;
  restingEcg?: number;
  maxExerciseHeartRate?: number;
  exerciseAngina?: number;
  stDepression?: number;
  stSlope?: number;
  majorVessels?: number;
  thalassemia?: number;
}

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskResult {
  score: number;
  level: RiskLevel;
  breakdown: {
    age: number;
    heartRate: number;
    systolicBP: number;
    diastolicBP: number;
    oxygenSaturation: number;
    temperature: number;
  };
  recommendation: string;
  disclaimer: string;
  mlAssessment: ReturnType<typeof predictUciHeartDiseasePattern>;
  concordance: "CONCORDANT" | "MODEL_ELEVATED" | "VITALS_ELEVATED" | "LIMITED_DATA";
}

function scoreAge(age: number): number {
  if (age < 25) return 5;
  if (age < 35) return 10;
  if (age < 45) return 20;
  if (age < 55) return 35;
  if (age < 65) return 55;
  if (age < 75) return 75;
  if (age < 85) return 90;
  return 100;
}

function scoreHeartRate(hr: number): number {
  if (hr >= 60 && hr <= 100) return 10;
  if (hr >= 50 && hr < 60) return 30;
  if (hr > 100 && hr <= 120) return 35;
  if (hr >= 40 && hr < 50) return 55;
  if (hr > 120 && hr <= 140) return 60;
  if (hr >= 30 && hr < 40) return 80;
  if (hr > 140) return 85;
  return 95;
}

function scoreSystolicBP(sys: number): number {
  if (sys >= 90 && sys <= 120) return 5;
  if (sys > 120 && sys <= 130) return 20;
  if (sys > 130 && sys <= 140) return 40;
  if (sys >= 80 && sys < 90) return 45;
  if (sys > 140 && sys <= 160) return 60;
  if (sys < 80) return 70;
  if (sys > 160 && sys <= 180) return 80;
  return 95;
}

function scoreDiastolicBP(dia: number): number {
  if (dia >= 60 && dia <= 80) return 5;
  if (dia > 80 && dia <= 90) return 25;
  if (dia > 90 && dia <= 100) return 50;
  if (dia >= 50 && dia < 60) return 55;
  if (dia > 100 && dia <= 110) return 70;
  if (dia < 50) return 75;
  if (dia > 110) return 90;
  return 95;
}

function scoreOxygen(o2: number): number {
  if (o2 >= 95) return 5;
  if (o2 >= 90 && o2 < 95) return 30;
  if (o2 >= 85 && o2 < 90) return 55;
  if (o2 >= 80 && o2 < 85) return 75;
  if (o2 < 80) return 95;
  return 100;
}

function scoreTemperature(temp: number): number {
  if (temp >= 36.1 && temp <= 37.2) return 5;
  if (temp > 37.2 && temp <= 38.0) return 25;
  if (temp >= 35.0 && temp < 36.1) return 35;
  if (temp > 38.0 && temp <= 39.0) return 55;
  if (temp > 39.0 && temp <= 40.0) return 75;
  if (temp < 35.0) return 85;
  return 95;
}

export function validateVitals(vitals: Partial<PatientVitals>): string[] {
  const errors: string[] = [];

  if (vitals.age !== undefined) {
    if (typeof vitals.age !== "number" || vitals.age < 0 || vitals.age > 150) {
      errors.push("Age must be a number between 0 and 150");
    }
  }

  if (vitals.heartRate !== undefined) {
    if (typeof vitals.heartRate !== "number" || vitals.heartRate < 20 || vitals.heartRate > 300) {
      errors.push("Heart rate must be between 20 and 300 bpm");
    }
  }

  if (vitals.systolicBP !== undefined) {
    if (typeof vitals.systolicBP !== "number" || vitals.systolicBP < 40 || vitals.systolicBP > 300) {
      errors.push("Systolic blood pressure must be between 40 and 300 mmHg");
    }
  }

  if (vitals.diastolicBP !== undefined) {
    if (typeof vitals.diastolicBP !== "number" || vitals.diastolicBP < 20 || vitals.diastolicBP > 200) {
      errors.push("Diastolic blood pressure must be between 20 and 200 mmHg");
    }
  }

  if (vitals.diastolicBP !== undefined && vitals.systolicBP !== undefined) {
    if (vitals.diastolicBP > vitals.systolicBP) {
      errors.push("Diastolic BP cannot be higher than systolic BP");
    }
  }

  if (vitals.oxygenSaturation !== undefined) {
    if (typeof vitals.oxygenSaturation !== "number" || vitals.oxygenSaturation < 50 || vitals.oxygenSaturation > 100) {
      errors.push("Oxygen saturation must be between 50% and 100%");
    }
  }

  if (vitals.temperature !== undefined) {
    if (typeof vitals.temperature !== "number" || vitals.temperature < 28 || vitals.temperature > 45) {
      errors.push("Temperature must be between 28°C and 45°C");
    }
  }

  if (vitals.respiratoryRate !== undefined) {
    if (typeof vitals.respiratoryRate !== "number" || vitals.respiratoryRate < 4 || vitals.respiratoryRate > 60) {
      errors.push("Respiratory rate must be between 4 and 60 breaths/min");
    }
  }

  return errors;
}

export function assessRisk(vitals: PatientVitals): RiskResult {
  const ageScore = scoreAge(vitals.age) * 0.15;
  const hrScore = scoreHeartRate(vitals.heartRate) * 0.20;
  const sysScore = scoreSystolicBP(vitals.systolicBP) * 0.20;
  const diaScore = scoreDiastolicBP(vitals.diastolicBP) * 0.15;
  const o2Score = scoreOxygen(vitals.oxygenSaturation) * 0.15;
  const tempScore = scoreTemperature(vitals.temperature) * 0.15;

  const totalScore = Math.round(ageScore + hrScore + sysScore + diaScore + o2Score + tempScore);
  const clampedScore = Math.min(100, Math.max(0, totalScore));

  let level: RiskLevel;
  if (clampedScore <= 30) level = "LOW";
  else if (clampedScore <= 60) level = "MODERATE";
  else if (clampedScore <= 80) level = "HIGH";
  else level = "CRITICAL";

  const recommendation = getRecommendation(level);
  const mlAssessment = predictUciHeartDiseasePattern(vitals, vitals.mlInputs);
  const vitalsElevated = level === "HIGH" || level === "CRITICAL";
  const concordance = mlAssessment.classification === "LIMITED DATA"
    ? "LIMITED_DATA"
    : vitalsElevated === (mlAssessment.classification === "POSITIVE")
      ? "CONCORDANT"
      : mlAssessment.classification === "POSITIVE" ? "MODEL_ELEVATED" : "VITALS_ELEVATED";

  return {
    score: clampedScore,
    level,
    breakdown: {
      age: Math.round(ageScore / 0.15),
      heartRate: Math.round(hrScore / 0.20),
      systolicBP: Math.round(sysScore / 0.20),
      diastolicBP: Math.round(diaScore / 0.15),
      oxygenSaturation: Math.round(o2Score / 0.15),
      temperature: Math.round(tempScore / 0.15),
    },
    recommendation,
    disclaimer: "This academic prototype combines project-defined rules with a separately trained UCI research model. Neither layer is a medical diagnosis. A qualified healthcare professional must confirm anything consequential.",
    mlAssessment,
    concordance,
  };
}

function getRecommendation(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "Condition appears stable according to the configured assessment rules. Continue routine monitoring.";
    case "MODERATE":
      return "Increased monitoring is recommended. Consider professional evaluation if symptoms persist or worsen.";
    case "HIGH":
      return "High-risk indicators detected. Prompt healthcare professional evaluation is recommended.";
    case "CRITICAL":
      return "Critical indicators detected. Immediate professional medical evaluation is recommended.";
  }
}

export interface PatientRecord {
  id: string;
  patientName: string;
  vitals: PatientVitals;
  result: RiskResult;
  timestamp: Date;
  notes?: string;
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "LOW": return "#10B981";
    case "MODERATE": return "#F59E0B";
    case "HIGH": return "#EF4444";
    case "CRITICAL": return "#DC2626";
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case "LOW": return "rgba(16, 185, 129, 0.15)";
    case "MODERATE": return "rgba(245, 158, 11, 0.15)";
    case "HIGH": return "rgba(239, 68, 68, 0.15)";
    case "CRITICAL": return "rgba(220, 38, 38, 0.25)";
  }
}
