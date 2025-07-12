import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <span className="logo">ISPInfo</span>
            {t.footer?.tagline && (
              <span className="tagline">{t.footer.tagline}</span>
            )}
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            {t.nav?.home || 'Home'}
          </Link>
          <a 
            href="https://docs.ispinfo.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link"
          >
            {t.nav?.documentation || 'Documentation'}
          </a>
          <Link to="/terms" className={`nav-link ${isActive('/terms')}`}>
            {t.nav?.terms || 'Terms of Service'}
          </Link>
          <Link to="/privacy" className={`nav-link ${isActive('/privacy')}`}>
            {t.nav?.privacy || 'Privacy Policy'}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
