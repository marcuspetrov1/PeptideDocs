import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { CATEGORY_LABELS } from '../data/categories.js'
import DoseSelector from '../components/DoseSelector.jsx'
import ReconstitutionPanel from '../components/ReconstitutionPanel.jsx'
import './PeptideDetail.css'

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: '1px' }}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

const INFO_ROWS = [
  { key: 'mechanism',       label: 'Mechanism'       },
  { key: 'effects',         label: 'Effects'         },
  { key: 'results_timeline', label: 'Results'        },
  { key: 'timing',          label: 'Timing'          },
  { key: 'administration',  label: 'Administration'  },
  { key: 'research_notes',  label: 'Research Notes'  },
]

const URL_PATTERN = /https?:\/\/\S+/g

function linkifyCitation(citation) {
  const parts = []
  let lastIndex = 0
  let match
  URL_PATTERN.lastIndex = 0
  let matchIdx = 0

  while ((match = URL_PATTERN.exec(citation)) !== null) {
    const url = match[0]
    if (match.index > lastIndex) {
      parts.push(citation.slice(lastIndex, match.index))
    }
    parts.push(
      <a key={matchIdx++} href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    )
    lastIndex = match.index + url.length
  }

  if (lastIndex < citation.length) {
    parts.push(citation.slice(lastIndex))
  }

  return parts
}

function ResearchNotes({ value }) {
  const citations = value.split(' | ')
  return (
    <ul className="peptide-detail__research-notes">
      {citations.map((citation, idx) => (
        <li key={idx}>{linkifyCitation(citation)}</li>
      ))}
    </ul>
  )
}

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
        <title>{peptide.name} — PeptideDocs</title>
        <meta name="description" content={`${peptide.overview.slice(0, 155)}...`} />
      </Helmet>

      {/* Hero */}
      <span className="peptide-detail__category">{CATEGORY_LABELS[peptide.category] ?? peptide.category}</span>
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
              <dd className="peptide-detail__value">
                {key === 'research_notes' ? <ResearchNotes value={value} /> : value}
              </dd>
            </div>
          )
        })}
      </div>

      {/* Reconstitution panel — updates with dose selection */}
      <ReconstitutionPanel dose={activeDose} />

      {/* Disclaimer */}
      <div className="peptide-detail__disclaimer">
        <WarningIcon />
        <p className="peptide-detail__disclaimer-text">
          This information is for educational and research purposes only. It does not
          constitute medical advice, diagnosis, or treatment. Research peptides are not
          approved for human use by any regulatory authority. Always consult a qualified
          healthcare professional before using any compound. Not for use by persons under
          18 years of age.
        </p>
      </div>
    </article>
  )
}
