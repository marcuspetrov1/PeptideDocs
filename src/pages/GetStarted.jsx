import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SHOP_URL } from '../config.js'
import './GetStarted.css'

const steps = [
  {
    number: '01',
    title: 'Browse the catalog',
    description:
      'Start at the catalog to explore everything we carry. Each entry covers mechanism, dosage, expected effects, and timeline.',
    link: null,
  },
  {
    number: '02',
    title: 'Find what\'s right for you',
    description:
      'Read the detail page for any peptide you\'re interested in. Pay attention to dosage protocols and results timelines before deciding.',
    link: null,
  },
  {
    number: '03',
    title: 'Place your order',
    description: null,
    descriptionNode: (
      <>
        Head to{' '}
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="get-started__link"
        >
          optimalpep.com
        </a>{' '}
        to complete your order. All products ship from our trusted supplier.
      </>
    ),
  },
]

const faqs = [
  {
    question: 'What are research peptides?',
    answer:
      'Synthetic amino acid sequences studied for their physiological effects. They are sold for research purposes only and are not approved for human use.',
  },
  {
    question: 'Do I need a prescription?',
    answer:
      'No prescription is required. These are research compounds, not pharmaceutical drugs. You are responsible for knowing the regulations in your jurisdiction.',
  },
  {
    question: 'How do I know what to order?',
    answer:
      'Read the catalog entries thoroughly. Each peptide page covers dosage protocols, effects, and timelines based on available research. When in doubt, start with lower doses.',
  },
  {
    question: 'What payment and shipping options are available?',
    answer: null,
    answerNode: (
      <>
        Visit{' '}
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="get-started__link"
        >
          optimalpep.com
        </a>{' '}
        for current payment methods and shipping details.
      </>
    ),
  },
]

export default function GetStarted() {
  return (
    <main className="get-started">
      <Helmet>
        <title>How to Get Started — OptimalPep</title>
        <meta name="description" content="Learn how to browse the peptide catalog, find the right compound, and place your order at OptimalPep." />
      </Helmet>

      {/* ── Header ── */}
      <section className="get-started__header">
        <p className="get-started__eyebrow">Research peptide reference</p>
        <h1 className="get-started__heading">How to Get Started</h1>
        <p className="get-started__subtitle">
          Everything you need to go from browsing to ordering — in three steps.
        </p>
      </section>

      {/* ── Process steps ── */}
      <section className="get-started__steps-section">
        <h2 className="get-started__section-heading">The process</h2>
        <ol className="get-started__steps" aria-label="Getting started steps">
          {steps.map((step) => (
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
          <Link to="/catalog" className="get-started__btn">
            Browse the Catalog
          </Link>
        </div>
      </section>

      {/* ── Contact placeholder ── */}
      <section className="get-started__contact-section">
        <h2 className="get-started__section-heading">Contact &amp; Ordering</h2>
        <div className="get-started__placeholder glass">
          <span className="get-started__placeholder-icon" aria-hidden="true">
            📋
          </span>
          <div className="get-started__placeholder-body">
            <strong className="get-started__placeholder-title">
              Contact &amp; Ordering
            </strong>
            <p className="get-started__placeholder-text">
              Contact and ordering information to be added.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="get-started__faq-section">
        <h2 className="get-started__section-heading">Frequently asked questions</h2>
        <dl className="get-started__faq">
          {faqs.map((faq) => (
            <div key={faq.question} className="get-started__faq-item">
              <dt className="get-started__faq-q">{faq.question}</dt>
              <dd className="get-started__faq-a">
                {faq.answer ?? faq.answerNode}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
