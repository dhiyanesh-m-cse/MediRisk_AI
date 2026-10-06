# MediRisk Design Brainstorm

## Context
MediRisk is an Intelligent Patient Risk Assessment System — a healthcare application for recording patient vitals, calculating risk scores (0-100), classifying risk levels (Low/Moderate/High/Critical), and generating recommendations. The target users are healthcare staff, clinic assistants, medical students, and administrators.

The reference UI shows a dark, mobile-first design with deep black/crimson backgrounds, ECG waveform visualization, a 3D anatomical heart, and clean data cards.

---

## Three Design Approaches

### Approach 1: "Crimson Pulse"
**Very Brief Intro:** A cinematic, dark biomedical interface inspired by ICU monitoring systems — deep blacks with crimson accent light, clinical precision meets dramatic visual storytelling.
**Probability:** 0.08

### Approach 2: "Clinical Frost"
**Very Brief Intro:** A clean, cold-toned medical interface with frosted glass panels, steel-blue accents, and soft ambient lighting — feels like a modern hospital dashboard with glassmorphism.
**Probability:** 0.04

### Approach 3: "Bioluminescent"
**Very Brief Intro:** A nature-inspired dark interface using bioluminescent greens and teals against obsidian backgrounds, evoking the feeling of living organic systems being monitored.
**Probability:** 0.03

---

## Selected Approach: Crimson Pulse

### Design Movement
Medical Futurism — drawing from ICU monitor aesthetics, surgical lighting, and the visceral beauty of anatomical visualization. Think the interface of a next-gen surgical console.

### Core Principles
1. **Dramatic Contrast** — Near-pure black backgrounds with targeted crimson/rose illumination create clinical urgency without noise
2. **Data as Hero** — Every number, every waveform is the centerpiece; the UI disappears so the health data speaks
3. **Anatomical Warmth** — The crimson palette isn't cold technology; it evokes blood, life, and the human body
4. **Mobile-First Precision** — Designed for touch interaction on a phone-sized viewport, with every element precisely sized

### Color Philosophy
- **Background:** Pure near-black (#0A0A0A to #111111) — creates the canvas of an operating room in darkness
- **Primary Accent:** Crimson Rose (#DC2626 to #EF4444) — the color of blood, life, and medical urgency
- **Secondary:** Warm white (#F5F5F5) for data text, soft rose (#FECACA) for subtle highlights
- **Status Colors:** Emerald (#10B981) for normal/safe, Amber (#F59E0B) for moderate, Crimson (#EF4444) for critical
- **Surface:** Slightly elevated dark cards (#1A1A1A to #222222) with subtle crimson edge glow

### Layout Paradigm
- **Mobile-Stacked Cards** — Full-width cards stacked vertically within a max-width container simulating a phone screen
- **Circular Data Rings** — Heart rate and key metrics displayed in semi-circular gauge components
- **Full-Bleed Waveforms** — ECG waveforms span the full card width with no padding, creating immersive data visualization
- **Bottom Navigation Bar** — Persistent tab bar with icon-only navigation

### Signature Elements
1. **Crimson Glow Edges** — Cards and interactive elements have a subtle crimson box-shadow that pulses gently on active states
2. **ECG Waveform Animations** — Real-time animated heartbeat line with smooth canvas-based drawing
3. **Gauge Semicircles** — Progress/score indicators rendered as partial circle gauges with gradient fills

### Interaction Philosophy
- Touch-friendly with generous tap targets (44px minimum)
- Swipe transitions between tabs
- Subtle haptic-style bounce on card interactions
- Waveform animation on load creates a "the patient is alive" feeling

### Animation
- **Entrance:** Cards fade in with a 200ms stagger (stagger by 60ms)
- **Gauges:** Animate from 0 to target value over 800ms with easeOutCubic
- **Waveform:** Continuous CSS animation creating a flowing heartbeat line
- **Tab Switch:** Smooth opacity crossfade with 200ms duration
- **Buttons:** Scale(0.97) on press with 160ms snap-back

### Typography System
- **Display/Headings:** "Space Grotesk" — geometric, modern, authoritative
- **Body/Data:** "DM Sans" — clean, highly legible for medical numbers
- **Hierarchy:**
  - H1 (Greeting): 28px, bold, white
  - H2 (Section titles): 20px, semibold, white/90
  - H3 (Card titles): 16px, medium, white/80
  - Body: 14px, regular, white/70
  - Data values: 36-48px, bold, white
  - Units/labels: 12px, medium, white/50

### Brand Essence
**A cinematic patient risk assessment platform that transforms vital signs into actionable medical intelligence — designed for the professionals who make life-or-death decisions.**

Personality: **Urgent · Precise · Authoritative**

### Brand Voice
- Headlines feel commanding: "How do you feel today?" (personal), "Risk Score: 74/100 — HIGH" (direct)
- CTAs are clinical and action-oriented: "Record ECG", "Assess Risk", "View History"
- Microcopy is reassuring: "Continue routine monitoring", "Prompt professional evaluation"
- Never generic: No "Welcome to our website" or "Get started today"

### Wordmark & Logo
A stylized heartbeat line forming the letter "M" inside a circular badge — the M shape created by an ECG spike pattern, rendered in crimson gradient on transparent/dark background.

### Signature Brand Color
**Crimson Rose (#DC2626)** — This is THE MediRisk color. It appears in the gauge arcs, waveform lines, active states, and the logo. It's unmistakable.

## Style Decisions

- Every primary screen carries a visible MediRisk signature: the heartbeat-M badge, a Crimson Rose ECG trace, or a high-contrast risk/data readout above the fold.
- Subjective inputs are presented as **clinical intake signals** with restrained labels and diagnostic-style states rather than consumer-wellness emoji controls.
- Crimson light is treated as monitoring-console illumination: it identifies active channels, urgent actions, and instrument surfaces without becoming a generic background gradient.
