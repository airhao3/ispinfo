# ispinfo.io Clone

This project is a clone of `ispinfo.io`, providing IP address and ASN information lookup services. It leverages Cloudflare's serverless ecosystem (Workers, D1, Pages) for development and deployment, and uses the open-source GeoLite2 database as the core data source.

## Technologies Used

*   **Data Source:** MaxMind GeoLite2 (free version)
*   **Database:** Cloudflare D1
*   **Backend API:** Cloudflare Worker (TypeScript)
*   **Frontend Framework:** React (built with Vite) + TypeScript
*   **UI Styling:** Bootstrap
*   **Deployment:** Cloudflare Worker (integrated frontend and backend deployment)

## Project Structure

*   `backend/`: Contains the Cloudflare Worker backend, D1 database schema, and data import scripts.
*   `frontend/`: Contains the React frontend application.

## Setup and Local Development

### Prerequisites

*   Node.js (LTS recommended)
*   npm (Node Package Manager)
*   Cloudflare Wrangler CLI (`npm install -g wrangler`)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ispinfo.io
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Cloudflare D1

Ensure your `wrangler.jsonc` is configured with your D1 database details. The `database_id` should match your Cloudflare D1 database ID.

#### Import Data

(Instructions for importing GeoLite2 data into D1 will go here once the data pipeline is finalized.)

#### Generate Worker Types

```bash
npm run cf-typegen
```

### 3. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Build Frontend for Backend Integration

This command builds the frontend and copies the output to `backend/public`.

```bash
npm run build
```

### 4. Run Locally

Navigate back to the `backend` directory:

```bash
cd ../backend
```

Start the local development server:

```bash
npm run dev
```

Once the server is running, you can access the application in your browser at the URL provided by Wrangler (e.g., `http://localhost:8787`).

## API Endpoints

*   **`/ip`**: Returns the client's own IP address.
*   **`/{ip}`**: Returns detailed information (ASN, organization, city, country, etc.) for the specified IP address.
    *   **Browser:** Returns JSON data.
    *   **Command Line (e.g., `curl`):** Returns plain text for easier readability.

## Deployment

(Instructions for deploying to Cloudflare will go here once local development is stable.)

## Future Enhancements

*   Automated monthly data updates from MaxMind.
*   Improved error handling and logging.
*   More comprehensive frontend features and UI/UX improvements.
