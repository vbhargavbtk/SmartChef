import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Download, 
  Calendar,
  ChefHat,
  Loader2,
  CheckCircle,
  Circle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedMealPlan, setSelectedMealPlan] = useState('')
  const [selectedRecipes, setSelectedRecipes] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('Produce')

  const categories = [
    'Produce', 'Dairy', 'Meat', 'Pantry', 'Frozen', 'Beverages', 
    'Snacks', 'Bakery', 'Canned Goods', 'Spices', 'Other'
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [mealPlansRes, recipesRes, groceryListRes] = await Promise.all([
        axios.get('/api/meal-plan'),
        axios.get('/api/recipes/saved'),
        axios.get('/api/grocery-list')
      ])

      setMealPlans(mealPlansRes.data)
      setSavedRecipes(recipesRes.data)
      
      if (groceryListRes.data.length > 0) {
        setGroceryList(groceryListRes.data[0].items || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load grocery list data')
    } finally {
      setLoading(false)
    }
  }

  const generateFromMealPlan = async () => {
    if (!selectedMealPlan) {
      toast.error('Please select a meal plan')
      return
    }

    setGenerating(true)
    try {
      const response = await axios.post('/api/grocery-list/generate', {
        mealPlanId: selectedMealPlan
      })

      setGroceryList(response.data.items)
      toast.success('Grocery list generated from meal plan!')
    } catch (error) {
      console.error('Error generating grocery list:', error)
      toast.error('Failed to generate grocery list')
    } finally {
      setGenerating(false)
    }
  }

  const generateFromRecipes = async () => {
    if (selectedRecipes.length === 0) {
      toast.error('Please select at least one recipe')
      return
    }

    setGenerating(true)
    try {
      const response = await axios.post('/api/grocery-list/from-recipes', {
        recipeIds: selectedRecipes
      })

      setGroceryList(response.data.items)
      toast.success('Grocery list generated from recipes!')
    } catch (error) {
      console.error('Error generating grocery list:', error)
      toast.error('Failed to generate grocery list')
    } finally {
      setGenerating(false)
    }
  }

  const addItem = () => {
    if (newItem.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.trim(),
        category: newItemCategory,
        quantity: 1,
        unit: '',
        checked: false
      }
      setGroceryList([...groceryList, item])
      setNewItem('')
      setNewItemCategory('Produce')
    }
  }

  const removeItem = (itemId) => {
    setGroceryList(groceryList.filter(item => item.id !== itemId))
  }

  const toggleItem = (itemId) => {
    setGroceryList(groceryList.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ))
  }

  const updateItemQuantity = (itemId, quantity) => {
    setGroceryList(groceryList.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    ))
  }

  const saveGroceryList = async () => {
    try {
      await axios.post('/api/grocery-list/save', {
        items: groceryList
      })
      toast.success('Grocery list saved successfully!')
    } catch (error) {
      console.error('Error saving grocery list:', error)
      toast.error('Failed to save grocery list')
    }
  }

  const exportToPDF = () => {
    // This would integrate with a PDF generation library
    toast.success('PDF export feature coming soon!')
  }

  const getItemsByCategory = () => {
    const grouped = {}
    categories.forEach(category => {
      grouped[category] = groceryList.filter(item => item.category === category)
    })
    return grouped
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Grocery List</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={saveGroceryList}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Save List
              </button>
              <button
                onClick={exportToPDF}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Generate grocery lists from your meal plans or add items manually
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Options */}
          <div className="lg:col-span-1 space-y-6">
            {/* Generate from Meal Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                From Meal Plan
              </h2>
              
              <div className="space-y-4">
                <select
                  value={selectedMealPlan}
                  onChange={(e) => setSelectedMealPlan(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a meal plan</option>
                  {mealPlans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      Week of {new Date(plan.weekStart).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={generateFromMealPlan}
                  disabled={generating || !selectedMealPlan}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate List'
                  )}
                </button>
              </div>
            </div>

            {/* Generate from Recipes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-primary-600" />
                From Recipes
              </h2>
              
              <div className="space-y-4">
                <div className="max-h-40 overflow-y-auto">
                  {savedRecipes.map(recipe => (
                    <label key={recipe._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedRecipes.includes(recipe._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipes([...selectedRecipes, recipe._id])
                          } else {
                            setSelectedRecipes(selectedRecipes.filter(id => id !== recipe._id))
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{recipe.title}</span>
                    </label>
                  ))}
                </div>
                
                <button
                  onClick={generateFromRecipes}
                  disabled={generating || selectedRecipes.length === 0}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate List'
                  )}
                </button>
              </div>
            </div>

            {/* Add Manual Item */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter item name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <button
                  onClick={addItem}
                  disabled={!newItem.trim()}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Grocery List Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shopping List</h2>
              
              {groceryList.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(getItemsByCategory()).map(([category, items]) => {
                    if (items.length === 0) return null
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => toggleItem(item.id)}
                                  className="text-gray-400 hover:text-primary-600 transition-colors"
                                >
                                  {item.checked ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </button>
                                <span className={`${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {item.name}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                                  min="1"
                                />
                                <input
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) => {
                                    setGroceryList(groceryList.map(i => 
                                      i.id === item.id ? { ...i, unit: e.target.value } : i
                                    ))
                                  }}
                                  placeholder="unit"
                                  className="w-20 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                                />
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Your grocery list is empty</p>
                  <p className="text-sm text-gray-500">
                    Generate a list from a meal plan or add items manually
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroceryList 