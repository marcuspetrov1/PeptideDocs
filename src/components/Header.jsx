import { Link } from 'react-router-dom';
import { SHOP_URL } from '../config.js';
import logoSrc from '../assets/optimalpep-new-site-logo.avif';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src={logoSrc} alt="OptimalPep" className="header-logo-img" />
      </Link>
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="header-shop-btn"
      >
        Shop
      </a>
    </header>
  );
}
