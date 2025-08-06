import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  ChefHat, 
  Calendar, 
  ShoppingCart, 
  Plus, 
  Clock, 
  Heart,
  TrendingUp,
  BookOpen,
  X,
  Users
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    savedRecipes: 0,
    mealPlans: 0,
    groceryLists: 0
  })
  const [recentRecipes, setRecentRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const recipesRes = await axios.get('/api/recipes/saved')

        setStats({
          savedRecipes: recipesRes.data.length,
          mealPlans: 0,
          groceryLists: 0
        })

        setRecentRecipes(recipesRes.data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Don't show error toast for new users with no data
        if (error.response?.status !== 401) {
          toast.error('Failed to load dashboard data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedRecipe) {
        closeRecipeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedRecipe])

  const quickActions = [
    {
      title: 'Generate Recipe',
      description: 'Create a new recipe with AI',
      icon: Plus,
      path: '/recipe-generator',
      color: 'bg-blue-500'
    },

    {
      title: 'Grocery List',
      description: 'Create shopping list',
      icon: ShoppingCart,
      path: '/grocery-list',
      color: 'bg-purple-500'
    }
  ]

  const viewRecipe = (recipe) => {
    console.log('Opening recipe modal:', recipe)
    console.log('Recipe title:', recipe.title)
    console.log('Recipe ingredients:', recipe.ingredients)
    console.log('Recipe instructions:', recipe.instructions)
    setSelectedRecipe(recipe)
  }

  const closeRecipeModal = () => {
    console.log('Closing recipe modal')
    setSelectedRecipe(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Welcome Header */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900">
             Welcome back, {user?.name}! 👋
           </h1>
           
         </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/saved-recipes')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.savedRecipes}</p>
                </div>
              </div>
              <div className="text-blue-600 text-sm font-medium">View All →</div>
            </div>
          </div>



          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grocery Lists</p>
                <p className="text-2xl font-bold text-gray-900">{stats.groceryLists}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Recipes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Recipes</h2>
            {recentRecipes.length > 0 && (
              <button
                onClick={() => navigate('/saved-recipes')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </button>
            )}
          </div>
          <div className="p-6">
            {recentRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentRecipes.map((recipe) => (
                                     <div 
                     key={recipe._id} 
                     className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-orange-200 hover:shadow-md"
                     onClick={() => viewRecipe(recipe)}
                     title="Click to view recipe details"
                   >
                    <div className="flex items-center mb-3">
                      <ChefHat className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.cookTime} mins
                    </div>
                                         <div className="flex items-center text-sm text-gray-600">
                       <TrendingUp className="h-4 w-4 mr-1" />
                       {recipe.difficulty}
                     </div>
                     <div className="mt-3 text-xs text-orange-600 font-medium">
                       Click to view details →
                     </div>
                   </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No recipes saved yet</p>
                <Link
                  to="/recipe-generator"
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Recipe
                </Link>
              </div>
            )}
          </div>
                 </div>
       </div>

               {/* Recipe Modal */}
        {console.log('Modal state - selectedRecipe:', selectedRecipe)}
        {selectedRecipe && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
            onClick={closeRecipeModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
             <div className="p-6 border-b border-gray-200">
               <div className="flex justify-between items-start">
                 <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                 <button
                   onClick={closeRecipeModal}
                   className="text-gray-500 hover:text-gray-700 transition-colors"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>
             </div>

             <div className="p-6">
                               {/* Recipe Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center bg-orange-100 px-4 py-2 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="font-semibold text-orange-800">{selectedRecipe.cookTime || 'N/A'} mins</span>
                  </div>
                  <div className="flex items-center bg-red-100 px-4 py-2 rounded-lg">
                    <Users className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">{selectedRecipe.servings || 'N/A'} servings</span>
                  </div>
                  <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-800 capitalize">{selectedRecipe.difficulty || 'N/A'}</span>
                  </div>
                </div>

                               {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                      selectedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">
                            {typeof ingredient === 'string' 
                              ? ingredient 
                              : `${ingredient.amount} ${ingredient.name}`
                            }
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No ingredients available</p>
                    )}
                  </div>
                </div>

                               {/* Instructions */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                  <div className="space-y-3">
                    {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
                      selectedRecipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{instruction}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No instructions available</p>
                    )}
                  </div>
                </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

export default Dashboard 