# Smart Chef - AI-Powered Meal Planning Application

A full-stack web application that uses AI to generate recipes, plan meals, and create grocery lists.

## 🚀 Live Application

- **Frontend:** [Deployed on your chosen platform]
- **Backend:** [Deployed on your chosen platform]

## ✨ Features

- **AI Recipe Generation** - Generate recipes based on ingredients or preferences
- **Meal Planning** - Plan your weekly meals
- **Grocery Lists** - Automatically generate shopping lists
- **User Authentication** - Secure login and registration
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Google Gemini AI** for recipe generation

### Deployment
- **Frontend:** Netlify
- **Backend:** Render.com
- **Database:** MongoDB Atlas

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vbhargavbtk/SmartChef.git
   cd SmartChef
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example files and configure them:
   ```bash
   # For server
   cp server/env.example server/.env
   
   # For client
   cp client/env.example client/.env
   ```
   
   Update the `.env` files with your actual values:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `VITE_API_URL`: Your backend API URL (for production)

4. **Run the application**
   ```bash
   # Start backend (from server directory)
   npm run dev
   
   # Start frontend (from client directory)
   npm run dev
   ```

## 📁 Project Structure

```
Smart Chef/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                # Backend Node.js application
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   └── server.js
└── README.md
```

## 🔧 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/recipes/generate` - Generate AI recipes

- `GET /api/grocery-list` - Get grocery lists
- `POST /api/grocery-list` - Create grocery list

## 🚀 Deployment

### Frontend Deployment
You can deploy the frontend to any static hosting platform:

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `cd client && npm install && npm run build`
3. Set publish directory: `client/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

**Vercel:**
1. Connect your GitHub repository
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`

**GitHub Pages:**
1. Set up GitHub Actions workflow
2. Build and deploy to `gh-pages` branch

### Backend Deployment
You can deploy the backend to any Node.js hosting platform:

**Render.com:**
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Configure environment variables

**Railway:**
1. Connect GitHub repository
2. Set root directory: `server`
3. Configure environment variables

**Heroku:**
1. Connect GitHub repository
2. Set buildpack: `heroku/nodejs`
3. Configure environment variables

### Environment Variables for Production
Make sure to set these environment variables in your hosting platform:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your frontend domain (for CORS)

### GitHub Actions (Optional)
For automated deployment, you can set up GitHub Actions workflows. Create `.github/workflows/` directory and add deployment workflows for your preferred hosting platforms.





## 🙏 Acknowledgments

- Google Gemini AI for recipe generation
- MongoDB Atlas for database hosting
- Netlify and Render.com for hosting