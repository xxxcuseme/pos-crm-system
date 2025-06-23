#!/bin/bash

# Railway deployment script for POS CRM Backend
echo "🚀 Starting Railway deployment script..."

# Ensure we're in the correct directory
cd apps/backend

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed database with initial data (only if RAILWAY_ENVIRONMENT is production)
if [ "$RAILWAY_ENVIRONMENT" = "production" ] && [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Seeding database with initial data..."
  npm run db:seed
fi

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment script completed successfully!"

# Start the application
echo "🎯 Starting application..."
exec node dist/main.js 