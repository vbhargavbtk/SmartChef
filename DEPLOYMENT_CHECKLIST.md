# Deployment Checklist

## Pre-Deployment Checklist

### Environment Variables
- [ ] MongoDB Atlas connection string configured
- [ ] JWT secret set (use a strong random string)
- [ ] Google Gemini API key configured
- [ ] Frontend API URL pointing to backend
- [ ] CORS settings configured for production domains

### Security
- [ ] All sensitive data moved to environment variables
- [ ] No hardcoded API keys or secrets in code
- [ ] JWT secret is strong and unique
- [ ] CORS properly configured for production

### Database
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Database connection tested
- [ ] Backup strategy in place

### Code Quality
- [ ] All tests passing (if any)
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Input validation in place

## Deployment Steps

### Backend Deployment
1. [ ] Choose hosting platform (Render, Railway, Heroku, etc.)
2. [ ] Connect GitHub repository
3. [ ] Set root directory to `server`
4. [ ] Configure build command: `npm install`
5. [ ] Configure start command: `npm start`
6. [ ] Set all environment variables
7. [ ] Deploy and test API endpoints

### Frontend Deployment
1. [ ] Choose hosting platform (Netlify, Vercel, GitHub Pages, etc.)
2. [ ] Connect GitHub repository
3. [ ] Set build command: `cd client && npm install && npm run build`
4. [ ] Set publish directory: `client/dist`
5. [ ] Configure environment variables
6. [ ] Deploy and test application

## Post-Deployment Testing

### Backend API
- [ ] Health check endpoint working
- [ ] Authentication endpoints working
- [ ] Recipe generation working
- [ ] Database operations working
- [ ] CORS properly configured

### Frontend Application
- [ ] Application loads without errors
- [ ] User registration/login working
- [ ] Recipe generation working
- [ ] All features functional
- [ ] Responsive design working on mobile

### Integration Testing
- [ ] Frontend can communicate with backend
- [ ] Authentication flow working end-to-end
- [ ] Recipe generation working end-to-end
- [ ] Error handling working properly

## Monitoring & Maintenance

### Performance
- [ ] Application response times acceptable
- [ ] Database queries optimized
- [ ] API rate limiting configured

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Regular security updates scheduled

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Uptime monitoring configured

## Troubleshooting

### Common Issues
- CORS errors: Check frontend URL in backend CORS settings
- Database connection: Verify MongoDB Atlas network access
- Build failures: Check Node.js version compatibility
- Environment variables: Ensure all required variables are set

### Useful Commands
```bash
# Test backend locally
cd server && npm start

# Test frontend locally
cd client && npm run dev

# Check build output
cd client && npm run build

# Test production build
cd client && npm run preview
``` 