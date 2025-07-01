import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

interface IPLookupProps {
  onLookup: (ip: string) => Promise<void>;
  loading: boolean;
}

export default function IPLookup({ onLookup, loading }: IPLookupProps) {
  const [ip, setIp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) {
      setError('Please enter an IP address');
      return;
    }
    
    try {
      await onLookup(ip);
      setError('');
    } catch (err) {
      setError('Failed to fetch IP information');
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="input-group">
            <Form.Control
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address or domain"
              className="form-control-lg"
              disabled={loading}
            />
            <Button 
              variant="primary" 
              type="submit"
              className="btn-lg"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
        </Form>
      </Card.Body>
    </Card>
  );
}
