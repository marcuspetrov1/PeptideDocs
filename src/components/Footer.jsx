import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="disclaimer">
        The statements made on this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} OptimalPep
      </p>
    </footer>
  );
}
