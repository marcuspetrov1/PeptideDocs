import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button } from '../components/ui/button.jsx'

const orderSteps = [
  {
    number: '01',
    title: 'Browse the catalog',
    description: 'Start at the catalog to explore everything we carry. Each entry covers mechanism, dosage, expected effects, and timeline.',
  },
  {
    number: '02',
    title: 'Find what\'s right for you',
    description: 'Read the detail page for any peptide you\'re interested in. Pay attention to dosage protocols and results timelines before deciding.',
  },
]

const supplies = [
  {
    num: '1',
    title: 'Bacteriostatic (BAC) Water',
    description: 'Required to reconstitute the lyophilized (freeze-dried) peptide powder into a liquid solution, ensuring it remains sterile and stable.',
  },
  {
    num: '2',
    title: 'Insulin Syringes',
    description: 'Necessary for precise measurement, transfer of the BAC water, and accurate research administration.',
  },
  {
    num: '3',
    title: 'Sterile Alcohol Pads',
    description: 'Essential for maintaining a clean environment and sanitizing the vial stoppers before any transfers.',
  },
]

const reconSteps = [
  {
    number: '01',
    title: 'Prepare a Clean Workspace',
    description: 'Wash your hands thoroughly and lay out your supplies on a clean, sanitized surface.',
  },
  {
    number: '02',
    title: 'Sanitize the Vials',
    description: 'Take a fresh sterile alcohol pad and wipe the rubber stoppers of both the peptide vial and the BAC water vial. Allow them a moment to air dry.',
  },
  {
    number: '03',
    title: 'Draw the BAC Water',
    description: 'Using a new insulin syringe, draw out the exact amount of BAC water required for your specific peptide.',
  },
  {
    number: '04',
    title: 'Insert the Water Gently',
    description: 'Carefully push the needle through the rubber stopper of the peptide vial. Angle the needle so the water flows down the inside glass wall of the vial, rather than spraying directly onto the delicate powder.',
  },
  {
    number: '05',
    title: 'Dissolve by Rolling',
    description: 'Once the water is inserted, do not shake the vial — shaking can damage the fragile peptide structures. Instead, slowly and gently roll the vial between your fingers until the powder is fully dissolved and the liquid is completely clear.',
  },
  {
    number: '06',
    title: 'Refrigerate Immediately',
    description: 'Store the reconstituted peptide in the refrigerator right away. Keeping the liquid cool is critical for maintaining potency and extending shelf life.',
  },
]

const SECTION_CLASS = 'mt-16 border-t border-border pt-12 max-[600px]:mt-12 max-[600px]:pt-9'
const SECTION_HEADING_CLASS = 'mb-7 text-[22px] font-medium tracking-[-0.3px] text-foreground max-[600px]:mb-5 max-[600px]:text-[19px]'
const SECTION_INTRO_CLASS = 'mt-[-12px] mb-6 max-w-[640px] text-sm leading-[1.7] text-muted-foreground'

function StepList({ steps, ariaLabel }) {
  return (
    <ol className="mb-9 flex list-none flex-col gap-0 p-0" aria-label={ariaLabel}>
      {steps.map(step => (
        <li key={step.number} className="group flex items-start gap-6">
          <div className="flex w-11 shrink-0 flex-col items-center" aria-hidden="true">
            <span className="w-11 shrink-0 rounded-md border border-primary-border bg-primary-bg px-2.5 py-1 text-center font-mono text-[13px] font-bold tracking-[0.06em] text-primary">
              {step.number}
            </span>
            <div className="mt-1.5 min-h-8 w-0.5 flex-1 bg-primary-border group-last:hidden" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5 pb-9 group-last:pb-0">
            <strong className="pt-0.5 text-[19px] leading-[1.25] font-semibold tracking-[-0.2px] text-foreground">
              {step.title}
            </strong>
            <p className="m-0 text-sm leading-[1.7] text-muted-foreground">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function GetStarted() {
  return (
    <div className="mx-auto max-w-[800px] px-6 pt-8 pb-20 text-left max-lg:pt-6 max-lg:pb-16 max-[600px]:px-4 max-[600px]:pt-4 max-[600px]:pb-12">
      <Helmet>
        <title>How to Get Started — PeptideDocs</title>
        <meta name="description" content="Learn how to browse the peptide catalog and reconstitute your peptides." />
      </Helmet>

      {/* ── Header ── */}
      <section>
        <p className="mb-3.5 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
          Preparation &amp; Reconstitution Guide
        </p>
        <h1 className="mb-4 font-heading text-3xl leading-[1.05] font-normal tracking-[-1.68px] text-foreground max-lg:mb-3 max-lg:text-[38px] max-lg:tracking-[-1px] max-[600px]:text-[30px] max-[600px]:tracking-[-0.6px]">
          How to Get Started
        </h1>
        <p className="m-0 max-w-[560px] text-[17px] leading-[1.6] text-muted-foreground">
          Everything you need to know — from browsing to preparation.
        </p>
      </section>

      {/* ── Order process ── */}
      <section className={SECTION_CLASS}>
        <h2 className={SECTION_HEADING_CLASS}>The process</h2>
        <StepList steps={orderSteps} ariaLabel="Getting started steps" />
        <div className="mt-1">
          <Button
            asChild
            className="h-auto rounded-full bg-primary px-[26px] py-[11px] text-[15px] font-medium tracking-[0.05px] text-white no-underline transition-[opacity,box-shadow] duration-200 hover:bg-primary hover:opacity-[0.88] hover:shadow-[0_2px_14px_rgba(84,126,239,0.35)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
          >
            <Link to="/catalog">Browse the Catalog</Link>
          </Button>
        </div>
      </section>

      {/* ── Essential Supplies ── */}
      <section className={SECTION_CLASS}>
        <h2 className={SECTION_HEADING_CLASS}>Essential supplies needed</h2>
        <p className={SECTION_INTRO_CLASS}>
          Before beginning, you will need to purchase the following three items to safely prepare and handle your peptides.
        </p>
        <div className="flex flex-col overflow-hidden rounded-[10px] border border-border">
          {supplies.map(item => (
            <div key={item.num} className="flex items-start gap-5 border-b border-border px-[22px] py-[18px] last:border-b-0">
              <span className="mt-0.5 shrink-0 rounded-md border border-primary-border bg-primary-bg px-[9px] py-[3px] text-center font-mono text-[13px] font-bold text-primary">
                {item.num}
              </span>
              <div className="flex flex-col gap-1">
                <strong className="text-[16px] font-semibold tracking-[-0.1px] text-foreground">
                  {item.title}
                </strong>
                <p className="m-0 text-[14px] leading-[1.65] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reconstitution ── */}
      <section className={SECTION_CLASS}>
        <h2 className={SECTION_HEADING_CLASS}>Step-by-step reconstitution</h2>
        <p className={SECTION_INTRO_CLASS}>
          Peptides arrive as a freeze-dried powder to preserve stability during transit. Reconstitution is the process of gently mixing this powder with Bacteriostatic Water to create a usable liquid solution.
        </p>
        <div className="mb-7 max-w-[600px] rounded-md border border-primary-border border-l-[3px] border-l-primary bg-primary-bg px-4 py-2.5 text-[13px] leading-[1.6] text-muted-foreground">
          The exact amount of BAC water needed varies by peptide. Always refer to the reconstitution panel on each peptide's detail page.
        </div>
        <StepList steps={reconSteps} ariaLabel="Reconstitution steps" />
      </section>
    </div>
  )
}
