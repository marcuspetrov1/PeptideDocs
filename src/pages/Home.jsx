import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getAllPeptides, getPeptideBySlug } from '../data/peptides.js'
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../data/categories.js'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Card } from '../components/ui/card.jsx'
import HomeSearch from '../components/HomeSearch.jsx'

const peptides = getAllPeptides()

// Derive unique categories present in the data, with counts, ordered to
// match Catalog and labeled from the shared category map so chip text never
// diverges from Catalog's curated labels.
const categoryMap = peptides.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1
  return acc
}, {})

const presentSlugs = Object.keys(categoryMap)
const orderedSlugs = [
  ...CATEGORY_ORDER.filter(slug => presentSlugs.includes(slug)),
  ...presentSlugs.filter(slug => !CATEGORY_ORDER.includes(slug)),
]

const categories = orderedSlugs.map(slug => ({
  slug,
  label: CATEGORY_LABELS[slug] ?? slug,
  count: categoryMap[slug],
}))

// Hand-picked, well-known peptides shown below the search hero. Slugs are
// verified against src/data/peptides.json.
const FEATURED_SLUGS = [
  'bpc-157',
  'tb-500',
  'ghk-cu',
  'ipamorelin',
  'semaglutide',
  'tirzepatide',
  'retatrutide',
  'glow',
]

const featured = FEATURED_SLUGS.map(getPeptideBySlug).filter(Boolean)

const SECTION_HEADING_CLASS =
  'mb-2 font-heading text-[30px] font-normal tracking-[-0.5px] text-foreground text-balance max-lg:text-lg'
const SECTION_SUB_CLASS = 'mb-8 text-[16px] text-muted-foreground'

export default function Home() {
  return (
    <div className="w-full text-left">
      <Helmet>
        <title>PeptideDocs — Research Peptide Information</title>
        <meta name="description" content="Browse detailed information on research peptides including mechanisms, dosage protocols, effects, and timelines." />
      </Helmet>

      {/* ── Hero: search-first ── */}
      <section className="home-hero-grain search-glow relative flex min-h-[calc(100svh-84px)] flex-col items-center justify-center overflow-hidden border-b border-border bg-[linear-gradient(160deg,var(--bg)_0%,var(--code-bg)_55%,var(--bg)_100%)] px-8 py-16 text-center max-lg:px-6 max-lg:py-12 max-[600px]:px-4 max-[600px]:py-10">
        <div className="relative z-[1] flex w-full max-w-[720px] flex-col items-center">
          <p className="mb-4 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary uppercase [animation:fadeUp_0.5s_ease_both] motion-reduce:[animation:none]">
            Research peptide reference
          </p>
          <h1 className="mb-4 text-balance text-[56px] leading-[1.05] font-normal tracking-[-1.5px] text-foreground [animation:fadeUp_0.55s_ease_120ms_both] motion-reduce:[animation:none] max-lg:text-[40px] max-lg:tracking-[-1px] max-[600px]:text-[32px] max-[600px]:tracking-[-0.6px]">
            Your <em className="italic">peptide</em> reference guide
          </h1>
          <p className="mb-9 max-w-[540px] text-[17px] leading-[1.6] text-muted-foreground [animation:fadeUp_0.55s_ease_240ms_both] motion-reduce:[animation:none] max-[600px]:text-sm">
            Search 65 research peptide profiles — mechanisms, dosing protocols, and
            expected timelines. For informational purposes only — not medical advice.
          </p>
          <div className="w-full max-w-[640px] [animation:fadeUp_0.5s_ease_360ms_both] motion-reduce:[animation:none]">
            <HomeSearch />
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 [animation:fadeUp_0.5s_ease_480ms_both] motion-reduce:[animation:none]">
            {categories.map(cat => (
              <Badge
                key={cat.slug}
                asChild
                className="h-auto gap-1.5 rounded-full border-primary-border bg-primary-bg px-3.5 py-[7px] font-category text-xs font-semibold tracking-[0.06em] text-primary uppercase no-underline transition-[opacity,box-shadow] duration-200 hover:!bg-primary-bg hover:opacity-[0.82] hover:shadow-[0_0_0_1px_var(--color-primary-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Link to="/catalog">
                  {cat.label}
                  <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold tracking-[0] tabular-nums text-white">
                    {cat.count}
                  </span>
                </Link>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular peptides ── */}
      <section className="border-b border-border px-8 py-20 max-lg:px-6 max-lg:py-16 max-[600px]:px-4 max-[600px]:py-12">
        <h2 className={SECTION_HEADING_CLASS}>Popular Peptides</h2>
        <p className={SECTION_SUB_CLASS}>A few well-known peptides to start with</p>
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {featured.map(p => (
            <Card key={p.slug} className="transition-shadow duration-200 hover:shadow-md">
              <Link
                to={`/peptides/${p.slug}`}
                className="flex min-w-0 flex-col gap-2 px-(--card-spacing) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-base font-semibold tracking-[-0.2px] text-foreground">
                    {p.name}
                  </span>
                  <Badge variant="outline" className="shrink-0 font-category text-[10px] tracking-[0.04em] uppercase">
                    {CATEGORY_LABELS[p.category] ?? p.category}
                  </Badge>
                </div>
                <p className="m-0 line-clamp-2 min-w-0 text-[14px] leading-[1.6] break-words text-muted-foreground">
                  {p.overview}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Get started strip ── */}
      <section className="px-8 py-14 max-lg:px-6 max-lg:py-12 max-[600px]:px-4 max-[600px]:py-10">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-border bg-card px-7 py-6 max-[600px]:flex-col max-[600px]:items-start">
          <div>
            <h2 className="mb-1 font-heading text-[22px] font-normal tracking-[-0.3px] text-foreground text-balance">
              New to peptides?
            </h2>
            <p className="m-0 text-[15px] text-muted-foreground">
              Start here to learn the basics before you browse.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="h-auto rounded-full bg-primary px-6 py-[11px] text-[15px] font-medium tracking-[0.05px] text-white no-underline transition-[opacity,box-shadow,background] duration-200 hover:bg-primary hover:opacity-[0.88] hover:shadow-[0_2px_14px_rgba(84,126,239,0.35)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
            >
              <Link to="/get-started">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-full border-border bg-transparent px-6 py-[11px] text-[15px] font-medium tracking-[0.05px] text-foreground no-underline transition-[opacity,box-shadow,background] duration-200 hover:border-primary-border hover:bg-transparent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
            >
              <Link to="/catalog">Browse Full Catalog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
