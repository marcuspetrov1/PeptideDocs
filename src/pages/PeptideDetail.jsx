import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import DoseSelector from '../components/DoseSelector.jsx'
import ReconstitutionPanel from '../components/ReconstitutionPanel.jsx'
import './PeptideDetail.css'

const INFO_ROWS = [
  { key: 'mechanism',       label: 'Mechanism'       },
  { key: 'effects',         label: 'Effects'         },
  { key: 'results_timeline', label: 'Results'        },
  { key: 'half_life',       label: 'Half-Life'       },
  { key: 'timing',          label: 'Timing'          },
  { key: 'administration',  label: 'Administration'  },
  { key: 'research_notes',  label: 'Research Notes'  },
]

export default function PeptideDetail() {
  const { slug } = useParams()
  const peptide = peptides.find(p => p.slug === slug)
  const [selectedDoseIdx, setSelectedDoseIdx] = useState(0)

  if (!peptide) {
    return (
      <div className="peptide-detail--not-found">
        <h1>Peptide not found</h1>
        <p>No peptide matches <strong>{slug}</strong>.</p>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    )
  }

  const activeDose = peptide.doses[selectedDoseIdx]

  return (
    <article className="peptide-detail">
      <Helmet>
        <title>{peptide.name} — OptimalPep</title>
        <meta name="description" content={`${peptide.overview.slice(0, 155)}...`} />
      </Helmet>

      {/* Hero */}
      <span className="peptide-detail__category">{peptide.category}</span>
      <div className="peptide-detail__name-row">
        <h1 className="peptide-detail__name">{peptide.name}</h1>
        <DoseSelector
          doses={peptide.doses}
          selectedIdx={selectedDoseIdx}
          onChange={setSelectedDoseIdx}
        />
      </div>
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

      {/* Reconstitution panel — updates with dose selection */}
      <ReconstitutionPanel dose={activeDose} />

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
