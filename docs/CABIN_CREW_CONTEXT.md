# Cabin × Crew Context Explorer — scientific provenance and boundaries

ORBIT-M · November 14, 2026 · Team research derived from Maya Dimant and Ofir Nakash's working document and NASA's published standards.

## What is new

A fictional cabin-and-crew context panel directly below the guided mission:
- Ambient cabin ppO2 (mmHg), total cabin pressure (kPa), temperature (°C), humidity (%).
- **ppCO2 as a one-hour average in mmHg** (never mislabeled as an instantaneous reading).
- Crew-reported headache, difficulty concentrating, sleep trouble, or fatigue.
- Four synchronized story days (12, 15, 17, 19) with no live sensor feed. On day 17 a mock elevated one-hour mean CO2 and fictional symptoms appear on the same day; the prototype says this cannot establish cause.
- On day 19 the mock CO2 level is below the nominal reference but fatigue persists, demonstrating that nominal reference comparison does not rule out other problems.
- Manual fictional snapshot form, with numerical validation and multi-select crew symptom reports. Nothing is uploaded or saved.
- Readable bar-chart reference line, numerical values and descriptions; textContent for dynamic text rendering.
- Static files included in the offline app shell cache, no medical records added.

## Exactly what NASA supports

**Primary NASA standard:** [NASA-STD-3001 Volume 2, section 6](https://www.nasa.gov/reference/6-0-natural-and-induced-environments-vol-2/).

- **[V2 6001] Trend Analysis of Environmental and Suit Data:** environmental and suit data must support trend analysis.
- **[V2 6004] Nominal Vehicle/Habitat Carbon Dioxide Levels:** **average one-hour ppCO2** in a habitable volume must be **no more than 3 mmHg**. This is the exact and only NASA numeric atmospheric reference the module compares automatically.
- **[V2 6020] Atmospheric Data Recording:** for each isolatable habitable compartment, systems continuously record pressure, humidity, temperature, ppO2 and ppCO2.
- **[V2 6021] Atmospheric Data Displaying:** the same measurements must be displayed locally and remotely.
- **Ambient ppO2 is not inspired PIO2.** The app does not derive an inhaled-oxygen value or screen for hypoxia from ambient ppO2.

**Additional primary context:** [NASA OCHMO-TB-004 Carbon Dioxide](https://www.nasa.gov/ochmo-tb-004-carbon-dioxide-2/) describes research on headaches and elevated habitat CO2 among astronauts. It notes confounders such as fluid redistribution in microgravity and other factors. We do **not** convert observational research into individual medical prediction.

NASA's technical design requirements apply to validated mission systems, NOT to this browser prototype.

## Entirely project-authored story inputs (not NASA astronaut data)

| Day | CO2 one-hour mean (mmHg) | Crew symptoms | Demo presentation |
| --- | ---: | --- | --- |
| 12 | 1.8 | None | Below nominal CO2 reference; no symptoms reported |
| 15 | 2.4 | None | Below nominal CO2 reference |
| 17 | 3.4 | Headache, difficulty concentrating | Above nominal CO2 reference and **co-occurrence only** |
| 19 | 2.8 | Fatigue | Below nominal CO2 reference; symptom still needs professional context |

The examples also include invented ambient ppO2, pressure, temperature and humidity values. None constitutes spacecraft measurements or validated normality ranges.

## Explicit limitations
- No cabin sensors, continuous measurement, ISS API, diagnosis, causal inference, predictive health model, clinical clearance, medical advice or automated engineering actions.
- The NASA 3 mmHg reference applies specifically to **one-hour mean habitat ppCO2**; it must NOT be used as an instantaneous personal danger threshold.
- Oxygen ppO2 is displayed only, not translated to inspired oxygen or hypoxia assessment.
- No safe/unsafe classification for pressure, humidity or temperature because their required mission-specific context and measurements have not been verified.
- Form input bounds prevent broken entries; they are NOT operational safety thresholds.
- A normal habitat reference comparison does not guarantee the crew member or environment is safe.

## Twenty-second demonstration
1. Start [the four-stage guided story](https://bzeira.github.io/orbit-m-space-apps-2026/#flightStory).
2. Advance to **day 17**: the health engine shows repeated sleep/pulse changes; Cabin × Crew shows fictional **3.4 mmHg (one-hour mean)** above the NASA nominal habitat reference with same-day fictional headache/focus reports.
3. Explain: "Two data sources on one mission day can motivate a check, but cannot prove cause. Validate the averaging period and instrumentation; use approved mission procedures."
4. Advance to **day 19**: CO2 is now below the nominal reference while a symptom remains. The app does NOT declare the astronaut recovered.

## Acceptance checklist
- [ ] A human researcher verifies the NASA standard number, averaging duration, units and NASA links.
- [ ] Run node --test. Test day 17 and day 19, above-reference and no-causal-inference cases, malformed numeric inputs.
- [ ] Test manual form and reset, scene synchronization, keyboard and mobile display.
- [ ] Verify the live GitHub Pages site and the first-online-then-offline reload.
- [ ] Include this new feature in the final science review and disclose AI assistance.

## Authorship and disclosure
Maya Dimant and Ofir Nakash supplied the research direction and continue their joint science review. Barak Zeira leads team software integration. ChatGPT (OpenAI) assisted with the code, tests and documentation. The human team remains responsible for verification. NASA does not endorse or medically validate ORBIT-M.
