import { Link } from 'react-router-dom';
import { SHOP_URL } from '../config.js';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        OptimalPep
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
