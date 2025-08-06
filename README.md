# Smart Chef - AI-Powered Meal Planning Application

Smart Chef is a full-stack web application that leverages AI to help you generate recipes, plan meals, and create organized grocery lists. Designed for home cooks and food enthusiasts, it streamlines your kitchen experience with smart automation and a beautiful, responsive interface.

---

## ✨ Features
- **AI Recipe Generation:** Instantly create recipes based on your available ingredients and preferences using Google Gemini AI.
- **Smart Meal Planning:** Plan your weekly meals with a drag-and-drop interface and automatic scheduling.
- **Automated Grocery Lists:** Generate categorized grocery lists from your meal plans or recipes.
- **User Authentication:** Secure login and registration with JWT.
- **Personalized Recommendations:** Get suggestions tailored to your dietary needs and cooking style.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.

---

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios
- React Router

**Backend:**
- Node.js (Express)
- MongoDB (Mongoose)
- JWT Authentication
- Google Gemini AI API

**Deployment:**
- Frontend: Netlify, Vercel, or any static host
- Backend: Render.com, Railway, Heroku, or any Node.js host
- Database: MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vbhargavbtk/SmartChef.git
   cd SmartChef
   ```
2. **Install dependencies:**
   ```bash
   # Frontend
   cd client && npm install
   # Backend
   cd ../server && npm install
   ```
3. **Set up environment variables:**
   - Copy `client/env.example` to `client/.env` and fill in your values
   - Copy `server/env.example` to `server/.env` and fill in your values
4. **Run the application locally:**
   ```bash
   # Backend (from server directory)
   npm run dev
   # Frontend (from client directory)
   npm run dev
   ```

---

## 📁 Project Structure
```
Smart Chef/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── env.example
├── server/                 # Backend Node.js app
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic
│   ├── server.js
│   └── env.example
└── README.md
```

---

## 🔧 API Endpoints (Backend)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/recipes/generate` - Generate AI recipes
- `GET /api/meal-plan` - Get meal plans
- `POST /api/meal-plan` - Create meal plan
- `GET /api/grocery-list` - Get grocery lists
- `POST /api/grocery-list` - Create grocery list

---

## 🌐 Deployment

### Frontend (Netlify Example)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com`

### Backend (Render.com Example)
1. Create a new Web Service
2. Connect your GitHub repository
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Configure environment variables

> **Tip:** You can deploy to any platform that supports Node.js and static hosting. See the deployment checklist for more options.

---

## 📝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 🙏 Acknowledgments
- Google Gemini AI for recipe generation
- MongoDB Atlas for database hosting
- Netlify, Vercel, and Render.com for hosting

---

**Smart Chef is production-ready and open for contributions!**

