import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-brand mb-3">
              {/* Placeholder for Logo - Replace with actual SVG/Image */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#007bff"/>
              </svg>
              ispinfo
            </h5>
            <p className="text-muted">The trusted source for IP address data.</p>
            <div className="social-icons">
              <a href="#" className="social-icon me-2"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon me-2"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
            </div>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Products</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">IP Geolocation</a></li>
              <li><a href="#" className="text-muted">ASN Data</a></li>
              <li><a href="#" className="text-muted">IP to Company</a></li>
              <li><a href="#" className="text-muted">Carrier Detection</a></li>
            </ul>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Developers</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">API Docs</a></li>
              <li><a href="#" className="text-muted">Libraries</a></li>
              <li><a href="#" className="text-muted">Status Page</a></li>
            </ul>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">About Us</a></li>
              <li><a href="#" className="text-muted">Contact</a></li>
              <li><a href="#" className="text-muted">Careers</a></li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">Terms of Service</a></li>
              <li><a href="#" className="text-muted">Privacy Policy</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <div className="text-center text-muted">
          <p className="mb-0">&copy; {new Date().getFullYear()} ispinfo. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
