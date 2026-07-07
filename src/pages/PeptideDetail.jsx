import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { CATEGORY_LABELS } from '../data/categories.js'
import ReconstitutionPanel from '../components/ReconstitutionPanel.jsx'
import { Badge } from '../components/ui/badge.jsx'

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
      className="mt-px shrink-0"
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
      <a
        key={matchIdx++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80"
      >
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
    <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
      {citations.map((citation, idx) => (
        <li key={idx}>{linkifyCitation(citation)}</li>
      ))}
    </ul>
  )
}

export default function PeptideDetail() {
  const { slug } = useParams()
  const peptide = peptides.find(p => p.slug === slug)

  if (!peptide) {
    return (
      <div className="pt-12 pb-16 px-6 text-center text-muted-foreground">
        <h1>Peptide not found</h1>
        <p>No peptide matches <strong>{slug}</strong>.</p>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    )
  }

  const activeDose = peptide.doses[0]

  return (
    <article className="mx-auto max-w-[800px] px-6 pt-8 pb-16 text-left">
      <Helmet>
        <title>{peptide.name} — PeptideDocs</title>
        <meta name="description" content={`${peptide.overview.slice(0, 155)}...`} />
      </Helmet>

      {/* Hero */}
      <Badge className="mb-3.5 h-auto rounded-full border-primary-border bg-primary-bg px-2.5 py-[3px] font-mono text-[11px] font-semibold tracking-[0.08em] text-primary uppercase">
        {CATEGORY_LABELS[peptide.category] ?? peptide.category}
      </Badge>
      <div className="mb-3 flex flex-wrap items-baseline gap-[14px]">
        <h1 className="m-0 font-heading text-[48px] leading-[1.05] font-normal tracking-[-1.5px] text-foreground max-[600px]:text-[32px] max-[600px]:tracking-[-0.8px]">
          {peptide.name}
        </h1>
      </div>
      <p className="mb-10 max-w-[680px] text-[17px] leading-[1.65] text-muted-foreground">
        {peptide.overview}
      </p>

      {/* Info rows */}
      <div className="mb-9 flex flex-col overflow-hidden rounded-[10px] border border-border" role="list">
        {INFO_ROWS.map(({ key, label }) => {
          const value = peptide[key]
          if (value == null) return null
          return (
            <div
              key={key}
              className="grid grid-cols-[160px_1fr] border-b border-border last:border-b-0 max-[540px]:grid-cols-1"
              role="listitem"
            >
              <dt className="flex items-start bg-code-bg px-[18px] pt-4 pb-[14px] font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase max-[540px]:bg-transparent max-[540px]:px-4 max-[540px]:pt-[10px] max-[540px]:pb-1">
                {label}
              </dt>
              <dd className="m-0 px-[18px] py-[14px] text-[15px] leading-[1.6] text-foreground max-[540px]:px-4 max-[540px]:pt-0 max-[540px]:pb-[14px]">
                {key === 'research_notes' ? <ResearchNotes value={value} /> : value}
              </dd>
            </div>
          )
        })}
      </div>

      {/* Reconstitution panel */}
      <ReconstitutionPanel dose={activeDose} />

      {/* Disclaimer */}
      <div className="mb-9 flex items-start gap-[14px] rounded-lg border border-border border-l-4 border-l-warning bg-[rgba(245,158,11,0.06)] px-5 py-4">
        <WarningIcon />
        <p className="m-0 text-[14px] leading-[1.55] text-muted-foreground">
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
