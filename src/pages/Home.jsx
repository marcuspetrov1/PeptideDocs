import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../data/categories.js'
import './Home.css'
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

export default function Home() {
  return (
    <main className="home">
      <Helmet>
        <title>PeptideDocs — Research Peptide Information</title>
        <meta name="description" content="Browse detailed information on research peptides including mechanisms, dosage protocols, effects, and timelines." />
      </Helmet>

      {/* ── Section 1: Hero ── */}
      <section className="home__hero">
        <div className="home__hero-inner">
          <p className="home__hero-eyebrow">Research peptide reference</p>
          <h1 className="home__hero-heading">
            Your <em>peptide</em><br />
            reference guide
          </h1>
          <p className="home__hero-sub">
            Browse research peptide profiles covering mechanisms of action, dosing
            protocols, and expected timelines. For informational purposes only — not
            medical advice.
          </p>
          <div className="home__hero-ctas">
            <Link to="/catalog" className="home__cta home__cta--primary">
              Browse Catalog
            </Link>
            <Link to="/get-started" className="home__cta home__cta--secondary">
              How to Get Started
            </Link>
          </div>
        </div>
        <div className="home__hero-image" aria-hidden="true">
          <img src={heroImg} alt="" />
        </div>
      </section>

      {/* ── Section 2: Categories ── */}
      <section className="home__categories">
        <h2 className="home__section-heading">What we carry</h2>
        <p className="home__section-sub">
          Peptides spanning multiple research categories
        </p>
        <div className="home__category-chips">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to="/catalog"
              className="home__category-chip"
            >
              {cat.label}
              <span className="home__category-count">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Section 3: How it works ── */}
      <section className="home__how">
        <h2 className="home__section-heading">How to get started</h2>
        <p className="home__section-sub">
          Two simple steps to find what you're looking for
        </p>
        <div className="home__steps">
          {steps.map(step => (
            <div key={step.number} className="home__step">
              <span className="home__step-number">{step.number}</span>
              <strong className="home__step-title">{step.title}</strong>
              <p className="home__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
