# ProjectMark

A robust topic management system with versioning, hierarchical structure, and authentication.

## API Documentation

The complete API documentation is available at: [https://projectmark.fly.dev/api-docs](https://projectmark.fly.dev/api-docs)

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
- Fly.io CLI (for deployment)

## Tests

I haven't had time to implement the tests. However, with more time, I would set up [Jest](https://jestjs.io/) for both unit and integration testing. For integration tests, I would mock the necessary data to simulate real-world scenarios and ensure the system behaves correctly. I'd also configure test coverage to validate that all important code paths are thoroughly tested.

In addition, I would use [Husky](https://typicode.github.io/husky) to enforce pre-push hooks that automatically run the test suite before code is pushed to the repository, helping maintain code quality and preventing regressions.

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

The application will be available at `http://localhost:3000`

### OR

### Docker Setup

1. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### OR

### Client Session

To access the API directly without local setup:

1. Visit [https://projectmark.fly.dev/api-docs](https://projectmark.fly.dev/api-docs)
2. Use one of the default users to do the login:
   - Admin: admin@example.com / admin123
   - Editor: editor@example.com / editor123
   - Viewer: viewer@example.com / viewer123
3. Click "Authorize" and enter your credentials
4. Start making API requests using the interactive documentation

### Deployment Summary

The application is deployed on [Fly.io](https://fly.io), a modern platform for running full-stack applications and databases. Key deployment features:

- **Global Edge Network**: Deployed across multiple regions for optimal performance
- **Automatic HTTPS**: SSL/TLS encryption out of the box
- **PostgreSQL Database**: Managed database with automatic backups
- **Zero-Downtime Deployments**: Seamless updates with no service interruption
- **Built-in Monitoring**: Real-time logs and metrics

#### Quick Deployment Steps

1. Install Fly.io CLI and login
2. Launch app with `fly launch`
3. Set environment variables
4. Deploy with `fly deploy`

For detailed deployment instructions, see the [Deployment to Fly.io](#deployment-to-flyio) section below.

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
URL=""
```

## Database Schema

The system uses the following main models:

- User: Manages authentication and authorization
- Topic: Represents content with versioning
- Resource: Links to external content