import { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import type { IPInfo } from '../services/api';

declare global {
  interface Window {
    L: any;
  }
}

interface IPMapProps {
  ipInfo: IPInfo;
}

export default function IPMap({ ipInfo }: IPMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!ipInfo?.loc) return;

    const [lat, lng] = ipInfo.loc.split(',').map(Number);
    
    const loadMap = async () => {
      try {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
        script.crossOrigin = '';
        
        script.onload = () => {
          if (mapRef.current && !mapInstance.current) {
            const L = window.L;
            
            // Initialize map
            mapInstance.current = L.map(mapRef.current).setView([lat, lng], 13);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance.current);
            
            // Add marker
            if (markerRef.current) {
              mapInstance.current.removeLayer(markerRef.current);
            }
            
            markerRef.current = L.marker([lat, lng])
              .addTo(mapInstance.current)
              .bindPopup(`
                <div>
                  <strong>IP:</strong> ${ipInfo.ip}<br>
                  ${[ipInfo.city, ipInfo.region, ipInfo.country].filter(Boolean).join(', ')}
                </div>
              `)
              .openPopup();
          }
        };
        
        document.body.appendChild(script);
        
        return () => {
          // Cleanup
          if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
          }
          document.head.removeChild(link);
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };
    
    loadMap();
  }, [ipInfo]);

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-0" style={{ height: '500px' }}>
        {ipInfo?.loc ? (
          <div 
            ref={mapRef} 
            style={{ 
              width: '100%', 
              height: '100%',
              minHeight: '300px',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d'
            }}
          >
            Loading map...
          </div>
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No location data available for this IP address.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
