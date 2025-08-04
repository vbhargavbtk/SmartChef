# Smart Chef - Railway Backend Deployment Guide

This guide will help you deploy your Smart Chef backend to Railway.

## Prerequisites

- A [Railway](https://railway.app/) account
- Your GitHub repository connected to Railway
- Your MongoDB Atlas database ready
- Google Gemini API key

## Step 1: Sign Up for Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign up with your GitHub account
3. Complete the verification process

## Step 2: Create a New Project

1. **Click "New Project"** in your Railway dashboard
2. **Select "Deploy from GitHub repo"**
3. **Choose your Smart Chef repository**
4. **Select the `server` directory** as the root directory

## Step 3: Configure Environment Variables

After creating the project, go to the **Variables** tab and add these environment variables:

### Required Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartchef
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-google-gemini-api-key-here
NODE_ENV=production
FRONTEND_URL=https://your-netlify-domain.netlify.app
```

### How to Add Variables

1. **Go to your project dashboard**
2. **Click on the "Variables" tab**
3. **Click "New Variable"** for each variable
4. **Add the key-value pairs** as shown above

### Important Notes:
- Replace `mongodb+srv://username:password@cluster.mongodb.net/smartchef` with your actual MongoDB Atlas connection string
- Replace `your-super-secret-jwt-key-here` with a strong secret key
- Replace `your-google-gemini-api-key-here` with your Google Gemini API key
- Update `FRONTEND_URL` after you deploy your frontend to Netlify

## Step 4: Deploy Your Application

1. **Railway will automatically detect your project** and start building
2. **Monitor the build process** in the "Deployments" tab
3. **Wait for the deployment to complete**

### Build Process
Railway will:
- Install Node.js 18
- Install dependencies from `package.json`
- Start your application using `npm start`
- Run health checks on `/api/health`

## Step 5: Get Your Application URL

1. **Go to the "Settings" tab**
2. **Copy your generated domain** (e.g., `https://your-app-name-production.up.railway.app`)
3. **This is your backend API URL**

## Step 6: Update Frontend Configuration

1. **Go to your Netlify dashboard**
2. **Navigate to Site settings > Environment variables**
3. **Update `VITE_API_URL`** to your Railway URL:
   ```
   VITE_API_URL=https://your-app-name-production.up.railway.app
   ```

## Step 7: Test Your Deployment

### Test the Health Endpoint
```bash
curl https://your-app-name-production.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "SmartChef API is running"
}
```

### Test Authentication
```bash
# Test registration
curl -X POST https://your-app-name-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Step 8: Configure Custom Domain (Optional)

1. **Go to the "Settings" tab** in your Railway project
2. **Click "Custom Domains"**
3. **Add your custom domain**
4. **Configure DNS settings** as instructed

## Monitoring and Logs

### View Logs
1. **Go to the "Deployments" tab**
2. **Click on any deployment**
3. **View real-time logs**

### Monitor Performance
1. **Go to the "Metrics" tab**
2. **View CPU, memory, and network usage**
3. **Monitor response times and error rates**

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in the "Deployments" tab
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variable Issues**
   - Double-check all environment variables are set correctly
   - Ensure no extra spaces or quotes in variable values
   - Verify MongoDB connection string format

3. **Application Crashes**
   - Check the application logs
   - Verify all required environment variables are present
   - Test MongoDB connection

4. **CORS Issues**
   - Ensure `FRONTEND_URL` is set correctly
   - Check that your Netlify domain is allowed
   - Verify the CORS configuration in `server.js`

### Debugging Commands

```bash
# Test environment variables
railway run echo $MONGO_URI

# Test MongoDB connection
railway run node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
"

# Check application status
railway status
```

## Environment Variables Checklist

Make sure these are set in Railway:
- ✅ `MONGO_URI` - Your MongoDB Atlas connection string
- ✅ `JWT_SECRET` - A strong secret key for JWT tokens
- ✅ `GEMINI_API_KEY` - Your Google Gemini API key
- ✅ `NODE_ENV` - Set to "production"
- ✅ `FRONTEND_URL` - Your Netlify frontend URL

## Railway Features

### Automatic Deployments
- Railway automatically deploys when you push to your main branch
- You can configure branch-specific deployments
- Preview deployments for pull requests

### Scaling
- Railway automatically scales based on traffic
- You can manually adjust resources in the "Settings" tab
- Pay only for what you use

### Monitoring
- Real-time logs and metrics
- Performance monitoring
- Error tracking and alerting

## Cost Information

Railway pricing is based on usage:
- **Free Tier**: $5 credit per month
- **Pay-as-you-go**: Pay only for resources used
- **Team Plans**: Available for collaboration

### Cost Optimization
- Use the free tier for development
- Monitor resource usage in the "Metrics" tab
- Scale down during low-traffic periods

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data to your repository
2. **JWT Secret**: Use a strong, random secret key
3. **MongoDB**: Use MongoDB Atlas with proper authentication
4. **API Keys**: Keep your API keys secure and rotate them regularly
5. **HTTPS**: Railway provides SSL certificates automatically

## Support

If you encounter issues:
1. Check Railway's documentation
2. Review logs in the "Deployments" tab
3. Test locally with `npm start`
4. Verify all environment variables are set correctly
5. Check MongoDB Atlas connection and network access

## Useful Railway CLI Commands

If you install Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy manually
railway up

# View logs
railway logs

# Open in browser
railway open
``` 