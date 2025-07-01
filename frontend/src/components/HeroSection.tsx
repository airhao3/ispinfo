import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner, Card } from 'react-bootstrap';
import './HeroSection.css';

interface IpInfo {
  ip: string;
  hostname?: string; // Make optional as it might not always be returned
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  asn?: { asn: number; as_organization: string } | null;
  location?: {
    geoname_id: number;
    postal_code: string;
    latitude: number;
    longitude: number;
    country_iso_code: string;
    country_name: string;
    city_name: string;
    continent_name: string;
  } | null;
}


const HeroSection: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch IP info from backend
  const fetchIpInfo = async (ip: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ip/${ip}`); // Assuming API is at /api/ip
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: IpInfo = await response.json();
      setResults(data);
    } catch (e: any) {
      setError(`Failed to fetch IP info: ${e.message}`);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's own IP on load
  useEffect(() => {
    // Fetch user's own IP. In a real scenario, you'd have a dedicated endpoint for this.
    // For now, we'll simulate fetching a common public IP.
    fetchIpInfo('8.8.8.8'); // Example: Google DNS
  }, []);

  const handleSearch = async () => {
    if (!ipAddress) {
      setError('Please enter an IP address or domain.');
      return;
    }
    fetchIpInfo(ipAddress);
  };

  return (
    <section className="hero-section d-flex align-items-center justify-content-center text-center">
      <Container>
        <h1 className="display-4 fw-bold mb-3">Accurate IP address data for any application</h1>
        <p className="lead text-muted mb-5">
          Powering thousands of businesses and developers with our industry-leading IP data.
        </p>

        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="input-group input-group-lg shadow-sm">
                <Form.Control
                  type="text"
                  placeholder="Search for any IP address, domain, or ASN"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  aria-label="IP Address or Domain"
                />
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Search'}
                </Button>
              </div>
            </Form>
          </div>
        </div>

        {isLoading && !results && !error && (
          <div className="text-center mt-4">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        )}

        {results && (
          <Card className="ip-info-card mt-5 p-4 shadow-sm rounded">
            <Card.Body>
              <h4 className="mb-3">Your IP address is: <span className="text-primary">{results.ip}</span></h4>
              <div className="row text-start">
                <div className="col-md-6">
                  <p><strong>Geolocation:</strong> {results.location?.city_name}, {results.location?.continent_name}, {results.location?.country_name} <img src={`https://flagcdn.com/w20/${results.location?.country_iso_code?.toLowerCase()}.png`} alt={results.location?.country_name} /></p>
                  <p><strong>ASN:</strong> {results.asn?.asn} {results.asn?.as_organization}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Company:</strong> {results.asn?.as_organization || 'N/A'}, Business</p>
                  <p><a href="#" className="link-primary">See all details &rarr;</a></p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </section>
  );
};

export default HeroSection;