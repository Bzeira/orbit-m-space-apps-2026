# ORBIT-M — Crew Health Companion

**NASA Space Apps Challenge 2026 · Haifa, Israel · November 14–15, 2026**

> **Working challenge (provided by the team):** [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/). Please verify the challenge is also selected on the official ORBIT-M team page.
>
> **Status:** Demonstrator code committed. The team reports GitHub Pages is live and initial browser view works. New research-module UI and science review still need manual verification. No field testing or clinical validation is claimed.

## The problem
Long-duration spaceflight can affect physical and behavioral health. Astronauts need an easy way to **record daily indicators, understand when their own pattern changes, and decide when to request an appropriate check-in**—even without live access to Earth.

## The prototype
A small, local-first, dependency-free browser application that:
1. Shows pulse, sleep, mood and temperature for a **fully synthetic** crew member.
2. **Guided 60-second judge demo:** four fictional mission days, longitudinal trend and decisions that reuse the existing engine. Starting or ending the walkthrough preserves the user's previous dashboard entries.
3. Compares new inflight readings with the **median of 14 explicitly labeled synthetic preflight days** (a demonstration design, not a NASA monitoring prescription).
4. Flags repeated illustrative changes using **explicit, reviewable** rules and offers context-dependent follow-up questions rather than an opaque "medical AI".
5. Links concise in-app source notes to primary NASA Human Research Program and medical-standards resources, without lengthy hazard-explanation cards.
6. Accepts new **demo** readings while keeping the simulated preflight baseline unchanged; stores readings only in the local browser.
7. **Mission configuration and two scheduled fictional check-ins each day** (morning and evening) plus optional extra entries. This schedule is our demonstration design, not NASA's.
8. **Dedicated Mental Well-being:** mood, stress, anxiety, fatigue, concentration, connection, sleep quality and motivation; voluntary fictional private-support request, no actual messaging. Scheduled physiological readings also update the existing vitals trend.
9. **Post-EVA Check**: interactive front/back SVG body map with pointer-hover highlights, click/touch and keyboard selection, synchronized multi-select regions with independent 1–10 pain ratings, a stylized body map and fictional follow-up timeline, inspired by Maya and Ofir's research and NASA EVA injury evidence.
10. **Habitat Microbiology**: fictional air/surface/water sample logging, with NASA ISS in-flight bacterial/fungal CFU reference values, water coliform status, units and citations. Environmental microbes are not the crew's gut microbiome.
11. **Post-EVA Possible DCS Concern Screen (educational only)**: select a fictional pressure exposure history and NASA-listed symptoms. The UI explains possible decompression-related concern or need for urgent medical review, **never diagnoses or excludes DCS and never reports a risk percentage**. The screen first checks neurological and cardiopulmonary findings, then offers milder symptoms, then optionally links suit-contact discomfort. Pupil symmetry, speech, mental clarity, and limb coordination observations are included. The symptom groupings are from the 2026 NASA OCHMO technical brief; **no questionnaire can rule out Type II DCS**. Doppler/ultrasound appears only as a clinician-considered supplemental assessment, not a definitive test or a treatment order.

12. **Cardiovascular BP / PP / estimated MAP:** user-entered **fictional** systolic/diastolic readings with mission day and AM/PM/extra slots; conventional PP and MAP estimates, individual synthetic preflight comparison, context labels for habitat/EVA/return to gravity, a gravity-return milestone and transparent trend visualization. This module is based on research contributed by teammate Itay Lipsky and cross-checked against NASA and the American Heart Association. It **does not** directly measure cardiac stroke volume, change the MAP formula to 1/2 during EVA, prescribe exercise or diagnose cardiovascular disease.

This is **not** real astronaut telemetry, a diagnosis, validated risk score, treatment algorithm, or NASA-endorsed tool. Rule thresholds are team-created demonstration parameters; they must be scientifically reviewed before claims beyond a prototype. The app does not implement radiation dosimeter integration, a clinically validated triage tool, actual medical advice, private psychological messaging or secure medical storage.

### Run it locally
No external packages are needed to run the UI.

1. Clone: `git clone https://github.com/Bzeira/orbit-m-space-apps-2026.git`
2. Enter: `cd orbit-m-space-apps-2026`
3. Run: `python -m http.server 8000` (or `py -m http.server 8000` on Windows)
4. Open `http://localhost:8000` in a browser.

To run all automated test suites (requires Node.js 20+): `node --test`.

**Important:** Opening `index.html` directly using a `file://` URL may prevent JavaScript modules from loading. Use a local server. GitHub Pages has been enabled by the team for `main` and repository root. Public demo: https://bzeira.github.io/orbit-m-space-apps-2026/ . Source and CI are public; the newest two modules still need manual browser acceptance testing.


> **Offline support:** A scoped service worker pre-caches the static UI on a successful first online visit, so a later offline re-open can use locally cached files. This has automated offline-cache tests, but still requires manual browser QA on the published HTTPS URL. External NASA research links still require the internet. No actual private medical records should be entered.

### Open the app offline after first visit
1. Open the public HTTPS site while connected. Confirm that the small Offline notice says that the static app shell is ready.
2. Disconnect from the network, close that tab and revisit the same link.
3. The interface and code should load from the browser cache; the external NASA research links cannot be opened without connectivity.
4. If it fails, check browser service-worker/storage settings. Do not present offline availability as guaranteed until the team performs a real offline browser test.

## Evidence and scientific boundaries
The three NASA sources referenced in the interface are:
- [Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)
- [Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)
- [Ongoing HRP Research in Space](https://www.nasa.gov/hrp/ongoing-hrp-research/)

They inform *what matters* in space health. They **do not establish or validate our numeric prototype thresholds**. See [sources and AI disclosure](docs/REFERENCES_AND_AI.md). See [cardiovascular source audit and limitations](docs/CARDIOVASCULAR_RESEARCH.md), [mission, mental-health and urgent-first EVA workflow](docs/WORKFLOW_UPDATES.md), [implemented research modules and scientific limitations](docs/RESEARCH_FEATURES.md), [challenge scope and remaining questions](docs/CHALLENGE_BRIEF.md), [risk coverage matrix](docs/RISK_MATRIX.md), and [baseline/triage design](docs/BASELINE_AND_DECISION_ENGINE.md).

## Team Members (5 active participants)

| Name | Known skills and proposed contribution |
| --- | --- |
| **Barak Zeira** | Only confirmed programmer; software development and integration |
| **Maya Dimant** | Biology, chemistry, mathematics, scientific review and visual design |
| **Ofir Nakash** | Proposed: research, NASA reference audit; skills to confirm |
| **Inbar** | Proposed: user research, pitch and story; skills to confirm |
| **Itay Lipsky** | Mechanical engineering, MATLAB, SolidWorks, sensors, CAD; Arduino learning if relevant |

**Roles are proposals, not confirmed assignments.**

## Hackathon documentation
- [Guided one-minute judge walkthrough and 4-minute pitch](docs/JUDGE_WALKTHROUGH.md)
- [Challenge brief and science questions](docs/CHALLENGE_BRIEF.md)
- [Team responsibilities and two-day sprint](docs/TEAM_PLAN.md)
- [Submission checklist — local vs global](docs/SUBMISSION_CHECKLIST.md)
- [Pitch structure](docs/PITCH.md)
- [References and AI disclosure](docs/REFERENCES_AND_AI.md)
- [Work tracker](https://github.com/Bzeira/orbit-m-space-apps-2026/issues)

## Delivery gates
- [x] Public GitHub repository created after Saturday, 14 Nov 2026 09:00 Israel time
- [x] Initial demo source and synthetic scenarios added
- [x] Add automated tests and syntax checks (see GitHub Actions for latest results)
- [ ] Visually QA **new** research modules on desktop/mobile
- [ ] Confirm official team challenge and review assumptions with science lead
- [x] GitHub Pages deployed from main (the team reports public access; recheck new features in an incognito window)
- [ ] Choose and add team-approved OSI-compliant license; cite all assets and libraries
- [ ] Send local prose summary by **15 Nov, 16:00**
- [ ] Send local pitch or demo by **15 Nov, 17:30**
- [ ] Submit final project and public link on official team **Project** tab by **15 Nov, 23:59** (target 22:00)

## AI disclosure
The planning documents, README, initial app code and EVA/microbiology/DCS symptom/mental-health/mission check-in/cardiovascular demonstrator modules and guided mission storyline were drafted with assistance from **ChatGPT (OpenAI)** during the hackathon on November 14, 2026. The EVA and microbial research document was developed by Maya Dimant and Ofir Nakash, and the blood-pressure research outline was prepared by Itay Lipsky. Team review, scientific validation, testing and disclosure in the official submission are required. No NASA affiliation or endorsement is implied.