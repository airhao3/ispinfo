import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ContentPage.css';

const About = () => {
  return (
    <div className="content-page">
      <div className="content-container">
        <h1>About ISPInfo</h1>
        <p className="page-description">
          Your trusted source for IP information and network intelligence.
        </p>
        
        <section className="content-section">
          <h2>Our Mission</h2>
          <p>
            At ISPInfo, we're dedicated to providing accurate and comprehensive IP geolocation 
            and network intelligence services. Our goal is to help developers, businesses, and 
            IT professionals make informed decisions about their network infrastructure.
          </p>
        </section>

        <section className="content-section">
          <h2>What We Offer</h2>
          <ul className="feature-list">
            <li><strong>IP Geolocation:</strong> Precise location data for any IP address</li>
            <li><strong>Network Intelligence:</strong> Detailed ISP and organization information</li>
            <li><strong>Security Insights:</strong> Identify potential security risks and VPN usage</li>
            <li><strong>Developer-Friendly API:</strong> Easy integration for your applications</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Our Technology</h2>
          <p>
            Our platform leverages a combination of proprietary algorithms and multiple data sources 
            to deliver the most accurate and up-to-date IP information available. We continuously 
            update our database to ensure you get the most reliable results.
          </p>
        </section>

        <div className="back-home">
          <Link to="/" className="back-button">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
