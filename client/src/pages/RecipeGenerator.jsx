import { useState, useEffect, useRef } from 'react'
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
  Loader2,
  History,
  Eye,
  Trash2,
  Download
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedHistory, setGeneratedHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistoryRecipe, setSelectedHistoryRecipe] = useState(null)
  const recipeModalRef = useRef(null)

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (showHistory) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }

    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [showHistory])

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const cuisineTypes = [
    'North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Maharashtrian', 'Punjabi',
    'Rajasthani', 'Kashmiri', 'Goan', 'Kerala', 'Hyderabadi', 'Mughlai',
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'French', 
    'Mediterranean', 'American', 'Greek', 'Spanish', 'Korean'
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
      const response = await axios.post('/api/recipes/generate', {
        ingredients,
        cuisineType: data.cuisineType,
        dietaryPreferences: [], // Removed dietary preferences
        maxCookTime: data.maxCookTime,
        difficulty: data.difficulty,
        servings: data.servings
      })

      setGeneratedRecipe(response.data.recipe)
      toast.success('Recipe generated and saved successfully!')
      
      // No need to save to history separately - it's already saved to the main database
    } catch (error) {
      console.error('Error generating recipe:', error)
      toast.error(error.response?.data?.error || 'Failed to generate recipe')
    } finally {
      setLoading(false)
    }
  }



  const resetForm = () => {
    setIngredients([])
    setGeneratedRecipe(null)
    reset()
  }

  // Load generated recipes history
  const loadGeneratedHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await axios.get('/api/recipes/generated')
      setGeneratedHistory(response.data)
    } catch (error) {
      console.error('Error loading generated history:', error)
      toast.error('Failed to load generated recipes history')
    } finally {
      setLoadingHistory(false)
    }
  }

  // View a recipe from history
  const viewHistoryRecipe = (recipe) => {
    setSelectedHistoryRecipe(recipe)
    setShowHistory(false)
  }

  // Delete a recipe from history
  const deleteHistoryRecipe = async (recipeId) => {
    try {
      await axios.delete(`/api/recipes/${recipeId}`)
      toast.success('Recipe deleted successfully')
      loadGeneratedHistory() // Reload the list
    } catch (error) {
      console.error('Error deleting recipe from history:', error)
      toast.error('Failed to delete recipe from history')
    }
  }

  // Save recipe to main collection (for manual save button)
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
        cookTime: generatedRecipe.cookTime.toString(), // Convert to string as expected by Recipe model
        estimatedCalories: generatedRecipe.estimatedCalories || 0,
        cuisine: generatedRecipe.cuisine || 'General',
        dietaryTags: generatedRecipe.dietaryTags || [],
        difficulty: generatedRecipe.difficulty?.toLowerCase() || 'medium', // Convert to lowercase
        servings: generatedRecipe.servings,
        isGenerated: false // Mark as manually saved (duplicate of generated recipe)
      })

      toast.success('Recipe saved as a new copy!')
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast.error('Failed to save recipe')
    } finally {
      setSaving(false)
    }
  }

  const exportToPDF = async () => {
    if (!selectedHistoryRecipe) {
      toast.error('No recipe to export')
      return
    }

    try {
      toast.loading('Generating PDF...', { id: 'pdf-export' })
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (2 * margin)
      
      let yPosition = margin
      
      // Add title
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text(selectedHistoryRecipe.title, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      
      // Add recipe details
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const details = [
        `Cook Time: ${selectedHistoryRecipe.cookTime}`,
        `Servings: ${selectedHistoryRecipe.servings}`,
        `Difficulty: ${selectedHistoryRecipe.difficulty}`,
        `Cuisine: ${selectedHistoryRecipe.cuisine || 'General'}`,
        `Calories: ${selectedHistoryRecipe.estimatedCalories || 'N/A'}`
      ]
      
      details.forEach(detail => {
        pdf.text(detail, margin, yPosition)
        yPosition += 8
      })
      
      yPosition += 10
      
      // Add ingredients section
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Ingredients:', margin, yPosition)
      yPosition += 10
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      selectedHistoryRecipe.ingredients.forEach((ingredient, index) => {
        const ingredientText = typeof ingredient === 'string' 
          ? `• ${ingredient}`
          : `• ${ingredient.amount} ${ingredient.name}`
        
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = margin
        }
        
        pdf.text(ingredientText, margin + 5, yPosition)
        yPosition += 6
      })
      
      yPosition += 10
      
      // Add instructions section
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Instructions:', margin, yPosition)
      yPosition += 10
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      // Combine all instructions into natural language
      const naturalInstructions = selectedHistoryRecipe.instructions.join(' ')
      
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = margin
      }
      
      // Split the natural language instructions into multiple lines
      const lines = pdf.splitTextToSize(naturalInstructions, contentWidth - 10)
      lines.forEach(line => {
        pdf.text(line, margin, yPosition)
        yPosition += 6
      })
      yPosition += 5
      
      // Add footer
      const footerText = `Generated by YourSmartChef - ${new Date().toLocaleDateString()}`
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' })
      
      // Save the PDF
      const fileName = `${selectedHistoryRecipe.title.replace(/[^a-zA-Z0-9]/g, '_')}_recipe.pdf`
      pdf.save(fileName)
      
      toast.success('PDF exported successfully!', { id: 'pdf-export' })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF', { id: 'pdf-export' })
    }
  }

  const exportGeneratedRecipeToPDF = async () => {
    if (!generatedRecipe) {
      toast.error('No recipe to export')
      return
    }

    try {
      toast.loading('Generating PDF...', { id: 'generated-pdf-export' })
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (2 * margin)
      
      let yPosition = margin
      
      // Add title
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text(generatedRecipe.title, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      
      // Add recipe details
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const details = [
        `Cook Time: ${generatedRecipe.cookTime}`,
        `Servings: ${generatedRecipe.servings}`,
        `Difficulty: ${generatedRecipe.difficulty}`,
        `Cuisine: ${generatedRecipe.cuisine || 'General'}`,
        `Calories: ${generatedRecipe.estimatedCalories || 'N/A'}`
      ]
      
      details.forEach(detail => {
        pdf.text(detail, margin, yPosition)
        yPosition += 8
      })
      
      yPosition += 10
      
      // Add ingredients section
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Ingredients:', margin, yPosition)
      yPosition += 10
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      generatedRecipe.ingredients.forEach((ingredient, index) => {
        const ingredientText = typeof ingredient === 'string' 
          ? `• ${ingredient}`
          : `• ${ingredient.amount} ${ingredient.name}`
        
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = margin
        }
        
        pdf.text(ingredientText, margin + 5, yPosition)
        yPosition += 6
      })
      
      yPosition += 10
      
      // Add instructions section
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Instructions:', margin, yPosition)
      yPosition += 10
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      // Combine all instructions into natural language
      const naturalInstructions = generatedRecipe.instructions.join(' ')
      
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = margin
      }
      
      // Split the natural language instructions into multiple lines
      const lines = pdf.splitTextToSize(naturalInstructions, contentWidth - 10)
      lines.forEach(line => {
        pdf.text(line, margin, yPosition)
        yPosition += 6
      })
      yPosition += 5
      
      // Add footer
      const footerText = `Generated by YourSmartChef - ${new Date().toLocaleDateString()}`
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' })
      
      // Save the PDF
      const fileName = `${generatedRecipe.title.replace(/[^a-zA-Z0-9]/g, '_')}_recipe.pdf`
      pdf.save(fileName)
      
      toast.success('PDF exported successfully!', { id: 'generated-pdf-export' })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF', { id: 'generated-pdf-export' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative">
      <div className="relative">
        {/* Backdrop Overlay */}
        {showHistory && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setShowHistory(false)}
          ></div>
        )}
        
        {/* Left Sidebar for History */}
        <div className={`history-sidebar fixed left-0 top-0 h-full bg-white shadow-2xl border-r-2 border-orange-200 overflow-y-auto z-50 transition-all duration-500 ease-in-out transform ${
          showHistory ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
        } w-80 md:w-96`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <History className="h-5 w-5 mr-2 text-purple-600" />
                  Recipe History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {loadingHistory ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 text-orange-500 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-600 text-sm">Loading history...</p>
                </div>
              ) : generatedHistory.length > 0 ? (
                <div className="space-y-4">
                  {generatedHistory.map((recipe) => (
                    <div key={recipe._id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{recipe.title}</h3>
                        <button
                          onClick={() => deleteHistoryRecipe(recipe._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
                          title="Delete from history"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-xs text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{recipe.cookTime} mins</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                      

                      
                      <button
                        onClick={() => viewHistoryRecipe(recipe)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-3 rounded text-xs hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Recipe
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-1">No generated recipes yet</p>
                  <p className="text-xs text-gray-500">
                    Generate your first recipe to see it here
                  </p>
                </div>
              )}
              
              {/* Scroll to top button */}
              {generatedHistory.length > 5 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      const sidebar = document.querySelector('.history-sidebar');
                      if (sidebar) {
                        sidebar.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                  >
                    ↑ Scroll to Top
                  </button>
                </div>
              )}
            </div>
          </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
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
                <br />
                <span className="text-sm text-gray-600">All generated recipes are automatically saved to your recipe collection!</span>
              </p>
              <div className="flex justify-center mt-4 space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              
              {/* History Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowHistory(!showHistory)
                    if (!showHistory) {
                      loadGeneratedHistory()
                    }
                  }}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center mx-auto transform hover:scale-105 shadow-lg ${
                    showHistory 
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                  } ${loadingHistory ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={loadingHistory}
                >
                  {loadingHistory ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <History className="h-5 w-5 mr-2" />
                  )}
                  {loadingHistory ? 'Loading...' : (showHistory ? 'Hide History' : 'View Generated History')}
                </button>
              </div>
            </div>

        {/* Input Container */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-8 relative overflow-hidden mb-8">
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

        {/* Output Container */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-8 relative overflow-hidden mb-8">
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

              {/* Note about automatic saving */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ <strong>Auto-saved!</strong> This recipe has been automatically saved to your recipe collection and is available in the Meal Planner.
                </p>
              </div>

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
                      <span className="font-semibold">Save as Copy</span>
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



        {/* Selected History Recipe Modal */}
        {selectedHistoryRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div ref={recipeModalRef} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedHistoryRecipe.title}
                  </h2>
                  <button
                    onClick={() => setSelectedHistoryRecipe(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recipe Details */}
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center bg-orange-100 px-4 py-2 rounded-full">
                        <Clock className="h-5 w-5 mr-2 text-orange-600" />
                        <span className="font-semibold text-orange-800">{selectedHistoryRecipe.cookTime} mins</span>
                      </div>
                      <div className="flex items-center bg-red-100 px-4 py-2 rounded-full">
                        <Users className="h-5 w-5 mr-2 text-red-600" />
                        <span className="font-semibold text-red-800">{selectedHistoryRecipe.servings} servings</span>
                      </div>
                      <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-full">
                        <TrendingUp className="h-5 w-5 mr-2 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">{selectedHistoryRecipe.difficulty}</span>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🥘</span>
                        Ingredients
                      </h4>
                      <ul className="space-y-3">
                        {selectedHistoryRecipe.ingredients.map((ingredient, index) => (
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
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">📝</span>
                      Instructions
                    </h4>
                    <ol className="space-y-4">
                      {selectedHistoryRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <span className="font-bold text-yellow-600 mr-4 min-w-[30px] text-lg">
                            {index + 1}.
                          </span>
                          <span className="text-gray-800 leading-relaxed">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8 pt-6 border-t-2 border-orange-200">
                  <button
                    onClick={async () => {
                      try {
                        // Convert ingredients to the format expected by the backend
                        const ingredients = selectedHistoryRecipe.ingredients.map(ingredient => {
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
                          title: selectedHistoryRecipe.title,
                          ingredients: ingredients,
                          instructions: selectedHistoryRecipe.instructions,
                          cookTime: selectedHistoryRecipe.cookTime.toString(), // Convert to string
                          estimatedCalories: selectedHistoryRecipe.estimatedCalories || 0,
                          cuisine: selectedHistoryRecipe.cuisine || 'General',
                          dietaryTags: selectedHistoryRecipe.dietaryTags || [],
                          difficulty: selectedHistoryRecipe.difficulty?.toLowerCase() || 'medium', // Convert to lowercase
                          servings: selectedHistoryRecipe.servings
                        })

                        toast.success('Recipe saved to My Recipes successfully!')
                        setSelectedHistoryRecipe(null)
                      } catch (error) {
                        console.error('Error saving recipe:', error)
                        toast.error('Failed to save recipe')
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Save to My Recipes</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Export PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedHistoryRecipe(null)}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeGenerator 