# Implemented research features — EVA & ISS habitat microbiology

Implemented on **November 14, 2026**, following Maya Dimant and Ofir Nakash's team research. The original team research document has not been replaced. This page distinguishes actual code, NASA evidence, and ideas left for further work.

## 1. Post-EVA Check: implemented as a SYNTHETIC self-report log
**UI:** main site → Post-EVA
- Stylized interactive body map; select hands, shoulders, torso, back, hips, knees or feet.
- Fictional EVA identifier, body side, onset, report type (pressure, strain, skin, fatigue or other), suit-fit notes, discomfort 0–10, ongoing/improving/resolved follow-up, optional fictional note.
- Locally stored demonstration history with synthetic examples and a reset button.
- No clinical scoring. A 0–10 self-rating is not an injury severity classification or decision about readiness for the next EVA.

**NASA evidence:** The 2022 evidence report describes potential injury and compromised performance from spacesuit/operational factors, including risks affecting hands and shoulders. The 2023/2024 NASA EVA incidence tracking abstract describes systematic tracking of suited exposure and injury location.
- https://ntrs.nasa.gov/citations/20220004017
- https://ntrs.nasa.gov/citations/20230015608

## 2. Habitat sample monitor: implemented as a SYNTHETIC ISS comparison
**UI:** main site → Habitat
- Records a fictional location, sample medium (air, water, surface), organism group, bacterial/fungal colony count and water coliform test status.
- Displays the actual source unit with each NASA ISS **in-flight** reference. Shows sample log and "above reference", "coliform detected" or "water test incomplete" context without medical/safety directions.
- Water fungal numeric comparison is intentionally unavailable, because NASA's page-10 ISS in-flight reference table does not specify a water fungi value.
- Reference is NOT evidence that any specific sample was correctly collected, calibrated or cultured. NASA's source does not authorize the prototype to decide cleaning, treatment, mission readiness or crew health.

**Official reference (NASA OCHMO-TB-046, Rev A, May 19 2025, p. 10):**
| ISS in-flight sample | Bacteria | Fungi |
|---|---|---|
| Air | 1,000 CFU/m³ | 100 CFU/m³ |
| Surface | 10,000 CFU/100 cm² | 100 CFU/100 cm² |
| Water | 50 CFU/mL and no detectable coliforms | not separately specified in table |

**Do not mix** with preflight limits on page 9, which have different collection context and figures. The table's own explanatory captions relate to the ISS Medical Operations Requirements Document.
- https://www.nasa.gov/wp-content/uploads/2025/05/ochmo-tb-046-microbiology-rev-a.pdf
- https://www.nasa.gov/reference/jsc-microbiology/

**Key distinction:** Environmental sample results are NOT the astronaut's gut microbiome or a diagnosis of infection.

## 3. Reviewed, **NOT** implemented / not validated
The original team document proposes more: in-suit gas pressure and metabolic telemetry, validated DCS/hypoxia medical diagnosis, post-EVA medical examinations, VGE Doppler screening, workload and nutritional thresholds, cognition tests, medical-record integration and operational treatment instructions. Many numerical claims in the English-language draft use numbered citations with no bibliography linking those numbers to verifiable sources. Therefore:

- **Only a fictional DCS symptom concern screen has been implemented. No DCS or hypoxia clinical diagnosis or emergency treatment guidance** has been implemented.
- **No NASA-certified pressure, oxygen or medical thresholds** have been coded.
- **No automatic additional sampling, disinfection, filter replacement or medical referrals** have been implemented.
- **No actual NASA electronic medical record, suit hardware, sensor, secure messaging, radiation tracking or hospital systems** have been connected.
- The site's collapsed **EVA Research Roadmap** is descriptive research scope, not a medical checklist, professional protocol or shipped feature list.
- NASA studies and technical briefs support relevance and limited reference figures, but **do not validate** the team's original wellness-engine heuristic thresholds or a personal medical decision-support system.

## 3A. DCS symptom concern screen — implemented as a NON-DIAGNOSTIC educational tool

The team identified a primary 2020 NASA publication: *Crew Health and Performance Extravehicular Activity Roadmap* (NASA/TP-20205007604). Its §3.7.2–3.7.3 covers tracking EVA exposure, suit fit, tasks, discomfort, injury and medical debriefings; §3.8 discusses decompression risk mitigation **research and validation gaps**. This is authoritative for the roadmap's subject matter, but **not an individual diagnostic rule or clearance protocol**:
https://www.nasa.gov/wp-content/uploads/2017/02/tp-20205007604.pdf

For specific DCS symptom categories, we used NASA OCHMO-TB-037, *Decompression Sickness (DCS) Risk Mitigation*, **Rev D, October 5 2026, page 3**, which lists:
- Type I symptom examples: itching, musculoskeletal pain, mild rash.
- Type II symptom examples: numbness, weakness, cognitive changes, inner-ear problems, cardiopulmonary issues, mottled skin rash.
Official source: https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-037-decompression-sickness.pdf

**What the prototype now does:** The user selects **fictional** pressure-reduction history (yes/no/unknown) and symptoms. If any serious symptom group is present, the UI flags **urgent medical review regardless of reported pressure history**. If milder symptom categories follow a reported pressure reduction, it displays **possible decompression-related concern, medical review needed**. Nonspecific symptoms without documented exposure are only shown as a need for symptom review. No selected symptoms gives **NOT ASSESSED**, never "no DCS" or "safe".

**What it cannot do:** Confirm DCS, infer Type I or Type II status for an individual, calculate probability, exclude other causes, select decompression/oxygen/hyperbaric treatments, prescribe EVA readiness, or replace approved medical/safety protocols. This nonvalidated question-based alert logic is **our own safety-conscious software design**, not an algorithm supplied or endorsed by NASA. The symptom form **does not store** its selections.

Test it using "Joint pain after pressure change", "Neurological / breathing concern" and "No symptoms selected" scenario buttons. See src/dcs-screen.mjs and tests/dcs-screen.test.mjs.

## 4. Technical data boundaries
- JavaScript modules: \`src/research.mjs\` (pure logic) and \`src/research-ui.mjs\` (browser UI).
- CSS: \`assets/research.css\`; HTML: \`index.html\`; tests: \`tests/research.test.mjs\`.
- Local browser storage stores **fictional entries** and can be reset. It is *not encrypted medical storage*. Do **not** enter genuine patient or astronaut health data.
- No external UI framework, API, network backend, sensor device or NASA logo is used.

## 5. Next science & QA steps
- [ ] Team science review of wording and NASA ISS table applicability to the selected challenge.
- [ ] Medical mentor consultation on serious symptoms and handling, **not** a claim of clinician approval.
- [ ] Manual browser tests: body-map and region selector, EVA add/reset, sample type switches, water coliform, reference labels, persistence after refresh, browser privacy, mobile layout and Console.
- [ ] Reconfirm official team Project submission links, presentation, video, AI disclosures and licensing.
- [ ] If available, use a genuine, appropriate NASA human research dataset in a separate, clearly sourced feature. The current input records are all fictional.

## AI disclosure
ChatGPT (OpenAI) assisted with implementation, scaffolding, interface copy and tests for the two new research-backed demonstrations on November 14, 2026. Maya Dimant and Ofir Nakash conducted the underlying team research. NASA is not a project sponsor or validating authority. The team must review, test and disclose AI use in its official submission.
