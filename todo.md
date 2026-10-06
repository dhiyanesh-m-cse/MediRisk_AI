# MediRisk Hybrid Assessment Enhancement

- [x] Review the UCI Heart Disease and MIMIC-IV Demo documentation, data availability, and permissible role in the prototype.
- [x] Acquire and inspect the UCI Heart Disease training data, documenting cleaning and feature decisions.
- [x] Compare logistic regression, decision tree, and random forest models using a reproducible held-out evaluation.
- [x] Define the client-side ML inference interface, dataset provenance, and explicit academic-use disclosures.
- [x] Add a two-layer assessment view with rule score, ML probability, model factors, and disagreement warning.
- [x] Add a model laboratory page showing the reproducible pipeline, comparison metrics, and MIMIC-IV validation roadmap.
- [x] Test the end-to-end assessment flow, including validation, storage, risk presentation, and responsive visual design.
- [x] Save a delivery checkpoint and provide the enhanced project to the user.

# Account-Based Patient App Release

- [x] Upgrade MediRisk to authenticated user, database, and protected file-storage capabilities.
- [x] Add a user profile record and render the authenticated user’s chosen display name in the dashboard.
- [x] Create protected patient-record tables for assessments and uploaded health materials.
- [x] Build a dedicated upload center for reports, medical-history files, and patient images with file-type and size safeguards.
- [x] Build a private health-history library that lists, previews, downloads, and removes only the current user’s uploads through owner-checked access routes.
- [x] Add authentication entry, sign-out controls, and intentional empty/loading/error states.
- [x] Add installable PWA metadata and keep private account APIs and health-file routes out of the PWA cache.
- [x] Verify account isolation, safe upload validation, owner-scoped deletion, assessment persistence queries, anonymous file denial, PWA shell privacy boundaries, and the production build; then save the final publish-ready checkpoint.
