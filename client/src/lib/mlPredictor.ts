/**
 * Design reminder — Crimson Pulse: transparent dark clinical-research UI.
 * This is an offline academic demonstration of a model trained by the local
 * reproducible UCI pipeline; it is not a clinical decision-support model.
 */
import modelArtifact from "./models/uciRandomForestAcademic.json";
import type { PatientVitals, UciModelInputs } from "./riskEngine";

type ForestNode = { f: number; t: number; l: number; r: number; p: number | null };
type ForestArtifact = {
  model_name: string;
  training_dataset: string;
  target: string;
  feature_order: string[];
  imputation_medians: number[];
  trees: ForestNode[][];
  feature_importance: Record<string, number>;
  test_metrics: { accuracy: number; precision: number; recall: number; f1: number; roc_auc: number };
};

const artifact = modelArtifact as unknown as ForestArtifact;

export interface MlAssessment {
  model: string;
  dataset: string;
  target: string;
  probability: number;
  classification: "POSITIVE" | "NEGATIVE" | "LIMITED DATA";
  coverage: { provided: number; total: number; missing: string[] };
  globallyInfluentialFeatures: { key: string; label: string; importance: number }[];
  validation: { accuracy: number; precision: number; recall: number; f1: number; rocAuc: number };
  note: string;
}

const featureLabels: Record<string, string> = {
  age: "Age",
  sex: "Sex coding",
  cp: "Chest pain type",
  trestbps: "Resting systolic BP",
  chol: "Serum cholesterol",
  fbs: "Fasting blood sugar flag",
  restecg: "Resting ECG result",
  thalach: "Maximum exercise heart rate",
  exang: "Exercise-induced angina",
  oldpeak: "ST depression",
  slope: "ST-segment slope",
  ca: "Fluoroscopy vessel count",
  thal: "Thalassemia result",
};

function walkTree(nodes: ForestNode[], values: number[]): number {
  let nodeIndex = 0;
  while (true) {
    const node = nodes[nodeIndex];
    if (node.p !== null) return node.p;
    nodeIndex = values[node.f] <= node.t ? node.l : node.r;
  }
}

function finiteValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function predictUciHeartDiseasePattern(vitals: PatientVitals, inputs?: UciModelInputs): MlAssessment {
  const sourceValues: Record<string, number | undefined> = {
    age: vitals.age,
    trestbps: vitals.systolicBP,
    sex: finiteValue(inputs?.sex),
    cp: finiteValue(inputs?.chestPainType),
    chol: finiteValue(inputs?.cholesterol),
    fbs: finiteValue(inputs?.fastingBloodSugar),
    restecg: finiteValue(inputs?.restingEcg),
    thalach: finiteValue(inputs?.maxExerciseHeartRate),
    exang: finiteValue(inputs?.exerciseAngina),
    oldpeak: finiteValue(inputs?.stDepression),
    slope: finiteValue(inputs?.stSlope),
    ca: finiteValue(inputs?.majorVessels),
    thal: finiteValue(inputs?.thalassemia),
  };

  const missing = artifact.feature_order.filter((feature) => sourceValues[feature] === undefined);
  const values = artifact.feature_order.map((feature, index) => sourceValues[feature] ?? artifact.imputation_medians[index]);
  const probability = artifact.trees.reduce((sum, tree) => sum + walkTree(tree, values), 0) / artifact.trees.length;
  const provided = artifact.feature_order.length - missing.length;
  const lowCoverage = provided < 8;

  return {
    model: artifact.model_name,
    dataset: artifact.training_dataset,
    target: artifact.target,
    probability: Math.round(probability * 1000) / 10,
    classification: lowCoverage ? "LIMITED DATA" : probability >= 0.5 ? "POSITIVE" : "NEGATIVE",
    coverage: { provided, total: artifact.feature_order.length, missing },
    globallyInfluentialFeatures: Object.entries(artifact.feature_importance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([key, importance]) => ({ key, label: featureLabels[key], importance: Math.round(importance * 1000) / 10 })),
    validation: {
      accuracy: artifact.test_metrics.accuracy,
      precision: artifact.test_metrics.precision,
      recall: artifact.test_metrics.recall,
      f1: artifact.test_metrics.f1,
      rocAuc: artifact.test_metrics.roc_auc,
    },
    note: lowCoverage
      ? "Limited model-input coverage: blank UCI features were median-imputed from the training data. Record a full research feature set before interpreting the preview."
      : "Academic UCI pattern estimate. This probability is not a diagnosis, treatment recommendation, or clinically validated risk score.",
  };
}

export const UCI_MODEL_METADATA = {
  rows: 303,
  missing: "ca: 4, thal: 2",
  split: "Stratified 75/25 split • random_state 42",
  evaluation: [
    { model: "Logistic Regression", accuracy: 86.84, precision: 83.78, recall: 88.57, f1: 86.11, rocAuc: 93.10 },
    { model: "Decision Tree", accuracy: 73.68, precision: 70.27, recall: 74.29, f1: 72.22, rocAuc: 83.62 },
    { model: "Random Forest", accuracy: 86.84, precision: 83.78, recall: 88.57, f1: 86.11, rocAuc: 94.49 },
  ],
} as const;
