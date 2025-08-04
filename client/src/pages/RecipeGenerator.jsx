import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  ChefHat, 
  Plus, 
  X, 
  Clock, 
  Users, 
  TrendingUp,
  Save,
  Sparkles,
  Loader2
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const cuisineTypes = [
    'North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Maharashtrian', 'Punjabi',
    'Rajasthani', 'Kashmiri', 'Goan', 'Kerala', 'Hyderabadi', 'Mughlai',
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'French', 
    'Mediterranean', 'American', 'Greek', 'Spanish', 'Korean'
  ]

  const dietaryPreferences = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
    'Paleo', 'Low-Carb', 'High-Protein', 'Low-Sodium'
  ]

  const difficultyLevels = ['Easy', 'Medium', 'Hard']

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()])
      setCurrentIngredient('')
    }
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  const generateRecipe = async (data) => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    setLoading(true)
    try {
      console.log('Generating recipe with data:', {
        ingredients,
        cuisineType: data.cuisineType,
        dietaryPreferences: data.dietaryPreferences || [],
        maxCookTime: data.maxCookTime,
        difficulty: data.difficulty,
        servings: data.servings
      })

      const response = await axios.post('/api/recipes/generate', {
        ingredients,
        cuisineType: data.cuisineType,
        dietaryPreferences: data.dietaryPreferences || [],
        maxCookTime: data.maxCookTime,
        difficulty: data.difficulty,
        servings: data.servings
      })

      console.log('Recipe generation response:', response.data)
      setGeneratedRecipe(response.data.recipe)
      toast.success('Recipe generated successfully!')
    } catch (error) {
      console.error('Error generating recipe:', error)
      toast.error(error.response?.data?.error || 'Failed to generate recipe')
    } finally {
      setLoading(false)
    }
  }

  const saveRecipe = async () => {
    if (!generatedRecipe) return

    setSaving(true)
    try {
      // Convert ingredients to the format expected by the backend
      const ingredients = generatedRecipe.ingredients.map(ingredient => {
        if (typeof ingredient === 'string') {
          return {
            name: ingredient,
            amount: 'as needed',
            category: 'other'
          }
        }
        return ingredient
      })

      await axios.post('/api/recipes/save', {
        title: generatedRecipe.title,
        ingredients: ingredients,
        instructions: generatedRecipe.instructions,
        cookTime: generatedRecipe.cookTime,
        estimatedCalories: generatedRecipe.estimatedCalories || 0,
        cuisine: generatedRecipe.cuisine || 'General',
        dietaryTags: generatedRecipe.dietaryTags || [],
        difficulty: generatedRecipe.difficulty,
        servings: generatedRecipe.servings
      })

      toast.success('Recipe saved successfully!')
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast.error('Failed to save recipe')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setIngredients([])
    setGeneratedRecipe(null)
    reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Indian Design */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-10 w-10 text-orange-600 mr-3" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
                         <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
               Masala Recipe Generator
             </h1>
           </div>
           <p className="text-gray-700 text-lg">
             Transform your available ingredients into delicious Indian recipes 🍛
           </p>
          <div className="flex justify-center mt-4 space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipe Generation Form */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-bl-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🌶️</span>
              Recipe Preferences
            </h2>
            
            <form onSubmit={handleSubmit(generateRecipe)} className="space-y-6">
              {/* Ingredients Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🥘</span>
                  Available Ingredients *
                </label>
                <div className="flex mb-4">
                  <input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add an ingredient (e.g., chicken, tomatoes, paneer)"
                    className="flex-1 border-2 border-orange-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-r-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Ingredients Tags */}
                {ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 shadow-sm"
                      >
                        <span className="mr-1">🌿</span>
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-2 text-orange-600 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cuisine Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🍽️</span>
                  Cuisine Type
                </label>
                <select
                  {...register('cuisineType')}
                  className="w-full border-2 border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 bg-white"
                >
                  <option value="">Any cuisine</option>
                  {cuisineTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🥗</span>
                  Dietary Preferences
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryPreferences.map(preference => (
                    <label key={preference} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
                      <input
                        type="checkbox"
                        value={preference}
                        {...register('dietaryPreferences')}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{preference}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">⏰</span>
                    Max Cook Time (mins)
                  </label>
                  <input
                    type="number"
                    {...register('maxCookTime', { min: 5, max: 180 })}
                    placeholder="30"
                    className="w-full border-2 border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">📊</span>
                    Difficulty
                  </label>
                  <select
                    {...register('difficulty')}
                    className="w-full border-2 border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 bg-white"
                  >
                    <option value="">Any difficulty</option>
                    {difficultyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">👥</span>
                    Servings
                  </label>
                  <input
                    type="number"
                    {...register('servings', { min: 1, max: 12 })}
                    placeholder="4"
                    className="w-full border-2 border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading || ingredients.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    <span className="text-lg font-semibold">Generating Recipe...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    <span className="text-lg font-semibold">Generate Recipe</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Recipe Display */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-br-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🍛</span>
              Generated Recipe
            </h2>
            
            {generatedRecipe ? (
              <div className="space-y-6">
                {/* Recipe Header */}
                <div className="border-b-2 border-orange-200 pb-6 mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                    {generatedRecipe.title}
                  </h3>
                  <div className="flex items-center space-x-8 text-sm">
                    <div className="flex items-center bg-orange-100 px-4 py-2 rounded-full">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
                      <span className="font-semibold text-orange-800">{generatedRecipe.cookTime} mins</span>
                    </div>
                    <div className="flex items-center bg-red-100 px-4 py-2 rounded-full">
                      <Users className="h-5 w-5 mr-2 text-red-600" />
                      <span className="font-semibold text-red-800">{generatedRecipe.servings} servings</span>
                    </div>
                    <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-full">
                      <TrendingUp className="h-5 w-5 mr-2 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">{generatedRecipe.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🥘</span>
                    Ingredients
                  </h4>
                  <ul className="space-y-3">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <span className="w-3 h-3 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                        <span className="text-gray-800 font-medium">
                          {typeof ingredient === 'string' 
                            ? ingredient 
                            : `${ingredient.amount} ${ingredient.name}`
                          }
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    Instructions
                  </h4>
                  <ol className="space-y-4">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <span className="font-bold text-yellow-600 mr-4 min-w-[30px] text-lg">
                          {index + 1}.
                        </span>
                        <span className="text-gray-800 leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Nutritional Info */}
                {generatedRecipe.nutritionalInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Nutritional Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(generatedRecipe.nutritionalInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t-2 border-orange-200">
                  <button
                    onClick={saveRecipe}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-lg"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span className="font-semibold">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Save Recipe</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No recipe generated yet</p>
                <p className="text-sm text-gray-500">
                  Add ingredients and preferences to generate your first recipe
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeGenerator 