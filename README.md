# ORBIT-M — Crew Health Companion

**NASA Space Apps Challenge 2026 · Haifa, Israel · November 14–15, 2026**

> **Working challenge (provided by the team):** [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/). Please verify the challenge is also selected on the official ORBIT-M team page.
>
> **Status:** Demonstrator code committed. The team reports GitHub Pages is live and initial browser view works. New research-module UI and science review still need manual verification. No field testing or clinical validation is claimed.

## The problem
Long-duration spaceflight can affect physical and behavioral health. Astronauts need an easy way to **record daily indicators, understand when their own pattern changes, and decide when to request an appropriate check-in**—even without live access to Earth.

## The prototype
A small, offline-first, dependency-free browser application that:
1. Shows pulse, sleep, mood and temperature for a **fully synthetic** crew member.
2. Compares new inflight readings with the **median of 14 explicitly labeled synthetic preflight days** (a demonstration design, not a NASA monitoring prescription).
3. Flags repeated illustrative changes using **explicit, reviewable** rules and offers context-dependent follow-up questions rather than an opaque "medical AI".
4. Connects risk-explanation cards to **NASA Human Research Program** sources.
5. Accepts new **demo** readings while keeping the simulated preflight baseline unchanged; stores readings only in the local browser.
6. Includes a private psychological-support conversation prompt as a **concept**, not an actual communication service.
7. **Post-EVA Check**: stylized selectable body map and fictional discomfort follow-up timeline, inspired by Maya and Ofir's research and NASA EVA injury evidence.
8. **Habitat Microbiology**: fictional air/surface/water sample logging, with the correct **NASA ISS in-flight** bacterial/fungal CFU reference values, water coliform status, units and citations. Environmental microbes are not the crew's gut microbiome.

This is **not** real astronaut telemetry, a diagnosis, validated risk score, treatment algorithm, or NASA-endorsed tool. Rule thresholds are team-created demonstration parameters; they must be scientifically reviewed before claims beyond a prototype. The app does not implement radiation dosimeter integration, clinical triage, actual medical advice or secure flight data storage.

### Run it locally
No external packages are needed to run the UI.

1. Clone: `git clone https://github.com/Bzeira/orbit-m-space-apps-2026.git`
2. Enter: `cd orbit-m-space-apps-2026`
3. Run: `python -m http.server 8000` (or `py -m http.server 8000` on Windows)
4. Open `http://localhost:8000` in a browser.

To run **both** test suites (requires Node.js 20+): `node --test`.

**Important:** Opening `index.html` directly using a `file://` URL may prevent JavaScript modules from loading. Use a local server. GitHub Pages has been enabled by the team for `main` and repository root. Public demo: https://bzeira.github.io/orbit-m-space-apps-2026/ . Source and CI are public; the newest two modules still need manual browser acceptance testing.

## Evidence and scientific boundaries
The three NASA sources referenced in the interface are:
- [Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)
- [Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)
- [Ongoing HRP Research in Space](https://www.nasa.gov/hrp/ongoing-hrp-research/)

They inform *what matters* in space health. They **do not establish or validate our numeric prototype thresholds**. See [sources and AI disclosure](docs/REFERENCES_AND_AI.md). See [implemented research modules and scientific limitations](docs/RESEARCH_FEATURES.md), [challenge scope and remaining questions](docs/CHALLENGE_BRIEF.md), [risk coverage matrix](docs/RISK_MATRIX.md), and [baseline/triage design](docs/BASELINE_AND_DECISION_ENGINE.md).

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
- [Challenge brief and science questions](docs/CHALLENGE_BRIEF.md)
- [Team responsibilities and two-day sprint](docs/TEAM_PLAN.md)
- [Submission checklist — local vs global](docs/SUBMISSION_CHECKLIST.md)
- [Pitch structure](docs/PITCH.md)
- [References and AI disclosure](docs/REFERENCES_AND_AI.md)
- [Work tracker](https://github.com/Bzeira/orbit-m-space-apps-2026/issues)

## Delivery gates
- [x] Public GitHub repository created after Saturday, 14 Nov 2026 09:00 Israel time
- [x] Initial demo source and synthetic scenarios added
- [x] Run Node engine + research unit tests in GitHub Actions (14/14 passed on 14 Nov 2026)
- [ ] Visually QA **new** research modules on desktop/mobile
- [ ] Confirm official team challenge and review assumptions with science lead
- [x] GitHub Pages deployed from main (the team reports public access; recheck new features in an incognito window)
- [ ] Choose and add team-approved OSI-compliant license; cite all assets and libraries
- [ ] Send local prose summary by **15 Nov, 16:00**
- [ ] Send local pitch or demo by **15 Nov, 17:30**
- [ ] Submit final project and public link on official team **Project** tab by **15 Nov, 23:59** (target 22:00)

## AI disclosure
The planning documents, README, initial app code and new EVA/microbiology demonstrator modules were drafted with assistance from **ChatGPT (OpenAI)** during the hackathon on November 14, 2026. The scientific research document was developed by teammates Maya Dimant and Ofir Nakash. Team review, scientific validation, testing and disclosure in the official submission are required. No NASA affiliation or endorsement is implied.