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

## November 14: additional research implementation
Maya Dimant and Ofir Nakash produced a research document covering EVA symptoms and habitat microbial monitoring. The team retained original exploratory claims with incomplete numeric references as unverified. ChatGPT assisted with integrating **research-backed, synthetic demonstrations** into the public site: a Post-EVA self-report timeline and ISS environmental sampling log.

Official references actually used for those modules:
- NASA OCHMO-TB-046, *Microbiology in Spaceflight Overview*, Rev A, May 19 2025, **p. 10** for ISS in-flight CFU limits (air: bacteria 1,000 and fungi 100 CFU/m³; surfaces: bacteria 10,000 and fungi 100 CFU/100 cm²; water: bacteria 50 CFU/mL and no detectable coliforms). https://www.nasa.gov/wp-content/uploads/2025/05/ochmo-tb-046-microbiology-rev-a.pdf
- NASA JSC Microbiology Lab: monitoring environmental air, water, surfaces and hardware, distinct from gut microbiome research. https://www.nasa.gov/reference/jsc-microbiology/
- NASA 2022 EVA Injury Evidence Report: spacesuit and EVA operations may cause contact and musculoskeletal injuries. https://ntrs.nasa.gov/citations/20220004017
- NASA EVA Suited Incidence Tracking (2023 submission): tracking suited exposure, reported injuries and locations. https://ntrs.nasa.gov/citations/20230015608

Project code only logs **fictional** EVA reports and environmental sample counts. No real personal or ISS samples were used. NASA source figures inform the ISS reference-comparison display but do not validate clinical conclusions, medical/safety actions, general spacecraft thresholds or any unverified DCS numbers.

See [RESEARCH_FEATURES.md](RESEARCH_FEATURES.md) for the feature-by-feature evidence map and unimplemented claims.

**AI disclosure update:** ChatGPT (OpenAI), Nov 14 2026: drafted the EVA/habitat prototype HTML, CSS, validation logic, JS interactions, source annotations, unit tests and implementation documentation. Members must verify before submitting; no NASA endorsement is implied.


## November 14: NASA 2020 EVA Roadmap and 2026 DCS symptom screen

The team supplied NASA/TP-20205007604, *Crew Health and Performance Extravehicular Activity Roadmap: 2020*. We reviewed §3.7.2 and §3.7.3 (suited exposure reporting, injury debriefing) and §3.8 (decompression mitigation research). These passages support collecting exposure and symptom context but do NOT provide validated individual DCS diagnosis or risk percentages.
- Primary source: https://www.nasa.gov/wp-content/uploads/2017/02/tp-20205007604.pdf

The newer primary NASA OCHMO-TB-037, *Decompression Sickness Risk Mitigation*, **Rev D, October 5 2026, p. 3**, supplies the symptom categories (Type I: itching, musculoskeletal pain, mild rash; Type II: neurological, inner ear, cardiopulmonary complaints and cutis marmorata). These are the only DCS clinical symptom categories represented in the DCS interface:
- Primary source: https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-037-decompression-sickness.pdf

**What is team-authored:** The yes/no/unknown pressure history question, rules mapping the selected symptoms to review/urgent/not-assessed labels, user-interface wording, examples and tests were designed for this hackathon. They are **not clinically validated NASA screening criteria**. There is no individual DCS probability, diagnosis, or treatment advice. Data remain fictional and DCS-form values are not persisted.

**AI disclosure:** ChatGPT (OpenAI) drafted the symptom-review engine, UI, unit tests, and this documentation on Nov 14, 2026. Human clinical review and accurate official disclosure are still required.
