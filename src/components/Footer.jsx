import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="disclaimer">
        [Disclaimer — to be added]
      </p>
      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} OptimalPep
      </p>
    </footer>
  );
}
