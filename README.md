# ORBIT-M | EVA Assessment Demo

Interactive static prototype for the NASA Space Apps Challenge 2026. This repository now runs **only the EVA assessment screens**. The earlier "Notice the change / Know what to check" Crew Health Companion page, its navigation, UI modules, styles and tests have been removed from the active project as requested.

## Five-screen flow

1. Welcome screen.
2. Astronaut identification, demo IDs 1–10.
3. Astronaut profile with selectable Normal/Abnormal states for seven synthetic categories. Clicking a category opens a **horizontal reference-range chart** that displays a single fictional sample value, not an invented historical timeline.
4. Pre-EVA input page: heart rate, oxygen saturation, systolic/diastolic blood pressure, body temperature and observed breaths during a 30- or 60-second interval. PP, estimated MAP and breathing rate are calculated live. Clicking one of the seven comparable measures opens a horizontal reference-range chart with the **actual entered value**.
5. Simulated three-way result: green when all seven numeric checks are comfortably inside their bands and profile statuses are Normal; amber **Needs Further Inspection** when one or more numeric readings are inside but close to a band edge; red when any numeric reading is out of range or a profile category is Abnormal. The amber screen uses a soft-blue pixel-art city/park scene with a custom bitmap-style heading, retaining ORBIT-M's frame and modal. Its CTA opens the detailed near-limit readings, and each reading links to its reference chart. Red outcomes link to the flagged categories and charts.

**Illustrative near-limit rule:** a value inside a user-provided reference interval is marked for further inspection when it is within the outer **10% of the interval width** at either end. This is a UI/demo classification, **not** a validated clinical or NASA EVA threshold. It applies even with three or more near-limit readings, so these results are never accidentally shown as green. Out-of-range readings always take priority and show red. Temperature is recorded without a range and is not assigned a category.\n\n**Ranges provided by the team (inclusive):** heart rate 60–100 bpm; oxygen saturation 95–100%; systolic BP 90–120 mmHg; diastolic BP 60–80 mmHg; PP 40–60 mmHg; estimated MAP 70–100 mmHg; respiratory rate 12–20 per minute. Temperature is recorded only; no threshold was provided.

PP = SBP − DBP. Estimated MAP ≈ DBP + PP/3 (resting approximation). Respiratory rate = breaths counted × 60 / observation duration in seconds.

All astronaut records, profile reference ranges, profile readings, charts and green/amber/red decisions are demonstration-only. None are real astronaut medical measurements, NASA-validated EVA fitness thresholds, diagnoses or operational authorization. The pre-EVA reference charts plot entered values only and never manufacture past observations. Breathing rate alone does not indicate psychological stability or normal lung function.

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
