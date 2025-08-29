#!/bin/bash

echo "🚀 Starting deployment process for Gearup4..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ CLI tools are ready"

# Backend deployment
echo "🔧 Deploying backend to Railway..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one based on env.example"
    echo "   Then run this script again."
    exit 1
fi

# Deploy to Railway
echo "📤 Deploying to Railway..."
railway up

# Get Railway URL
echo "🔍 Getting Railway app URL..."
RAILWAY_URL=$(railway status | grep -o 'https://[^[:space:]]*' | head -1)
echo "✅ Backend deployed at: $RAILWAY_URL"

cd ..

# Frontend deployment
echo "🌐 Deploying frontend to Vercel..."
cd frontend

# Update .env with Railway URL
if [ -f .env ]; then
    sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$RAILWAY_URL|" .env
    echo "✅ Updated frontend .env with backend URL"
fi

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

cd ..

echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "   1. Set environment variables in Railway dashboard"
echo "   2. Set environment variables in Vercel dashboard"
echo "   3. Update CORS_ORIGIN in Railway with your Vercel domain"
echo "   4. Test your deployed application" 