import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import './PeptideDetail.css'

const INFO_ROWS = [
  { key: 'mechanism',       label: 'Mechanism'      },
  { key: 'dosage',          label: 'Dosage'         },
  { key: 'effects',         label: 'Effects'        },
  { key: 'results_timeline', label: 'Results'       },
  { key: 'half_life',       label: 'Half-Life'      },
  { key: 'available_sizes', label: 'Sizes'          },
  { key: 'research_notes',  label: 'Research Notes' },
]

export default function PeptideDetail() {
  const { slug } = useParams()
  const peptide = peptides.find(p => p.slug === slug)

  if (!peptide) {
    return (
      <div className="peptide-detail--not-found">
        <h1>Peptide not found</h1>
        <p>No peptide matches <strong>{slug}</strong>.</p>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    )
  }

  return (
    <article className="peptide-detail">
      <Helmet>
        <title>{peptide.name} — OptimalPep</title>
        <meta name="description" content={`${peptide.overview.slice(0, 155)}...`} />
      </Helmet>

      {/* Hero */}
      <span className="peptide-detail__category">{peptide.category}</span>
      <h1 className="peptide-detail__name">{peptide.name}</h1>
      <p className="peptide-detail__overview">{peptide.overview}</p>

      {/* Info rows */}
      <div className="peptide-detail__info" role="list">
        {INFO_ROWS.map(({ key, label }) => {
          const value = peptide[key]
          if (value == null) return null
          return (
            <div key={key} className="peptide-detail__row" role="listitem">
              <dt className="peptide-detail__label">{label}</dt>
              <dd className="peptide-detail__value">{value}</dd>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="peptide-detail__disclaimer">
        <span className="peptide-detail__disclaimer-icon" aria-hidden="true">⚠</span>
        <p className="peptide-detail__disclaimer-text">
          [Disclaimer — to be added]
        </p>
      </div>

      {/* CTA */}
      <div className="peptide-detail__cta">
        <Link to="/get-started" className="peptide-detail__cta-link">
          How to get started
        </Link>
      </div>
    </article>
  )
}
