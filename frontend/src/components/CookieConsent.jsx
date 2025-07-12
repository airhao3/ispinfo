import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [cookies, setCookies] = useState({
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
      accepted: true,
      date: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      ...cookies,
      accepted: true,
      date: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setVisible(false);
    setPreferencesOpen(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true, // Necessary cookies cannot be rejected
      analytics: false,
      preferences: false,
      marketing: false,
      accepted: true,
      date: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setVisible(false);
    setPreferencesOpen(false);
  };

  const togglePreferences = () => {
    setPreferencesOpen(!preferencesOpen);
  };

  const handleCookieToggle = (cookieType) => {
    setCookies(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <h3>We value your privacy</h3>
        <p>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
          By clicking "Accept All", you consent to our use of cookies. 
          <Link to="/cookies" className="cookie-policy-link">Cookie Policy</Link>
        </p>

        {preferencesOpen ? (
          <div className="cookie-preferences">
            <div className="cookie-preference">
              <div>
                <h4>Necessary</h4>
                <p>Essential for the website to function properly.</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={true} 
                  disabled
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="cookie-preference">
              <div>
                <h4>Analytics</h4>
                <p>Help us understand how visitors interact with our website.</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={cookies.analytics}
                  onChange={() => handleCookieToggle('analytics')}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="cookie-preference">
              <div>
                <h4>Preferences</h4>
                <p>Remember your settings and preferences.</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={cookies.preferences}
                  onChange={() => handleCookieToggle('preferences')}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="cookie-preference">
              <div>
                <h4>Marketing</h4>
                <p>Used to deliver relevant ads and measure ad performance.</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={cookies.marketing}
                  onChange={() => handleCookieToggle('marketing')}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="cookie-buttons">
              <button 
                className="cookie-btn secondary"
                onClick={handleRejectAll}
              >
                Reject All
              </button>
              <button 
                className="cookie-btn primary"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="cookie-buttons">
            <button 
              className="cookie-btn secondary"
              onClick={togglePreferences}
            >
              Preferences
            </button>
            <button 
              className="cookie-btn primary"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
