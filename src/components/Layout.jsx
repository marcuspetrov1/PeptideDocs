import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ flex: '1 0 auto', minHeight: '60vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
