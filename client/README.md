# E-commerce Frontend

A modern and scalable ecommerce frontend built with Next.js, TypeScript, and Redux Toolkit that integrates with the Nest.js backend API.

## 🚀 Features

### Core Features
- **Authentication**: JWT-based authentication with secure HttpOnly cookies
- **State Management**: Redux Toolkit for global state management
- **API Integration**: Clean API service layer with Axios
- **Modern UI**: Responsive design with TailwindCSS and Radix UI components
- **Type Safety**: Full TypeScript implementation with strict typing

### Pages and Flows
- **Authentication**: Login, signup, and logout flows
- **Home**: Product listings, categories, and featured products
- **Product Detail**: Product information and add to cart functionality
- **Cart**: View and update cart items
- **Checkout & Orders**: Checkout process and order history
- **User Profile**: Account management and settings

### Best Practices
- **Type Safety**: Typed Redux state, actions, and thunks
- **Error Handling**: Centralized API error handling
- **Testing**: Jest and React Testing Library setup
- **Code Quality**: ESLint and Prettier configuration
- **Component Architecture**: Modular and reusable components

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + Custom components
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── products/         # Product-related components
│   ├── cart/             # Cart components
│   ├── orders/           # Order components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── services/             # API service layer
├── store/                # Redux store
│   ├── slices/          # Redux slices
│   ├── hooks.ts         # Typed Redux hooks
│   └── provider.tsx     # Redux provider
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- The backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   NEXT_PUBLIC_APP_NAME=E-commerce Store
   NEXT_PUBLIC_APP_DESCRIPTION=Modern e-commerce platform
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

## 🔐 Authentication

The frontend integrates with the backend's JWT authentication system:

- **Login**: Email and password authentication
- **Signup**: User registration with validation
- **Token Management**: Automatic token refresh and storage
- **Protected Routes**: Route protection based on authentication status

## 🛒 Shopping Features

- **Product Browsing**: View products with filtering and pagination
- **Product Details**: Detailed product information and reviews
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Complete order process with address management
- **Order History**: View past orders and their status

## 🎨 UI Components

The application uses a comprehensive design system:

- **Base Components**: Button, Input, Card, Badge, etc.
- **Layout Components**: Header, Footer, Sidebar, etc.
- **Feature Components**: ProductCard, CartItem, OrderCard, etc.
- **Responsive Design**: Mobile-first approach with TailwindCSS

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API integration and user flow tests
- **Test Utilities**: Custom render functions and mocks

## 🔧 Configuration

### TailwindCSS
- Custom color palette and design tokens
- Responsive breakpoints and utilities
- Component-specific styles

### TypeScript
- Strict type checking enabled
- Path aliases for clean imports
- Type definitions for all API responses

### Redux Toolkit
- Slices for each feature module
- Async thunks for API calls
- Typed selectors and actions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Make sure to set the following environment variables in production:

```env
NEXT_PUBLIC_API_URL=your_production_api_url
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_DESCRIPTION=Your App Description
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
2. Review the component documentation
3. Open an issue in the repository
