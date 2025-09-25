#!/bin/bash

echo "🚀 Setting up E-commerce API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL v13 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
echo "📝 Setting up environment variables..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update .env file with your database credentials"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Run: npm run prisma:migrate"
echo "3. Run: npm run prisma:seed"
echo "4. Run: npm run start:dev"
echo ""
echo "API will be available at: http://localhost:3000"
echo "Documentation will be available at: http://localhost:3000/api/v1/docs"
