import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RecipeGenerator from './pages/RecipeGenerator'
import SavedRecipes from './pages/SavedRecipes'

import GroceryList from './pages/GroceryList'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recipe-generator" 
            element={
              <ProtectedRoute>
                <RecipeGenerator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved-recipes" 
            element={
              <ProtectedRoute>
                <SavedRecipes />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/grocery-list" 
            element={
              <ProtectedRoute>
                <GroceryList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App 