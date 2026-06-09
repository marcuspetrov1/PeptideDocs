import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { SHOP_URL } from '../config.js'
import './Home.css'

// Derive unique categories with counts
const categoryMap = peptides.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1
  return acc
}, {})

const categories = Object.entries(categoryMap).map(([slug, count]) => ({
  slug,
  label: slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '),
  count,
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
      'Read about mechanisms, dosage protocols, and expected timelines to identify the peptide that fits your goals.',
  },
  {
    number: '3',
    title: 'Place your order',
    description: (
      <>
        Head over to{' '}
        <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="home__step-link">
          optimalpep.com
        </a>{' '}
        to purchase with confidence.
      </>
    ),
  },
]

export default function Home() {
  return (
    <main className="home">
      <Helmet>
        <title>OptimalPep — Research Peptide Information</title>
        <meta name="description" content="Browse detailed information on research peptides including mechanisms, dosage protocols, effects, and timelines." />
      </Helmet>

      {/* ── Section 1: Hero ── */}
      <section className="home__hero">
        <div className="home__hero-inner">
          <p className="home__hero-eyebrow">Research peptide reference</p>
          <h1 className="home__hero-heading">
            Your peptide<br />
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
          Three simple steps from research to order
        </p>
        <div className="home__steps">
          {steps.map(step => (
            <div key={step.number} className="home__step glass">
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
