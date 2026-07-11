# Data review needed: route / evidence

Generated as part of Task 1 (search UX overhaul, data model changes). These
five `peptides.json` entries have `route: []` and/or `evidence: "unclassified"`
because the entry's own `overview` / `mechanism` / `effects` / `administration`
/ `research_notes` text did not unambiguously support a specific enum value.
Per the task brief, no route or evidence value was invented or upgraded based
on outside/general knowledge — only what each entry's own text states. These
need a human (site owner) pass to confirm or fill in.

## `route: []`

### `pnc-27` (PNC-27)
- `administration` field says "Subcutaneous (per proposed educational
  protocol; underlying animal research used intraperitoneal administration)".
- Left empty because the entry repeatedly disclaims that this route/dose is
  established: "No validated human dosing exists" (dosage_text) and "PNC-27
  has no established human safety profile" (timing). The only route actually
  used in the underlying research is intraperitoneal, which isn't in the
  route enum. Human reviewer should decide whether to still tag
  `subcutaneous` as "proposed" or leave blank.

### `slu-pp-332` (SLU-PP-332)
- `administration` field explicitly states: "Intraperitoneal in published
  animal studies; subcutaneous route is not validated for this compound in
  humans." Intraperitoneal isn't in the route enum, and the text explicitly
  disclaims subcutaneous. Left empty rather than tagging a route the entry
  itself says isn't validated.

## `evidence: "unclassified"`

### `glow` (Glow Blend)
- Blend of GHK-Cu, BPC-157, and TB-500. The entry's own overview/mechanism/
  effects text describes mechanisms in detail but never states an evidence
  tier (no "preclinical", "clinical trial", "Phase", etc.) for the blend
  itself. Individual components have evidence tiers on their own catalog
  entries, but per the task brief, evidence must be derived from each entry's
  own text, not inferred by cross-referencing other entries.

### `adamax` (Adamax)
- Overview/mechanism/effects use only hedged, non-evidentiary language
  ("is believed to", "reported benefits include") with no animal-study,
  human-study, trial, or case-report language anywhere in the entry
  (overview/mechanism/effects/research_notes).

### `igf-1-lr3` (IGF-1 LR3)
- Text states "It has never received regulatory approval for human
  therapeutic use" and discusses safety/dosing caveats, but does not state
  whether the underlying evidence is animal, in-vitro, or human (no
  "preclinical", "trial", "study", or "case report" language). Not enough
  in the entry's own text to place it in a specific tier.

## Note on route: entries with multiple values

Two entries have more than one route value derived directly from the
`administration` field text (not review items, just flagged for visibility
since they're a departure from the single-`subcutaneous` default):

- `semax`, `selank`: `administration` = "Subcutaneous or intranasal" →
  `route: ["subcutaneous", "intranasal"]`.
- `prostamax`: `administration` = "Intramuscular (subcutaneous mentioned as
  an alternative route)" → `route: ["intramuscular", "subcutaneous"]`.
