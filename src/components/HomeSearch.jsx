import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command.jsx'
import { getAllPeptides } from '../data/peptides.js'
import { matchesQuery, toSearchParams } from '../lib/search.js'

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

  const hasQuery = value.trim().length > 0
  // matchesQuery normalizes/lowercases its own needle, and treats an empty
  // needle as "match everything" — so this single call covers both the
  // "browsing" and "searching" states that the old ternary handled by hand.
  const filtered = peptides.filter(p => matchesQuery(p, value))

  function goToCatalog() {
    const params = toSearchParams({ q: value })
    navigate(`/catalog?${new URLSearchParams(params).toString()}`)
  }

  // cmdk's own Enter handling always fires (it runs our onKeyDown first,
  // then — unless we've called preventDefault — selects whatever item is
  // currently highlighted). Because cmdk auto-highlights the first
  // suggestion whenever the list is non-empty, "Enter selects the top
  // suggestion" already covers the has-results case and must stay
  // untouched. The one case cmdk can't handle on its own is zero results:
  // no item is ever highlighted, so Enter would otherwise do nothing. Route
  // that case to the full Catalog search instead. (When results exist but
  // the user wants the full Catalog anyway, the "Search catalog" row below
  // the list — reachable by click or by arrowing down and hitting Enter on
  // it — covers that.)
  function handleKeyDown(e) {
    if (e.key === 'Enter' && hasQuery && filtered.length === 0) {
      e.preventDefault()
      goToCatalog()
    }
  }

  return (
    <Command
      className="rounded-xl border border-border shadow-sm"
      shouldFilter={false}
      label="Search peptides"
      onKeyDown={handleKeyDown}
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
        {hasQuery && (
          <CommandGroup>
            <CommandItem value={`__catalog-search__${value}`} onSelect={goToCatalog}>
              <SearchIcon className="opacity-60" aria-hidden="true" />
              Search catalog for &ldquo;{value.trim()}&rdquo;
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
