import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './FinalCTASection.css';

const FinalCTASection: React.FC = () => {
  return (
    <section className="final-cta-section py-5 text-center">
      <Container>
        <h2 className="mb-4">Ready to get started?</h2>
        <div className="d-flex justify-content-center">
          <Button variant="light" size="lg" href="#signup" className="me-3">Sign up free</Button>
          <Button variant="outline-light" size="lg" href="#contact">Talk to sales</Button>
        </div>
      </Container>
    </section>
  );
};

export default FinalCTASection;
