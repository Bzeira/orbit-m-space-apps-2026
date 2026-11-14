# Preflight baseline and decision design (prototype only)

## NASA reference vs project simplification
- NASA Spaceflight Standard Measures research measures different domains at different frequencies, with assessments approximately 6 and 3 months before flight and 14-day actigraphy periods for sleep.
- Our app uses a **median of 14 synthetic preflight days** for pulse, sleep, mood and temperature. That is an engineering illustration, **not** an official NASA clinical requirement or valid medical threshold.
- Other categories (microbiome, immune function, bone density and psychological health) cannot responsibly be assigned one universal daily cadence.

## Transparent demo algorithm
1. Label observation: preflight or inflight, day, units and measurement device.
2. Validate that entries are complete, numeric and inside plausible demo input bounds.
3. Calculate the median of 14 synthetic preflight entries separately for each metric.
4. Examine repeated inflight changes versus that preflight median; real systems must account for posture, shift schedule, microgravity adaptation, sensor error and individual context.
5. Display which observation changed and prompt non-diagnostic follow-up questions.
6. Offer an optional **private** referral request to behavioral-health support when relevant; the current software only displays the question, it does not contact anyone.
7. Refer suspected urgent hazards or symptoms to approved mission medical procedures. Never replace certified oxygen, pressure, radiation or clinical emergency limits with baseline-relative heuristics.
8. Postflight comparable follow-up measurements are planned; not implemented.

## Scientific and privacy caveats
- Current numeric thresholds are made up to demonstrate software; they are not validated, clinically actionable or NASA approved.
- Mood self-reports and questions are private; no automatic psychiatric diagnosis, passive emotion recognition or crew-wide broadcast.
- Browser localStorage is **not** secure medical storage and must never be used for real astronaut or patient data.
- NASA has provided private psychological conferences and support on ISS; communication delays on deep-space missions may prevent live calls.
- If there is time, ask a qualified flight/medical professional to review the domains and safeguards, not to casually bless an unvalidated formula.

## Sources
- https://www.nature.com/articles/s41526-025-00532-6
- https://www.nasa.gov/reference/6-0-medical-operations/
- https://www.nasa.gov/reference/jsc-behavioral-health/
- https://www.nasa.gov/missions/station/faq-the-real-story-about-astronaut-health-care-in-space/
