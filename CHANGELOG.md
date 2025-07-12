# Changelog

## 2025-07-03

### Added

- **Website Live with Core Functionality:** The `ispinfo.io` website is now fully deployed and accessible.
- **Automatic Local IP Query:** Upon visiting the site, the user's own IP address is automatically detected and displayed. This enhances user experience by providing immediate relevant information.
- **IP Search Functionality:** Users can now search for any IP address to retrieve detailed information (ASN, organization, city, country, etc.). This was implemented by extending the existing API gateway to handle IP lookup requests and integrating it with the frontend search interface.
- **Cloudflare Caching:** Implemented Cloudflare caching for improved performance and reduced load on the backend. This was achieved by configuring appropriate caching rules within Cloudflare for the deployed Workers and Pages.
- **Cloudflare Turnstile for Abuse Protection:** Integrated Cloudflare Turnstile to protect against automated abuse and bot traffic. This involved adding Turnstile widgets to relevant frontend forms and validating tokens on the backend API endpoints.

### Rationale and Implementation Notes

- **User Experience:** The automatic IP detection and search functionality were prioritized to provide immediate value and utility to users.
- **Performance:** Cloudflare Caching was a natural choice given the Cloudflare ecosystem, significantly speeding up content delivery.
- **Security & Abuse Prevention:** Turnstile was integrated to ensure the service remains robust and available by mitigating potential abuse, especially on search endpoints. The implementation involved minimal changes to the existing frontend and backend, leveraging Cloudflare's built-in capabilities.
