#!/bin/bash

# Smart Chef Heroku Deployment Script
echo "🚀 Starting Smart Chef Heroku deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "📖 Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Navigate to server directory
cd server

# Get app name from user
echo "📝 Enter your Heroku app name (or press Enter to create a new one):"
read app_name

if [ -z "$app_name" ]; then
    echo "🆕 Creating new Heroku app..."
    heroku create
    app_name=$(heroku apps:info --json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Created app: $app_name"
else
    echo "🔗 Connecting to existing app: $app_name"
    heroku git:remote -a $app_name
fi

# Set environment variables
echo "🔧 Setting up environment variables..."
echo "📝 Please enter your MongoDB Atlas connection string:"
read mongo_uri

echo "📝 Please enter your JWT secret:"
read jwt_secret

echo "📝 Please enter your Google Gemini API key:"
read gemini_key

echo "📝 Please enter your Netlify frontend URL (or press Enter to skip for now):"
read frontend_url

# Set environment variables
heroku config:set MONGO_URI="$mongo_uri"
heroku config:set JWT_SECRET="$jwt_secret"
heroku config:set GEMINI_API_KEY="$gemini_key"
heroku config:set NODE_ENV="production"

if [ ! -z "$frontend_url" ]; then
    heroku config:set FRONTEND_URL="$frontend_url"
fi

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app URL: https://$app_name.herokuapp.com"
    echo ""
    echo "🔍 Testing the API..."
    curl -s https://$app_name.herokuapp.com/api/health
    
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your Netlify VITE_API_URL to: https://$app_name.herokuapp.com"
    echo "2. Test your application"
    echo "3. Monitor logs with: heroku logs --tail -a $app_name"
else
    echo "❌ Deployment failed! Check the logs above."
    exit 1
fi 