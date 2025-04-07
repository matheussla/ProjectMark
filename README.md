# ProjectMark

A robust topic management system with versioning, hierarchical structure, and authentication.

## Features

- Topic versioning system
- Hierarchical topic structure
- JWT-based authentication
- Role-based access control
- SQLite database with Prisma ORM
- Docker support
- TypeScript support

## Prerequisites

- Node.js (v20 or higher)
- Yarn or npm
- Docker and Docker Compose (optional)

## Project Structure

```
src/
├── auth/           # Authentication module
├── config/         # Configuration files
├── shared/         # Shared utilities and middleware
├── topics/         # Topic management module
├── users/          # User management module
└── index.ts        # Application entry point
```

## Setup

### Local Development

1. Install dependencies:
```bash
yarn install
```

2. Generate Prisma client:
```bash
yarn prisma:generate
```

3. Run migrations:
```bash
yarn prisma:migrate
```

4. Run migrations:
```bash
yarn seed
```

5. Start the development server:
```bash
yarn dev
```

### Docker Setup

1. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Topics

#### Create Topic
```bash
POST /topics
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Topic Name",
  "content": "Topic Content",
  "parentTopicId": "optional-parent-id"
}
```

#### Get Topic
```bash
GET /topics/:id
Authorization: Bearer <token>
```

#### Update Topic (Creates new version)
```bash
PUT /topics/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "content": "Updated Content"
}
```

#### Get Topic Versions
```bash
GET /topics/:id/versions
Authorization: Bearer <token>
```

#### Get Topic Hierarchy
```bash
GET /topics/:id/hierarchy
Authorization: Bearer <token>
```

#### Find Shortest Path
```bash
GET /topics/shortest-path/:startId/:endId
Authorization: Bearer <token>
```

### Users

#### Create User
```bash
POST /users
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "user123",
  "role": "VIEWER"
}
```

## Default Users

The system comes with these default users:

1. Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: ADMIN

2. Editor User
   - Email: editor@example.com
   - Password: editor123
   - Role: EDITOR

3. Viewer User
   - Email: viewer@example.com
   - Password: viewer123
   - Role: VIEWER

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

## Database Schema

The system uses the following main models:

- User: Manages authentication and authorization
- Topic: Represents content with versioning
- Resource: Links to external content