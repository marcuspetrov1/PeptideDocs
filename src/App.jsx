import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import PeptideDetail from './pages/PeptideDetail.jsx'
import GetStarted from './pages/GetStarted.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/peptides/:slug" element={<PeptideDetail />} />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    </Layout>
  )
}
