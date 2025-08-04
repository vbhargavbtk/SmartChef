#!/bin/bash

# Smart Chef Railway Deployment Script
echo "🚂 Starting Smart Chef Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    railway login
fi

# Navigate to server directory
cd server

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "🔗 Linking to Railway project..."
    railway link
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    
    # Get the deployment URL
    echo "🌐 Getting deployment URL..."
    DEPLOY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    
    if [ ! -z "$DEPLOY_URL" ]; then
        echo "🌐 Your Railway URL: $DEPLOY_URL"
        echo ""
        echo "🔍 Testing the API..."
        curl -s "$DEPLOY_URL/api/health"
        
        echo ""
        echo "📋 Next steps:"
        echo "1. Update your Netlify VITE_API_URL to: $DEPLOY_URL"
        echo "2. Test your application"
        echo "3. Monitor logs with: railway logs"
    else
        echo "⚠️  Could not retrieve deployment URL. Check Railway dashboard."
    fi
else
    echo "❌ Deployment failed! Check the logs above."
    exit 1
fi 