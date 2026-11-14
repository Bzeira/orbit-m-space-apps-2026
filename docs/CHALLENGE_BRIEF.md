# ORBIT-M Challenge Brief — Astronaut Health Monitoring

## Official challenge
**Title:** Create Health Monitoring Software for Astronauts on Space Missions  
**URL:** https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/  
**Difficulty:** Intermediate  
**Focus:** Human Exploration · Software · Space Exploration  
**Team verification:** Working challenge shared by organizers/team. The exact challenge selection on ORBIT-M's official NASA team page should still be checked.

### The task, in practical terms
Design a **visual tool for astronauts to collect health indicators, assess their own health, understand space-specific hazards, and receive useful information to support appropriate follow-up or preventive actions**. NASA's challenge discusses examples such as pulse, blood pressure, glucose, body temperature, sleep hours and mood. It allows text/click/camera inputs and encourages charts, understandable visual feedback and routine measurement reminders.

## NASA reference resources from the official challenge
These are **scientific context**, not a complete individual astronaut health telemetry dataset.

1. **NASA Human Research Program — Five Hazards of Human Spaceflight:** https://www.nasa.gov/hrp/hazards/
2. **NASA HRP — Risks of Human Spaceflight:** https://www.nasa.gov/hrp/risks/
3. **NASA HRP — Ongoing Research in Space:** https://www.nasa.gov/hrp/ongoing-hrp-research/
4. **Canadian Space Agency — Monitoring Radiation for Astronaut Health:** https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp

A fifth official resource is a CSA article about science experiments in space. Open the official challenge Resources tab to obtain its exact link if it will be used.

The 2026 Space Apps Connect response suggests NASA OSDR and NASA Life Sciences Portal for public research, and using **clearly labeled simulated telemetry** where individual astronaut records are not public:
https://github.com/nasa/spaceapps/discussions/2025

## MVP concept: "Know what changed and what to check"
**End user:** crew member on an extended mission.  
**Input:** daily resting pulse, hours slept, voluntary mood rating, temperature, entered manually.  
**Processing:** compare against an individual's short synthetic baseline; show explicit changes and NASA context; no diagnosis.  
**Output:** a focused status view and explanation of which measurement changed, with a prompt to verify readings and use existing crew medical procedures for decisions.

### Implemented in first commit series
- UI: dashboard, example scenarios, daily input form.
- Four-day synthetic baseline comparison.
- Transparent demo flags for pulse, sleep, mood and temperature.
- Local-only persistence of demo readings.
- NASA scientific context linked from risk panels.
- Node built-in tests included **(not yet executed in a verified runtime)**.

### Not implemented / not claimed
- Real astronaut medical data, real wearable readings, sensor drivers or real-time telemetry.
- Clinical decision-making, medical diagnosis, treatment guidance or validated risk classification.
- Actual radiation dose estimates or bone density measurement.
- NASA-validated alarm cutoffs, secure health-record system, spacecraft certification.
- Tested GitHub Pages deployment.

## Science + UX review, assigned to the right disciplines
**Maya:** validate how and why each indicator maps to an HRP risk, check scientific wording, clarify why four baseline days is demo-only, and design user flow.  
**Itay:** assess which measurements can realistically be acquired on a spacecraft, what devices would be needed, and create a labeled optional sensor architecture diagram. Sensor hardware is **not required** to show a functioning software MVP.
**Others:** collect citations, pitch, QA and document unverified claims.

## Essential open decisions
- Does the team want an astronaut self-check, a medical officer dashboard, or both? **Recommendation: astronaut self-check first.**
- Which NASA research-derived fact will be directly demonstrated, not just quoted?
- Which 2 realistic scenarios are strongest for judges?
- How will the team validate any thresholds or redesign them to avoid medical claims?
- Who will own the local submissions and global Submit click?

No statement in this brief should be treated as a clinician-approved astronaut medical protocol.