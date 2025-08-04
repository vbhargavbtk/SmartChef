# Smart Chef Deployment Script for Windows
Write-Host "🚀 Starting Smart Chef deployment..." -ForegroundColor Green

# Navigate to client directory
Set-Location client

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "📁 Build files are in: client/dist/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy your backend to Heroku/Railway/Render" -ForegroundColor White
    Write-Host "2. Upload the 'client/dist' folder to Netlify" -ForegroundColor White
    Write-Host "3. Set VITE_API_URL environment variable in Netlify" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed! Please check the error messages above." -ForegroundColor Red
    exit 1
} 