import { useLocation, Link } from 'react-router-dom'
import './BackBar.css'

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
    <div className="back-bar">
      <div className="back-bar__inner">
        <Link to={back.to} className="back-bar__link">
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
