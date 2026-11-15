# Astronaut EVA presentation flow

The default entry is now the team's original Welcome design. The existing research workspace remains available through **Research workspace**, including its original section bookmarks and locally saved data.

1. Click **Welcome**, or activate it with the keyboard, to open identification.
2. Enter a whole-number ID from **1 to 10** and press **ENTER** or the Enter key.
3. The astronaut page retains the illustrated avatar, seven parameter rows, Normal/Abnormal arrow controls, mission length, purpose and **Assess Readiness**.
4. Click a parameter name or status to inspect its report: 14 fictional preflight readings, a personal median baseline, seven mission readings, the explicit DEMO range, a baseline/current comparison and an accessible data table.
5. **Assess Readiness** opens the green approval design if every parameter is within its DEMO range. Otherwise it opens the red warning design.
6. **CLICK HERE TO SEE DATA** lists only abnormal or unavailable parameters. Each links to its own report, with a return to the findings list.

## Presentation fixtures and state

- All ten astronauts and their readings are fictional. IDs **1, 5 and 8** initially have all Normal values. ID **2** initially has abnormal bpm and body temperature, matching the team's reference. The existing ten-ID scenario assignments are preserved.
- The arrows select a synthetic Normal or Abnormal value. They update the actual latest reading, so the status, graphs and readiness result remain consistent.
- Each astronaut retains independent mission inputs and demo changes during the current tab session. Reloading resets this presentation data. It does not overwrite the research workspace's existing local records.
- ID entry is a demonstration selector, not identity verification or medical-record access.
- All seven ranges are team-authored, unvalidated **DEMO** rules. The /100 screening indices are interface fixtures, not clinical measurements or connected tests. Approval is explicitly labeled as a demonstration result and never records medical clearance. No new scientific threshold claims are introduced.
- Missing or nonfinite readings block approval. Changing a URL to an approved-result route cannot bypass the current values.

## Preserved visual material

The original Canva font files were not supplied. To avoid substituting the carefully chosen letterforms, `assets/astronaut/original-elements.png` preserves the supplied title artwork, row labels, result lettering, warning icon and astronaut illustration. `src/astronaut-art.mjs` records their sprite coordinates. These are extracted source elements, not recreated typography. Accessible names remain real HTML text or SVG labels. New report text and entered values use the existing system/Arial family and do not introduce a webfont dependency.

`welcome.jpeg` preserves the original Welcome composition. A small starfield texture from the same image, a sunset and a magenta perspective grid carry that visual language across the other screens. The original white data cards, ID silhouette/ribbons, green result, warning symbol, orange data button and red/black warning stripes remain recognizable and functional. No Canva editor/browser chrome is included in the shipped assets.

The service worker includes the new modules and local artwork in its static cache. No new external runtime dependencies, backend, identity service or real medical data are involved.

The earlier `eva-flow.mjs`, its scoped styles and tests remain in the repository. On hosts with the new artwork entry it stays hidden and does not lock body scrolling or create a second visible entry flow. Existing `#eva-flow` links open the new Welcome screen, and `?dashboard=1` still bypasses the introduction to the research dashboard.

## Validation

Run `node --test` for model and existing research regression tests. CI also checks all three new browser modules with `node --check`. Browser verification should cover IDs 1–10, both results, each parameter report, arrow/value consistency, invalid input, back navigation, research workspace access, mobile layout and offline replay after the first successful online installation.

On November 15, 2026, all **89 automated tests passed**, including the retained earlier EVA flow and the compatibility guard against a second entry overlay. Browser QA verified all ten ID-to-result flows, all seven reports (21 plotted and tabulated readings each), invalid IDs, Enter submission, retained and escaped mission inputs, findings-only filtering, return links and browser Back, arrow/report/result consistency, and protection against forcing approval through the URL. The seven screen types were also checked in a **390px iframe viewport**, with no horizontal overflow. The existing guided story, EVA timeline, sample log and DCS example initialized and responded correctly after removing an obsolete `setArea("hand")` call that previously stopped the research module. Static-cache coverage is automated; a real network-disconnected browser replay has not been manually verified in this environment.
