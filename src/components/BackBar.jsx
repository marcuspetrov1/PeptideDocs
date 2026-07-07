import { useLocation, Link } from 'react-router-dom'

function getBack(pathname) {
  if (pathname === '/catalog') return { to: '/', label: 'Home' }
  if (pathname.startsWith('/peptides/')) return { to: '/catalog', label: 'Browse Peptides' }
  if (pathname === '/get-started') return { to: '/', label: 'Home' }
  return null
}

export default function BackBar() {
  const { pathname } = useLocation()
  const back = getBack(pathname)
  if (!back) return null

  return (
    <div className="sticky top-[84px] z-[99] border-b border-border bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex h-9 max-w-[var(--container-max)] items-center px-8 max-lg:px-6 max-[600px]:px-4">
        <Link
          to={back.to}
          className="inline-flex items-center gap-[5px] font-sans text-[13px] font-medium text-muted-foreground opacity-65 no-underline transition-[opacity,color] duration-150 hover:text-primary hover:opacity-100 focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {back.label}
        </Link>
      </div>
    </div>
  )
}
