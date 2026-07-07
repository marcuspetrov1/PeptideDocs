import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../data/categories.js'
import heroImg from '../assets/frontpage-main-peptide.webp'

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

const steps = [
  {
    number: '1',
    title: 'Browse the catalog',
    description:
      'Explore our full range of research peptides, each with detailed mechanism and protocol information.',
  },
  {
    number: '2',
    title: 'Find what is right for you',
    description:
      'Read about mechanisms, dosage protocols, and expected timelines to identify the peptide that fits your research.',
  },
]

const SECTION_HEADING_CLASS =
  'mb-2 font-heading text-[30px] font-normal tracking-[-0.5px] text-foreground max-lg:text-lg'
const SECTION_SUB_CLASS = 'mb-8 text-[16px] text-muted-foreground'

export default function Home() {
  return (
    <div className="w-full text-left">
      <Helmet>
        <title>PeptideDocs — Research Peptide Information</title>
        <meta name="description" content="Browse detailed information on research peptides including mechanisms, dosage protocols, effects, and timelines." />
      </Helmet>

      {/* ── Section 1: Hero ── */}
      <section className="home-hero-grain relative grid min-h-[70vh] grid-cols-2 items-stretch overflow-hidden border-b border-border bg-[linear-gradient(160deg,var(--bg)_0%,var(--code-bg)_55%,var(--bg)_100%)] max-lg:grid-cols-1 max-lg:min-h-[60vh] max-[600px]:min-h-[55vh]">
        <div className="relative z-[1] max-w-none px-8 pt-[calc(84px+3rem)] pb-16 max-lg:px-6 max-lg:pt-[calc(84px+2rem)] max-lg:pb-12 max-[600px]:px-4 max-[600px]:pt-[calc(84px+1.5rem)] max-[600px]:pb-10">
          <p className="mb-4 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary uppercase [animation:fadeUp_0.5s_ease_both] motion-reduce:[animation:none]">
            Research peptide reference
          </p>
          <h1 className="mb-6 text-[64px] leading-[1.02] font-normal tracking-[-2px] text-foreground [animation:fadeUp_0.55s_ease_120ms_both] motion-reduce:[animation:none] max-lg:text-[44px] max-lg:tracking-[-1.2px] max-[600px]:text-[34px] max-[600px]:tracking-[-0.8px]">
            Your <em className="italic">peptide</em><br />
            reference guide
          </h1>
          <p className="mb-9 max-w-[560px] text-[17px] leading-[1.6] text-muted-foreground [animation:fadeUp_0.55s_ease_240ms_both] motion-reduce:[animation:none] max-[600px]:text-sm">
            Browse research peptide profiles covering mechanisms of action, dosing
            protocols, and expected timelines. For informational purposes only — not
            medical advice.
          </p>
          <div className="flex flex-wrap gap-3 [animation:fadeUp_0.5s_ease_360ms_both] motion-reduce:[animation:none]">
            <Link
              to="/catalog"
              className="inline-flex items-center rounded-full bg-primary px-6 py-[11px] text-[15px] font-medium tracking-[0.05px] text-white no-underline transition-[opacity,box-shadow,background] duration-200 hover:opacity-[0.88] hover:shadow-[0_2px_14px_rgba(84,126,239,0.35)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
            >
              Browse Catalog
            </Link>
            <Link
              to="/get-started"
              className="inline-flex items-center rounded-full border border-border bg-transparent px-6 py-[11px] text-[15px] font-medium tracking-[0.05px] text-foreground no-underline transition-[opacity,box-shadow,background] duration-200 hover:border-primary-border hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
            >
              How to Get Started
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(to_right,var(--bg)_0%,transparent_35%)] after:content-[''] max-lg:hidden">
          <img src={heroImg} alt="" className="block h-full w-full object-cover object-center opacity-[0.88]" />
        </div>
      </section>

      {/* ── Section 2: Categories ── */}
      <section className="border-b border-border px-8 py-20 max-lg:px-6 max-lg:py-16 max-[600px]:px-4 max-[600px]:py-12">
        <h2 className={SECTION_HEADING_CLASS}>What we carry</h2>
        <p className={SECTION_SUB_CLASS}>
          Peptides spanning multiple research categories
        </p>
        <div className="flex flex-wrap gap-2.5">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to="/catalog"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary-border bg-primary-bg px-3.5 py-[7px] font-mono text-xs font-semibold tracking-[0.06em] text-primary uppercase no-underline transition-[opacity,box-shadow] duration-200 hover:opacity-[0.82] hover:shadow-[0_0_0_1px_var(--color-primary-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {cat.label}
              <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold tracking-[0] text-white">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Section 3: How it works ── */}
      <section className="px-8 pt-20 pb-24 max-lg:px-6 max-lg:pt-16 max-lg:pb-20 max-[600px]:px-4 max-[600px]:pt-12 max-[600px]:pb-16">
        <h2 className={SECTION_HEADING_CLASS}>How to get started</h2>
        <p className={SECTION_SUB_CLASS}>
          Two simple steps to find what you're looking for
        </p>
        <div className="grid grid-cols-3 gap-5 max-[800px]:max-w-[480px] max-[800px]:grid-cols-1">
          {steps.map(step => (
            <div key={step.number} className="flex flex-col gap-2.5 rounded-xl border border-border bg-card px-6 py-7">
              <span className="self-start rounded-md border border-primary-border bg-primary-bg px-[9px] py-[3px] font-mono text-[13px] font-bold tracking-[0.06em] text-primary">
                {step.number}
              </span>
              <strong className="text-base leading-[1.2] font-semibold tracking-[-0.2px] text-foreground">
                {step.title}
              </strong>
              <p className="m-0 text-[14px] leading-[1.65] text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
