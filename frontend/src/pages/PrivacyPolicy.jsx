import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ContentPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="content-page">
      <div className="content-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: July 12, 2025</p>
        
        <section className="content-section">
          <h2>1. Information We Collect</h2>
          <p>
            When you use ISPInfo, we may collect the following types of information:
          </p>
          <ul>
            <li><strong>IP Addresses:</strong> We collect IP addresses for the purpose of providing our services and improving accuracy.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website and services.</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your experience and analyze site usage.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve and personalize our services</li>
            <li>Analyze usage and trends</li>
            <li>Prevent fraud and enhance security</li>
            <li>Communicate with you about our services</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="content-section">
          <h2>4. Third-Party Services</h2>
          <p>
            We may use third-party services to help operate our website and deliver services. These third parties 
            have access to your information only to perform specific tasks on our behalf and are obligated 
            not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="content-section">
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, 
            including the right to access, correct, or delete your data.
          </p>
        </section>

        <section className="content-section">
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="content-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
