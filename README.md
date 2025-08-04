# Smart Chef 🍳

A comprehensive meal planning and recipe generation application built with React, Node.js, and MongoDB.

## 🚀 Features

- **AI-Powered Recipe Generation**: Generate personalized recipes using Google Gemini AI
- **Meal Planning**: Create and manage weekly meal plans
- **Grocery Lists**: Automatically generate shopping lists from meal plans
- **User Authentication**: Secure login and registration system
- **Recipe Management**: Save, edit, and organize your favorite recipes
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google Gemini API
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartchef
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Get API Keys**

   - **MongoDB Atlas**: Create a free cluster and get your connection string
   - **Google Gemini**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your API key

5. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 5173) servers.

## 🌐 Deployment

### Deploying to Netlify

1. **Prepare for deployment**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Base directory: `client`

3. **Environment Variables**
   In Netlify dashboard, add these environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Backend Deployment**
   Deploy your backend to a platform like Heroku, Railway, or Render:
   ```bash
   cd server
   # Follow platform-specific deployment instructions
   ```

### Manual Deployment Steps

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Upload to Netlify**
   - Drag and drop the `client/dist` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=client/dist
   ```

## 📁 Project Structure

```
smartchef/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   ├── package.json
│   └── server.js
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update user preferences

### Recipes
- `POST /api/recipes/generate` - Generate AI recipe
- `POST /api/recipes/save` - Save recipe
- `GET /api/recipes/saved` - Get user's saved recipes
- `GET /api/recipes/:id` - Get specific recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Meal Planning
- `POST /api/meal-plan/save` - Save meal plan
- `GET /api/meal-plan` - Get user's meal plans
- `GET /api/meal-plan/:id` - Get specific meal plan
- `PUT /api/meal-plan/:id` - Update meal plan
- `DELETE /api/meal-plan/:id` - Delete meal plan

### Grocery Lists
- `POST /api/grocery-list/generate` - Generate from meal plan
- `POST /api/grocery-list/from-recipes` - Generate from recipes

## 🎨 Features in Detail

### AI Recipe Generation
- Input available ingredients
- Set dietary preferences (vegan, keto, gluten-free, etc.)
- Choose cuisine type
- Set maximum cook time
- Get AI-generated recipes with ingredients, steps, and nutritional info

### Meal Planning
- Weekly calendar interface
- Drag and drop recipe assignment
- Automatic grocery list generation
- Meal plan templates

### Grocery List Management
- Categorized by store sections (produce, dairy, meat, etc.)
- Quantity aggregation
- Export to PDF
- Share with family members

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy to Netlify with the `client/dist` folder
3. Set environment variables in Netlify dashboard

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

### Database (MongoDB Atlas)
1. Create a free cluster
2. Set up database access
3. Configure network access
4. Get connection string

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Google Gemini AI for recipe generation capabilities
- MongoDB Atlas for database hosting
- The React and Node.js communities for excellent documentation
- All contributors and beta testers

---

**Made with ❤️ for food lovers everywhere** 