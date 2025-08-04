#!/bin/bash

# Smart Chef Deployment Script
echo "🚀 Starting Smart Chef deployment..."

# Navigate to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in: client/dist/"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Deploy your backend to Heroku/Railway/Render"
    echo "2. Upload the 'client/dist' folder to Netlify"
    echo "3. Set VITE_API_URL environment variable in Netlify"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi 