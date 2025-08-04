# Smart Chef - Heroku Backend Deployment Guide

This guide will help you deploy your Smart Chef backend to Heroku.

## Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [Git](https://git-scm.com/) installed
- A Heroku account
- Your MongoDB Atlas database ready

## Step 1: Install Heroku CLI

If you haven't installed Heroku CLI yet:

### Windows
```bash
# Download and install from: https://devcenter.heroku.com/articles/heroku-cli
# Or use winget:
winget install --id=Heroku.HerokuCLI
```

### macOS
```bash
brew tap heroku/brew && brew install heroku
```

### Linux
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

## Step 2: Login to Heroku

```bash
heroku login
```

This will open your browser to authenticate with Heroku.

## Step 3: Create a New Heroku App

Navigate to your project directory and create a new Heroku app:

```bash
cd server
heroku create your-smartchef-backend
```

Replace `your-smartchef-backend` with your preferred app name (must be unique across all Heroku apps).

## Step 4: Set Environment Variables

Set up all the required environment variables in Heroku:

```bash
# MongoDB Connection String
heroku config:set MONGO_URI="your_mongodb_atlas_connection_string"

# JWT Secret
heroku config:set JWT_SECRET="your_jwt_secret_key_here"

# Google Gemini API Key
heroku config:set GEMINI_API_KEY="your_gemini_api_key_here"

# Set production environment
heroku config:set NODE_ENV="production"

# Set frontend URL (update this after deploying to Netlify)
heroku config:set FRONTEND_URL="https://your-netlify-domain.netlify.app"
```

### Important Notes:
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string
- Replace `your_jwt_secret_key_here` with a strong secret key
- Replace `your_gemini_api_key_here` with your Google Gemini API key
- Update `FRONTEND_URL` after you deploy your frontend to Netlify

## Step 5: Deploy to Heroku

### Option A: Deploy from Git (Recommended)

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Heroku deployment"
   ```

2. **Add Heroku remote**:
   ```bash
   heroku git:remote -a your-smartchef-backend
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

### Option B: Deploy using Heroku CLI

```bash
heroku container:push web
heroku container:release web
```

## Step 6: Verify Deployment

1. **Check if the app is running**:
   ```bash
   heroku ps
   ```

2. **View logs**:
   ```bash
   heroku logs --tail
   ```

3. **Test the API**:
   ```bash
   # Test health endpoint
   curl https://your-smartchef-backend.herokuapp.com/api/health
   ```

4. **Open the app in browser**:
   ```bash
   heroku open
   ```

## Step 7: Update Frontend Configuration

After successful deployment, update your frontend environment variable:

1. **Get your Heroku app URL**:
   ```bash
   heroku info
   ```

2. **Update Netlify environment variable**:
   - Go to your Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Update `VITE_API_URL` to: `https://your-smartchef-backend.herokuapp.com`

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   heroku logs --tail
   
   # Common fixes:
   # - Ensure all dependencies are in package.json
   # - Check Node.js version compatibility
   # - Verify all environment variables are set
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Check if MONGO_URI is set correctly
   heroku config:get MONGO_URI
   
   # Test MongoDB connection
   heroku run node -e "console.log(process.env.MONGO_URI)"
   ```

3. **CORS Issues**
   - Ensure `FRONTEND_URL` is set correctly in Heroku
   - Check that your Netlify domain is allowed in CORS configuration

4. **App Crashes**
   ```bash
   # Check recent logs
   heroku logs --tail
   
   # Restart the app
   heroku restart
   ```

### Useful Heroku Commands

```bash
# View all environment variables
heroku config

# View specific environment variable
heroku config:get VARIABLE_NAME

# Set environment variable
heroku config:set VARIABLE_NAME="value"

# View app logs
heroku logs --tail

# Open app in browser
heroku open

# Restart app
heroku restart

# Scale dynos (if needed)
heroku ps:scale web=1

# Check app status
heroku ps
```

## Environment Variables Checklist

Make sure these are set in Heroku:
- ✅ `MONGO_URI` - Your MongoDB Atlas connection string
- ✅ `JWT_SECRET` - A strong secret key for JWT tokens
- ✅ `GEMINI_API_KEY` - Your Google Gemini API key
- ✅ `NODE_ENV` - Set to "production"
- ✅ `FRONTEND_URL` - Your Netlify frontend URL

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data to your repository
2. **JWT Secret**: Use a strong, random secret key
3. **MongoDB**: Use MongoDB Atlas with proper authentication
4. **API Keys**: Keep your API keys secure and rotate them regularly
5. **HTTPS**: Heroku provides SSL certificates automatically

## Monitoring and Maintenance

1. **Enable Heroku Add-ons** (optional):
   ```bash
   # Add logging service
   heroku addons:create papertrail:choklad
   
   # Add monitoring
   heroku addons:create newrelic:wayne
   ```

2. **Set up automatic deployments**:
   - Connect your GitHub repository to Heroku
   - Enable automatic deploys from your main branch

3. **Monitor your app**:
   - Use `heroku logs --tail` to monitor real-time logs
   - Set up alerts for app crashes or high error rates

## Cost Optimization

- **Free Tier**: Heroku no longer offers a free tier
- **Basic Dyno**: Starts at $7/month for basic dyno
- **Hobby Dyno**: $7/month for hobby dyno
- **Standard Dyno**: $25/month for standard dyno

## Support

If you encounter issues:
1. Check Heroku's documentation
2. Review logs with `heroku logs --tail`
3. Test locally with `npm start`
4. Verify all environment variables are set correctly
5. Check MongoDB Atlas connection and network access 