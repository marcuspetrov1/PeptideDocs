import Header from './Header.jsx';
import BackBar from './BackBar.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <BackBar />
      <main style={{ flex: '1 0 auto', minHeight: '60vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
