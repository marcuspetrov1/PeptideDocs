import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../data/categories.js'
import './Catalog.css'

const sorted = [...peptides].sort((a, b) => a.name.localeCompare(b.name))

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
    <section className="catalog">
      <Helmet>
        <title>Peptide Catalog — PeptideDocs</title>
        <meta name="description" content="Browse all available research peptides. Information on mechanisms, dosage, effects, and timelines for each compound." />
      </Helmet>

      <h1 className="catalog__heading">Browse Peptides</h1>

      <div className="catalog__search-row">
        <input
          className="catalog__search"
          type="search"
          placeholder="Search peptides…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search peptides"
        />
      </div>

      <div className="catalog__filters" role="group" aria-label="Filter by category">
        <button
          className={`catalog__filter-btn${activeCategory === null ? ' catalog__filter-btn--active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {CATEGORY_ORDER.map(cat => (
          <button
            key={cat}
            className={`catalog__filter-btn${activeCategory === cat ? ' catalog__filter-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="catalog__empty">No peptides match your search.</p>
      ) : (
        <div className="catalog__grid">
          {visible.map(peptide => (
            <Link
              key={peptide.slug}
              to={`/peptides/${peptide.slug}`}
              className="catalog__card"
            >
              <span className="catalog__category">{CATEGORY_LABELS[peptide.category] ?? peptide.category}</span>
              <h2 className="catalog__name">{peptide.name}</h2>
              <p className="catalog__overview">{peptide.overview}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
