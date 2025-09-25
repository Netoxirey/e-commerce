# 🛒 E-commerce Application

A modern, full-stack e-commerce application built with **Next.js** (frontend) and **NestJS** (backend), featuring a unified deployment where NestJS serves both the API and static frontend files.

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and Redux Toolkit
- **Backend**: NestJS with TypeScript, Prisma ORM, and PostgreSQL
- **Database**: PostgreSQL with Redis for caching
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Single NestJS server serving both API and static files

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp env.example .env
   cp server/env.example server/.env
   cp client/env.local.example client/.env.local
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start backend
   cd server && npm run start:dev
   
   # Terminal 2: Start frontend
   cd client && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api/v1
   - API Documentation: http://localhost:3000/api/v1/docs

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production with Docker

```bash
# Build and start production environment
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🏭 Production Build

### Option 1: Unified NestJS Server (Recommended)

This approach builds the Next.js app as static files and serves them through NestJS:

```bash
# Build everything
./build.sh

# Start production server
cd server && npm run start:prod
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/v1
- Documentation: http://localhost:3000/api/v1/docs

### Option 2: Separate Servers

```bash
# Build frontend
cd client && npm run build && npm run start

# Build and start backend
cd server && npm run build && npm run start:prod
```

## 📁 Project Structure

```
e-commerce/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── out/               # Static export (production)
├── server/                # NestJS backend
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── common/        # Shared utilities
│   │   └── config/        # Configuration
│   ├── prisma/            # Database schema & migrations
│   └── dist/              # Compiled JavaScript
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Dockerfile             # Production Docker image
└── build.sh              # Build script
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 🎯 Features

### Frontend
- ✅ Modern React with Next.js 14
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Redux Toolkit for state management
- ✅ Responsive design
- ✅ Authentication flow
- ✅ Shopping cart
- ✅ Order management
- ✅ User profile

### Backend
- ✅ RESTful API with NestJS
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control
- ✅ Database with Prisma ORM
- ✅ Input validation
- ✅ Error handling
- ✅ API documentation with Swagger
- ✅ File upload support
- ✅ Caching with Redis

### Database
- ✅ User management
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Order processing
- ✅ Address management
- ✅ Category management

## 🧪 Testing

```bash
# Backend tests
cd server
npm run test
npm run test:e2e

# Frontend tests
cd client
npm run test
npm run test:coverage
```

## 📚 API Documentation

When the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/v1/docs
- **OpenAPI JSON**: http://localhost:3000/api/v1/docs-json

## 🚀 Deployment

### Vercel (Frontend) + Railway/Heroku (Backend)

1. Deploy backend to Railway/Heroku
2. Deploy frontend to Vercel
3. Update `NEXT_PUBLIC_API_URL` in Vercel

### Single Server Deployment

1. Use the unified build approach
2. Deploy to any Node.js hosting service
3. Set up PostgreSQL and Redis
4. Configure environment variables

### Docker Deployment

```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Check the API documentation at `/api/v1/docs`

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd server && npm update
cd ../client && npm update

# Rebuild
./build.sh
```

---

**Happy coding! 🎉**
