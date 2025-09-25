# E-commerce API

A modern and scalable ecommerce API built with Nest.js, featuring authentication, product management, shopping cart, and order processing.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based authentication with HttpOnly cookies for secure session handling
- **User Management**: Profile management, address management, and role-based access control
- **Product Management**: CRUD operations for products with categories, inventory tracking, and attributes
- **Shopping Cart**: Add/remove items, update quantities, and cart validation
- **Order Processing**: Checkout flow, payment simulation, and order history
- **Database Management**: Prisma ORM with PostgreSQL support and migrations

### Technical Features
- **RESTful API**: Well-structured endpoints following REST conventions
- **Validation**: Request validation using class-validator and class-transformer
- **Error Handling**: Centralized error handling with custom filters
- **Documentation**: Swagger/OpenAPI documentation for all endpoints
- **Testing**: Unit and integration tests with Jest
- **Code Quality**: ESLint and Prettier for code style enforcement
- **Security**: Helmet for security headers, CORS configuration, and rate limiting

## 🛠️ Tech Stack

- **Framework**: Nest.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── filters/          # Exception filters
│   ├── guards/           # Authentication guards
│   ├── interceptors/     # Response interceptors
│   └── pipes/            # Validation pipes
├── config/               # Configuration
│   └── prisma/          # Database configuration
├── modules/              # Feature modules
│   ├── auth/            # Authentication
│   ├── users/           # User management
│   ├── products/        # Product management
│   ├── cart/            # Shopping cart
│   └── orders/          # Order processing
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── main.ts             # Application entry point
└── app.module.ts       # Root module
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   JWT_REFRESH_EXPIRES_IN="7d"
   NODE_ENV="development"
   PORT=3000
   API_PREFIX="api/v1"
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:
- **Swagger UI**: `http://localhost:3000/api/v1/docs`

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Structure
- **Unit Tests**: Located in `src/tests/unit/`
- **Integration Tests**: Located in `src/tests/integration/`
- **E2E Tests**: Located in `test/`

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:deploy      # Deploy migrations to production
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed the database

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage
```

## 🔐 Authentication

The API uses JWT-based authentication with HttpOnly cookies for refresh tokens.

### User Roles
- **ADMIN**: Full access to all resources
- **SELLER**: Can manage products and view orders
- **CUSTOMER**: Can manage their own profile, cart, and orders

### Authentication Flow
1. **Sign Up**: Create a new user account
2. **Sign In**: Authenticate with email/password
3. **Access Token**: Short-lived token for API requests
4. **Refresh Token**: Long-lived token stored in HttpOnly cookie
5. **Token Refresh**: Use refresh token to get new access token

## 📊 Database Schema

The database includes the following main entities:
- **Users**: User accounts with profiles and addresses
- **Products**: Product catalog with categories and attributes
- **Cart**: Shopping cart with items
- **Orders**: Order processing with items and addresses
- **Categories**: Product categorization with hierarchy
- **Reviews**: Product reviews and ratings

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Secure refresh token storage
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Security Headers**: Helmet for security headers
- **Role-based Access**: Granular permission system

## 🚀 Deployment

### Environment Variables
Make sure to set the following environment variables in production:

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
CORS_ORIGIN=your_frontend_domain
```

### Database Migration
```bash
npm run prisma:deploy
```

### Build and Start
```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:
1. Check the [API Documentation](http://localhost:3000/api/v1/docs)
2. Review the test files for usage examples
3. Open an issue in the repository

## 🔄 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/signin` - Sign in user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Sign out user

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/addresses` - Create address
- `PUT /api/v1/users/addresses/:id` - Update address
- `DELETE /api/v1/users/addresses/:id` - Delete address

### Products
- `GET /api/v1/products` - Get products with filtering
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (Admin/Seller)
- `PUT /api/v1/products/:id` - Update product (Admin/Seller)
- `DELETE /api/v1/products/:id` - Delete product (Admin/Seller)

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create category (Admin/Seller)
- `PUT /api/v1/categories/:id` - Update category (Admin/Seller)
- `DELETE /api/v1/categories/:id` - Delete category (Admin/Seller)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:id` - Update cart item
- `DELETE /api/v1/cart/items/:id` - Remove cart item
- `DELETE /api/v1/cart/clear` - Clear cart

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id/status` - Update order status
- `PUT /api/v1/orders/:id/cancel` - Cancel order
