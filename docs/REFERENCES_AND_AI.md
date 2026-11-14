# Sources, assumptions, licences and AI use

## Official 2026 selected challenge
- [NASA Space Apps Challenge 2026 — Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/)
- The team must verify the official ORBIT-M team page names the same challenge.

## Primary sources actually referenced inside the demonstration
| Source | Link | Exact role in the prototype |
|---|---|---|
| NASA Human Research Program, Five Hazards of Human Spaceflight | https://www.nasa.gov/hrp/hazards/ | Explains isolation/confinement and distance-from-Earth context cards; references alongside example trend flags |
| NASA Human Research Program, Risks of Human Spaceflight | https://www.nasa.gov/hrp/risks/ | Explains cardiovascular, reduced fitness, sleep and behavioral risks; linked from example flags |
| NASA Human Research Program, Ongoing Research in Space | https://www.nasa.gov/hrp/ongoing-hrp-research/ | Background on current human-spaceflight investigations; linked in README and challenge brief |

**No public NASA numeric health telemetry has been incorporated into the current engine.** The sources justify *which issues to monitor*, not our demo thresholds. The displayed readings are wholly **synthetic**.

## Further sources not yet integrated
- [Canadian Space Agency: Monitoring Radiation for Astronaut Health](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp) — challenge resource, not coded into the demo.
- [NASA Open Science Data Repository](https://osdr.nasa.gov/) — possible source of public studies/metadata, not yet downloaded or incorporated.
- [NASA Life Sciences Portal](https://nlsp.nasa.gov/) — some data require access requests.
- [NASA Space Apps Connect discussion on missing unified health dataset](https://github.com/nasa/spaceapps/discussions/2025) — community guidance, not an official data grant or medical standard.

## Evidence and limitations
- The first four **simulated** daily records are used as a toy baseline. Four samples are not sufficient for a medically validated personal baseline.
- The engine in src/engine.mjs contains project-authored change thresholds (15% pulse deviation, sleep shift of 1.5 hours, two low mood scores, demo temperature flag at 38°C).
- **These thresholds are illustrative, not derived from, endorsed by, or certified against NASA medical standards**. No diagnosis, treatment or recommendation to change medications is made.
- The software stores new demo data locally in browser storage. It is **not** a secure health record and must not receive real astronaut or patient data.

## Original code, third-party materials, licensing
The application is written as plain HTML/CSS/JavaScript with no external runtime dependencies. Node's built-in test runner powers tests. No third-party fonts, stock photographs, NASA logos, copied dashboards or library source code are included. Team must agree on and add an OSI-compatible source license before the global submission. See [2026 NASA Space Apps terms](https://www.spaceappschallenge.org/legal/).

## AI-use log
| AI system | Date | What it did | Human verification still needed |
|---|---|---|---|
| ChatGPT (OpenAI) | 2026-11-14 | Drafted README, planning documentation, initial UI, rule-based demo engine, synthetic examples and test definitions. Looked up NASA HRP science and challenge-related sources. | Review all scientific statements, run tests, check application on browsers, confirm source use, choose licence, and disclose AI assistance on official form. |

Additional contributions using AI should be added here, including images, text, code, translations or data analyses. Any generated imagery used for the final project should be labeled according to NASA Space Apps rules.

## Verification log
- [x] The README and application source are committed to public GitHub after opening time on 2026-11-14.
- [ ] The sample browser flow has been manually tested by a team member.
- [ ] Node tests passed in team environment.
- [ ] The on-page statements and assumptions are approved by the team science reviewer.
- [ ] Project uses an actual public NASA numerical dataset or makes a scientifically substantive and clearly cited use of official challenge resources.
- [ ] Final demo and project links verified in an incognito browser.
- [ ] AI disclosures and licensing included on official submission.