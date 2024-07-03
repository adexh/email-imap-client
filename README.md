# Email IMAP Client

This project is a monorepo for an Email IMAP Client that fetches emails and loads them into Elasticsearch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Running the Project](#running-the-project)
- [Building the Project](#building-the-project)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [Docker](https://www.docker.com/) (v20 or later)
- [Docker Compose](https://docs.docker.com/compose/) (v1.27 or later)
- [Azure Portal Registered App](https://learn.microsoft.com/en-us/graph/auth-register-app-v2#register-an-application)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/email-imap-client.git
cd email-imap-client
```

2. Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix packages/shared-types
npm install --prefix frontend
```

## Docker Setup

### Environment Variables

Create a `.env` file in the root directory and configure the following environment variables:
This file is for docker-compose

```
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database
POSTGRES_PORT=5432

REDIS_PASSWORD=your_redis_password

ELASTIC_USER=your_elastic_user
ELASTIC_PASS=your_elastic_Pass
```

### Ensure Docker is running on your machine. Then, run the following command to start the services:

```bash
docker-compose up -d
```

### Elastic Search script
Run the script from script folder in the root `elasticIndex.sh` to add the indices

## Running the Project

### Environment Variables backend

Create a `.env` file in the `./backend` directory and configure the following environment variables:

```
AUTH_SECRET=some_secret_text

POSTGRES_USER= dbuser
POSTGRES_PASSWORD= dbpass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB= emaildb

REDIS_PASSWORD= redispass

ELASTIC_NODE= http://localhost:9200
ELASTIC_USER= elastic
ELASTIC_PASS= elasticPass

CLIENT_ID=your_app_client_id
REDIRECT_URI=http://localhost:5173/emailLink (This must be same from the app registration)
CLIENT_SECRET=your_secret
```

Create a `.env` file in the `./frontend` directory and configure the following environment variables:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

To run the backend:

```bash
cd backend
npm run dev
```

To run the frontend:

```bash
cd frontend
npm run dev
```

## Building the Project

1. Build shared-types:

```bash
cd packages/shared-types
npm run build
```

2. Build the backend:

```bash
cd backend
npm run build
```

3. Build the frontend:

```bash
cd frontend
npm run build
```

## Additional Information

- Ensure that the symlinks for `shared-types` are properly created in the `node_modules` folder.
- If you encounter issues with imports, verify that the `tsconfig.json` and `vite.config.js` files are correctly configured.

---

This README should provide a clear guide for setting up and running your project. Let me know if you need any further adjustments or additional information!