import Header from './Header.jsx';
import BackBar from './BackBar.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <BackBar />
      <main className="min-h-[60vh] flex-[1_0_auto]">
        {children}
      </main>
      <Footer />
    </>
  );
}
