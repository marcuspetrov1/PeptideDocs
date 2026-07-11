import { Input } from './ui/input.jsx'
import { cn } from '../lib/utils.js'

/**
 * Shared, presentational peptide search input.
 *
 * Renders the same-looking search box on both the Home and Catalog pages.
 * Owns unwrapping the DOM change event so callers work with plain strings,
 * and wires up Enter / form submission to `onSubmit`. No data fetching,
 * routing, or dropdown/typeahead logic lives here — that belongs to the
 * pages/components that render this one.
 */
export default function PeptideSearch({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search peptides…',
  autoFocus,
  'aria-label': ariaLabel = 'Search peptides',
  className,
  ...props
}) {
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={cn(
          'h-auto rounded-[10px] border-border bg-code-bg px-4 py-2.5 font-sans text-[15px] text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary-border focus-visible:ring-[3px] focus-visible:ring-primary-bg',
          className
        )}
        {...props}
      />
    </form>
  )
}
