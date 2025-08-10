# Smart Chef - AI-Powered Meal Planning Application

A full-stack web application that uses AI to generate recipes, plan meals, and create grocery lists.

## ✨ Features

- **AI Recipe Generation** - Generate recipes based on ingredients or preferences
- **Meal Planning** - Plan your weekly meals
- **Grocery Lists** - Automatically generate shopping lists
- **User Authentication** - Secure login and registration
- **Responsive Design** - Works on desktop and mobile

## 🚀 Live Application  [ https://yoursmartchef.netlify.app/ ]

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
   
   Create `server/config.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   NODE_ENV=development
   ```

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
- `GET /api/meal-plan` - Get meal plans
- `POST /api/meal-plan` - Create meal plan
- `GET /api/grocery-list` - Get grocery lists
- `POST /api/grocery-list` - Create grocery list

## 🚀 Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

### Backend (Render.com)
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory: `server`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request



