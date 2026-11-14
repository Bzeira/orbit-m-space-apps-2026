# Cardiovascular monitoring: BP, pulse pressure and estimated MAP

ORBIT-M | November 14, 2026
Scientific research and feature suggestions: Itay Lipsky, team-uploaded document "לחץ דם בחלל(1).docx".
Code and tests drafted with assistance from ChatGPT (OpenAI), requiring team verification.

## What the site now demonstrates

- Fictional systolic (SBP) and diastolic (DBP) pressure in mmHg, recorded by mission day and morning/evening/extra check-in.
- Pulse pressure: PP = SBP − DBP. The American Heart Association recognizes PP as a marker of pulsatile hemodynamic stress/arterial stiffness, **not a direct measurement of stroke volume per beat**.
- Estimated mean arterial pressure: MAP ≈ DBP + PP / 3. **Only a conventional approximation at a normal heart rate, not direct measurement**. Even if the input context is EVA, the coefficient is NOT changed to one-half without supporting validation.
- Fictional preflight BP samples 116/75, 118/76 and 120/77 mmHg, yielding a median baseline 118/76. These are project invented values, NOT published NASA astronaut data.
- A short PP/MAP trend and changes relative to that fictional median. The chosen **20 mmHg change marker** (SBP or DBP) is invented solely to highlight a difference in the demo, NOT a NASA or clinical threshold. This must be mentioned during judging.
- Context tags for habitat, EVA and after return to gravity; optional gravity-return mission-day countdown. None of these changes the MAP formula or defines a medical conclusion.
- Symptom precedence: fictional fainting, chest discomfort or difficulty breathing prompts urgent review through approved mission medical procedures. All other simulated entries are informational and cannot provide clinical clearance.
- Manually entered records are saved in browser localStorage only. No sensor, continuous stream, device, medical messaging or secure patient storage is connected. Never input real patient or astronaut data.
- No exercise prescription or clearance to perform EVA/return to gravity is created.

## Source audit of Itay's document

Supported with sources:
1. PP = SBP − DBP and usual MAP approximation at normal heart rate: AHA Measurement of Blood Pressure in Humans statement.
2. Spaceflight fluid shifts, cardiovascular adaptation and post-landing orthostatic intolerance: NASA cardiovascular research.
3. Exercise as a broad countermeasure to cardiovascular deconditioning and changes in exercise capacity: NASA and peer-reviewed Moore et al. (2014).

Not verified sufficiently for implementation:
1. **Automatic one-third to one-half MAP coefficient switch during EVA**. The document asserts equal systolic/diastolic duration during EVA but does not provide enough directly verified evidence for this rule. Current calculations keep the conventional approximation and clearly label the caveat.
2. **PP as a direct measure of blood pumped per heartbeat**. PP is not a direct stroke-volume measurement.
3. **PP must rise at the start of flight then steadily fall for every crew member**. NASA documentation describes complex adaptations, not a universal trajectory.
4. **MAP 70–100 as universal normal and MAP below 60 as a self-contained real-time emergency diagnosis in flight**. No project diagnosis, treatment instruction or validated in-flight rule has been established for these values.
5. **Prescribing resistance vs aerobic exercise on the basis of PP/MAP**, including automatically adjusted training before landing. NASA supports countermeasure exercise generally, but not the exact individualized protocol proposed in the document.
6. **Blood pressure will remain constant across the astronaut's daily schedule**. No validated pattern is assumed.

## Authoritative references

- American Heart Association, Measurement of Blood Pressure in Humans (2019), BP components, PP and MAP: https://pmc.ncbi.nlm.nih.gov/articles/PMC11409525/
- NASA, Cardiovascular Health in Microgravity (2020), fluid shifts and orthostatic intolerance: https://www.nasa.gov/humans-in-space/cardiovascular-health-in-microgravity/
- NASA Human Research Roadmap, Cardiovascular Adaptations Risk: https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=179
- Moore et al., Peak exercise oxygen uptake during and following long-duration spaceflight (2014), PMID 24970852. This study is about exercise capacity, NOT PP-derived workout prescriptions: https://pubmed.ncbi.nlm.nih.gov/24970852/

## Science and QA tasks

- [ ] Confirm 120/80 -> PP 40 and estimated MAP about 93.3 mmHg.
- [ ] Check that selecting EVA does not change MAP to the unverified one-half formula.
- [ ] Enter two readings on one mission day, morning and evening; verify values and chart.
- [ ] Attempt another morning reading and verify it asks to use Additional.
- [ ] Record fictional lightheadedness and serious symptoms; verify non-diagnostic review messaging.
- [ ] Enter gravity return day and verify mission length is respected.
- [ ] Test mobile, keyboard navigation, data reset, persistence, browser console.
- [ ] Ask the medical mentor to assess any proposed additional BP alert logic and whether a high-HR MAP formula is appropriate.

The site contains no real NASA biomedical readings. This feature is an educational demonstration, and NASA does not validate or endorse its algorithms.
