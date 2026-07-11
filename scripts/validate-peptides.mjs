#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Allow optional file path as command-line argument for testing
const dataPath =
  process.argv[2] || path.join(__dirname, '../src/data/peptides.json');

const VALID_CATEGORIES = [
  'recovery',
  'beauty',
  'gh-secretagogue',
  'fat-loss',
  'metabolic',
  'cognitive',
  'sexual-health',
  'hormonal',
  'immune',
  'longevity',
  'sleep-repair',
  'research-peptide',
];

const VALID_ROUTES = [
  'subcutaneous',
  'intramuscular',
  'oral',
  'intranasal',
  'topical',
];

const VALID_EVIDENCE = ['preclinical', 'early-human', 'clinical', 'unclassified'];

// Keys every item is allowed to have. Used to catch typos/unexpected fields
// as new data fields get added over time.
const KNOWN_KEYS = new Set([
  'slug',
  'name',
  'aliases',
  'category',
  'overview',
  'mechanism',
  'effects',
  'results_timeline',
  'timing',
  'administration',
  'route',
  'evidence',
  'research_notes',
  'doses',
]);

let exitCode = 0;
const errors = [];

try {
  // 1. Read and parse JSON
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  let data;
  try {
    data = JSON.parse(fileContent);
  } catch (e) {
    console.error(`ERROR: Failed to parse ${dataPath} as JSON`);
    console.error(e.message);
    process.exit(1);
  }

  // 2. Validate it's an array of exactly 64 items
  if (!Array.isArray(data)) {
    console.error('ERROR: File content is not a JSON array');
    process.exit(1);
  }

  if (data.length !== 65) {
    console.error(
      `ERROR: Expected exactly 65 items, but found ${data.length}`
    );
    process.exit(1);
  }

  // 3. Validate unique slugs
  const slugs = new Set();
  data.forEach((item, index) => {
    if (!item.slug) {
      errors.push(`Item ${index}: missing slug field`);
      exitCode = 1;
      return;
    }

    if (slugs.has(item.slug)) {
      errors.push(`Item ${index} (${item.name}): duplicate slug "${item.slug}"`);
      exitCode = 1;
    } else {
      slugs.add(item.slug);
    }
  });

  // 4. Validate categories
  data.forEach((item, index) => {
    if (!item.category) {
      errors.push(`Item ${index} (${item.slug}): missing category field`);
      exitCode = 1;
      return;
    }

    if (!VALID_CATEGORIES.includes(item.category)) {
      errors.push(
        `Item ${index} (${item.slug}): unknown category "${item.category}". Valid categories: ${VALID_CATEGORIES.join(
          ', '
        )}`
      );
      exitCode = 1;
    }
  });

  // 5. Validate aliases (optional; if present, array of non-empty strings)
  data.forEach((item, index) => {
    if (item.aliases === undefined) return;

    if (!Array.isArray(item.aliases)) {
      errors.push(`Item ${index} (${item.slug}): aliases must be an array`);
      exitCode = 1;
      return;
    }

    item.aliases.forEach((alias, aliasIndex) => {
      if (typeof alias !== 'string' || alias.trim().length === 0) {
        errors.push(
          `Item ${index} (${item.slug}), aliases[${aliasIndex}]: must be a non-empty string`
        );
        exitCode = 1;
      }
    });
  });

  // 6. Validate route (required; array; every element in the route enum; may be empty)
  data.forEach((item, index) => {
    if (!Array.isArray(item.route)) {
      errors.push(
        `Item ${index} (${item.slug}): route field is missing or not an array`
      );
      exitCode = 1;
      return;
    }

    item.route.forEach((route, routeIndex) => {
      if (!VALID_ROUTES.includes(route)) {
        errors.push(
          `Item ${index} (${item.slug}), route[${routeIndex}]: unknown route "${route}". Valid routes: ${VALID_ROUTES.join(
            ', '
          )}`
        );
        exitCode = 1;
      }
    });
  });

  // 7. Validate evidence (required; string; one of the evidence enum)
  data.forEach((item, index) => {
    if (typeof item.evidence !== 'string' || item.evidence.trim().length === 0) {
      errors.push(`Item ${index} (${item.slug}): missing evidence field`);
      exitCode = 1;
      return;
    }

    if (!VALID_EVIDENCE.includes(item.evidence)) {
      errors.push(
        `Item ${index} (${item.slug}): unknown evidence "${item.evidence}". Valid evidence: ${VALID_EVIDENCE.join(
          ', '
        )}`
      );
      exitCode = 1;
    }
  });

  // 8. Validate no unexpected top-level keys (catches typos in new fields)
  data.forEach((item, index) => {
    Object.keys(item).forEach((key) => {
      if (!KNOWN_KEYS.has(key)) {
        errors.push(
          `Item ${index} (${item.slug}): unexpected key "${key}"`
        );
        exitCode = 1;
      }
    });
  });

  // 9. Validate doses
  data.forEach((item, itemIndex) => {
    if (!item.doses || !Array.isArray(item.doses)) {
      errors.push(
        `Item ${itemIndex} (${item.slug}): doses field is missing or not an array`
      );
      exitCode = 1;
      return;
    }

    // PeptideDetail.jsx renders peptide.doses[0] unconditionally, so every
    // peptide needs at least one dose.
    if (item.doses.length === 0) {
      errors.push(`Item ${itemIndex} (${item.slug}): doses array is empty`);
      exitCode = 1;
      return;
    }

    item.doses.forEach((dose, doseIndex) => {
      // Check if dose has valid mg-based dosing
      const hasMgBased =
        dose.vial_mg !== null &&
        dose.vial_mg !== undefined &&
        dose.concentration_mg_per_ml !== null &&
        dose.concentration_mg_per_ml !== undefined;

      if (!hasMgBased) {
        // IU-only dosing requires a non-empty dose.label
        const hasLabel =
          dose.label !== null &&
          dose.label !== undefined &&
          typeof dose.label === 'string' &&
          dose.label.trim().length > 0;

        if (!hasLabel) {
          errors.push(
            `Item ${itemIndex} (${item.slug}), dose ${doseIndex} (label: "${dose.label}"): dose.label is missing or empty. ` +
              `Either vial_mg AND concentration_mg_per_ml must both be non-null, or dose.label must be a non-empty string.`
          );
          exitCode = 1;
        }
      }

      // ReconstitutionPanel.jsx always renders dose.syringe_reference.map(...)
      // regardless of mg-based vs. label-based dosing, so it must always be a
      // non-empty array, and every row must resolve to a displayable mg or iu.
      if (!dose.syringe_reference || !Array.isArray(dose.syringe_reference) || dose.syringe_reference.length === 0) {
        errors.push(
          `Item ${itemIndex} (${item.slug}), dose ${doseIndex} (label: "${dose.label}"): syringe_reference is missing or empty`
        );
        exitCode = 1;
      } else {
        dose.syringe_reference.forEach((ref, refIndex) => {
          const validMg = ref.mg !== null && ref.mg !== undefined && typeof ref.mg === 'number';
          const validIu = ref.iu !== null && ref.iu !== undefined && typeof ref.iu === 'number';
          if (!validMg && !validIu) {
            errors.push(
              `Item ${itemIndex} (${item.slug}), dose ${doseIndex}, syringe_reference[${refIndex}] (units: ${ref.units}): neither mg nor iu is a numeric value`
            );
            exitCode = 1;
          }
        });
      }
    });
  });

  // Print errors if any
  if (errors.length > 0) {
    errors.forEach((error) => console.error(error));
    console.error('\n');
  }

  // Print success summary
  if (exitCode === 0) {
    const categorySet = new Set(data.map((item) => item.category));
    console.log(`✓ Validation passed!`);
    console.log(`  - ${data.length} items found`);
    console.log(`  - ${categorySet.size} unique categories: ${Array.from(categorySet).sort().join(', ')}`);
  }

  process.exit(exitCode);
} catch (e) {
  console.error(`FATAL ERROR: ${e.message}`);
  process.exit(1);
}
