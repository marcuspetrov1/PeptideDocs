import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion.jsx'

const STATIC_LEGAL_FAQ = {
  question: 'How should research peptides be stored?',
  answer:
    'Lyophilized (freeze-dried) peptides should be stored in a cool, dry place away from light — ideally refrigerated at 2–8 °C. Once reconstituted, keep refrigerated and use within 30 days. Do not freeze reconstituted peptides. These compounds are for research purposes only and are not intended for human use.',
}

/**
 * Derives FAQ items from existing peptide fields and appends one shared
 * static legal/storage entry.
 */
export default function PeptideFAQ({ peptide }) {
  const faqData = []

  if (peptide.mechanism) {
    faqData.push({
      question: `How does ${peptide.name} work?`,
      answer: peptide.mechanism,
    })
  }
  if (peptide.effects) {
    faqData.push({
      question: `What effects does ${peptide.name} have?`,
      answer: peptide.effects,
    })
  }
  if (peptide.results_timeline) {
    faqData.push({
      question: `What is the expected research timeline for ${peptide.name}?`,
      answer: peptide.results_timeline,
    })
  }
  if (peptide.administration || peptide.timing) {
    const combined = [peptide.administration, peptide.timing].filter(Boolean).join(' ')
    faqData.push({
      question: `How and when is ${peptide.name} administered in research?`,
      answer: combined,
    })
  }

  faqData.push(STATIC_LEGAL_FAQ)

  return (
    <div className="mb-9">
      <h2 className="mb-4 font-heading text-[22px] font-normal tracking-[-0.3px] text-foreground">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="rounded-[10px] border border-border overflow-hidden">
        {faqData.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-${idx}`}
            className="border-border last:border-b-0"
          >
            <AccordionTrigger className="px-[18px] text-[14px] font-medium text-left hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-[18px] text-[14px] leading-[1.65] text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
