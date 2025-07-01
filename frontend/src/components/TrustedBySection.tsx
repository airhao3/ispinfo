import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './TrustedBySection.css';

const TrustedBySection: React.FC = () => {
  const logos = [
    { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1200px-Microsoft_logo_%282012%29.svg.png' },
    { name: 'Dell', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1200px-Dell_Logo.svg.png' },
    { name: 'Shopify', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_Logo.svg/1200px-Shopify_Logo.svg.png' },
    { name: 'T-Mobile', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/T-Mobile_logo_2023.svg/1200px-T-Mobile_logo_2023.svg.png' },
    { name: 'Ubisoft', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ubisoft_logo.svg/1200px-Ubisoft_logo.svg.png' },
    { name: 'Brex', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Brex_logo.svg/1200px-Brex_logo.svg.png' },
  ];

  return (
    <section className="trusted-by-section py-5">
      <Container className="text-center">
        <h5 className="text-muted text-uppercase mb-4">Trusted by Industry Leaders</h5>
        <Row className="align-items-center justify-content-center">
          {logos.map((logo, index) => (
            <Col key={index} xs={6} sm={4} md={2} className="mb-4 mb-md-0">
              <img src={logo.src} alt={logo.name} className="img-fluid grayscale-logo" />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TrustedBySection;
