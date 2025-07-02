import { useState, useEffect } from 'react';
import { getMyIP, lookupIP } from './services/api';
import type { IPInfo } from './services/api';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';

function App() {
  const [clientIpInfo, setClientIpInfo] = useState<IPInfo | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);

  const [searchIp, setSearchIp] = useState('');
  const [searchIpInfo, setSearchIpInfo] = useState<IPInfo | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientIP();
  }, []);

  const fetchClientIP = async () => {
    try {
      setClientLoading(true);
      setClientError(null);
      const info = await getMyIP();
      setClientIpInfo(info);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch your IP information';
      setClientError(errorMessage);
      setClientIpInfo(null);
      console.error('Error in fetchClientIP:', err);
    } finally {
      setClientLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchIp) {
      setSearchError('Please enter an IP address.');
      setSearchIpInfo(null);
      return;
    }
    try {
      setSearchLoading(true);
      setSearchError(null);
      const info = await lookupIP(searchIp);
      setSearchIpInfo(info);
    } catch (err: any) {
      const errorMessage = err?.message || `Failed to lookup IP: ${searchIp}`;
      setSearchError(errorMessage);
      setSearchIpInfo(null);
      console.error('Error in handleSearch:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">IP Information Lookup</h1>

      {/* Client IP Information */}
      <Card className="mb-4">
        <Card.Header>Your IP Information</Card.Header>
        <Card.Body>
          {clientLoading && <Spinner animation="border" size="sm" className="me-2" />}
          {clientLoading && !clientIpInfo && <p>Loading your IP information...</p>}
          {clientError && <Alert variant="danger">{clientError}</Alert>}
          {clientIpInfo && (
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(clientIpInfo, null, 2)}
            </pre>
          )}
        </Card.Body>
      </Card>

      {/* IP Lookup Form */}
      <Card className="mb-4">
        <Card.Header>Lookup IP Address</Card.Header>
        <Card.Body>
          <Form>
            <Row className="align-items-end">
              <Col md={9}>
                <Form.Group controlId="formIpAddress">
                  <Form.Label>IP Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                    value={searchIp}
                    onChange={(e) => setSearchIp(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Button variant="primary" onClick={handleSearch} disabled={searchLoading}>
                  {searchLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
          {searchError && <Alert variant="danger" className="mt-3">{searchError}</Alert>}
          {searchIpInfo && (
            <div className="mt-3">
              <h5>Lookup Result for {searchIp}:</h5>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(searchIpInfo, null, 2)}
              </pre>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;