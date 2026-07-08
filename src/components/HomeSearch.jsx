import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command.jsx'
import { getAllPeptides } from '../data/peptides.js'
import { CATEGORY_LABELS } from '../data/categories.js'

const PROMPTS = [
  "Search 'BPC-157 research protocols'…",
  "Search 'Peptides for tissue repair'…",
  "Search 'TB-500 mechanism'…",
  "Search 'Growth hormone secretagogues'…",
  "Search 'Cognitive peptides'…",
]

const TYPE_SPEED = 45  // ms per character
const PAUSE_MS   = 1800 // hold full string
const ERASE_SPEED = 22  // ms per character erase

function useTypewriter(prompts) {
  const [placeholder, setPlaceholder] = useState('')
  const [active, setActive] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!active) return

    let promptIdx = 0
    let charIdx   = 0
    let erasing   = false

    function tick() {
      const current = prompts[promptIdx]

      if (!erasing) {
        charIdx++
        setPlaceholder(current.slice(0, charIdx))
        if (charIdx === current.length) {
          erasing = true
          timerRef.current = setTimeout(tick, PAUSE_MS)
          return
        }
        timerRef.current = setTimeout(tick, TYPE_SPEED)
      } else {
        charIdx--
        setPlaceholder(current.slice(0, charIdx))
        if (charIdx === 0) {
          erasing  = false
          promptIdx = (promptIdx + 1) % prompts.length
          timerRef.current = setTimeout(tick, TYPE_SPEED)
          return
        }
        timerRef.current = setTimeout(tick, ERASE_SPEED)
      }
    }

    timerRef.current = setTimeout(tick, TYPE_SPEED)

    return () => clearTimeout(timerRef.current)
  }, [active, prompts])

  return { placeholder, stop: () => setActive(false) }
}

const peptides = getAllPeptides()

export default function HomeSearch() {
  const navigate   = useNavigate()
  const [value, setValue]   = useState('')
  const { placeholder, stop } = useTypewriter(PROMPTS)

  const query = value.trim().toLowerCase()
  const filtered = query
    ? peptides.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (CATEGORY_LABELS[p.category] ?? '').toLowerCase().includes(query)
      )
    : peptides

  return (
    <Command
      className="rounded-xl border border-border shadow-sm"
      shouldFilter={false}
      label="Search peptides"
    >
      <CommandInput
        placeholder={placeholder || 'Search peptides…'}
        value={value}
        onValueChange={(v) => { stop(); setValue(v) }}
        onFocus={stop}
        spellCheck={false}
        autoComplete="off"
        inputMode="search"
        enterKeyHint="search"
        style={{ touchAction: 'manipulation' }}
      />
      <CommandList>
        <CommandEmpty>No peptides found.</CommandEmpty>
        <CommandGroup heading="Peptides">
          {filtered.slice(0, 8).map(p => (
            <CommandItem
              key={p.slug}
              value={p.slug}
              onSelect={() => navigate(`/peptides/${p.slug}`)}
            >
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
