import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ContentPage.css';

const CookiePolicy = () => {
  return (
    <div className="content-page">
      <div className="content-container">
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last updated: July 12, 2025</p>
        
        <section className="content-section">
          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and to provide information to the site owners.
          </p>
        </section>

        <section className="content-section">
          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong>Preference Cookies:</strong> Remember your preferences and settings.</li>
            <li><strong>Security Cookies:</strong> Used for security purposes.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>3. Third-Party Cookies</h2>
          <p>
            We may also use various third-party cookies to report usage statistics of the Service, 
            deliver advertisements on and through the Service, and so on.
          </p>
        </section>

        <section className="content-section">
          <h2>4. Your Choices Regarding Cookies</h2>
          <p>
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, 
            please visit the help pages of your web browser. However, please note that if you delete 
            cookies or refuse to accept them, you might not be able to use all of the features we offer.
          </p>
        </section>

        <section className="content-section">
          <h2>5. Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by 
            posting the new Cookie Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="content-section">
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Cookie Policy, please contact us at:
            <br />
            <a href="mailto:privacy@ispinfo.io">privacy@ispinfo.io</a>
          </p>
        </section>

        <div className="back-home">
          <Link to="/" className="back-button">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
