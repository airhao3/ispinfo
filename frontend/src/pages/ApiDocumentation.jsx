import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ContentPage.css';

const ApiDocumentation = () => {
  return (
    <div className="content-page">
      <div className="content-container">
        <h1>API Documentation</h1>
        <p className="page-description">
          Integrate our IP lookup services into your applications with our powerful API.
        </p>
        
        <section className="content-section">
          <h2>Getting Started</h2>
          <p>
            Our API provides programmatic access to IP geolocation and network information. 
            To get started, you'll need an API key which you can get by signing up.
          </p>
          
          <div className="code-block">
            <pre style={{ margin: 0, textAlign: 'left' }}>{
`// Example API Request
fetch('https://api.ispinfo.io/v1/lookup?ip=8.8.8.8', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
            }</pre>
          </div>
        </section>

        <section className="content-section">
          <h2>Endpoints</h2>
          
          <div className="endpoint">
            <h3>IP Lookup</h3>
            <div className="endpoint-method get">GET</div>
            <div className="endpoint-path">/v1/lookup?ip=:ip</div>
            <p>Retrieve detailed information about an IP address.</p>
            
            <h4>Parameters</h4>
            <ul>
              <li><code>ip</code> (required) - The IP address to look up</li>
            </ul>
            
            <h4>Example Response</h4>
            <div className="code-block">
              <pre style={{ margin: 0, textAlign: 'left' }}>{
`{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "region": "California",
  "country": "US",
  "location": {
    "lat": 37.4056,
    "lng": -122.0775
  },
  "isp": "Google LLC",
  "asn": "AS15169",
  "organization": "Google LLC",
  "is_hosting": true,
  "is_vpn": false,
  "timezone": "America/Los_Angeles"
}`
              }</pre>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Rate Limiting</h2>
          <p>
            Free tier: 100 requests per day<br />
            Pro tier: 10,000 requests per day<br />
            Enterprise: Contact us for custom limits
          </p>
        </section>

        <div className="back-home">
          <Link to="/" className="back-button">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
