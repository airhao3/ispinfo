# Public Directory

This directory contains static files that will be served directly by the web server.

## Files

- `robots.txt`: Instructions for web crawlers about which pages to index
- `sitemap.xml`: Sitemap to help search engines discover all pages on the site
- `og-image.jpg`: Social media sharing image (to be added)

## Adding New Files

1. Place static assets like images, fonts, or other files in this directory
2. Reference them in your code using the root path, e.g., `/robots.txt`
3. The files will be copied to the root of the build output directory during the build process
