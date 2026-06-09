import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import './Catalog.css'

const sorted = [...peptides].sort((a, b) => a.name.localeCompare(b.name))

export default function Catalog() {
  return (
    <section className="catalog">
      <Helmet>
        <title>Peptide Catalog — OptimalPep</title>
        <meta name="description" content="Browse all available research peptides. Information on mechanisms, dosage, effects, and timelines for each compound." />
      </Helmet>

      <h1 className="catalog__heading">Browse Peptides</h1>
      <p className="catalog__subtitle">Information on each peptide we carry</p>

      <div className="catalog__grid">
        {sorted.map(peptide => (
          <Link
            key={peptide.slug}
            to={`/peptides/${peptide.slug}`}
            className="catalog__card glass"
          >
            <span className="catalog__category">{peptide.category}</span>
            <h2 className="catalog__name">{peptide.name}</h2>
            <p className="catalog__overview">{peptide.overview}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
