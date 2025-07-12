import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: July 12, 2025</p>
        
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using ISPInfo.io (the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            ISPInfo.io provides IP geolocation and network information services. The Service is provided "as is" and 
            ISPInfo.io assumes no responsibility for the timeliness, deletion, or failure to store any user communications.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Use of the Service</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any laws</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use the Service to infringe upon or violate our intellectual property rights</li>
            <li>Use the Service to harass, abuse, or harm another person</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. API Usage</h2>
          <p>
            Our API is provided for legitimate use cases. You agree to comply with our rate limits and not to abuse the service. 
            Excessive usage may result in temporary or permanent suspension of access.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall ISPInfo.io be liable for any indirect, incidental, special, consequential or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by 
            posting the new Terms on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:legal@ispinfo.io">legal@ispinfo.io</a>
          </p>
        </section>

        <div className="back-home">
          <Link to="/" className="back-button">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
