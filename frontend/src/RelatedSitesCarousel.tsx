import React from 'react';
import { Carousel, Container, Row, Col, Card, Button } from 'react-bootstrap';
import './RelatedSitesCarousel.css';

interface Site {
  name: string;
  description: string;
  url: string;
  image: string; // URL to the site's logo or a relevant image
}

const relatedSites: Site[] = [
  {
    name: 'Cloudflare',
    description: 'Leading CDN and security provider.',
    url: 'https://www.cloudflare.com/',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Cloudflare_Logo.svg/1200px-Cloudflare_Logo.svg.png',
  },
  {
    name: 'AWS',
    description: 'Comprehensive and broadly adopted cloud platform.',
    url: 'https://aws.amazon.com/',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png',
  },
  {
    name: 'Google Cloud',
    description: 'Suite of cloud computing services.',
    url: 'https://cloud.google.com/',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Google_Cloud_Logo.svg/1200px-Google_Cloud_Logo.svg.png',
  },
  {
    name: 'Microsoft Azure',
    description: 'Cloud computing service for building, testing, deploying, and managing applications.',
    url: 'https://azure.microsoft.com/',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1200px-Microsoft_Azure.svg.png',
  },
  {
    name: 'DigitalOcean',
    description: 'Cloud computing platform for developers.',
    url: 'https://www.digitalocean.com/',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png',
  },
];

const RelatedSitesCarousel: React.FC = () => {
  return (
    <div className="related-sites-section py-5">
      <Container>
        <h2 className="text-center mb-5">Our Partners & Related Services</h2>
        <Carousel indicators={false} interval={3000} controls={true}>
          {relatedSites.map((site, index) => (
            <Carousel.Item key={index}>
              <Row className="justify-content-center">
                <Col md={6} lg={4}>
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <a href={site.url} target="_blank" rel="noopener noreferrer">
                        <img src={site.image} alt={site.name} className="site-logo mb-3" />
                      </a>
                      <Card.Title as="h5">{site.name}</Card.Title>
                      <Card.Text>{site.description}</Card.Text>
                      <Button variant="outline-primary" href={site.url} target="_blank" rel="noopener noreferrer">
                        Visit Site
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default RelatedSitesCarousel;
