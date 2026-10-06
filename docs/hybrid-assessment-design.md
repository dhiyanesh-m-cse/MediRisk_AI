# MediRisk Hybrid Assessment Design

## Decision Contract

MediRisk presents two independent academic signals rather than merging them into a clinical diagnosis. The existing rule-based layer continues to calculate a `0–100` score from age, heart rate, blood pressure, oxygen saturation, and temperature. The UCI machine-learning layer estimates the probability of the historical UCI binary target `num > 0` using a separately collected set of cardiovascular-study attributes. The UI must name the source data and explicitly distinguish the two feature sets.

| Layer | Inputs | Output | Intended role |
| --- | --- | --- | --- |
| Rule assessment | Age, resting heart rate, systolic/diastolic BP, SpO₂, temperature, optional respiratory rate | `0–100` project score and four project risk bands | Existing vital-sign triage demonstration |
| UCI ML assessment | 13 UCI variables, including chest-pain type, cholesterol, exercise factors, fluoroscopy vessel count and thalassemia result | Probability of UCI target `num > 0`, positive/negative research label | Separate pattern-recognition demonstration |
| Concordance check | Rule band and ML probability label | Agreement, elevated-ML, or divergent signal | Makes disagreement visible rather than hiding it |

## Reproducible UCI Experiment

The app’s model laboratory documents a stratified 75/25 train/test split with `random_state=42`. Question-mark placeholders were converted to missing values and the median was calculated on training data for imputation. All targets were binarized as `num > 0`. The model-selection rule was highest F1 score, with ROC-AUC and then accuracy as tie-breakers.

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | Selected |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Logistic Regression | 86.84% | 83.78% | 88.57% | 86.11% | 93.10% | No |
| Decision Tree | 73.68% | 70.27% | 74.29% | 72.22% | 83.62% | No |
| Random Forest | 86.84% | 83.78% | 88.57% | 86.11% | 94.49% | **Yes** |

The selected Random Forest is serialized for offline client-side demonstration. Its most influential fitted features were thalassemia result (`0.17958`), chest pain type (`0.16271`), number of fluoroscopy-colored major vessels (`0.13201`), and maximum achieved heart rate (`0.11008`). Feature importance is a fitted-model ranking, not a causal explanation or individual clinical rationale.

> **Safety boundary.** The held-out test results above are not external clinical validation. The output does not diagnose heart disease, determine treatment, or replace clinician judgment.

## MIMIC-IV Demo Role

The MIMIC-IV Demo’s openly available 100-patient sample will appear in the laboratory as a future schema-mapping and validation track. It must not be pooled with the UCI training evaluation because it represents a distinct, deidentified critical-care data source with a different population and collection context. A future study would obtain appropriate access for full MIMIC-IV, map time-bounded vital/clinical variables, preregister external-validation metrics, and evaluate calibration and subgroup performance.

## Sources

1. [UCI Machine Learning Repository — Heart Disease](https://archive.ics.uci.edu/dataset/45/heart%2BdiseaseHeart)
2. [PhysioNet — MIMIC-IV Clinical Database Demo v2.2](https://physionet.org/content/mimic-iv-demo/2.2/)
