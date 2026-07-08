import { useLocation, useParams, Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb.jsx'
import { getPeptideBySlug } from '../data/peptides.js'
import { CATEGORY_LABELS } from '../data/categories.js'

/**
 * Replaces BackBar. Renders contextual breadcrumbs using a static route/label
 * map — no naive segment splitting. The category crumb always links to /catalog;
 * the current-page leaf is plain text (not a link).
 */
export default function SiteBreadcrumbs() {
  const { pathname } = useLocation()

  // Home route — no breadcrumb strip needed
  if (pathname === '/') return null

  // /catalog
  if (pathname === '/catalog') {
    return (
      <BreadcrumbBar>
        <HomeLink />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Catalog</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbBar>
    )
  }

  // /get-started
  if (pathname === '/get-started') {
    return (
      <BreadcrumbBar>
        <HomeLink />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Get Started</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbBar>
    )
  }

  // /peptides/:slug
  if (pathname.startsWith('/peptides/')) {
    const slug = pathname.replace('/peptides/', '')
    const peptide = getPeptideBySlug(slug)
    const categoryLabel = peptide
      ? (CATEGORY_LABELS[peptide.category] ?? peptide.category)
      : null
    const peptideName = peptide ? peptide.name : slug

    return (
      <BreadcrumbBar>
        <HomeLink />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* Category crumb links to /catalog — a real existing route */}
          <BreadcrumbLink asChild>
            <Link to="/catalog">{categoryLabel ?? 'Catalog'}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{peptideName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbBar>
    )
  }

  // Unknown route — render nothing
  return null
}

function BreadcrumbBar({ children }) {
  return (
    <div className="border-b border-border bg-code-bg px-8 py-2.5 max-lg:px-6 max-[600px]:px-4">
      <Breadcrumb>
        <BreadcrumbList className="text-[13px]">{children}</BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

function HomeLink() {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link to="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}
