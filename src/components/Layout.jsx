import Header from './Header.jsx'
import SiteBreadcrumbs from './SiteBreadcrumbs.jsx'
import LegalDisclaimer from './LegalDisclaimer.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <SiteBreadcrumbs />
      <LegalDisclaimer />
      <main className="min-h-[60vh] flex-[1_0_auto]">
        {children}
      </main>
      <Footer />
    </>
  )
}
