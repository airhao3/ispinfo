import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import './GlobalNavigationBar.css';

const GlobalNavigationBar: React.FC = () => {
  return (
    <Navbar expand="lg" className="global-navbar sticky-top shadow-sm">
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          {/* Placeholder for Logo - Replace with actual SVG/Image */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#007bff"/>
          </svg>
          <span className="navbar-brand-text ms-2">ispinfo</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <NavDropdown title="Products" id="products-dropdown">
              <NavDropdown.Item href="#products/ip-geolocation">IP Geolocation</NavDropdown.Item>
              <NavDropdown.Item href="#products/asn">ASN</NavDropdown.Item>
              <NavDropdown.Item href="#products/ip-to-company">IP to Company</NavDropdown.Item>
              <NavDropdown.Item href="#products/carrier-detection">Carrier Detection</NavDropdown.Item>
              <NavDropdown.Item href="#products/vpn-detection">VPN Detection</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Solutions" id="solutions-dropdown">
              <NavDropdown.Item href="#solutions/cybersecurity">Cybersecurity</NavDropdown.Item>
              <NavDropdown.Item href="#solutions/e-commerce">E-commerce</NavDropdown.Item>
              <NavDropdown.Item href="#solutions/marketing">Marketing</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Developers" id="developers-dropdown">
              <NavDropdown.Item href="#developers/api-docs">API Documentation</NavDropdown.Item>
              <NavDropdown.Item href="#developers/libraries">Libraries</NavDropdown.Item>
              <NavDropdown.Item href="#developers/status-page">Status Page</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Resources" id="resources-dropdown">
              <NavDropdown.Item href="#resources/blog">Blog</NavDropdown.Item>
              <NavDropdown.Item href="#resources/whitepapers">Whitepapers</NavDropdown.Item>
              <NavDropdown.Item href="#resources/case-studies">Case Studies</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Company" id="company-dropdown">
              <NavDropdown.Item href="#company/about-us">About Us</NavDropdown.Item>
              <NavDropdown.Item href="#company/contact">Contact</NavDropdown.Item>
              <NavDropdown.Item href="#company/careers">Careers</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link href="#login">Log in</Nav.Link>
            <Button variant="primary" href="#signup" className="ms-2">Sign up free</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default GlobalNavigationBar;
