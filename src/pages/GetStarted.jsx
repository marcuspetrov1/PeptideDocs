import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SHOP_URL } from '../config.js'
import './GetStarted.css'

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
  {
    number: '03',
    title: 'Place your order',
    descriptionNode: (
      <>
        Head to{' '}
        <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="get-started__link">
          optimalpep.com
        </a>{' '}
        to complete your order. All products ship from our trusted supplier.
      </>
    ),
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

export default function GetStarted() {
  return (
    <main className="get-started">
      <Helmet>
        <title>How to Get Started — OptimalPep</title>
        <meta name="description" content="Learn how to browse the peptide catalog, reconstitute your peptides, and place your order at OptimalPep." />
      </Helmet>

      {/* ── Header ── */}
      <section className="get-started__header">
        <p className="get-started__eyebrow">Preparation &amp; Reconstitution Guide</p>
        <h1 className="get-started__heading">How to Get Started</h1>
        <p className="get-started__subtitle">
          Everything you need to know — from ordering to preparation.
        </p>
      </section>

      {/* ── Order process ── */}
      <section className="get-started__steps-section">
        <h2 className="get-started__section-heading">The process</h2>
        <ol className="get-started__steps" aria-label="Getting started steps">
          {orderSteps.map(step => (
            <li key={step.number} className="get-started__step">
              <div className="get-started__step-marker" aria-hidden="true">
                <span className="get-started__step-number">{step.number}</span>
                <div className="get-started__step-line" />
              </div>
              <div className="get-started__step-content">
                <strong className="get-started__step-title">{step.title}</strong>
                <p className="get-started__step-desc">
                  {step.description ?? step.descriptionNode}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="get-started__catalog-cta">
          <Link to="/catalog" className="get-started__btn">Browse the Catalog</Link>
        </div>
      </section>

      {/* ── Essential Supplies ── */}
      <section className="get-started__supplies-section">
        <h2 className="get-started__section-heading">Essential supplies needed</h2>
        <p className="get-started__section-intro">
          Before beginning, you will need to purchase the following three items to safely prepare and handle your peptides.
        </p>
        <div className="get-started__supply-list">
          {supplies.map(item => (
            <div key={item.num} className="get-started__supply">
              <span className="get-started__supply-num">{item.num}</span>
              <div className="get-started__supply-content">
                <strong className="get-started__supply-title">{item.title}</strong>
                <p className="get-started__supply-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reconstitution ── */}
      <section className="get-started__recon-section">
        <h2 className="get-started__section-heading">Step-by-step reconstitution</h2>
        <p className="get-started__section-intro">
          Peptides arrive as a freeze-dried powder to preserve stability during transit. Reconstitution is the process of gently mixing this powder with Bacteriostatic Water to create a usable liquid solution.
        </p>
        <div className="get-started__recon-note">
          The exact amount of BAC water needed varies by peptide. Always refer to the reconstitution panel on each peptide's detail page.
        </div>
        <ol className="get-started__steps" aria-label="Reconstitution steps">
          {reconSteps.map(step => (
            <li key={step.number} className="get-started__step">
              <div className="get-started__step-marker" aria-hidden="true">
                <span className="get-started__step-number">{step.number}</span>
                <div className="get-started__step-line" />
              </div>
              <div className="get-started__step-content">
                <strong className="get-started__step-title">{step.title}</strong>
                <p className="get-started__step-desc">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Contact & Ordering ── */}
      <section className="get-started__contact-section">
        <h2 className="get-started__section-heading">Ready to order?</h2>
        <p className="get-started__section-intro">
          Browse the full catalog and complete your order at{' '}
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="get-started__link">
            optimalpep.com
          </a>
          . All products are sourced from our trusted supplier and ship with standard
          research-grade handling.
        </p>
        <Link to="/catalog" className="get-started__btn">Browse the Catalog</Link>
      </section>
    </main>
  )
}
