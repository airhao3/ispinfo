import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ISPInfo</h3>
          <p>{t.footer?.tagline || 'Your trusted source for IP information and network intelligence.'}</p>
        </div>
        
        <div className="footer-section">
          <h4>{t.footer?.quickLinks || 'Quick Links'}</h4>
          <ul className="footer-links">
            <li><Link to="/">{t.nav?.home || 'Home'}</Link></li>
            <li><Link to="/about">{t.nav?.about || 'About Us'}</Link></li>
            <li><Link to="/api">{t.nav?.api || 'API Documentation'}</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>{t.footer?.legal || 'Legal'}</h4>
          <ul className="footer-links">
            <li><Link to="/terms">{t.nav?.terms || 'Terms of Service'}</Link></li>
            <li><Link to="/privacy">{t.nav?.privacy || 'Privacy Policy'}</Link></li>
            <li><Link to="/cookies">{t.nav?.cookies || 'Cookie Policy'}</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>{t.footer?.connect || 'Connect'}</h4>
          <div className="social-links">
            <a href="https://github.com/ispinfo" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://twitter.com/ispinfo" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="mailto:contact@ispinfo.io">Contact Us</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>{
          t.footer?.copyright 
            ? t.footer.copyright.replace('{year}', currentYear)
            : `© ${currentYear} ISPInfo. All rights reserved.`
        }</p>
      </div>
    </footer>
  );
};

export default Footer;
