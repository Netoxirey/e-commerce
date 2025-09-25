#!/bin/bash

echo "🚀 Setting up E-commerce Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
echo "📝 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp env.local.example .env.local
    echo "✅ Created .env.local file from template"
    echo "⚠️  Please update .env.local file with your API URL"
else
    echo "✅ .env.local file already exists"
fi

echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Make sure the backend API is running on http://localhost:3000"
echo "2. Update .env.local file if needed"
echo "3. Run: npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:3001"
echo "Make sure the backend is running on port 3000"
