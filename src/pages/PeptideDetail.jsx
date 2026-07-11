import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPeptideBySlug } from '../data/peptides.js'
import { CATEGORY_LABELS } from '../data/categories.js'
import ReconstitutionPanel from '../components/ReconstitutionPanel.jsx'
import ReconstitutionCalculator from '../components/ReconstitutionCalculator.jsx'
import PeptideFAQ from '../components/PeptideFAQ.jsx'
import GlossaryTerm from '../components/GlossaryTerm.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'

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
        className="rounded-sm text-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
  const peptide = getPeptideBySlug(slug)

  if (!peptide) {
    return (
      <div className="pt-12 pb-16 px-6 text-center text-muted-foreground">
        <h1>Peptide not found</h1>
        <p>No peptide matches <strong>{slug}</strong>.</p>
        <Link
          to="/catalog"
          className="rounded-sm text-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to catalog
        </Link>
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
      <Badge className="mb-3.5 h-auto rounded-full border-primary-border bg-primary-bg px-2.5 py-[3px] font-category text-[11px] font-semibold tracking-[0.08em] text-primary uppercase">
        {CATEGORY_LABELS[peptide.category] ?? peptide.category}
      </Badge>
      <div className="mb-3 flex flex-wrap items-baseline gap-[14px]">
        <h1 className="m-0 font-heading text-[48px] leading-[1.05] font-normal tracking-[-1.5px] text-foreground max-[600px]:text-[32px] max-[600px]:tracking-[-0.8px]">
          {peptide.name}
        </h1>
      </div>
      <p className="mb-8 max-w-[680px] text-[17px] leading-[1.65] text-muted-foreground">
        {peptide.overview}
      </p>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mb-9">
        <TabsList className="mb-6 w-full justify-start gap-1 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mechanism">Mechanism &amp; Effects</TabsTrigger>
          <TabsTrigger value="protocol">
            <GlossaryTerm term="Reconstitution">Protocol</GlossaryTerm>
          </TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
            {peptide.category && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                    Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px] text-foreground">
                  {CATEGORY_LABELS[peptide.category] ?? peptide.category}
                </CardContent>
              </Card>
            )}
            {peptide.administration && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                    Administration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px] text-foreground">
                  {peptide.administration}
                </CardContent>
              </Card>
            )}
            {activeDose?.vial_mg && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                    Vial Size
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px] text-foreground">
                  {activeDose.vial_mg} mg
                </CardContent>
              </Card>
            )}
            {activeDose?.concentration_mg_per_ml && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                    Concentration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px] text-foreground">
                  {activeDose.concentration_mg_per_ml} mg/mL
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Mechanism & Effects tab */}
        <TabsContent value="mechanism">
          <div className="flex flex-col gap-6">
            {peptide.mechanism && (
              <section>
                <h2 className="mb-2 font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                  Mechanism
                </h2>
                <p className="text-[15px] leading-[1.65] text-foreground">{peptide.mechanism}</p>
              </section>
            )}
            {peptide.effects && (
              <section>
                <h2 className="mb-2 font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                  Effects
                </h2>
                <p className="text-[15px] leading-[1.65] text-foreground">{peptide.effects}</p>
              </section>
            )}
          </div>
        </TabsContent>

        {/* Protocol tab */}
        <TabsContent value="protocol">
          <div className="flex flex-col gap-6">
            {peptide.results_timeline && (
              <section>
                <h2 className="mb-2 font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                  Results Timeline
                </h2>
                <p className="text-[15px] leading-[1.65] text-foreground">{peptide.results_timeline}</p>
              </section>
            )}
            {peptide.timing && (
              <section>
                <h2 className="mb-2 font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
                  Timing
                </h2>
                <p className="text-[15px] leading-[1.65] text-foreground">{peptide.timing}</p>
              </section>
            )}
            <ReconstitutionCalculator
              defaultMg={activeDose?.vial_mg ?? 5}
              defaultMl={activeDose?.bac_water_ml ?? 2}
            />
            <ReconstitutionPanel dose={activeDose} />
          </div>
        </TabsContent>

        {/* Research tab */}
        <TabsContent value="research">
          {peptide.research_notes ? (
            <ResearchNotes value={peptide.research_notes} />
          ) : (
            <p className="text-[15px] text-muted-foreground">No research notes available.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* FAQ */}
      <PeptideFAQ peptide={peptide} />

      {/* Disclaimer — always visible below tabs */}
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
