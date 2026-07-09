import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { XIcon } from 'lucide-react'
import { getAllPeptides } from '../data/peptides.js'
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../data/categories.js'
import { applyFilters, parseSearchParams, toSearchParams } from '../lib/search.js'
import PeptideSearch from '../components/PeptideSearch.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { cn } from '../lib/utils.js'

const sorted = [...getAllPeptides()].sort((a, b) => a.name.localeCompare(b.name))

const ROUTE_ORDER = ['subcutaneous', 'intramuscular', 'oral', 'intranasal', 'topical']
const ROUTE_LABELS = {
  subcutaneous: 'Subcutaneous',
  intramuscular: 'Intramuscular',
  oral: 'Oral',
  intranasal: 'Intranasal',
  topical: 'Topical',
}

const EVIDENCE_ORDER = ['preclinical', 'early-human', 'clinical', 'unclassified']
const EVIDENCE_LABELS = {
  preclinical: 'Preclinical',
  'early-human': 'Early human',
  clinical: 'Clinical',
  unclassified: 'Unclassified',
}

const PILL_BASE = 'h-auto rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.07em] uppercase'
const PILL_ACTIVE = 'border-primary-border bg-primary-bg text-primary hover:bg-primary-bg'
const PILL_INACTIVE = 'border-border text-muted-foreground hover:border-primary-border hover:bg-primary-bg hover:text-primary'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { q, cat, route, evidence } = parseSearchParams(searchParams)

  // Local buffer for the search input's displayed value, decoupled from the
  // async URL commit cycle. Without this, a burst of keystrokes faster than
  // React Router's render/commit cycle can settle out of order and snap the
  // input back to a stale, shorter string mid-typing (characters get
  // dropped/scrambled). The URL (`q`) remains the source of truth for
  // external changes (initial load, Back/Forward, chip removal, Clear all);
  // the effect below re-syncs the buffer whenever `q` changes from one of
  // those sources rather than from the input itself.
  //
  // `pendingEditsRef` counts search-input edits whose setSearchParams call
  // hasn't yet committed. Every keystroke through handleQueryChange updates
  // localQuery immediately (synchronous, never blocked on the URL) and
  // increments the counter; every `q` change consumes one pending edit and
  // is treated as an "echo" of our own typing rather than a real external
  // change, so it does NOT overwrite localQuery. This matters because
  // React Router's setSearchParams commits can land out of order under a
  // burst of near-simultaneous calls — without this guard, a stale,
  // out-of-order commit arriving after a later keystroke would still trip
  // the naive `useEffect(() => setLocalQuery(q), [q])` and snap the visible
  // input back to an older, shorter value even though the fix already
  // decoupled the *initial* display from `q`. Once the pending count drains
  // to zero, any further `q` change is genuinely external and resyncs the
  // buffer as intended.
  const [localQuery, setLocalQuery] = useState(q)
  const pendingEditsRef = useRef(0)
  useEffect(() => {
    if (pendingEditsRef.current > 0) {
      pendingEditsRef.current -= 1
      return
    }
    setLocalQuery(q)
  }, [q])

  function updateFilters(next) {
    setSearchParams(toSearchParams(next), { replace: true })
  }

  function handleQueryChange(value) {
    setLocalQuery(value)
    pendingEditsRef.current += 1
    updateFilters({ q: value, cat, route, evidence })
  }

  function toggleFacet(group, values, value) {
    const current = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value]
    updateFilters({ q, cat, route, evidence, [group]: current })
  }

  function removeFacet(group, values, value) {
    updateFilters({ q, cat, route, evidence, [group]: values.filter(v => v !== value) })
  }

  function clearAll() {
    setSearchParams({}, { replace: true })
  }

  const visible = applyFilters(sorted, { q, cat, route, evidence })

  const chips = [
    ...cat.map(value => ({ group: 'cat', value, label: CATEGORY_LABELS[value] ?? value })),
    ...route.map(value => ({ group: 'route', value, label: ROUTE_LABELS[value] ?? value })),
    ...evidence.map(value => ({ group: 'evidence', value, label: EVIDENCE_LABELS[value] ?? value })),
  ]
  const hasActiveFilters = Boolean(q) || chips.length > 0

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-8 pt-8 pb-16 max-lg:px-6 max-lg:pt-6 max-lg:pb-12 max-[600px]:px-4 max-[600px]:pt-5 max-[600px]:pb-10">
      <Helmet>
        <title>Peptide Catalog — PeptideDocs</title>
        <meta name="description" content="Browse all available research peptides. Information on mechanisms, dosage, effects, and timelines for each compound." />
      </Helmet>

      <h1 className="mt-2 mb-2.5 font-heading text-3xl leading-[1.05] font-normal tracking-[-1.68px] text-foreground max-lg:mt-1 max-lg:mb-2 max-lg:text-2xl max-lg:tracking-[-0.9px]">
        Browse Peptides
      </h1>

      <div className="mb-4">
        <PeptideSearch
          value={localQuery}
          onChange={handleQueryChange}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2 max-lg:mb-3" role="group" aria-label="Filter by category">
        <Button
          variant="ghost"
          onClick={() => updateFilters({ q, cat: [], route, evidence })}
          className={cn(PILL_BASE, cat.length === 0 ? PILL_ACTIVE : PILL_INACTIVE)}
        >
          All
        </Button>
        {CATEGORY_ORDER.map(value => (
          <Button
            key={value}
            variant="ghost"
            onClick={() => toggleFacet('cat', cat, value)}
            className={cn(PILL_BASE, cat.includes(value) ? PILL_ACTIVE : PILL_INACTIVE)}
          >
            {CATEGORY_LABELS[value]}
          </Button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 max-lg:mb-3" role="group" aria-label="Filter by route">
        {ROUTE_ORDER.map(value => (
          <Button
            key={value}
            variant="ghost"
            onClick={() => toggleFacet('route', route, value)}
            className={cn(PILL_BASE, route.includes(value) ? PILL_ACTIVE : PILL_INACTIVE)}
          >
            {ROUTE_LABELS[value]}
          </Button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2 max-lg:mb-6" role="group" aria-label="Filter by evidence">
        {EVIDENCE_ORDER.map(value => (
          <Button
            key={value}
            variant="ghost"
            onClick={() => toggleFacet('evidence', evidence, value)}
            className={cn(PILL_BASE, evidence.includes(value) ? PILL_ACTIVE : PILL_INACTIVE)}
          >
            {EVIDENCE_LABELS[value]}
          </Button>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="mb-8 flex flex-wrap items-center gap-2 max-lg:mb-6">
          {chips.map(chip => (
            <Badge
              key={`${chip.group}-${chip.value}`}
              variant="outline"
              className="h-auto gap-1 rounded-full border-primary-border bg-primary-bg px-2.5 py-[3px] font-mono text-[11px] font-semibold tracking-[0.08em] text-primary uppercase"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => removeFacet(chip.group, { cat, route, evidence }[chip.group], chip.value)}
                aria-label={`Remove ${chip.label} filter`}
                className="ml-0.5 inline-flex size-3 items-center justify-center rounded-full text-primary hover:text-foreground"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            onClick={clearAll}
            className="h-auto rounded-full px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.07em] text-muted-foreground uppercase hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No peptides match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1 max-[560px]:gap-3.5">
          {visible.map(peptide => (
            <Card
              key={peptide.slug}
              asChild
              className="border-border bg-card pt-5 px-[22px] pb-[22px] transition-[transform,border-color,box-shadow] duration-200 [animation:fadeUp_0.4s_ease_both] hover:-translate-y-0.5 hover:border-primary-border hover:shadow-[0_4px_20px_rgba(84,126,239,0.12)] motion-reduce:[animation:none] [&:nth-child(2)]:[animation-delay:60ms] [&:nth-child(3)]:[animation-delay:120ms] [&:nth-child(4)]:[animation-delay:180ms] [&:nth-child(5)]:[animation-delay:240ms] [&:nth-child(6)]:[animation-delay:300ms]"
            >
              <Link
                to={`/peptides/${peptide.slug}`}
                className="flex flex-col gap-2.5 text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <CardHeader className="p-0">
                  <Badge className="h-auto self-start rounded-full border-primary-border bg-primary-bg px-2.5 py-[3px] font-mono text-[11px] font-semibold tracking-[0.08em] text-primary uppercase">
                    {CATEGORY_LABELS[peptide.category] ?? peptide.category}
                  </Badge>
                  <CardTitle className="m-0 font-heading text-[22px] leading-[1.15] font-normal tracking-[-0.3px] text-foreground">
                    {peptide.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="m-0 line-clamp-2 text-[14px] leading-[1.6] text-muted-foreground">
                    {peptide.overview}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
