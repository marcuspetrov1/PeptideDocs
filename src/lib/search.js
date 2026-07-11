import { CATEGORY_LABELS } from '@/data/categories.js'

// Substring match across name, aliases, category label, and overview.
// Normalizes needle defensively to handle both pre-normalized and raw input.
export function matchesQuery(p, needle) {
  if (!needle) return true
  const normalizedNeedle = needle.trim().toLowerCase()
  if (!normalizedNeedle) return true // after trim+lower, if empty, match all
  const hay = [
    p.name,
    ...(p.aliases ?? []),
    CATEGORY_LABELS[p.category] ?? p.category,
    p.overview ?? '',
  ].join(' ').toLowerCase()
  return hay.includes(normalizedNeedle)
}

// AND across groups, OR within a group.
// facets values are arrays of slugs.
// q is a substring match ANDed on top of facet filters.
export function applyFilters(list, { q = '', cat = [], route = [], evidence = [] }) {
  return list.filter(p => {
    // Text search: match against name, aliases, category label, overview
    if (!matchesQuery(p, q)) return false
    // Facet filters: AND across groups, OR within a group
    if (cat.length && !cat.includes(p.category)) return false
    if (route.length && !(p.route ?? []).some(r => route.includes(r))) return false
    if (evidence.length && !evidence.includes(p.evidence)) return false
    return true
  })
}

// URL → state helper. Parse URLSearchParams into filter object.
export function parseSearchParams(sp) {
  const csv = (k) => (sp.get(k) ? sp.get(k).split(',').filter(Boolean) : [])
  return {
    q: sp.get('q') ?? '',
    cat: csv('cat'),
    route: csv('route'),
    evidence: csv('evidence'),
  }
}

// State → URL helper. Omit empty params (no ?q= when blank).
export function toSearchParams({ q, cat, route, evidence }) {
  const next = {}
  if (q && q.trim()) next.q = q.trim()
  if (cat?.length) next.cat = cat.join(',')
  if (route?.length) next.route = route.join(',')
  if (evidence?.length) next.evidence = evidence.join(',')
  return next // pass to setSearchParams(next, { replace: true })
}
