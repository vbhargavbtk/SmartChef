import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ChefHat, 
  Clock, 
  Users, 
  TrendingUp, 
  Heart,
  Eye,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  X
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [filterCuisine, setFilterCuisine] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchSavedRecipes()
    
    // Check if we have a selected recipe from navigation state
    if (location.state?.selectedRecipe) {
      setSelectedRecipe(location.state.selectedRecipe)
    }
  }, [location.state])

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/recipes/saved')
      setRecipes(response.data)
    } catch (error) {
      console.error('Error fetching saved recipes:', error)
      toast.error('Failed to load saved recipes')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`/api/recipes/${recipeId}`)
      toast.success('Recipe deleted successfully')
      fetchSavedRecipes() // Refresh the list
    } catch (error) {
      console.error('Error deleting recipe:', error)
      toast.error('Failed to delete recipe')
    }
  }

  const viewRecipe = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const closeRecipeModal = () => {
    setSelectedRecipe(null)
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCuisine = filterCuisine === 'all' || recipe.cuisine === filterCuisine
    const matchesDifficulty = filterDifficulty === 'all' || recipe.difficulty === filterDifficulty
    
    return matchesSearch && matchesCuisine && matchesDifficulty
  })

  const uniqueCuisines = [...new Set(recipes.map(recipe => recipe.cuisine))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                Saved Recipes
              </h1>
              <p className="text-gray-600 mt-2">
                Your collection of favorite recipes ({recipes.length} recipes)
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Cuisine Filter */}
            <div className="flex gap-2">
              <select
                value={filterCuisine}
                onChange={(e) => setFilterCuisine(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Cuisines</option>
                {uniqueCuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Delete recipe"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{recipe.cookTime} mins</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                  {recipe.cuisine && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ChefHat className="h-4 w-4 mr-2" />
                      <span>{recipe.cuisine}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => viewRecipe(recipe)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterCuisine !== 'all' || filterDifficulty !== 'all' 
                ? 'No recipes match your filters' 
                : 'No saved recipes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCuisine !== 'all' || filterDifficulty !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by generating some recipes to save them here'}
            </p>
            <button
              onClick={() => navigate('/recipe-generator')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Generate Recipe
            </button>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                  <span className="font-semibold text-orange-800">{selectedRecipe.cookTime} mins</span>
                </div>
                <div className="flex items-center bg-red-100 px-4 py-2 rounded-lg">
                  <Users className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-800">{selectedRecipe.servings} servings</span>
                </div>
                <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800 capitalize">{selectedRecipe.difficulty}</span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        {typeof ingredient === 'string' 
                          ? ingredient 
                          : `${ingredient.amount} ${ingredient.name}`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                <div className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedRecipes 