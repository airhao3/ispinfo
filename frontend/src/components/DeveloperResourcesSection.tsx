import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './DeveloperResourcesSection.css';

const codeSnippets = {
  curl: `curl ispinfo.io/8.8.8.8`,
  python: `import requests
response = requests.get('https://ispinfo.io/8.8.8.8')
data = response.json()
print(data)`,
  javascript: `fetch('https://ispinfo.io/8.8.8.8')
  .then(response => response.json())
  .then(data => console.log(data));`,
  php: `<?php
$response = file_get_contents('https://ispinfo.io/8.8.8.8');
$data = json_decode($response);
print_r($data);
?>`,
};

const DeveloperResourcesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('curl');

  return (
    <section className="developer-resources-section py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="mb-4">Built for developers</h2>
            <p className="lead text-muted mb-4">
              Our API is designed for ease of use, scalability, and reliability.
              Integrate powerful IP data into your applications with minimal effort.
            </p>
            <ul className="list-unstyled feature-list mb-4">
              <li><span className="icon">✅</span> Easy to integrate</li>
              <li><span className="icon">✅</span> Scalable infrastructure</li>
              <li><span className="icon">✅</span> 99.99% uptime</li>
              <li><span className="icon">✅</span> Official libraries</li>
            </ul>
            <Button variant="outline-primary" href="#documentation">View Documentation</Button>
          </Col>
          <Col md={6}>
            <div className="code-example-block shadow-sm rounded">
              <div className="code-tabs d-flex justify-content-start mb-3">
                {Object.keys(codeSnippets).map((lang) => (
                  <button
                    key={lang}
                    className={`code-tab-btn ${activeTab === lang ? 'active' : ''}`}
                    onClick={() => setActiveTab(lang)}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
              <pre className="code-block">
                <code>
                  {codeSnippets[activeTab as keyof typeof codeSnippets]}
                </code>
              </pre>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default DeveloperResourcesSection;
