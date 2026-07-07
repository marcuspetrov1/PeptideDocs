import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/get-started', label: 'Get Started' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-code-bg px-6 py-8 text-center">
      <nav className="mb-4 flex items-center justify-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mx-auto mb-3 max-w-[640px] text-[13px] leading-[1.6] text-muted-foreground">
        The statements made on this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
      <p className="text-xs text-muted-foreground/60">
        &copy; {new Date().getFullYear()} PeptideDocs
      </p>
    </footer>
  );
}
