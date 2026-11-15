# ORBIT-M | EVA Assessment Demo

Interactive static prototype for the NASA Space Apps Challenge 2026. This repository now runs **only the EVA assessment screens**. The earlier "Notice the change / Know what to check" Crew Health Companion page, its navigation, UI modules, styles and tests have been removed from the active project as requested.

## Five-screen flow

1. Welcome screen.
2. Astronaut identification, demo IDs 1–10.
3. Astronaut profile with selectable Normal/Abnormal states for seven synthetic categories. Clicking a category opens a **horizontal reference-range chart** that displays a single fictional sample value, not an invented historical timeline.
4. Pre-EVA input page: heart rate, oxygen saturation, systolic/diastolic blood pressure, body temperature and observed breaths during a 30- or 60-second interval. PP, estimated MAP and breathing rate are calculated live. Clicking one of the seven comparable measures opens a horizontal reference-range chart with the **actual entered value**.
5. Simulated green or red result. A red outcome links to the flagged categories and their charts.

**Ranges provided by the team (inclusive):** heart rate 60–100 bpm; oxygen saturation 95–100%; systolic BP 90–120 mmHg; diastolic BP 60–80 mmHg; PP 40–60 mmHg; estimated MAP 70–100 mmHg; respiratory rate 12–20 per minute. Temperature is recorded only; no threshold was provided.

PP = SBP − DBP. Estimated MAP ≈ DBP + PP/3 (resting approximation). Respiratory rate = breaths counted × 60 / observation duration in seconds.

All astronaut records, profile reference ranges, profile readings, charts and green/red decisions are demonstration-only. None are real astronaut medical measurements, NASA-validated EVA fitness thresholds, diagnoses or operational authorization. The pre-EVA reference charts plot entered values only and never manufacture past observations. Breathing rate alone does not indicate psychological stability or normal lung function.

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000. To test with Node.js 22+: `node --test`.

Public GitHub Pages demo: https://bzeira.github.io/orbit-m-space-apps-2026/

### Source files

- `index.html`: the EVA-only entrypoint (no legacy dashboard).
- `src/eva-flow.mjs`: screen transitions, profiles, report overlays and demonstration outcomes.
- `src/eva-critical.mjs`: vital inputs, calculations, reference charts and validation.
- `assets/eva-flow.css`: the original EVA screens' isolated styling.
- `sw.js`: optional EVA-only offline cache, which clears the older app-shell caches after activation.
- `tests/eva-flow.test.mjs`: automated flow and visualization checks.

The `docs/` folder retains team research and challenge notes as reference material, not as an active module or link from the website. Those documents may describe discontinued prototype functionality.

This independent educational project is not affiliated with or endorsed by NASA.
