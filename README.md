# ispinfo.io Clone

This project is a clone of `ispinfo.io`, providing IP address and ASN information lookup services. It leverages Cloudflare's serverless ecosystem (Workers, D1, Pages) for development and deployment, and uses the open-source GeoLite2 database as the core data source.

## Technologies Used

*   **Data Source:** ipregistry.co API
*   **Backend API:** Cloudflare Workers (TypeScript) - `ispinfo-gateway-worker` (API Gateway) and `ispinfo-backend-worker` (Dispatcher/Aggregator)
*   **Frontend Framework:** React (built with Vite) + TypeScript
*   **UI Styling:** Bootstrap
*   **Deployment:** Cloudflare Worker (integrated frontend and backend deployment)

## Project Structure

*   `backend/`: Contains the `ispinfo-backend-worker` (Dispatcher/Aggregator) and its related files.
*   `gateway/`: Contains the `ispinfo-gateway-worker` (API Gateway) and its related files.

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

### 2. `ispinfo-backend-worker` Setup (Dispatcher/Aggregator)

Navigate to the `backend` directory:

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Configure API Keys

Before deploying, you need to set your external API keys (e.g., `ipregistry.co`) as Cloudflare Worker secrets. Navigate to the `backend` directory and run the following command for each key, replacing `<YOUR_API_KEY_NAME>` and `<YOUR_API_KEY>` with your actual key details:

```bash
npx wrangler secret put <YOUR_API_KEY_NAME>
```

For example, for ipregistry:

```bash
npx wrangler secret put IPREGISTRY_API_KEY
```

#### Generate Worker Types

```bash
npm run cf-typegen
```

### 3. `ispinfo-gateway-worker` Setup (API Gateway)

Navigate to the `gateway/ispinfo-gateway-worker` directory:

```bash
cd gateway/ispinfo-gateway-worker
```

#### Install Dependencies

```bash
npm install
```

#### Generate Worker Types

```bash
npm run cf-typegen
```

### 4. `ispinfo-frontend-worker` Setup (Frontend Pages)

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Build Frontend for Gateway Integration

This command builds the frontend and copies the output to `gateway/ispinfo-gateway-worker/public`.

```bash
npm run build
```

### 5. Run Locally

Navigate back to the `gateway/ispinfo-gateway-worker` directory:

```bash
cd ../gateway/ispinfo-gateway-worker
```

Start the local development server:

```bash
npm run dev
```

Once the server is running, you can access the application in your browser at the URL provided by Wrangler (e.g., `http://localhost:8787`).

## API Endpoints

*   **`/ip`**: Returns the client's own IP address.
*   **`/{ip}`**: Returns detailed information (ASN, organization, city, country, etc.) for the specified IP address.

## Deployment

To deploy your Workers to Cloudflare, navigate to their respective directories (`backend` and `gateway/ispinfo-gateway-worker`) and run:

```bash
npx wrangler deploy
```

## Future Enhancements

*   Improved error handling and logging.
*   More comprehensive frontend features and UI/UX improvements.
