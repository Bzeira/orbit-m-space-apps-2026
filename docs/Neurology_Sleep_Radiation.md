# Medical Monitoring Research and Decision Specification

14 November 2026  
**Research domains:** neurological/cognitive/vestibular health; visual health and SANS; sleep/circadian disruption; space radiation  
**Status:** Working medical research specification, version 1.3. Intended for our synthetic prototype and future clinical review, not as an approved flight-medical protocol. Any hardware specified for flight use must be checked against the mission equipment manifest.  
**Evidence base:** NASA Human Research Program resources, NASA medical standards, Canadian Space Agency investigations and technology programs, and peer-reviewed literature. Project-specific assumptions are identified separately from published evidence.  
**Related project documents:** [Risk matrix](RISK_MATRIX.md) · [Baseline and decision engine](BASELINE_AND_DECISION_ENGINE.md) · [Medical mentor questions](MEDICAL_MENTOR_QUESTIONS.md) · [Research feature status](RESEARCH_FEATURES.md)

> **Medical safety boundary:** The software documents observations, compares compatible measurements, requests useful follow-up, explains uncertainty, and escalates concerning findings to qualified mission medical staff. It does **not** diagnose disease, independently clear an EVA/crew member, prescribe medication, calculate individual cancer risk from simple dose totals, or replace mission radiation and emergency procedures. **For deep-space missions, onboard emergency procedures and authorized crew action must not wait for Earth acknowledgement.** Numerical alert rules require validation by flight medicine and radiation protection specialists before any real use.

## 1. Research priorities

I organized these priorities around two needs: detecting meaningful changes from each astronaut's preflight health, and giving the crew practical next steps when Earth cannot respond immediately. I separate published standards, research findings, and our own proposed prototype rules throughout.

1. Build a **three-layer evidence architecture**: (a) established clinical/agency criteria, (b) individual preflight longitudinal change, and (c) exploratory/research indicators. Do not label all three as “normal ranges.”
2. Add **hard safety overrides** for sudden neurological deficits, acute severe visual changes, and externally confirmed radiation hazards. These must not be suppressed by a normal personal baseline or an incomplete questionnaire.
3. For SANS, prioritize **serial OCT and ophthalmic review**, not a daily smartwatch “SANS score.” For cognition, use the same standardized tests repeatedly; for vestibular changes, record gravity transitions and functional impairment.
4. For sleep, combine **actigraphy + diary + schedule/light exposure + subjective sleepiness + a vigilance measure** when feasible. A proprietary sleep score alone is not a clinical test.
5. For radiation, ingest **calibrated dose-rate and cumulative-dose telemetry**, distinguish neutron and other detector channels, retain units and uncertainties, and join exposure to crew location, EVA, and shielding context.
6. Use **Canadian Space Agency (CSA) research as concrete monitoring precedents**: SANSORI/SANSORI-2 (eye measurements); Wayfinding (orientation and MRI/neuropsychology); Bio-Monitor (wearable physiology); Radi-N2 (personal and site neutron detectors); CANS (continuous autonomous neutron sensor in development); CSA's sleep-in-space account (environmental context).
7. For our demo, use **fictional measurements and explicit rule-source labels**. Prefer an honest “clinician review needed / threshold not established” over a fabricated cutoff.
8. Assume **Earth-independent initial response** for time-critical events: the crew needs a locally stored protocol, an authorized onboard medical officer, a clear immediate-action card, and asynchronous ground communication. The app must not wait for a message round trip before showing a critical crew action [N5, C8, C10].
9. Separate **evidence-based symptom relief, authorized onboard medical treatment, and experimental countermeasures**. For example, refractive correction is currently used for SANS; lower-body negative pressure remains investigational for SANS treatment [S1].

### Evidence labels used throughout

| Label | Meaning | Rule use |
|---|---|---|
| **STANDARD** | Applicable published NASA spaceflight standard or official requirement | Cite revision/clause; apply only under its defined conditions |
| **CONSENSUS** | Published expert clinical consensus | Implement as a candidate clinical review rule, with specified equipment/protocol |
| **RESEARCH** | Agency experiment or research publication that supports relevance/measurement | Track and trend; not automatically diagnostic |
| **GENERAL** | Terrestrial clinical recommendation | Context only; never assume spaceflight validation |
| **PROPOSED** | Internal design proposal | Synthetic demo only until reviewed and validated |

## 2. Scope and current implementation

I am covering the neurological/cognitive/ocular, sleep/circadian, and radiation risks identified in our [risk matrix](RISK_MATRIX.md). My goal is to define what we should measure, how we should measure it, what constitutes a significant change, and which medically appropriate next steps the crew can take with limited ground support. All three domains are currently classified as **research**, rather than implemented medical monitoring features. Our [baseline design](BASELINE_AND_DECISION_ENGINE.md) uses medians from **14 synthetic preflight days** for selected demonstration metrics and explicitly identifies the thresholds as project-created examples, not medical standards. Our [decision engine](../src/engine.mjs) implements trend checks and follow-up prompts; these must never be described as NASA thresholds. [Workflow updates](WORKFLOW_UPDATES.md) document the fictional morning/evening check-ins, exploratory mental-health ratings and serious-signs-first EVA questions; their cadence and scoring are project design decisions. [Cabin and crew context](CABIN_CREW_CONTEXT.md) explains how environmental telemetry may inform symptom review without establishing causation. [Medical mentor questions](MEDICAL_MENTOR_QUESTIONS.md) identify decisions requiring professional review, not institutional endorsement.

**Mission context:** We need the medical monitoring workflow to support deep-space autonomy, not depend on real-time terrestrial telemedicine. NASA estimates Earth to Mars communication at roughly **4 to 24 minutes one way** (approximately **8 to 48 minutes round trip** before processing and queuing); blackouts may occur. We should configure expected latency per mission rather than rely on a fixed clinical clock [N5, N9, C8].

**Scope boundary:** DCS/EVA, cardiovascular indicators, cabin monitoring and behavioral health are covered in other parts of our work. This specification covers neurological red flags where they overlap those workflows; it does not supersede their logic. Neurological symptoms after EVA should connect to the existing *serious-signs-first* screen without assuming SANS, fatigue, or DCS as the diagnosis.

**Planned implementation tiers:** (P0) brief symptom/sleep questionnaires and case explanations; (P1) imported synthetic PVT/OCT/dosimetry records; (P2) realistic time-series and sensor models; (flight-only) mission-approved instruments, protected medical data, calibrated dosimeters and authorized alert thresholds.

## 3. General measurement, baseline and interpretive method

### Baselines are not interchangeable

- **Preflight:** Repeat the same test with the same device/protocol, note circadian time, medication, corrective lenses, posture, sleep opportunity, and practice effects. For an OCT baseline, retain raw scan metadata; for a cognitive test, retain *multiple* practice-adjusted administrations; for sleep, multiple days including work/rest variation.
- **In-flight:** Record mission day, gravity phase (launch/early adaptation/stable microgravity/landing), time, device and firmware, test quality, environmental conditions, medication, symptoms, relevant EVA/solar events, and activity just before measurement.
- **Postflight:** Reassess in early recovery and later follow-up where the scientific/medical protocol calls for it. Postflight recovery should not be mistaken for an in-flight “normal” baseline.
- **Individual comparison:** Display current result, preflight median/distribution, change (absolute and relative), recent trend, measurement variability, and whether measurements are protocol-compatible. A z-score is descriptive, not an automatic diagnosis; n=14 daily points is NOT a clinical norm.
- **Clinical limits:** A standardized diagnostic criterion or safety limit is checked *separately* from individualized changes. A normal baseline cannot override sudden aphasia, visual loss, or SPE response procedures.
- **Data missingness:** Not measured, uncalibrated, poor image quality and normal must all be distinct states.

**Output rule template:** Observation → quality check → **immediate onboard safety screen and preapproved response** → criterion comparison (if applicable) → repeated-baseline change → focused follow-up → additional assessment → urgency / uncertainty / explanation → **crew medical officer (CMO) decision** → asynchronous consultation and ground review when the link permits. No real-time Earth acknowledgement dependency.

### Equipment status: what is actually measurable in a spacecraft

A published astronaut experiment demonstrates that a **measurement method has been used in space**, not that the intended vehicle carries the instrument or that its research output is validated for autonomous diagnosis. Before producing a flight-facing recommendation, confirm the instrument in the mission equipment manifest, training plan, approved procedure, power and calibration status, consumables, and onboard data interface. If it is unavailable, mark the measurement `not_available` and present a feasible alternative; do not infer a normal result.

| Status | Meaning | Examples and source |
|---|---|---|
| **Demonstrated in space / mission precedent** | Instrument or data collection used on ISS or an astronaut research mission; operational availability remains mission-specific | ISS OCT, orbital ocular ultrasound, Canadian Bio-Monitor smart garment, Radi-N2 bubble detectors [S1, C4, C7] |
| **Ground or research protocol** | Primarily useful for preflight and postflight comparison, or a special study | Brain MRI/fMRI, some formal vestibular assessments, full neuropsychology [C3, S1] |
| **Candidate onboard hardware** | A technically plausible sensor or assessment that requires qualification for the spacecraft | Calibrated near-vision chart, PVT tablet, portable autorefractor, automated perimetry, eye tonometer, wearable actigraph |
| **Developmental / future capability** | Not to be displayed as installed flight hardware | Canadian Active Neutron Spectrometer (CANS), described by CSA as a continuous autonomous neutron sensor in development as of February 2026 [C6] |
| **Derived or reported, not directly sensed** | Computed from other data or entered by a person | Career effective dose from validated dosimetry and modeling; headache severity; allocated sleep opportunity |

### Measurement acquisition quick reference

The device column states **what would take the measurement**, not what is guaranteed to be present onboard. For each observation store exact instrument model, protocol/version, UTC timestamp, mission elapsed time, unit, quality status, operator, and source. Schedules below are proposed unless a cited study/protocol specifies otherwise.

| Parameter IDs | Device or input | How to obtain the data and units | Frequency and availability | Evidence |
|---|---|---|---|---|
| N1, N4 | Crew report, observer, offline symptom questionnaire on tablet | Record onset/time last known well, symptoms, headache 0 to 10, functional effect; CMO observes acute signs | Immediately when symptoms appear; feasible without specialized sensor | Safety proposal |
| N2, SLP7 | Mission-configured **Psychomotor Vigilance Test (PVT)** on latency-calibrated tablet or laptop | Use identical test duration and stimulus protocol, tap/respond to visual cue, store individual response times in ms, lapses and omissions | Repeated preflight, scheduled or triggered in-flight; candidate | NASA Standard Measures [N4] |
| N3 | Standardized computerized cognitive battery on the same calibrated tablet/laptop | Complete attention, working-memory and executive-function tasks, retain accuracy, errors and task-specific latency | Repeated preflight/in-flight where approved; candidate | [N4] |
| N5 | Structured nausea/dizziness questionnaire, event log; CMO observation | Score symptom severity, vomiting episodes, intake, task interference and gravity phase | Early adaptation, transitions and when symptomatic; available by self-report | [N6, N10] |
| N6 | Standardized computer-based spatial navigation task | Navigate virtual landmarks/return route, log accuracy and time; keep scene and interface identical | Optional research/functional assessment; CSA Wayfinding used computer tasks [C3] |
| N7 | Clinical **MRI/fMRI scanner** | Acquire matched structural/functional brain images and radiologist report | Preflight/postflight or approved study; **not assumed onboard** | [C3, S1] |
| V1 | **Heidelberg Spectralis optical coherence tomography (OCT)** | Scan the same peripapillary region in each eye; export average **total retinal thickness (TRT)** in µm, segmentation and image quality | Mission-scheduled eye exam; demonstrated ISS protocol, actual spacecraft inventory must be checked | [S1] |
| V2, V4 | OCT en-face/MultiColor imaging or qualified fundus camera | Obtain optic-disc/macular images, date and laterality; specialist notes edema/folds and Frisén grade where appropriate | At ocular exams or after new visual symptoms; ISS OCT imaging precedent | [S1, C1] |
| V3 | Portable **autorefractor** or clinician-directed **trial-lens/subjective refraction kit**, if stocked | Assess each eye separately under defined conditions; report spherical equivalent and change in **diopters (D)** | Preflight and when blur appears; candidate equipment, not guaranteed | [S1] |
| V5 | Ocular B-scan **ultrasound** (orbital contour) or optical/ultrasound biometer | Trained operator measures globe shape or axial length using a repeatable protocol; do not treat these as direct intracranial pressure | Selected eye exams; ultrasound demonstrated on ISS; biometry availability mission-specific | [S1] |
| V6 | Calibrated distance and near **visual acuity chart** (physical or validated tablet) | Test right/left eyes individually, corrected and uncorrected at fixed distance; record logMAR/Snellen and reading-task difficulty | Preflight, scheduled exams, symptom-triggered; candidate | [S1] |
| V7 | Validated portable **visual field perimeter** | Perform monocular automated field test; save field map, fixation losses and false responses | Clinically concerning cases if equipped; ISS field capability reported late 2025 | [S1] |
| V8 | Tablet symptom questionnaire / CMO interview | Record onset, one or both eyes, visual distortion, headache, diplopia, abrupt loss | Daily short check or event-triggered; no device beyond crew interface | Safety proposal |
| SLP1, SLP3 to SLP5 | Validated **wrist actigraph with clock**, optionally built-in light sensor, plus diary | Wear during rest/activity; derive estimated sleep/wake, onset, midpoint, wake-after-sleep-onset (WASO) in minutes, and efficiency (%), with algorithm/version | Normally 24-hour wear and daily review; NASA ARCHeR precedent | [U3, G1] |
| SLP2 | Imported **mission crew schedule**, not wearable | Compute time allocated to sleep from planned sleep/wake windows; report hours | Daily; planned opportunity is not proof of sleep | [N3] |
| SLP6 | Karolinska Sleepiness Scale (KSS) self-report on tablet | Select integer **1 to 9** at a standardized time, including before critical tasks if required | Daily or pre-task as approved; proposed | General/research |
| SLP8 | Calibrated **personal light logger/actigraph photometer** | Time-stamped illuminance (lux), exposure timing and spectral metrics only if device actually measures spectrum | Continuous or daily summary; ARCHeR uses activity, sleep, light exposure | [U3] |
| SLP9 | Daily diary, cabin noise meter, temperature and CO2 sensors, medication/activity log | Record nap duration, caffeine timing, workload, noise dBA, temperature °C and measured CO2 (ppm, when available) | Daily contextual data; cabin engineering sensors belong to environmental workflow | [C5, C4] |
| R1 | **Calibrated active electronic personal radiation dosimeter** | Wear at prescribed body position; import measured dose rate, exposure interval, detector response and exact physical quantity (for example µSv/h, when that is what it measures) | Continuous if instrument supports it; **qualified device required** | [N8] |
| R2, R3 | Radiation protection database plus validated **radiation transport/dose model** | Reconcile prior career record, mission records and detector data; calculate approved effective-dose estimate in mSv and projected mission dose | Periodic and after events; **not a direct wrist sensor reading** | [N3, N8] |
| R4 (passive) | CSA **Radi-N2 neutron bubble dosimeter + automated bubble reader** | Count bubbles before deployment; place one personal detector and others at mapped sites; after an approximately **one-week** interval read again and convert with calibration to integrated neutron dose equivalent | Delayed retrospective neutron measurement; **not an emergency alarm** | [C7] |
| R4 (continuous) | Qualified active neutron spectrometer/dosimeter | Stream neutron-sensitive measurements with energy response and calibration; CANS is a Canadian development example, **not confirmed flight equipment** | Continuous only if a suitable flight-qualified sensor is installed | [C6] |
| R5 | Approved spacecraft **radiation warning system**, area dosimeters and space-weather telemetry | Receive time-stamped sensor/mission alarm, event identifier, crew compartment, and approved protocol version | Event-driven; any loss of ground link must not disable local alerting | [N7, N8] |
| R6 | Organ-dose **radiation transport model** with shielding/geometry data | Estimate tissue-specific absorbed/equivalent dose using defined particle fields and dosimeter evidence; keep uncertainty and radiation weighting | Periodic/event-driven; specialist model, not a direct medical test | [N3, N8] |
| R7 | Area dosimeters + crew location/EVA/shelter log | Join calibrated area measurements to time in location and shielding state; compare only matched dose quantities | Continuous location log / periodic map; Radi-N2 offers spatial research precedent | [C7] |

### Device-specific collection procedures

**Neurological and cognitive tests (N1 to N7).** At baseline, collect multiple PVT/cognitive sessions with the *same* device, screen response system, software version, test length, instructions and scheduled time; allow practice effects to stabilize. During flight, secure the device, use a quiet and consistent setting, run the stored test without changing its configuration, and save raw trial responses. A PVT lapse threshold is only meaningful for the specific validated task definition; a generic smartwatch reaction-time feature is not a substitute. With headache, sudden weakness, new speech problems or confusion, use a crew/CMO assessment immediately. A tablet questionnaire is **not** a stroke detector. CSA Wayfinding's computerized landmark tasks, MRI and neuropsychological assessments are valuable comparison methods, but its reported schedule is not a daily onboard clinical protocol [C3, N4].

**Vestibular function (N5, N6).** In microgravity, ordinary standing balance tests and Earth-specific fall-risk cutoffs are not directly interpretable. Ask about dizziness, nausea, disorientation, vomiting and task ability, observe gaze and coordination when trained, and run a *mission-validated* orientation test if available. A video head-impulse device or instrumented gaze/eye tracking system could be used only if specifically carried, trained and validated for the mission. Reserve terrestrial gait/posturography for preflight/postflight gravity conditions. Sudden focal neurological symptoms override a presumptive adaptation explanation [C3, N10].

**Eye examination (V1 to V8).** For OCT, train the crew member to fixate and acquire the standardized scan of each eye. Compare the same peripapillary **TRT**, retinal region and compatible OCT protocol, check segmentation and motion artifacts, and retain raw scans before applying the **20 µm** published criterion. OCT's nerve-fibre-layer output (RNFL) must not be substituted for TRT. For vision, use a calibrated chart at the exact test distance with correction status documented. For refraction, use a stocked portable autorefractor or supervised lens trial; **blur and acuity loss alone do not measure diopters**. If available, use OCT en-face/MultiColor images or a fundus camera for optic-disc/fold review, automated perimetry for field defects, and orbital ultrasound for ocular anatomy. Direct eye pressure (intraocular pressure, IOP) requires a trained examiner and a tonometer if provided; none of these measurements directly establishes intracranial pressure. CSA SANSORI and SANSORI-2 explore ocular biomechanics and pressure-related changes, but do not turn a consumer camera into an approved SANS instrument [S1, C1, C2].

**Sleep and circadian measures (SLP1 to SLP9).** Wear a mission-approved actigraph on the specified wrist across sleep and wake, synchronize its clock, mark the actual rest interval, and enter sleep start/finish, awakenings, naps and perceived restfulness in a daily diary. Process actigraphy with a recorded algorithm/version, flag periods of nonwear and reconcile discrepancies with the diary. Import sleep opportunity from the *scheduled* rest window, not from actigraphy. Where the actigraph also has a calibrated photometer, track light timing and lux; otherwise mark light data unavailable. Use the same KSS prompt and PVT protocol at similar relative times. CSA Bio-Monitor's **smart shirt, headband and tablet** offer additional pulse, respiration, temperature and activity signals, but those signals do not by themselves yield a validated diagnosis of insomnia, REM sleep or deep sleep. CSA sleeping-environment information supports collecting noise, ventilation, temperature and light context [U3, C4, C5].

**Radiation measurements (R1 to R7).** Begin with calibrated *active* personal and cabin dosimeters reporting their native radiation quantity, unit, time interval and detector response. Record location, shielding, EVA times and missing telemetry so personal exposure can be reconstructed. Use an approved conversion and transport model to estimate effective and organ doses: a detector's ambient dose equivalent is **not automatically the astronaut's personal effective dose**. Passive Radi-N2 bubble detectors are deployed, recovered and read later, so they support **retrospective neutron mapping**. For an immediate solar-event response, rely on the flight-approved radiation warning system and shelter rules; CANS is not to be shown as deployed unless the mission inventory verifies it. Do not silently combine absorbed dose (Gy), equivalent/effective dose (Sv) and detector-specific quantities [N3, N8, C6, C7].

### Data record required for each measurement

Use the following **proposed** fields to enable reproducible comparisons and defensible conclusions:

```json
{
  "parameter_id": "V1",
  "measured_at_utc": "2026-11-14T10:00:00Z",
  "mission_day": 30,
  "instrument": {"type": "spectral_domain_oct", "model": "Heidelberg Spectralis", "device_id": "EXAMPLE", "software_version": "example"},
  "protocol_id": "approved-peripapillary-trt-protocol",
  "measurement": {"eye": "right", "value": 356, "unit": "um", "quantity": "average_peripapillary_total_retinal_thickness"},
  "baseline": {"value": 330, "unit": "um", "protocol_compatible": true},
  "quality": {"status": "needs_operator_review", "segmentation_verified": false},
  "availability": "mission_manifest_pending",
  "evidence": ["S1"],
  "rule_status": "candidate_clinician_review"
}
```

The values, instrument identifiers and dates in this example are **fictional**. A real result must never report the 20 µm SANS criterion as confirmed when OCT segmentation or protocol compatibility remains unresolved. Devices must also expose `not_measured`, `nonwear`, `not_calibrated`, and `not_available` as distinct states. Any threshold evaluation must first pass the quality and compatibility checks.

## 4. Neurological and cognitive monitoring

### Primary clinical concerns

Spatial disorientation/motion sickness during gravity transitions; impaired attention, vigilance, executive function or memory; headaches and focal neurological symptoms; longer-term brain structural and functional adaptation. These are distinct from ocular SANS. NASA's HRP Risks [U2] and Standard Measures [N4] support systematic evaluation. CSA's **Wayfinding** specifically combines orientation tasks, neuropsychological assessments, and brain imaging **before and after flight**, showing an example of repeated within-person testing. The CSA page describes one preflight session six months before departure and sessions two weeks and six months after return; those times are *study design*, not an operational daily schedule [C3, N4].

### Neurological monitoring parameter register

| ID | Parameter; instrument | Baseline/expected finding | Concern and interpretation | Suggested cadence / evidence |
|---|---|---|---|---|
| N1 | **Sudden focal signs:** new speech difficulty, asymmetric weakness, new confusion, seizure, severe acute headache; tablet symptom intake and direct crew/CMO observation | No acute deficits | **Any newly observed acute warning sign warrants urgent mission medical response**; no baseline cutoff | Event-driven; safety proposal supported by general emergency neurology; route to existing EVA/DCS pathway if exposed |
| N2 | **Psychomotor vigilance:** calibrated tablet/laptop PVT, raw response latency (ms) and lapses | Repeated person-specific task/version, time of day and practice-adjusted variability | Sustained slower responses or increased lapses merits fatigue/sleep/confounder assessment; **no universal milliseconds cutoff** | Preflight repeated; inflight periodic or fatigue-triggered; RESEARCH |
| N3 | **Cognition:** standardized tablet/laptop cognitive battery (accuracy, errors, response time) | Repeat same validated battery, hardware, test order | Persistent change beyond instrument test-retest variation, especially with functional problems, → clinician review | Periodic; NASA Standard Measures [N4] |
| N4 | **Headache:** tablet/CMO interview, onset, 0-10 severity, duration, character, associated symptoms | Personal headache history | Sudden severe or neurologically accompanied headache → urgent; recurrent/new/worsening headache → targeted evaluation; **0 to 10 score is not a diagnosis** | Event-driven + brief daily report as needed; PROPOSED |
| N5 | **Motion sickness:** tablet symptom scale/CMO observation: nausea, vomiting, dizziness, disorientation, ability to eat/work | Preflight vestibular susceptibility and early inflight adaptation | Persistent vomiting, inability to carry out tasks, deterioration after early adaptation, new neurologic signs → review | Early microgravity, gravity transitions, symptom-triggered; RESEARCH |
| N6 | **Orientation/navigation performance:** fixed computerized spatial navigation/landmark task | Person-specific task accuracy/latency | Decreased orientation accuracy associated with task-performance concerns; **no universal abnormal score** | Preflight + targeted postflight; optionally inflight study; CSA Wayfinding C3 |
| N7 | **Structural/functional brain MRI (ground scanner only unless exceptionally equipped)** | Baseline MRI with clinical interpretation | Imaging changes require radiologist/flight surgeon interpretation, not in-app thresholds | Pre/post flight where protocol allows; CSA Wayfinding / NASA brain-fluid research |

**Questions:** When did the change begin? Did it occur after launch, an EVA, gravity transition or radiation event? Any speech problems, one-sided weakness, severe headache, loss of vision, gait/coordination difficulty, vomiting, medication change, recent sleep loss, high workload or cabin anomaly? Has it happened before? Can the astronaut perform required duties safely?

**Clinical logic:** If acute focal sign is present, issue **urgent review** even if cognitive tests look normal. If cognitive vigilance worsens without red flags, check sleep history, schedule, test quality, CO2, medications and illness; recommend repeating the standardized test and clinician review if persistent. Do not infer permanent brain injury from an MRI difference alone. Neurological symptoms shortly following EVA must also be passed to the separate DCS concern workflow; neither a negative Doppler nor a reassuring baseline rules out illness.

### Canadian evidence: Wayfinding

The **CSA Wayfinding** study examines visual/proprioceptive/vestibular integration, computerized orientation tasks, neuropsychological tests and neuroimaging. This directly supports monitoring spatial navigation **as its own metric**, rather than collapsing disorientation into mood or sleep. Its testing intervals are research-driven, not an onboard diagnosis schedule [C3].

## 5. Vision and Spaceflight-Associated Neuro-Ocular Syndrome (SANS)

SANS may include optic disc edema, chorioretinal folds, posterior globe flattening, axial changes and hyperopic refractive shift. Proposed mechanisms include headward fluid redistribution and altered venous/CSF dynamics; **do not claim a single proven cause or equate SANS with raised ICP**. NASA's HRP research includes OCT and brain-fluid studies; CSA **SANSORI** investigates ocular mechanical properties using questionnaires, imaging, MRI and exercise context, while **SANSORI-2** extends the biomechanics research [U3, C1, C2].

### SANS parameter register and criteria

| ID | Measure | Comparator | Published interpretation | Escalation / evidence |
|---|---|---|---|---|
| V1 | Peripapillary **total retinal thickness (TRT)** by **Spectralis Heidelberg OCT** | Equivalent preflight OCT of both eyes, comparable scan protocol | **≥20 µm average increase** is an earliest optic-disc-edema/SANS criterion in 2026 consensus; **≥55 µm** is a higher category criterion. These refer to **TRT, not RNFL alone** | Ophthalmic review, compare scans/quality/trend; CONSENSUS [S1] |
| V2 | Optic disc appearance by OCT en-face/MultiColor or fundus camera; specialist Frisén grade | Preflight images and expert grading | New edema signs; **Frisén grade ≥1** appears with higher optic-disc-edema category in consensus | Clinician ophthalmic evaluation [S1] |
| V3 | Manifest refraction (D) by stocked autorefractor or qualified trial-lens exam | Same correction/reference method | **Hyperopic shift > +0.50 D** is a consensus SANS sign | Refraction/functional assessment; check lens changes [S1] |
| V4 | Chorioretinal folds by OCT macular scan / qualified fundus imaging | Baseline imaging | New folds, especially macular involvement/visual distortion, warrant review | Clinician interpretation [S1] |
| V5 | Posterior globe flattening / axial length by ocular ultrasound or biometry (when equipped) | Imaging baseline and matched technique | New structural change may support SANS; no single general-purpose app threshold | Specialist review [S1] |
| V6 | Visual acuity by calibrated near/distance optotype chart plus near-task performance | Best-corrected preflight performance | Reproducible deterioration merits reassessment; **sudden major loss is urgent** | Safety-first rule / clinician review |
| V7 | Visual field testing with validated automated perimeter (if equipped) | Preflight field map and reliability indices | New blind spot, field defect or loss merits clinical assessment | Specialist evaluation; ISS field-test capability since 2025 [S1] |
| V8 | Headache, diplopia, eye discomfort, visual distortion from tablet symptom report and CMO assessment | Symptom baseline | Symptoms raise urgency but do not independently diagnose SANS or intracranial hypertension | Targeted screening, alternative diagnoses |

**Practical testing:** Store laterality (right/left), best-corrected vs uncorrected, OCT model, scan circle/segmentation, image quality, method and operator, altitude/microgravity phase, refraction method, date, and baseline version. No automated SANS “severity” from a single bad scan. The 2026 consensus reports routine NASA ISS eye assessment **pre/post flight, around flight days 30 and 90 and approximately 30 days before landing** for a six-month mission; this is context-specific, not a universal cadence for every mission [S1].

**Follow-up:** Is there a new blur at near or far distances? One eye or both? Sudden or gradual? Double vision, spots, blind areas, distorted straight lines, new headache or nausea? Worse when reading mission displays? Are corrective glasses available and adequate? Previous eye disease or recent mechanical/exertional event?

**Interpretation examples:** “OCT mean peripapillary TRT increased 26 µm from comparable preflight Spectralis baseline; this meets an early consensus criterion requiring qualified ocular review. OCT artifact and other explanations still need assessment.” / “Sudden unilateral visual loss: trigger urgent clinical assessment; do not attribute to chronic SANS without evaluation.”

**CSA contribution:** SANSORI and SANSORI-2 are research examples of integrating eye anatomy and biomechanics; **their observational/experimental designs do not provide the validated app threshold**. Use [S1] for published OCT numbers [C1, C2].

## 6. Sleep deprivation and circadian disruption

Spaceflight sleep can be affected by rotating light-dark exposure, scheduled operations, equipment noise, stress and environment. NASA ARCHeR uses wrist actigraphy for activity/sleep/light monitoring; CSA describes ISS sleeping quarters, noise and sixteen orbital sunrises/sunsets per Earth day. CSA also notes some astronauts *report* six hours feeling restful; **this anecdote must not negate evidence-based adequate sleep guidance** [U3, C5].

### Sleep/circadian parameter register

| ID | Parameter | How measured | Reference vs warning | Cadence / evidence |
|---|---|---|---|---|
| SLP1 | **Total sleep time** (hours) | Wrist actigraph + daily diary; store algorithm/version and reconcile discrepancies | **≥7 h/night on a regular basis** is a *general adult* AASM/SRS recommendation, NOT flight-specific diagnosis threshold. Recurrent <7 h or major fall vs preflight invites review | Daily; GENERAL [G1] |
| SLP2 | **Sleep opportunity** (hours allocated) | Imported crew schedule (not a sensor) | NASA-STD-3001 Vol 1 [V1 6001] includes a **recommended 8.5 h sleep period** as part of schedule planning; opportunity ≠ measured sleep | Daily; STANDARD [N3] |
| SLP3 | Bedtime/wake time and **sleep midpoint** | Wrist actigraph clock + imported schedule | Recurrent displacement from scheduled biological rest can indicate misalignment; no generic hour cutoff | Daily; RESEARCH/PROPOSED |
| SLP4 | Sleep continuity, awakenings, WASO | Wrist actigraph estimates + daily sleep diary | Repeated deterioration vs baseline; do NOT assign arbitrary universal WASO or “deep sleep” thresholds | Daily; RESEARCH |
| SLP5 | Sleep efficiency | Actigraph sleep estimate / reported time in bed | Compare individual/device-specific baseline; not a definitive polysomnographic value | Daily; RESEARCH |
| SLP6 | **Subjective sleepiness** (e.g. Karolinska Sleepiness Scale 1 to 9) | KSS 1-9 tablet prompt at consistent time | 7 to 9 denotes strong sleepiness on scale; needs mission validation as escalation trigger | Daily/pre-critical-task if protocol; RESEARCH |
| SLP7 | **PVT lapses / reaction time** | Calibrated tablet/laptop PVT (fixed duration, stimulus and lapse definition) | More lapses/slower response vs preflight and validated test norms; no universal 300-ms alert | Periodic or triggered; RESEARCH |
| SLP8 | **Light exposure**, timing, lux/spectrum where measurable | Actigraph light sensor / calibrated personal photometer + schedule | Misalignment with planned light program; no blanket lux cutoff | Continuous / daily; NASA ARCHeR |
| SLP9 | Caffeine/medications, workload, naps, cabin noise/CO2 and timing | Tablet diary + calibrated cabin telemetry (if available) | Explanatory context, not standalone sleep-disorder diagnosis | Daily contextual fields; NASA/CSA |

**Question set when poor sleep is detected:** How many hours did you actually sleep? Did you have the allotted sleep opportunity? How sleepy are you now? Did you nap? Was the sleeping area noisy, too bright, hot or uncomfortable? Any caffeine, sleep aids or new medications? Any headache, illness, pain or worry? Have you made errors or struggled to concentrate? Do you face a safety-critical operation soon?

**Output / recommendations:** Record a *fatigue concern*, not insomnia diagnosis. Recommend reviewing schedule and environment, checking vigilance if available, and clinician/mission-operations review before critical tasks when functional alertness is impaired. Repeated short sleep plus impaired PVT warrants higher review priority than either isolated signal. Sleepiness with sudden confusion, focal signs or severe symptoms invokes urgent medical override instead.

**Example (fictional):** Preflight median 7.8 h; mission 6.2, 5.6, 5.9 h: changes −1.6, −2.2, −1.9 h. This meets the current **synthetic prototype** repeated-decline rule, and the 3 values are all below the **general adult** 7 h recommendation; these are **two independent statements**, neither a spaceflight diagnosis. Suggest fatigue/schedule/condition review, not medication.

### Canadian evidence: sleep environment and Bio-Monitor

CSA's **Sleeping in Space** contextualizes sleep-station design, ventilation, noise, earplugs and 16 daily orbital light cycles; use it when constructing follow-up and environment fields [C5]. CSA **Bio-Monitor** smart garment includes a smart shirt/headband and tablet application to measure heart electrical activity/pulse, respiration, temperature, oxygen saturation, BP and movement, including during sleep. This shows a practical wearable **collection architecture**, not a device-approved sleep-stage diagnostic system [C4].

## 7. Space radiation and health risks

**Types:** Galactic cosmic radiation (GCR) provides chronic background exposure; solar particle events (SPE) can create episodic intense particle fields; trapped belt radiation matters by orbit. Secondary neutrons arise from interactions with materials; they require an appropriately characterized detector. Biological risks include cancer and potentially cataracts, circulatory and CNS effects, with differing confidence. An app cannot diagnose cancer or CNS radiation injury from a dose counter [U1,U2,N3,C6].

### Radiation dose units and measurement schema

- **Absorbed dose (Gy, mGy):** energy deposited per mass; needed for organ/tissue assessment.
- **Equivalent/effective dose (Sv, mSv):** radiation/organ weighting context; **not automatically interchangeable** with Gy or with an instrument’s ambient dose-equivalent reading.
- **Dose rate:** e.g. µSv/h or mSv/day (must specify quantity). Preserve original detector quantity, time and conversion model.
- **Neutron/charged-particle detection:** separate channel, energy response, uncertainty and calibration; avoid summing incompatible reported quantities.
- **Exposure metadata:** personal/device identifier, cabin location, shield configuration, EVA interval, solar event ID, calibration, uncertainty, missing intervals, source and mission phase.

### Radiation monitoring parameter register

| ID | Parameter | Comparator | Rule / interpretation | Cadence |
|---|---|---|---|---|
| R1 | **Personal time-resolved dose rate from calibrated active electronic dosimeter** | Calibrated detector readings; spacecraft map; event background | Increased relative to environment + mission operational trigger; **no arbitrary app-created emergency cutoff** | Continuous where hardware available |
| R2 | **Cumulative spaceflight career effective dose estimated from dosimetry + approved transport model** (NASA quantity) | Recorded prior career plus mission contribution | NASA-STD-3001 Vol 1 [V1 4030]: **less than 600 mSv total career effective dose**; not a target and not a daily trigger | Continuous accumulation / periodic reconciliation; STANDARD |
| R3 | **Mission dose/projected remaining dose from calibrated dosimetry + model** | Mission budget, validated forecast/model | Compare with approved mission planning constraints; distinguish observed vs predicted | Daily and when route/schedule changes |
| R4 | **Neutron dose (Radi-N2 passive bubbles + reader) or dose rate (qualified active neutron detector)** | Neutron detector channel and spatial map | CSA Radi-N2 shows personal and cabin monitoring; CANS aims continuous autonomous neutron sensing. **ISS-specific** observations not universal limits | Continuous with suitable sensor; historical passive detector weekly research intervals |
| R5 | **SPE alert from approved area dosimeters, onboard event monitor and space-weather feed** | External space-weather warning and vehicle dosimetry | Event-driven mission procedures; shelter recommendations from flight rules (not generic consumer alerts) | Event-driven / near-real-time |
| R6 | **Modeled organ/tissue-specific radiation doses (approved particle transport model)** | Approved transport/organ model | Check organ/tissue limits using correct quantity and time period; engineering/medical review | Periodic / event-driven |
| R7 | **Location/shielding exposure differential from area dosimeters + crew location logs** | Cabin compartment, EVA, sleeping quarters | Detect where exposure differs and potential shielding opportunities; require matched duration and sensor calibration | During mission / after events |

**NASA requirements, clearly distinguished:** NASA-STD-3001 Vol 1 Rev C [V1 4030] sets **<600 mSv career effective dose**. Radiation protection follows ALARA [V1 4029]. Its applicable design clauses include GCR vehicle/habitat requirements; these should **not be presented as individual acute danger thresholds**. Do not apply ISS neutron fraction or daily doses to Mars without mission-specific transport calculations [N3].

**Canadian contributions used in the proposed design:**

1. **CANS (CSA, 26 February 2026):** a compact **continuous, autonomous neutron spectrometer** in development; CSA awarded a development contract. The news article says neutrons contribute about **30% of total ISS radiation**. This number is contextual to the ISS, not a universal neutron fraction, and a development announcement is **not** evidence that CANS currently supplies operational telemetry to this mission [C6].
2. **Radi-N2 (CSA):** bubble detectors measured neutron radiation at **multiple ISS sites**, including **one worn by an astronaut and one in sleeping quarters**; monitors were left in place **one week**, then read. CSA reports a typical neutron dose-equivalent observation around **150 µSv/day** in that experimental context, plus relatively lower dose in sleeping quarters. These are **research observations**, not permissible exposure limits or comparisons to substitute for a new mission’s measured radiation [C7].
3. **CANS + Radi-N2 data schema implication (PROPOSED):** include a *source classification*: personal, area, location-mapped, passive integrated, or continuous active; include neutron-specific channel and data latency.

**Follow-up after abnormal radiation measurement:** Which detector flagged the event and what exactly was measured (Gy/Sv; dose rate)? Calibration OK? Are spacecraft and personal dosimeters consistent? Was there a confirmed SPE? Where was the astronaut, with what shielding, for what duration? Was this during EVA? Is a crew medical review indicated by the approved exposure incident protocol? Any acute symptoms? Symptoms do not determine the radiation dose and absence of symptoms does not exclude significant exposure.

**Conclusion / recommendation:** “Calibrated area dose rate exceeded approved mission event criterion [rule ID]; execute mission radiation response protocol and obtain radiation officer/flight-surgeon review.” **Do not** use 600 mSv career limit as the trigger to wait before sheltering. Track sensor uncertainty and accumulated exposure and do not generate personal cancer probabilities from simplistic mSv multiplication.

## 8. Cross-domain inference and dangerous confounding

| Observation combination | Candidate questions / checks | What the system must NOT infer |
|---|---|---|
| Headache + visual blur | Sudden onset? OCT/acuity/visual fields? Cabin CO2? Sleep? EVA/pressure history? | “This proves SANS or high intracranial pressure.” |
| Headache + slow PVT + poor sleep | Repeat standardized PVT; assess workload, medication and environment | “Sleep is definitely the cause”; bypass neurological red flags |
| Dizziness after gravity transition | Vestibular symptom trend, vomiting, neuro signs, mission phase | “Normal adaptation” if severe, persistent or accompanied by focal findings |
| Fatigue + high cabin CO2 | Verify calibrated telemetry and medical symptoms; route to cabin safety module | Diagnosis from CO2/sleep temporal correlation |
| Neurologic symptom after EVA | Immediate serious-signs screen; link EVA timing / pressure; authorized protocols | Rule out DCS on basis of no detected bubbles / normal baseline |
| Radiation spike + headache | Confirm detector/event; evaluate headache independently | Diagnose acute radiation syndrome from headache or simple background readings |

## 9. Decision-support logic and implementation requirements

**Rule precedence (proposed architecture):**

1. **Safety / external-protocol triggers first:** new acute neurological deficits, major sudden visual loss, and approved radiation alarm flags → urgent action without waiting for repeated measurements.
2. **Data quality gate:** missing, incompatible device, poor-quality OCT or calibration failure → “uninterpretable / repeat or verify,” not “normal.”
3. **Published criterion gate:** evaluate only with right technique and context (e.g. Spectralis peripapillary **TRT** ≥20 µm). Report the exact criterion and revision.
4. **Individual trend gate:** compared with a repeated preflight distribution plus recent phase and measurement variability; show absolute change and temporal trend. Current 14-day median is a **synthetic demo heuristic**.
5. **Question branch:** symptom onset, trajectory, functional impact, medication, sleep, environmental and EVA/radiation context.
6. **Suggested interpretation:** observation, possible explanations, cannot-exclude statements, confidence/quality flags. Avoid diagnosis or uncalibrated numeric risk score.
7. **Recommended next step:** (i) normal monitoring, (ii) repeat/assess, (iii) priority onboard CMO review, (iv) immediate mission-approved emergency protocol. Preauthorized local actions may proceed without Earth response; qualified onboard medical personnel and approved mission rules govern imaging, medication, EVA restrictions, and fitness to work.
8. **Communication state and treatment response:** record whether a ground consultation is queued, sent, acknowledged, answered or unavailable, and when an onboard action was started. Never reinterpret stale Earth advice as real-time assessment.
9. **Human audit:** capture CMO/medical reviewer signoff, timestamps, exact rule IDs, preapproved protocol versions, data versions, and change history.

### Candidate rule IDs (not approved for operational deployment)

| Rule | Input → behavior | Evidence / classification |
|---|---|---|
| `NEURO_RED_FLAG` | New focal deficit / severe acute neurological sign → urgent clinical protocol | Safety proposal; human review required |
| `VISUAL_ACUTE` | Sudden major vision loss or new severe diplopia + neurological concerns → urgent clinical protocol | Safety proposal |
| `SANS_TRT_20` | Protocol-compatible average peripapillary TRT change ≥20 µm → possible early SANS finding; clinical review | 2026 consensus [S1] |
| `SANS_TRT_55` | Comparable TRT change ≥55 µm → higher severity review | 2026 consensus [S1] |
| `SANS_REFRACTION` | Hyperopic refractive shift >+0.50 D → assess possible SANS | 2026 consensus [S1] |
| `SLEEP_TREND` | Repeated decline from baseline, with quality/schedule context → fatigue questionnaire | Project demo heuristic; not flight-validated |
| `SLEEP_REFERENCE` | Repeated actual sleep <7 h/night → report adult guideline context | General adult AASM/SRS [G1] |
| `PVT_DECLINE` | Repeated vigilance decline against validated test-specific variability → medical/fatigue assessment | Requires approved specific cutoff |
| `RAD_EVENT` | Approved radiation system alarm / mission threshold → mission response | Must be supplied by certified mission system |
| `RAD_CAREER` | Compare cumulative NASA-defined effective dose to career <600 mSv requirement; trend/project | NASA-STD-3001 V1 4030; *not shelter trigger* |

**Explicit result format (example):**

```
Finding: Possible early ocular change
Observation: Right-eye average peripapillary TRT +24 µm vs comparable preflight OCT
Quality: Spectralis protocol matched; segmentation verified; dates recorded
Published criterion: ≥20 µm average TRT change (2026 SANS consensus)
Other symptoms: blurred near vision; onset over two weeks
Interpretation: Meets an early SANS monitoring criterion; other causes remain possible
Next step: Qualified flight-surgeon/ophthalmic review; review trends and repeat imaging per protocol
Not concluded: Elevated intracranial pressure; irreversible damage; EVA fitness
Provenance: S1, rule SANS_TRT_20 (research spec version 1.0)
```

## 10. Deep-space autonomy and communication-delay requirements

### Why communication latency changes medical decision-making

The onboard system must not assume continuous, interactive medical support from Earth. For Mars missions, NASA documents approximately **4 to 24 minutes one way**, so an ordinary request and response can take **8 to 48 minutes at minimum**, plus packet transfer, ground review, relay scheduling and data processing. Conjunctions may interrupt communication for extended periods. These are *mission-dependent engineering conditions*, not fixed medical waiting times [N5, N9]. The CSA's **Health Beyond** program explicitly identifies autonomous crew medical decisions, limited resupply and lack of evacuation as deep-space healthcare constraints; the **Connected Care Medical Module (C2M2)** is a research/development example of integrating instruments, decision support and care workflows [C8, C9, C10].

> **Design principle:** The medical workflow is **onboard-first, offline-capable and ground-assisted**, not ground-dependent. The software can suggest **preapproved actions**, but clinical authority stays with the trained crew and designated CMO under mission protocols. The software must never invent a treatment, dose, or emergency action because a ground response is delayed.

### Three action tiers

| Tier | Trigger/context | What happens onboard | Earth communication | Authority / evidence status |
|---|---|---|---|---|
| **A: Immediate protective response** | Critical neurologic warning sign, sudden major visual loss, or approved radiation event alarm | Display cached emergency protocol; prompt crew to stop hazardous activity and notify the CMO; execute **preauthorized time-critical protective steps** appropriate to the hazard. If a radiation shelter trigger is confirmed, do not delay sheltering to obtain permission from Earth | Send high-priority event packet *in parallel*, without waiting | Only mission-approved, preflight-tested procedures. NASA radiation shelter operations [N7]; emergency priority is proposed internal design architecture |
| **B: Prompt onboard clinical review** | Progressive OCT findings, persistent cognitive change, significant sleep impairment, sustained vomiting or worsening dizziness without emergency signs | Gather targeted questions, repeat valid measurement if appropriate, show available equipment and approved interventions; CMO evaluates and determines next actions and duty restrictions | Transmit structured consultation when available; continue local follow-up | Published measurement criteria plus CMO judgment; countermeasures require individual authorization |
| **C: Routine prevention / monitoring** | Stable symptoms, minor deviations or known adaptation with no red flags | Environmental or schedule review, standardized remeasurement, prevention guidance; monitor response over time | Batch nonurgent summaries | Evidence-based self-management context; not a diagnosis |

**Critical distinction:** “Onboard autonomy” does **not** mean an astronaut self-prescribes an unapproved drug, performs an invasive procedure from an app prompt, or bypasses the CMO. When no designated CMO is physically available, the crew should follow its approved emergency training and written protocols, not a newly generated medical plan.

### Minimum onboard data and equipment assumptions

Before offering an action, we need a mission-specific inventory of **actual** available capabilities, including exam methods (visual acuity charts, OCT, ultrasound, validated cognitive tests), accessible medications and their authorized indications, medical devices, personal and cabin dosimetry, designated shelter locations, life support/environmental telemetry, and trained responders. A recommendation requiring an unavailable instrument, medication or shielding location must not be shown as immediately executable. NASA and CSA describe compact autonomous medical systems as *future capabilities*; We must not imply that the spacecraft already carries every research instrument [C8, C9, C10].

### Local decision and delayed-consultation workflow

1. **Detect and preserve context:** Store the finding with UTC timestamp, mission elapsed time, sensor/test metadata, symptoms, quality and last known communication status.
2. **Run safety overrides locally:** Hard-coded, versioned emergency criteria supersede baseline trends. Use approved mission response text and route immediately to the CMO and crew warning channel as appropriate.
3. **Show an actionable card:** Separate **do now (approved)**, **check next**, **CMO authorization needed**, **Earth consultation**, and **do not infer**. Include the last approved protocol version and link to its offline procedure.
4. **Act and document locally:** Record which person acknowledged the warning, action performed, time, equipment used, and observed response; continue monitoring. Do not automatically perform irreversible actions or administer medication.
5. **Queue consultation asynchronously:** Create a concise high-priority medical summary with abnormal measurement, baseline, trend, symptom onset, critical negatives/positives, actions already taken, response, current clinical status, and specific question for Earth. Attach imaging or raw data when bandwidth permits; preserve necessary evidence locally subject to privacy and storage policy.
6. **Reconcile delayed replies:** Timestamp when Earth's recommendation was *written* and *received*. If the astronaut's state changed in the meantime, display a **stale-advice warning** and require CMO reassessment before adopting it. Log message IDs and acknowledgement state; retry after interruptions without duplicating actions.
7. **Reassess after treatment:** Use a condition-specific interval from the approved protocol; record symptoms, functional ability, repeat measurement and adverse effects. No universal “15-minute recheck” can cover every condition.

**Communication statuses:** `offline` → `queued` → `transmitted` → `acknowledged` → `ground_response_received` → `reviewed_by_CMO`. These states are communication metadata, **not** clinical clearance. Missing ground acknowledgement must not block immediate crew safety actions.

### Response packet for the software handoff (proposed JSON schema fields)

```json
{
  "event_id": "fictional-event-001",
  "detected_at_utc": "2026-11-14T10:00:00Z",
  "mission_elapsed_seconds": 864000,
  "risk_domain": "vision",
  "urgency": "priority_onboard_review",
  "observation": {"parameter_id": "V1", "delta": 26, "unit": "um"},
  "baseline_compatible": true,
  "source_rule": "SANS_TRT_20",
  "protocol_version": "mission-approved-version-required",
  "onboard_actions": ["CMO notified", "repeat OCT requested"],
  "response_to_actions": "not_yet_assessed",
  "estimated_one_way_latency_minutes": 20,
  "ground_message_status": "queued",
  "last_ground_advice_utc": null,
  "medical_clearance": "not_determined"
}
```

This is a **synthetic example of data shape**, not an operational clinical recommendation or a claim that an action has been performed. It must be privacy-protected and audit-logged.

## 11. Medical and operational countermeasures by risk

The aim is to **improve the astronaut's condition where a realistic action exists**, while distinguishing symptom management from disease reversal. The following options are research-informed candidate workflows; only **mission-approved, individual-specific instructions** may be presented as executable treatment.

### 11.1 SANS and visual changes

| Finding | Possible onboard benefit | What requires medical oversight / additional test | Limits and cautions | Evidence |
|---|---|---|---|---|
| Gradual hyperopic shift / difficulty reading displays | Use pre-stowed **space anticipation glasses** or approved corrective lenses appropriate to the measured refractive shift; improve display readability | CMO/ophthalmic review of refraction, acuity and ocular images | **Glasses improve visual function, not the underlying ocular anatomy or SANS**; avoid changing lens strength without an assessment | **Currently used** [S1] |
| Increasing OCT peripapillary TRT, disc edema, new folds | Repeat quality-controlled OCT, monitor fields/acuity, adjust surveillance frequency, document rate of progression and duties affected | CMO and remote ophthalmologist when communications permit; use onboard diagnostic equipment only if present | No established treatment proven to reverse SANS in orbit; OCT change alone is not proof of high ICP | **Consensus monitoring** [S1]; **CSA research** [C1, C2] |
| Proposed fluid-shift countermeasure | **Do not automatically initiate.** Lower-body negative pressure (LBNP), thigh cuffs and other fluid-shift strategies may be discussed *only* if authorized mission equipment and research/clinical protocol exist | CMO/protocol review of cardiovascular tolerance, duration, contraindications and objective outcome measures | **Experimental for treating SANS**, not established therapy; published LBNP effects on surrogate physiology do not establish visual recovery | **Investigational** [S1] |
| Sudden visual loss, new major field defect, severe diplopia with neurologic symptoms | Stop hazardous tasks; activate onboard emergency evaluation immediately | CMO follows the mission's acute visual/neurological emergency protocol; asynchronous Earth consultation | **Do not wait for Earth, assume SANS, or delay an emergency screen for repeat OCT** | **Urgent safety principle**, proposed integration with approved protocols |

**Not recommended as autonomous SANS treatment:** empiric acetazolamide, topiramate, other pressure-lowering medications, improvised goggles/pressure systems or fluid shifts. The consensus discusses potential therapies but explicitly finds no established in-flight SANS treatment beyond corrective glasses; medication risks may be substantial [S1].

### 11.2 Cognitive and neurological symptoms

| Finding | Potential useful action | When to escalate | Caution / evidence |
|---|---|---|---|
| Slower PVT or reduced concentration after poor sleep | Pause/reassign safety-critical duties **as mission rules permit**, reduce excessive workload, arrange recovery sleep, review light schedule, caffeine and medication exposure; repeat the *same* validated test when appropriate | CMO review if persistent, progressing, or functionally impairing | Performance decline is not automatically a neurological diagnosis; **sleep intervention is appropriate only after screening for acute red flags** [N4, N3] |
| Recurrent mild headache without red flags | Verify hydration, sleep opportunity, visual strain, cabin conditions (including CO₂), recent exercise/EVA and known triggers; follow the onboard symptom-management protocol | Increasing severity, unusual pattern, neurologic or visual signs, persistent symptoms | A headache is not proof of SANS or elevated ICP. Any medication must be preauthorized and checked for contraindications/interactions |
| Sudden weakness, speech trouble, seizure, marked new confusion, thunderclap headache | **Immediate crew/CMO emergency response** with the mission's approved protocol; obtain last-known-well time and assess other acute signs without delaying protective action | Emergency automatically, even with previously normal trends | No ground-authorization delay; the system does **not** diagnose stroke, DCS, intoxication, or prescribe emergency drugs |

**Canadian relevance:** CSA **Wayfinding** is evidence for tracking spatial orientation and cognitive function, not for prescribing a neurological treatment [C3]. The CSA **Health Beyond** report supports locally available clinical decision aids with medically trained onboard leadership [C8, C10].

### 11.3 Vestibular dysfunction / space motion sickness

| Finding | Potential countermeasure | Oversight / follow-up | Evidence and risks |
|---|---|---|---|
| Nausea, motion intolerance and dizziness in early gravity adaptation | Limit provoking head/body movements when feasible, adjust task demands, protect hydration/nutrition, and allow adaptation periods | Track vomiting frequency, ability to drink, hydration signs, effect on duties; CMO reviews symptoms | NASA's Space Adaptation Sickness technical brief identifies behavior modification and delaying demanding EVA while performance is impaired [N6] |
| Moderate/severe space motion sickness limiting performance | Follow the **individual preapproved medication protocol** using available medical supplies; CMO verifies allergies, contraindications, sedation and interaction with tasks | Document drug name, dose *as actually administered by qualified crew*, time, response and side effects; do not auto-suggest doses | NASA describes historical inflight use of promethazine and other antiemetics, but sedating or performance-impairing effects matter; prescribing remains CMO-directed [N6, N10] |
| Persistent coordination or balance impairment during gravity transition | CMO-directed graded sensorimotor/vestibular adaptation or rehabilitation if mission protocol allows | Functional testing before return to demanding operations; repeat assessment when symptoms worsen | Rehabilitation/pre-adaptation is an area of research, not a universal fixed exercise regimen [N10] |
| Dizziness with focal neurological signs, severe headache or collapse | Activate urgent neurologic/emergency protocol, not routine motion sickness workflow | Immediate CMO response; cross-link DCS/EVA screen where appropriate | Do not mask red flags by assigning an adaptation diagnosis |

### 11.4 Sleep deprivation and circadian disruption

| Finding | Potential improvement | Follow-up measurement | Evidence and limits |
|---|---|---|---|
| Short sleep from insufficient allocated time | Protect sufficient sleep opportunity, review task scheduling and reduce avoidable schedule shifts; avoid safety-critical duties at circadian low points where possible | Sleep opportunity, actual sleep and fatigue over ensuing nights | NASA-STD-3001 [V1 6001] includes **8.5-hour recommended sleep period** and fatigue-management principles [N3] |
| Sleep fragmentation from cabin environment | Adjust approved **lighting**, noise control, privacy, thermal comfort, and ventilation where compatible with spacecraft safety; use approved eye masks/earplugs if appropriate | Awakenings, diary, noise/light/CO₂ context and next-day alertness | Environmental management supported by NASA scheduling standards and CSA's *Sleeping in Space* [N3, C5] |
| Sleepiness during working hours | CMO/operations-led fatigue countermeasures: planned naps, circadian lighting, and permitted caffeine timing or other approved strategies; adjust high-risk tasks | Subjective sleepiness and PVT, repeat trend | Countermeasures are contemplated by NASA standards; no universal “safe to operate” score exists [N3] |
| Persistent insomnia or circadian dysfunction | CMO evaluates medical/psychological causes, pain, environmental issues and any available treatment options | Serial sleep and functional data | **Medication is not an autonomous app suggestion**; medication selection, dosing and duration require authorized review |

**Never let a normal wearable sleep score clear a crewmember who is confused, acutely unwell or unable to perform safely.** A suggested nap or caffeine is not an alternative to evaluating a neurological emergency.

### 11.5 Space radiation exposure and radiation-related medical concerns

| Finding | Immediate protective action | Follow-up / possible medical care | Evidence and cautions |
|---|---|---|---|
| Mission-defined SPE warning or radiation detector shelter alarm | **Execute approved shelter procedure onboard without waiting for ground**; move to designated higher-shielding location, follow the spacecraft's protective configuration and avoid unnecessary EVA/exposure | Confirm area/personal readings, track location/time, document exposure and when the mission allows safe egress | NASA's Orion shelter concept uses reconfigured onboard stowage and dosimetry; **the actual shelter layout is spacecraft-specific** [N7] |
| Unexpected dose-rate increase without confirmed source | Verify detector status, units and background, cross-check independent instrument if available while maintaining safety, notify CMO/radiation lead | Evaluate time in each location and any EVA history, update total dose estimates | Neither area dose rate nor ambient neutron reading is directly a personal organ dose [C6, C7, N8] |
| Confirmed elevated cumulative mission/career dose | Apply ALARA: optimize habitat/shielded locations and task/EVA schedules using approved radiation planning models | CMO/radiation officer calculates relevant individual/organ exposure and future mission budget | **600 mSv career effective dose is not a shelter trigger** [N3] |
| Suspected high-dose incident / acute illness after exposure | Immediate approved exposure-response and medical assessment; evaluate symptoms without assuming they prove radiation injury | Onboard CMO assesses timing, clinical condition and appropriate testing *if available*, supported by delayed specialist consultation | No automated diagnosis of acute radiation syndrome, no generic protective pill, and no medication dosing from a dosimeter alone |

**Canadian relevance:** CANS is designed to help measure **neutron radiation continuously**, while Radi-N2 demonstrated personal and location-specific **passive neutron dosimetry**. Their value for the system is exposure characterization and timely monitoring, **not evidence of a radiation antidote** [C6, C7]. CSA's **C2M2** concept illustrates integrating medical devices and decision-support capacity for geographically isolated care [C9].

### 11.6 Intervention record: how to determine whether the astronaut improved

For each *authorized* action, keep a structured response record rather than merely marking “recommendation shown.” Minimum fields:

| Field | Example / purpose |
|---|---|
| `action_id`, `condition`, `authorized_protocol_id` | Link the intervention to the exact approved guidance |
| `authorization_level`, `authorized_by` | Self-care permitted / CMO required / ground advice optional; role and identity for audit |
| `performed_at_utc`, `crew_acknowledged_at_utc` | Distinguish suggested action from completed action |
| `available_onboard` | Confirm required hardware, stock, qualified operator and safe location |
| `pre_action_measurement` | E.g., baseline and latest vision, PVT lapses or sleep duration |
| `reassessment_due` | **Condition-specific interval defined by protocol**, never guessed by software |
| `post_action_measurement` | Same compatible test and quality checks where possible |
| `patient_report`, `adverse_effects`, `functional_status` | Did symptoms, performance or side effects improve? |
| `outcome` | `improved`, `unchanged`, `worse`, `unknown`; no unvalidated cure claim |
| `ground_consult_status` | Sent/queued/received, timestamped and stale-response checked |

### 11.7 Example autonomous scenarios (fictional)

**Scenario A: probable fatigue:** An astronaut sleeps 5.8 to 6.2 h on several successive nights and reports daytime sleepiness. The local system requests the focused sleep/fatigue questions and checks emergency neurological signs. With no emergency signs, it shows **locally approved** sleep-scheduling and environment countermeasures and recommends a CMO/operations review before critical work. It queues an Earth consultation if needed, tracks sleep and alertness, and records whether changes helped. **It does not prescribe a sleeping pill or declare the astronaut medically unfit by algorithm.**

**Scenario B: ocular change:** Compatible OCT scans show a +26 µm TRT change relative to preflight, triggering the early consensus SANS review criterion [S1]. The workflow asks about symptoms, checks for sudden-vision red flags, reviews image quality, and suggests onboard CMO assessment and repeat/serial OCT. Corrective glasses may assist functional vision *if refractive shift is confirmed and suitable eyewear is onboard*. Earth ophthalmology input is requested asynchronously. **It does not claim that glasses reverse SANS.**

**Scenario C: radiation alarm during delayed communications:** An approved onboard radiation monitoring system signals a shelter event. The onboard software immediately displays the **spacecraft-specific, preapproved shelter plan** and the local crew/CMO notification pathway; it does **not** show “wait for ground confirmation.” It logs personal/area dosimeters, crew location, shelter entry and later exposure estimates; requests Earth review concurrently. The crew follows the approved event-exit rule rather than an app-generated countdown [N7].

**Scenario D: sudden speech difficulty:** Regardless of preflight cognitive performance or recent sleep, the onboard software activates the local emergency medical protocol, records last-known-well time, notifies the CMO, and queues a high-priority ground report. A delayed reply from Earth cannot substitute for the immediate onboard emergency response.

## 12. Proposed questionnaire bank (structured, no diagnosis)

**Universal (asked locally, without ground connectivity):** What changed? Onset (date/time), sudden vs gradual, stable/worse/improving, severity, functional interference, previous episodes, current medications/caffeine, sleep and work shifts, relation to gravity transition, EVA, cabin or radiation event.

**Vision:** one/both eyes; near/distance; blurred/distorted/double; field loss; flashes/floaters; headache/nausea; corrective glasses; OCT availability and eye examination.

**Neurological:** new weakness/asymmetry; speech difficulty; orientation/confusion; severe sudden headache; dizziness; coordination and navigation difficulty; motion sickness; ability to eat/hydrate/work; last normal status.

**Sleep:** actual sleep and allocated opportunity; bedtime/midpoint; number/duration of awakenings; refreshing? sleepiness now? naps; caffeine/medications; light/noise/ventilation; stress/workload; lapses/errors during duties.

**Radiation:** detector quantity and units; person/area reading; alarm source; confirmed solar event; location/shielding and duration; EVA; calibration; missing intervals; concurrent symptoms; approved mission procedure followed.

**Before suggesting any countermeasure:** Is the required equipment/medication actually onboard? Is the protocol available offline? Is this action preauthorized for the astronaut, and is CMO approval required? Who can perform it? What must be reassessed, and when? What was already done? Has the astronaut worsened since the last Earth message?

**Privacy:** Mental-health disclosures stay private within authorized clinical channels; do not send sensitive questionnaire answers to the entire crew dashboard. Real crew health data must not be stored in browser `localStorage`; this limitation is already documented in [REFERENCES_AND_AI.md](REFERENCES_AND_AI.md).

## 13. Implementation handoff and acceptance checks

| Priority | Deliverable | Acceptance criteria |
|---|---|---|
| P0 | Health-monitoring data dictionary | Explicit units, device, timestamp, baseline type, missingness, reference source and mission-phase metadata |
| P0 | Rule provenance and safety class | Every result names standard/consensus/research/proposed; synthetic results clearly identified |
| P0 | Emergency precedence | New neurological red flags or mission radiation alarm bypass ordinary trend thresholds |
| P0 | Onboard-first emergency response | Certified local protocol loads while offline and **never waits for Earth**; CMO is immediately notified onboard |
| P0 | Preauthorized countermeasure cards | Each card has clinical indication, evidence grade, availability, actor/CMO authorization, contraindication caution, reassessment and clear “not approved” state |
| P0 | Asynchronous consultation handling | Supports offline queue, send/retry, time-stamped reply, duplicate handling and **stale advice** warning |
| P0 | Follow-up forms | Branch questions are relevant; no unsupported diagnoses or medical treatment |
| P1 | Synthetic vision case | TRT +24 µm → early consensus criterion if OCT quality matched; invalid scan → no conclusion |
| P1 | Synthetic sleep case | Repeated 6 h nights → trend + guideline context; no claim of clinical insomnia |
| P1 | Synthetic radiation case | Area neutron vs personal dosimeter; unit mismatches rejected; event alarm from supplied mission protocol |
| P1 | Cross-module context | Cabin CO2, EVA, sleep and symptoms linked by time, never declared causal |
| P1 | Test suite | Normal, missing, false positive, contradictory, unit mismatch, rapid onset and delayed reporting cases; add **20-min one-way, >40-min round trip, blackout, late reply, no CMO acknowledgement and radiation alarm while offline** |
| P1 | Intervention tracking | Suggestions are not logged as completed actions; track authorization, completion, outcomes and adverse effects separately |
| P2 | Longitudinal monitoring | Multiple preflight samples; flight phase covariates; device-specific variation; postflight tracking |
| Flight-only | Medical deployment | Flight-surgeon review, hazard analysis, validated thresholds, secure storage, calibration and mission approvals |

## 14. Evidence and source map

### Core NASA and CSA challenge resources

- **[U1] NASA HRP Five Hazards**: https://www.nasa.gov/hrp/hazards/ | *hazard taxonomy*: radiation, isolation/confinement, distance, gravity and hostile closed environment. Broad hazard taxonomy only; not a numerical threshold source.
- **[U2] NASA HRP Risks**: https://www.nasa.gov/hrp/risks/ | *risk scope*: ocular, sleep and neurological/radiation categories. Not a validated app algorithm.
- **[U3] NASA Ongoing HRP Research**: https://www.nasa.gov/hrp/ongoing-hrp-research/ | *measurement precedents*: ARCHeR actigraphy/light exposure; OCT/brain-fluid/SANS research; Standard Measures. Experimental context is not a clinical cutoff.
- **[U4] CSA 2026 Monitoring Radiation for Astronaut Health**: https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp | *CANS development*: continuous autonomous neutron monitoring; ~30% ISS fraction. Neither deployment status nor alarm thresholds.
- **[U5] CSA Why Conduct Science in Space?**: https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp | *deep-space motivation*: distance, increased exposure, communications/medical autonomy. Not specific clinical cutoffs.

### Canadian measurement and research programs

- **[C1] CSA SANSORI**: https://www.asc-csa.gc.ca/eng/sciences/sansori.asp | ocular questionnaires/imaging/MRI and eyeball mechanical properties; measurements before/during/after missions; research, not the source of ≥20 µm criterion.
- **[C2] CSA SANSORI-2**: https://www.asc-csa.gc.ca/eng/sciences/sansori-2.asp | continuing mechanistic research on ocular properties and SANS; not clinical alarm thresholds.
- **[C3] CSA Wayfinding**: https://www.asc-csa.gc.ca/eng/sciences/wayfinding.asp | spatial orientation tasks, MRI and neuropsychological tests, longitudinal before/after schedule; research context.
- **[C4] CSA Bio-Monitor**: https://www.asc-csa.gc.ca/eng/sciences/bio-monitor.asp | feasible wearable physiological data collection during sleep/exercise; not validated sleep-stage diagnosis.
- **[C5] CSA Sleeping in Space**: https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/sleeping-in-space.asp | sleep station, noise, schedule and circadian environment; popular-science article, not a medical threshold.
- **[C6] CSA 2026 CANS article**: same as U4; continuous autonomous neutron monitoring, Canadian development award, ISS neutron fraction.
- **[C7] CSA Radi-N2**: https://www.asc-csa.gc.ca/eng/sciences/radi-n2.asp | personal, sleep-station and cabin neutron dosimetry with week-long bubble-detector deployment; reports research observed neutron dose equivalent (~150 µSv/day) and spatial differences, **not a safety limit**.

- **[C8] CSA, Remote healthcare in space and on Earth**: https://www.asc-csa.gc.ca/eng/health/health-beyond-initiative/remote-healthcare-in-space-and-on-earth.asp | limits of evacuation/resupply and need for urgent autonomous medical decisions during deep-space missions.
- **[C9] CSA Connected Care Medical Module (C2M2)**: https://www.asc-csa.gc.ca/eng/health/health-beyond-initiative/health-beyond-canadian-flagship-c2m2.asp | **prototype concept** integrating medical technologies and decision-support; not an available onboard treatment system.
- **[C10] CSA Health Beyond deep-space healthcare advisory report (2021)**: https://www.asc-csa.gc.ca/eng/publications/health-beyond-report-advisory-council-deep-space-healthcare.asp | autonomous healthcare architecture: onboard clinician, local instrumentation, decision support, constrained data/communications and deferred ground consultation. **Policy/design guidance**, not a medical prescription.

### Standards and peer-reviewed evidence

- **[N3] NASA-STD-3001, Volume 1, Revision C (2023)**: https://www.nasa.gov/wp-content/uploads/2023/11/nasa-std-3001-vol-1-rev-c-with-signature.pdf | [V1 4029] ALARA, [V1 4030] <600 mSv career effective dose, [V1 6001] sleep/circadian work/rest scheduling and 8.5 h recommended sleep period. Confirm revision before any formal use.
- **[S1] Gew et al., *Eye* (2026), SANS expert consensus**: https://www.nature.com/articles/s41433-026-04651-6 | Spectralis peripapillary TRT ≥20 µm/≥55 µm, >+0.50 D hyperopic shift, clinical features and ISS examination context. Expert consensus, not an operational clinical validation.
- **[G1] AASM/SRS adult sleep duration consensus (2015)**: https://aasm.org/resources/pdf/adultsleepdurationconsensus.pdf | adults should regularly sleep ≥7 h; general recommendation, not flight-specific alarm.
- **[N4] NASA Standard Measures research (2025)**: https://www.nature.com/articles/s41526-025-00532-6 | research context for preflight/inflight/postflight multimodal standardization, not synthetic demo thresholds.
- **[N5] NASA Earth-independent operations, communications for exploration**: https://ntrs.nasa.gov/api/citations/20220002905/downloads/NESC-RP-20-01589_NASA-TM-20220002905final.pdf | ~4 to 24 min one-way Earth to Mars delay, autonomous flight response and radiation event operations; mission-dependent estimates.
- **[N6] NASA OCHMO Space Adaptation Sickness Medical Technical Brief (2025)**: https://www.nasa.gov/wp-content/uploads/2025/09/ochmo-mtb-004-space-adaptation-sickness-sas.pdf | activity adaptations, delaying critical tasks, historically used antiemetics and medication side effects. Technical brief **does not authorize the software to prescribe**.
- **[N7] NASA Crew Systems: Orion Radiation Shelter**: https://www.nasa.gov/reference/crew-systems/ | concrete example of onboard shielding configuration and radiation warning response. Orion-specific procedure, **not universal shelter instructions**.
- **[N8] NASA-STD-3001 Volume 2, space radiation monitoring**: https://www.nasa.gov/wp-content/uploads/2025/05/nasa-std-3001-vol-2.pdf | personal/area monitoring for BLEO missions; verify applicable revision and clauses before flight use.
- **[N9] NASA Mars communication and disruption technical assessment**: https://ntrs.nasa.gov/api/citations/20240011265/downloads/12-3-24%2020240011265.pdf | ~4 to 22 min one-way and possible weeks-long conjunction blackout depending on mission trajectory.
- **[N10] NASA Human Research Roadmap: Altered Sensorimotor/Vestibular Function**: https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=88 | pharmacological and adaptation/rehabilitation research precedents; not universal treatment instructions.


### Related internal documentation and code

- [RISK_MATRIX.md](RISK_MATRIX.md) : risk ownership, project coverage and status.
- [BASELINE_AND_DECISION_ENGINE.md](BASELINE_AND_DECISION_ENGINE.md) : synthetic baseline calculation, trend rules and their limitations.
- [WORKFLOW_UPDATES.md](WORKFLOW_UPDATES.md) : demonstration cadence and EVA symptom-screening changes.
- [CABIN_CREW_CONTEXT.md](CABIN_CREW_CONTEXT.md) : environmental observations and the distinction between correlation and causation.
- [MEDICAL_MENTOR_QUESTIONS.md](MEDICAL_MENTOR_QUESTIONS.md) : questions requiring flight-medical expertise.
- [RESEARCH_FEATURES.md](RESEARCH_FEATURES.md) : implemented functionality versus planned research.
- [src/engine.mjs](../src/engine.mjs) : existing trend calculations and follow-up logic.

These files document our design and implementation decisions. They are not independent medical evidence.

### Equipment availability checks for the intended mission

The clinical recommendation engine needs a versioned inventory mapping each parameter to `available_onboard`, `ground_only`, `research_only`, `planned_not_installed`, or `not_available`, with a trained operator, device model, consumables, calibration expiry, output data format, and approved protocol. It must fall back gracefully when a test cannot be performed. Any published ISS testing cadence or CSA research instrument is **a precedent, not a promise of availability** on the intended spacecraft.

Add validation scenarios for (1) OCT unavailable in flight but symptoms present, (2) only a commercial sleep watch is available, (3) a neutron bubble detector returns results one week later, (4) CANS absent despite being mentioned in a research citation, and (5) a radiation alert arrives while the Earth link is offline. In each case, the system must disclose the limitation and avoid fabricating measurements.

## 15. Unresolved medical decisions (for the mentor)

1. Which cognitive battery and PVT version will be used; what reliable-change criterion is appropriate given practice effects and mission duration?
2. Are OCT images standardized sufficiently to compare Spectralis peripapillary TRT, and who confirms segmentation and grade?
3. What in-flight visual-field/acuity devices and specialist review capacity are actually available for the intended mission?
4. Which patient symptoms automatically trigger mission emergency medicine, particularly overlapping DCS/EVA, stroke-like symptoms and ocular emergencies?
5. Which validated astronaut fatigue criteria and work restriction procedures can the team cite, beyond 8.5-hour sleep opportunity?
6. What calibrated radiation quantities are available onboard, and which approved thresholds activate shelter procedures? Does the system have neutron-specific telemetry or only research examples?
7. Who approves each rule, audit trail, privacy policy and postflight follow-up schedule?
8. Which actions are preauthorized for crew self-care, which require the CMO, and which drugs/procedures are actually stocked and trained for?
9. What minimum clinical actions must be possible during a 20 to 24-minute one-way delay or multi-day communication blackout?
10. Who signs the onboard protocol updates, and what is the safe fallback if a recommendation from Earth arrives after the astronaut’s state has changed?
11. Which countermeasures have sufficiently good in-flight evidence for inclusion as standard protocol, versus optional experimental research?

**Research conclusion:** I recommend an evidence-linked workflow for *change detection, onboard first response, reassessment, and delayed Earth consultation* in our clearly labeled synthetic prototype. The Canadian programs provide especially strong examples of what to monitor and how; the published SANS consensus and NASA standards supply a smaller set of defensible numeric reference criteria. Everything else should be marked as research-informed or proposed until clinically validated.


## 16. Science review and change control

- [ ] Confirm every threshold and device-specific qualifier against the cited original publication or NASA standard before presenting the rule as an evidence-based criterion.
- [ ] Obtain a flight-medicine mentor’s review of urgent symptom-screening language and escalation priority.
- [ ] Check all case examples remain explicitly synthetic, and keep the implemented-versus-proposed distinction synchronized with [RESEARCH_FEATURES.md](RESEARCH_FEATURES.md).
- [ ] Record any new clinical rules, source revisions or instrument changes here and update tests and [REFERENCES_AND_AI.md](REFERENCES_AND_AI.md) where applicable.
- [ ] Validate actions and delayed-advice behavior with a flight surgeon/CMO, not just developers.
- [ ] Confirm all preauthorized interventions are tied to the intended spacecraft’s inventory, protocols and trained responders.
- [ ] Simulate communications blackout, offline radiation alarm and Earth reply arriving after a change in astronaut condition.

**Research verification:** Medical claims, interpretations of the cited research, and applicability to actual missions must be reviewed by qualified medical and radiation specialists. No NASA or CSA endorsement is implied. Drafting provenance and source tracking are maintained in [REFERENCES_AND_AI.md](REFERENCES_AND_AI.md).
