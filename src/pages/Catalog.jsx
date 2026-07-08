import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getAllPeptides } from '../data/peptides.js'
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../data/categories.js'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Input } from '../components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { cn } from '../lib/utils.js'

const sorted = [...getAllPeptides()].sort((a, b) => a.name.localeCompare(b.name))

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [query, setQuery] = useState('')

  const needle = query.trim().toLowerCase()
  const visible = sorted.filter(p => {
    const matchesCategory = activeCategory === null || p.category === activeCategory
    const matchesQuery = needle === '' || p.name.toLowerCase().includes(needle)
    return matchesCategory && matchesQuery
  })

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
        <Input
          type="search"
          placeholder="Search peptides…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search peptides"
          className="h-auto rounded-[10px] border-border bg-code-bg px-4 py-2.5 font-sans text-[15px] text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary-border focus-visible:ring-[3px] focus-visible:ring-primary-bg"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2 max-lg:mb-6" role="group" aria-label="Filter by category">
        <Button
          variant="ghost"
          onClick={() => setActiveCategory(null)}
          className={cn(
            'h-auto rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.07em] uppercase',
            activeCategory === null
              ? 'border-primary-border bg-primary-bg text-primary hover:bg-primary-bg'
              : 'border-border text-muted-foreground hover:border-primary-border hover:bg-primary-bg hover:text-primary'
          )}
        >
          All
        </Button>
        {CATEGORY_ORDER.map(cat => (
          <Button
            key={cat}
            variant="ghost"
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={cn(
              'h-auto rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.07em] uppercase',
              activeCategory === cat
                ? 'border-primary-border bg-primary-bg text-primary hover:bg-primary-bg'
                : 'border-border text-muted-foreground hover:border-primary-border hover:bg-primary-bg hover:text-primary'
            )}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

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
