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
## Features - REST API for integration and orchestration - Scalable Node.js backend
