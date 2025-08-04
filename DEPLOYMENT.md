# Smart Chef - Netlify Deployment Guide

This guide will help you deploy your Smart Chef application to Netlify.

## Prerequisites

- A GitHub account with your Smart Chef repository
- A Netlify account
- Your backend deployed to a hosting service (Heroku, Railway, Render, etc.)

## Step 1: Deploy Your Backend

Before deploying the frontend, you need to deploy your backend server. Here are some options:

### Option A: Deploy to Heroku
```bash
cd server
# Create a new Heroku app
heroku create your-smartchef-backend

# Add environment variables
heroku config:set MONGO_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GEMINI_API_KEY=your_gemini_api_key
heroku config:set NODE_ENV=production

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Option B: Deploy to Railway
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Select the `server` directory
4. Add environment variables in the Railway dashboard
5. Deploy

### Option C: Deploy to Render
1. Go to [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the root directory to `server`
5. Add environment variables
6. Deploy

## Step 2: Deploy Frontend to Netlify

### Method 1: Connect GitHub Repository (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with your GitHub account

2. **Create New Site from Git**
   - Click "New site from Git"
   - Choose GitHub as your Git provider
   - Select your Smart Chef repository

3. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Add Environment Variables**
   - Go to Site settings > Environment variables
   - Add the following variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-url.com` (replace with your actual backend URL)

5. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Method 2: Manual Upload

1. **Build the Frontend**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Upload to Netlify**
   - Go to Netlify dashboard
   - Drag and drop the `client/dist` folder to the deploy area
   - Your site will be deployed automatically

3. **Configure Environment Variables**
   - Go to Site settings > Environment variables
   - Add `VITE_API_URL` with your backend URL

## Step 3: Configure Custom Domain (Optional)

1. Go to your Netlify site dashboard
2. Navigate to Domain settings
3. Add your custom domain
4. Configure DNS settings as instructed

## Step 4: Test Your Deployment

1. Visit your Netlify site URL
2. Test the following features:
   - User registration and login
   - Recipe generation
   - Meal planning
   - Grocery list generation

## Troubleshooting

### Common Issues

1. **API Calls Failing**
   - Check that `VITE_API_URL` is set correctly in Netlify environment variables
   - Ensure your backend is deployed and accessible
   - Check CORS settings on your backend

2. **Build Failures**
   - Check the build logs in Netlify dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **Routing Issues**
   - The `_redirects` file should handle SPA routing
   - If issues persist, check the `netlify.toml` configuration

### Environment Variables Checklist

Make sure these are set in your backend deployment:
- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `NODE_ENV=production`

Make sure these are set in Netlify:
- `VITE_API_URL`

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **CORS**: Configure your backend to allow requests from your Netlify domain
3. **HTTPS**: Netlify provides SSL certificates automatically
4. **API Keys**: Keep your API keys secure and rotate them regularly

## Performance Optimization

1. **Build Optimization**: The Vite config is already optimized for production
2. **Caching**: Netlify provides automatic caching
3. **CDN**: Your site will be served from Netlify's global CDN

## Monitoring

1. **Analytics**: Enable Netlify Analytics in your dashboard
2. **Forms**: Use Netlify Forms for any contact forms
3. **Functions**: Consider using Netlify Functions for serverless backend features

## Support

If you encounter issues:
1. Check Netlify's documentation
2. Review build logs in the Netlify dashboard
3. Test locally with `npm run build` and `npm run preview`
4. Check browser console for client-side errors 