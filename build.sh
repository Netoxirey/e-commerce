#!/bin/bash

# E-commerce Build Script
# This script builds both the frontend and backend for production

set -e

echo "🚀 Starting E-commerce Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Set environment
export NODE_ENV=production

print_status "Building Frontend (Next.js)..."
cd client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm ci
fi

# Build static export
print_status "Building static export..."
npm run build

print_success "Frontend build completed!"

# Go back to root
cd ..

print_status "Building Backend (NestJS)..."
cd server

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm ci
fi

# Build backend
print_status "Building backend..."
npm run build

print_success "Backend build completed!"

# Go back to root
cd ..

print_success "🎉 Build process completed successfully!"
print_status "To start the application:"
print_status "  cd server && npm run start:prod"
print_status "The frontend will be served at: http://localhost:3000"
print_status "The API will be available at: http://localhost:3000/api/v1"
print_status "Swagger docs at: http://localhost:3000/api/v1/docs"
