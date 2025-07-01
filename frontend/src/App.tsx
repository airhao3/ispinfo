import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Tab, Tabs, Alert, Spinner } from 'react-bootstrap';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import IPLookup from '@/components/IPLookup';
import IPDetails from '@/components/IPDetails';
import IPMap from '@/components/IPMap';
import type { IPInfo } from './services/api';
import { lookupIP, getMyIP } from './services/api';

function App() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchClientIP();
  }, []);

  const fetchClientIP = async () => {
    try {
      setLoading(true);
      setError(null);
      const ipInfo = await getMyIP();
      setIpInfo(ipInfo);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch your IP information';
      setError(errorMessage);
      setIpInfo(null);
      console.error('Error in fetchClientIP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (ip: string) => {
    if (!ip.trim()) {
      setError('Please enter a valid IP address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await lookupIP(ip);
      setIpInfo(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch IP information';
      setError(errorMessage);
      setIpInfo(null);
      console.error('Error in handleLookup:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
        <Container>
          <Navbar.Brand href="/" className="fw-bold">ISP Info</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#api" className="me-3">API</Nav.Link>
              <Nav.Link href="#pricing" className="me-3">Pricing</Nav.Link>
              <Nav.Link href="#docs" className="me-3">Docs</Nav.Link>
              <Nav.Link href="https://github.com/yourusername/ispinfo" target="_blank" rel="noopener noreferrer">
                <FaGithub className="me-1" /> GitHub
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="flex-grow-1 py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">IP Address Information</h1>
            <p className="lead text-muted">Lookup any IP address or domain to get detailed information about its location, ISP, and more.</p>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <IPLookup onLookup={handleLookup} loading={loading} />
            </div>
          </div>

          {error && (
            <div className="row justify-content-center mb-4">
              <div className="col-lg-8">
                <Alert 
                  variant="danger" 
                  onClose={() => setError(null)} 
                  dismissible
                >
                  {error}
                </Alert>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Fetching IP information...</p>
            </div>
          ) : ipInfo ? (
            <div className="row justify-content-center">
              <div className="col-12">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k || 'details')}
                  className="mb-4"
                  id="ip-details-tabs"
                >
                  <Tab eventKey="details" title="Details">
                    <div className="mt-4">
                      <IPDetails ipInfo={ipInfo} />
                    </div>
                  </Tab>
                  <Tab eventKey="map" title="Map">
                    <div className="mt-4">
                      <IPMap ipInfo={ipInfo} />
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          ) : null}
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <h5>ISP Info</h5>
              <p className="text-muted mb-0">
                Free IP geolocation and network information lookup service.
              </p>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <h5>Links</h5>
              <ul className="list-unstyled">
                <li><a href="#api" className="text-decoration-none text-muted">API</a></li>
                <li><a href="#pricing" className="text-decoration-none text-muted">Pricing</a></li>
                <li><a href="#docs" className="text-decoration-none text-muted">Documentation</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Connect</h5>
              <div className="d-flex gap-3">
                <a href="https://github.com/yourusername/ispinfo" target="_blank" rel="noopener noreferrer" className="text-muted">
                  <FaGithub size={20} />
                </a>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-muted">
                  <FaTwitter size={20} />
                </a>
                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-muted">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          <hr className="my-4 bg-secondary" />
          <div className="text-center text-muted">
            <small> 2023 ISP Info. All rights reserved.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
