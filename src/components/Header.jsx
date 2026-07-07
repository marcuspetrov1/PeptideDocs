import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/catalog', label: 'Catalog' },
  { to: '/get-started', label: 'Get Started' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] flex h-[84px] w-full items-center justify-between border-b border-border bg-background/88 px-5 backdrop-blur-md">
      <Link
        to="/"
        className="font-heading text-[22px] font-medium text-foreground transition-opacity hover:opacity-75"
      >
        PeptideDocs
      </Link>
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-foreground ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
