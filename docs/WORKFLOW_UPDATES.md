# ORBIT-M — Mission, Behavioral Health and Severity-First EVA Workflow
**Implementation date:** 2026-11-14. **Scope:** hackathon prototype using fictional input only.

## What changed
1. **Mission length and mission day** are configurable (1–1095 days). ORBIT-M chooses two demonstration check-ins per day (morning/evening), with unlimited additional voluntary check-ins up to a capped local history. The cadence is a TEAM DESIGN, not a NASA standard.
2. **Dedicated behavioral-health section:** self-report of mood, stress, anxiety/tension, mental fatigue, concentration, perceived social connection, sleep quality and motivation, each scored 1–5 by a team-defined exploratory form. Records can trigger a non-diagnostic topic prompt and optionally a fictional request for a private psychological conference. The application DOES NOT offer real counseling, does not send messages, and does not store secure medical records.
3. **Linked vital signs:** scheduled fictional check-ins collect resting pulse, sleep duration and temperature, feeding the original personal trend dashboard.
4. **Post-EVA body map:** multiple regions can be selected, each with its own **1–10** discomfort score. The **EVA event ID** is simply a user-created identifier for a specific simulated spacewalk (for example, EVA-004), NOT an astronaut identifier. Legacy single-location demo records remain readable.
5. **Severity-first DCS concern workflow:** First review hypothetical pupil symmetry, speech clarity, mental clarity and limb coordination, plus serious neurologic/breathing symptoms. Only when no urgent findings have been selected is the milder-symptom stage made available. Last, the user may optionally link a prior post-EVA multi-region pain report. **This order does not rule out Type II DCS.** Incomplete self-reported information can never provide medical clearance.
6. **Possible concerns, not medical diagnoses:** output may be "urgent medical review", "possible decompression-related concern", "symptom review", or "localized suit-contact discomfort". No risk percent, confirmed Type I/II classification, device-based diagnosis, treatment choice or EVA fitness decision is given.
7. **Further assessment examples:** For suspected DCS, text notes that an authorized clinician may consider additional examination and **Doppler/ultrasound VGE** evaluation. The 2026 NASA DCS brief states that bubbles can occur without DCS, and DCS symptoms without detectable bubbles. Therefore a scan cannot be used by this app to confirm or exclude the condition. Urgent signs must not be delayed for a scan.
8. Removed long educational hazard cards from the site and kept a concise primary-source link strip instead.

## NASA primary sources, what they actually support
- **NASA/TP-20205007604, 2020, Crew Health and Performance EVA Roadmap**, the research roadmap for symptom reporting, exposure monitoring, suit fit and DCS-related work. The document is NOT a diagnostic algorithm: https://www.nasa.gov/wp-content/uploads/2017/02/tp-20205007604.pdf
- **NASA OCHMO-TB-037, Decompression Sickness Risk Mitigation, Revision D, 5 Oct 2026**, manifestations of DCS; clinical diagnosis depends on symptoms; ultrasound/Doppler VGE evaluation is an adjunct and a negative result does not exclude DCS. https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-037-decompression-sickness.pdf
- **NASA Spaceflight Decompression Sickness Contingency Plan** (historical medical-operations training slides): illustrates neurological exam and records in spaceflight DCS contingency planning. This is a historical context resource and does NOT confer authority to the team's UI questionnaire. https://ntrs.nasa.gov/api/citations/20070024711/downloads/20070024711.pdf
- **NASA OCHMO-TB-043, Longitudinal Health Surveillance**, includes neurological and ocular assessment elements in astronaut medical surveillance. These do not independently establish a DCS screening score. https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-043-longitudinal-health-surveillance.pdf
- **NASA OCHMO-TB-016, Behavioral Health and Performance**, outlines monitoring and support, including Private Psychological Conferences and periodic cognitive assessments. Does NOT require ORBIT-M's twice-daily schedule or validate its homemade 1–5 metrics. https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-016-behavioral-health.pdf
- **NASA JSC Behavioral Health & Performance**, official operational context for professional psychological support: https://www.nasa.gov/reference/jsc-behavioral-health/
- **CDC Stroke Warning Signs**, supporting caution about new speech, coordination or neurological deficits being time-critical, independent of DCS. https://www.cdc.gov/stroke/signs-symptoms/

## Boundaries
- All values and scenarios are fictional. Do not enter actual mental-health, clinical or astronaut data.
- localStorage is not secure medical storage. No actual private support messaging, access controls, encryption or cloud medical records are implemented.
- NASA sources support why the reported findings are relevant, not the accuracy of the team's thresholds or sequencing logic.
- Abnormal or uncertain neurological observations are flagged for immediate **qualified mission medical review**, without declaring a condition or prescribing a test.
- The order "urgent signs first" is a safety-oriented UI, **not a method for ruling out Type II DCS**. The application must not provide false reassurance.
- Clinical decision-making, imaging, crew clearance and emergency treatment require established protocols and appropriately qualified personnel.

## Acceptance checklist for the team
- [ ] Change mission duration and day. Ensure invalid dates cannot save.
- [ ] Enter morning/evening check-ins plus an additional one; verify schedule and vitals dashboard.
- [ ] Reset behavioral demo history, refresh, and ensure fictional entries persist only in this browser.
- [ ] Select two body regions using the map and assign distinct pain scores; verify timeline and reset.
- [ ] Simulate abnormal pupil symmetry or slurred speech and verify the serious concern takes precedence over itching or suit discomfort.
- [ ] Verify the milder stage is unavailable with urgent findings, and is only a documentation stage, **not a clearance**.
- [ ] Select joint pain after pressure reduction: confirm "possible concern" and the properly qualified Doppler/ultrasound caveat.
- [ ] Verify mobile screen, keyboard navigation and browser console errors.
- [ ] Have a team science reviewer and the medical mentor review all on-screen medical wording.

## Authorship and AI disclosure
Maya Dimant and Ofir Nakash provided the EVA research direction; the ORBIT-M team supplied the requested workflow revisions. ChatGPT (OpenAI) assisted with source checks, JavaScript/CSS/HTML updates, tests and documentation on November 14 2026. NASA did not validate or endorse this prototype.
