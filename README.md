# IG Hub

## Overview
IG Hub is a microservice in the Aku platform ecosystem. It provides integration, orchestration, and gateway services for connecting internal and external systems.

## Features
- REST API for integration and orchestration
- Scalable Node.js backend

## Getting Started

### Prerequisites
- Node.js 20+
- Docker (optional)

### Development
```bash
git clone <repo-url>
cd IGHub
npm install
npm run dev
```

### Docker
```bash
docker build -t ig-hub:latest .
docker run -p 8080:8080 ig-hub:latest
```

### Testing
```bash
npm test
```

## Deployment
See `.github/workflows/ci.yml` for CI/CD pipeline.

## License
MIT
# Aku-IGHub

**Aku IG Hub** is a microservice in the Aku platform ecosystem. It provides integration, orchestration, and gateway services for connecting internal and external systems.

## Features

- **Integration Management** – Register and manage connectors to external HTTP, webhook, and gRPC services
- **Orchestration** – Define and execute multi-step workflows across integrated services with dependency resolution
- **API Gateway** – Route and proxy HTTP requests to downstream internal or external services
- **Authentication** – API key-based access control
- **REST API** – Full CRUD operations on all resources
- **Scalable Node.js backend** – Built with TypeScript and Express

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

| Variable    | Default         | Description                  |
|-------------|-----------------|------------------------------|
| `PORT`      | `3000`          | HTTP server port             |
| `NODE_ENV`  | `development`   | Environment name             |
| `API_KEY`   | `dev-api-key`   | API key for authentication   |
| `LOG_LEVEL` | `info`          | Log level                    |

### Running

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

### Docker

```bash
docker-compose up --build
```

## API Reference

All API endpoints are prefixed with `/api/v1`. Protected endpoints require the `x-api-key` header.

### Health

| Method | Path              | Description   |
|--------|-------------------|---------------|
| GET    | `/api/v1/health`  | Health check  |

### Integrations

| Method | Path                        | Description               |
|--------|-----------------------------|---------------------------|
| GET    | `/api/v1/integrations`      | List all integrations     |
| POST   | `/api/v1/integrations`      | Create an integration     |
| GET    | `/api/v1/integrations/:id`  | Get an integration        |
| PUT    | `/api/v1/integrations/:id`  | Update an integration     |
| DELETE | `/api/v1/integrations/:id`  | Delete an integration     |

#### Create Integration Body

```json
{
  "name": "Payment Service",
  "type": "http",
  "baseUrl": "https://payments.example.com",
  "authType": "bearer",
  "authValue": "token123"
}
```

### Orchestration

| Method | Path                                          | Description             |
|--------|-----------------------------------------------|-------------------------|
| GET    | `/api/v1/orchestration/workflows`             | List workflows          |
| POST   | `/api/v1/orchestration/workflows`             | Create a workflow       |
| GET    | `/api/v1/orchestration/workflows/:id`         | Get a workflow          |
| DELETE | `/api/v1/orchestration/workflows/:id`         | Delete a workflow       |
| POST   | `/api/v1/orchestration/workflows/:id/execute` | Execute a workflow      |
| GET    | `/api/v1/orchestration/executions/:id`        | Get execution status    |

#### Create Workflow Body

```json
{
  "name": "Order Processing",
  "description": "Process an order across multiple services",
  "steps": [
    {
      "id": "check-inventory",
      "name": "Check Inventory",
      "integrationId": "<integration-id>",
      "method": "GET",
      "path": "/inventory/check"
    },
    {
      "id": "charge-payment",
      "name": "Charge Payment",
      "integrationId": "<integration-id>",
      "method": "POST",
      "path": "/payments/charge",
      "dependsOn": ["check-inventory"]
    }
  ]
}
```

### Gateway

| Method | Path                         | Description              |
|--------|------------------------------|--------------------------|
| GET    | `/api/v1/gateway/routes`     | List gateway routes      |
| POST   | `/api/v1/gateway/routes`     | Create a gateway route   |
| GET    | `/api/v1/gateway/routes/:id` | Get a gateway route      |
| DELETE | `/api/v1/gateway/routes/:id` | Delete a gateway route   |
| ALL    | `/api/v1/gateway/proxy/*`    | Proxy a request          |

#### Create Gateway Route Body

```json
{
  "name": "Users Service",
  "matchPath": "/users",
  "targetUrl": "https://users.internal.example.com",
  "stripPrefix": true,
  "methods": ["GET", "POST"]
}
```

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Building

```bash
npm run build
```

## Architecture

```
src/
├── app.ts                    # Express application factory
├── index.ts                  # Server entry point
├── config/
│   └── index.ts              # Configuration
├── controllers/              # Request handlers
├── services/                 # Business logic
├── routes/                   # Route definitions
├── middleware/               # Express middleware
└── types/
    └── index.ts              # TypeScript types
```

## License

MIT
