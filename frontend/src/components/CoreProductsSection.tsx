import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './CoreProductsSection.css';

const products = [
  {
    icon: '🌍', // Globe icon
    title: 'IP Geolocation',
    description: 'Pinpoint the location of any IP address with city-level accuracy.',
  },
  {
    icon: '🏢', // Building icon
    title: 'ASN Data',
    description: 'Identify the ISP, hosting provider, or organization behind any IP.',
  },
  {
    icon: '🔗', // Link icon
    title: 'IP to Company',
    description: 'Map IP addresses to specific companies and organizations.',
  },
  {
    icon: '📡', // Satellite dish icon
    title: 'Carrier Detection',
    description: 'Determine the mobile carrier or network provider for an IP.',
  },
  {
    icon: '🛡️', // Shield icon
    title: 'VPN Detection',
    description: 'Detect VPNs, proxies, and other anonymity services.',
  },
  {
    icon: '⚡', // High voltage sign
    title: 'Abuse Contact',
    description: 'Get abuse contact information for IP addresses.',
  },
];

const CoreProductsSection: React.FC = () => {
  return (
    <section className="core-products-section py-5">
      <Container className="text-center">
        <h2 className="mb-5">Core IP Data</h2>
        <Row className="g-4">
          {products.map((product, index) => (
            <Col key={index} md={6} lg={4}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Body>
                  <div className="product-icon mb-3">{product.icon}</div>
                  <Card.Title as="h4">{product.title}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <a href="#" className="link-primary">Learn more &rarr;</a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default CoreProductsSection;
