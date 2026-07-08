import { GLOSSARY } from '../data/glossary.js'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip.jsx'

/**
 * Renders a term with a dotted underline and a tooltip definition.
 * Use only in JSX we author (tab labels, panel headings) — not injected
 * into raw peptide prose.
 */
export default function GlossaryTerm({ term, children }) {
  const entry = GLOSSARY[term]
  if (!entry) return <>{children ?? term}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="cursor-help border-b border-dashed border-muted-foreground/50 text-inherit"
          aria-describedby={undefined}
        >
          {children ?? term}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-[13px] leading-[1.5]">
        {entry.short}
      </TooltipContent>
    </Tooltip>
  )
}
