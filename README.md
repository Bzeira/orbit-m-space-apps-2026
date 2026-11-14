# ORBIT-M — Crew Health Companion

**NASA Space Apps Challenge 2026 · Haifa, Israel · November 14–15, 2026**

> **Working challenge (provided by the team):** [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/). Please verify the challenge is also selected on the official ORBIT-M team page.
>
> **Status:** Demonstrator code committed. Browser QA, scientific review, and live deployment **pending**. No field testing or clinical validation is claimed.

## The problem
Long-duration spaceflight can affect physical and behavioral health. Astronauts need an easy way to **record daily indicators, understand when their own pattern changes, and decide when to request an appropriate check-in**—even without live access to Earth.

## The prototype
A small, offline-first, dependency-free browser application that:
1. Shows pulse, sleep, mood and temperature for a **fully synthetic** crew member.
2. Compares a new reading with that member's **first four simulated baseline days**.
3. Flags illustrative changes using **explicit, reviewable** rules rather than an opaque "medical AI".
4. Connects risk-explanation cards to **NASA Human Research Program** sources.
5. Accepts new **demo** readings and stores them only in the local browser.

This is **not** real astronaut telemetry, a diagnosis, validated risk score, treatment algorithm, or NASA-endorsed tool. Rule thresholds are team-created demonstration parameters; they must be scientifically reviewed before claims beyond a prototype. The app does not implement radiation dosimeter integration, clinical triage, actual medical advice or secure flight data storage.

### Run it locally
No external packages are needed to run the UI.

1. Clone: `git clone https://github.com/Bzeira/orbit-m-space-apps-2026.git`
2. Enter: `cd orbit-m-space-apps-2026`
3. Run: `python -m http.server 8000` (or `py -m http.server 8000` on Windows)
4. Open `http://localhost:8000` in a browser.

To run the committed engine tests (requires Node.js 20+): `node --test tests/engine.test.mjs`.

**Important:** Opening `index.html` directly using a `file://` URL may prevent JavaScript modules from loading. Use a local server. For an online public demo, enable GitHub Pages for the `main` branch and root folder in repository Settings → Pages (not enabled by this update).

## Evidence and scientific boundaries
The three NASA sources referenced in the interface are:
- [Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)
- [Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)
- [Ongoing HRP Research in Space](https://www.nasa.gov/hrp/ongoing-hrp-research/)

They inform *what matters* in space health. They **do not establish or validate our numeric prototype thresholds**. See [sources and AI disclosure](docs/REFERENCES_AND_AI.md). See [challenge scope and remaining questions](docs/CHALLENGE_BRIEF.md).

## Team Members

| Name | Known skills and proposed contribution |
| --- | --- |
| **Barak Zeira** | Only confirmed programmer; software development and integration |
| **Maya Dimant** | Biology, chemistry, mathematics, scientific review and visual design |
| **Ofir Nakash** | Proposed: research, NASA reference audit; skills to confirm |
| **Inbar** | Proposed: user research, pitch and story; skills to confirm |
| **Itay Lipsky** | Mechanical engineering, MATLAB, SolidWorks, sensors, CAD; Arduino learning if relevant |
| **Eyal Danino** | Proposed: QA, demo capture and submission; skills to confirm |

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
- [ ] Run and visually QA app on desktop/mobile; execute tests
- [ ] Confirm official team challenge and review assumptions with science lead
- [ ] Publish functional public demo link and test it without login
- [ ] Choose and add team-approved OSI-compliant license; cite all assets and libraries
- [ ] Send local prose summary by **15 Nov, 16:00**
- [ ] Send local pitch or demo by **15 Nov, 17:30**
- [ ] Submit final project and public link on official team **Project** tab by **15 Nov, 23:59** (target 22:00)

## AI disclosure
The planning documents, README and initial app code were drafted with assistance from **ChatGPT (OpenAI)** during the hackathon on November 14, 2026. Team review, scientific validation, testing and disclosure in the official submission are required. No NASA affiliation or endorsement is implied.