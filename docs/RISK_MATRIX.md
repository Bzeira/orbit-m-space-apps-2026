# Coverage matrix: 17 spaceflight risks

The team's working list was collected on Nov 14, 2026. **A risk listed here is NOT a feature implemented in the app.** The MVP implements synthetic trends only.

| # | Risk | Plausible measurement / caution | Status | Named research owner |
|---|---|---|---|---|
| 1 | Altered immune response | Clinical assessment, lab tests and symptoms; smartwatch cannot diagnose immune function | Research | Not assigned |
| 2 | Vestibular / sensorimotor adaptation | Motion sickness symptom log and controlled balance tests | Research | Not assigned |
| 3 | Cardiovascular adaptations | Resting pulse, measured BP, exercise/posture and mission context | Synthetic pulse demo | Itay |
| 4 | Decompression sickness (DCS) | EVA pressure/exposure and authorized mission medical procedures, not daily wellness scores | Safety research only | Ofir + Maya |
| 5 | Microbiome / microorganisms | Periodic microbial sampling and lab analysis, not instant gut-disease inference | Research | Ofir + Maya |
| 6 | Hypoxia | Verified oxygen/suit environmental sensors plus clinical assessment | Safety research only | Not assigned |
| 7 | Food / nutrition | Meal intake, nutritional assessments | Roadmap | Not assigned |
| 8 | EVA-related injury | Voluntary symptom/injury reporting, EVA task/exposure context | Research | Ofir + Maya |
| 9 | Reduced muscle and aerobic fitness | Exercise records, functional tests | Roadmap | Itay |
| 10 | Bone density changes | Periodic dedicated scans such as DXA, not daily wearable-derived density | Research | Not assigned |
| 11 | Neurological, cognitive and ocular (SANS) | Symptom reports, cognitive measures, eye exams under medical supervision | Research | Inbar |
| 12 | Behavioral / psychological health | Private voluntary mood and wellbeing check-ins | Synthetic mood demo; no psychiatric diagnosis | Not assigned |
| 13 | Crew teamwork | Confidential aggregate team questionnaire, no colleague surveillance | Research | Not assigned |
| 14 | Sleep / circadian disruption | Sleep log, actigraphy, circadian schedule | Synthetic sleep demo | Inbar |
| 15 | Cabin systems / pressure | Calibrated cabin CO2, O2, pressure telemetry and engineering limits | Safety research only | Not assigned |
| 16 | Post-landing dynamic-load injury | Landing phase and postflight functional testing | Research | Itay |
| 17 | Space radiation | Exposure dosimetry and mission duration, not a diagnosis of cancer | Research | Inbar |

## Priorities for the hackathon

1. **Build and validate:** personal baseline, pulse, sleep, optional private mood and temperature trend; transparent follow-up questions.
2. **Add credible science:** Maya, Ofir and Inbar gather exact NASA citations, verify claims and identify data actually used. The 2025 Spaceflight Standard Measures paper supports phase-dependent monitoring, not our numerical demo cutoffs.
3. **Plan realistic hardware:** Itay checks sensor acquisition/limitations for cardio and basic exercise. Do not imply hardware is working until it has been tested.
4. **Defer safety-critical automation:** DCS, hypoxia and cabin anomalies must follow established aerospace and clinical protocols. Never infer safety from a personal baseline.

NASA sources:
- https://www.nasa.gov/hrp/risks/
- https://www.nasa.gov/hhp/human-system-risks/
- https://www.nature.com/articles/s41526-025-00532-6
- https://www.nasa.gov/reference/jsc-behavioral-health/

NASA Five Hazards playlist shared by the team: https://youtube.com/playlist?list=PLiuUQ9asub3RRA-BMh7wLsU7V6gUUSRwH
Its individual videos were not independently transcribed or analyzed in this document.
