import { Card, Row, Col, Alert } from 'react-bootstrap';
import type { IPInfo } from '../services/api';

interface IPDetailsProps {
  ipInfo: IPInfo;
}

export default function IPDetails({ ipInfo }: IPDetailsProps) {
  // Show error message if there's an error
  if (ipInfo.error) {
    return (
      <Alert variant="danger" className="mt-4">
        <h5>Error</h5>
        <p className="mb-1">{ipInfo.error}</p>
        {ipInfo.note && <p className="mb-0">Note: {ipInfo.note}</p>}
      </Alert>
    );
  }

  // Show informational message if no data is available
  if (ipInfo.message) {
    return (
      <Alert variant="info" className="mt-4">
        <h5>Information</h5>
        <p className="mb-1">{ipInfo.message}</p>
        {ipInfo.note && <p className="mb-0">Note: {ipInfo.note}</p>}
      </Alert>
    );
  }

  return (
    <div className="ip-details mt-4">
      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">IP Address Information</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><strong>IP Address:</strong> {ipInfo.ip}</li>
                <li className="mb-2"><strong>City:</strong> {ipInfo.city_name || 'N/A'}</li>
                <li className="mb-2"><strong>Region:</strong> {ipInfo.region_name || 'N/A'}</li>
                <li className="mb-2"><strong>Country:</strong> {ipInfo.country_name || 'N/A'}</li>
                <li className="mb-2"><strong>Postal Code:</strong> {ipInfo.postal_code || 'N/A'}</li>
                <li className="mb-2">
                  <strong>Coordinates:</strong> 
                  {ipInfo.latitude && ipInfo.longitude 
                    ? `${ipInfo.latitude}, ${ipInfo.longitude}` 
                    : 'N/A'}
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Network Information</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><strong>ASN:</strong> {ipInfo.asn || 'N/A'}</li>
                <li className="mb-2">
                  <strong>Organization:</strong> {ipInfo.as_organization || 'N/A'}
                </li>
                <li className="mb-2">
                  <strong>Location:</strong> {[
                    ipInfo.city_name, 
                    ipInfo.region_name, 
                    ipInfo.country_name
                  ].filter(Boolean).join(', ') || 'N/A'}
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {process.env.NODE_ENV === 'development' && (
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Raw Data</h5>
              </Card.Header>
              <Card.Body>
                <pre className="mb-0" style={{ fontSize: '0.8rem' }}>
                  {JSON.stringify(ipInfo, null, 2)}
                </pre>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {ipInfo.note && (
        <Alert variant="info" className="mt-3">
          <p className="mb-0">Note: {ipInfo.note}</p>
        </Alert>
      )}
    </div>
  );
}
