-- IP-to-ASN mapping table
CREATE TABLE asn_blocks (
  start_ip_num INTEGER NOT NULL,
  end_ip_num INTEGER NOT NULL,
  asn INTEGER NOT NULL,
  as_organization TEXT
);
CREATE INDEX idx_asn_blocks_ip_range ON asn_blocks (start_ip_num, end_ip_num);

-- IP-to-City mapping table
CREATE TABLE city_blocks (
  start_ip_num INTEGER NOT NULL,
  end_ip_num INTEGER NOT NULL,
  geoname_id INTEGER,
  postal_code TEXT,
  latitude REAL,
  longitude REAL
);
CREATE INDEX idx_city_blocks_ip_range ON city_blocks (start_ip_num, end_ip_num);

-- Geoname ID to Location details mapping table
CREATE TABLE city_locations (
  geoname_id INTEGER PRIMARY KEY,
  locale_code TEXT,
  continent_code TEXT,
  continent_name TEXT,
  country_iso_code TEXT,
  country_name TEXT,
  city_name TEXT
);
CREATE INDEX idx_city_locations_geoname_id ON city_locations (geoname_id);
