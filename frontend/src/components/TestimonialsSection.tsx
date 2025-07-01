import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import './TestimonialsSection.css';

const testimonials = [
  {
    quote: "The accuracy of the geolocation data is unparalleled. It has become an indispensable tool for our fraud detection system.",
    name: "Jane Doe",
    title: "Lead Developer",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    quote: "Incredibly fast and reliable API. We migrated from another service and saw a 50ms drop in our average response time.",
    name: "John Smith",
    title: "CTO",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    quote: "The ASN data is exactly what we needed for our network analysis tools. Rich, detailed, and always up-to-date.",
    name: "Sam Wilson",
    title: "Network Engineer",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    quote: "ispinfo.io's data has significantly improved our content personalization efforts. Highly recommended!",
    name: "Emily White",
    title: "Marketing Director",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="testimonials-section py-5">
      <Container className="text-center">
        <h2 className="mb-5">What Our Customers Say</h2>
        <Carousel indicators={false} controls={true} interval={5000}>
          {testimonials.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <Card className="shadow-sm testimonial-card">
                    <Card.Body>
                      <Card.Text className="fst-italic mb-4">
                        "{testimonial.quote}"
                      </Card.Text>
                      <div className="d-flex align-items-center justify-content-center">
                        <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar rounded-circle me-3" />
                        <div className="text-start">
                          <h5 className="mb-0">{testimonial.name}</h5>
                          <p className="text-muted mb-0">{testimonial.title}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
