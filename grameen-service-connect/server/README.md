# Grameen Service Connect - Backend Server

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- npm or yarn

### Installation

1. Install dependencies:

```bash
cd server
npm install
```

2. Configure environment variables:
   Copy `.env` file and update with your settings.

3. Start PostgreSQL (using Docker):

```bash
docker-compose up postgres -d
```

Or use Docker for the entire stack:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
npm run db:migrate
```

5. Start development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Service Requests

- `POST /api/requests` - Create new request
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request by ID
- `GET /api/requests/my-requests` - Get user's requests (requires auth)
- `PATCH /api/requests/:id/status` - Update request status (requires volunteer/admin)

### Messages

- `POST /api/messages` - Send contact message
- `GET /api/messages` - Get all messages (admin only)

### Users

- `PUT /api/users/profile` - Update user profile (requires auth)

## Docker Commands

Start all services:

```bash
docker-compose up -d
```

Stop all services:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f server
```

Rebuild containers:

```bash
docker-compose up -d --build
```
