/**
 * Patient Data Store
 * Manages patient records and assessment history using localStorage.
 */

import type { PatientRecord, PatientVitals, RiskResult } from "./riskEngine";
import { assessRisk } from "./riskEngine";

const STORAGE_KEY = "medirisk_patients";

export function loadPatients(): PatientRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records: PatientRecord[] = JSON.parse(raw);
    return records.map(r => ({
      ...r,
      timestamp: new Date(r.timestamp),
    }));
  } catch {
    return [];
  }
}

export function savePatient(
  patientName: string,
  vitals: PatientVitals,
  notes?: string
): PatientRecord {
  const result: RiskResult = assessRisk(vitals);
  const record: PatientRecord = {
    id: crypto.randomUUID(),
    patientName,
    vitals,
    result,
    timestamp: new Date(),
    notes,
  };

  const patients = loadPatients();
  patients.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));

  return record;
}

export function deletePatient(id: string): void {
  const patients = loadPatients();
  const filtered = patients.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getPatientHistory(patientName: string): PatientRecord[] {
  return loadPatients().filter(
    p => p.patientName.toLowerCase() === patientName.toLowerCase()
  );
}

export function getLatestRecord(patientName: string): PatientRecord | null {
  const history = getPatientHistory(patientName);
  return history.length > 0 ? history[0] : null;
}

export function getAllPatients(): PatientRecord[] {
  return loadPatients();
}

export function getRecentRecords(limit = 10): PatientRecord[] {
  return loadPatients().slice(0, limit);
}
