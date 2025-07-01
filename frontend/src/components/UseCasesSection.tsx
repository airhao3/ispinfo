import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './UseCasesSection.css';

const useCases = [
  {
    icon: '🛡️', // Shield icon
    title: 'Cybersecurity',
    description: 'Enhance threat intelligence and fraud detection.',
  },
  {
    icon: '🎯', // Target icon
    title: 'Ad Targeting',
    description: 'Deliver more relevant ads based on user location.',
  },
  {
    icon: '📈', // Chart icon
    title: 'Content Personalization',
    description: 'Tailor content and user experience by region.',
  },
  {
    icon: '📊', // Bar chart icon
    title: 'Analytics',
    description: 'Gain insights into user demographics and traffic sources.',
  },
  {
    icon: '🌐', // Globe with meridians
    title: 'Geo-blocking',
    description: 'Restrict access to content or services based on geography.',
  },
  {
    icon: '🔍', // Magnifying glass
    title: 'Compliance',
    description: 'Meet regulatory requirements for data residency and access.',
  },
];

const UseCasesSection: React.FC = () => {
  return (
    <section className="use-cases-section py-5">
      <Container className="text-center">
        <h2 className="mb-5">IP Address Data Use Cases</h2>
        <Row className="g-4">
          {useCases.map((useCase, index) => (
            <Col key={index} md={6} lg={4}>
              <Card className="h-100 shadow-sm use-case-card">
                <Card.Body>
                  <div className="use-case-icon mb-3">{useCase.icon}</div>
                  <Card.Title as="h4">{useCase.title}</Card.Title>
                  <Card.Text>{useCase.description}</Card.Text>
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

export default UseCasesSection;
