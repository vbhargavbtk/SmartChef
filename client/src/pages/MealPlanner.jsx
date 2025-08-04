import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { 
  Calendar, 
  Plus, 
  Save, 
  Trash2, 
  Clock, 
  Users,
  ChefHat,
  Loader2
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState({})
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek())

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner']

  function getCurrentWeek() {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
    return startOfWeek.toISOString().split('T')[0]
  }

  function getWeekDates(startDate) {
    const dates = []
    const start = new Date(startDate)
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  useEffect(() => {
    fetchData()
  }, [selectedWeek])

  const fetchData = async () => {
    setLoading(true)
    try {
      console.log('Fetching meal planner data...')
      
      const [recipesRes, mealPlanRes] = await Promise.all([
        axios.get('/api/recipes/saved'),
        axios.get('/api/meal-plan')
      ])

      console.log('Recipes response:', recipesRes.data)
      console.log('Meal plans response:', mealPlanRes.data)

      setSavedRecipes(recipesRes.data)
      
      // For now, just start with an empty meal plan
      setMealPlan({})
      
      // TODO: Implement proper meal plan loading when we have saved plans
      console.log('Meal planner data loaded successfully')
    } catch (error) {
      console.error('Error fetching data:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to access meal planner')
      } else {
        toast.error('Failed to load meal planner data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (result) => {
    console.log('Drag end result:', result)
    
    if (!result.destination) {
      console.log('No destination, drag cancelled')
      return
    }

    const { source, destination, draggableId } = result
    console.log('Source:', source, 'Destination:', destination, 'DraggableId:', draggableId)
    
    const recipe = savedRecipes.find(r => r._id === draggableId)

    if (!recipe) {
      console.log('Recipe not found:', draggableId)
      console.log('Available recipes:', savedRecipes.map(r => ({ id: r._id, title: r.title })))
      return
    }

    console.log('Dragging recipe:', recipe.title, 'to:', destination.droppableId)

    const newMealPlan = { ...mealPlan }
    const mealKey = destination.droppableId

    // Remove from source if it was already in a meal slot
    Object.keys(newMealPlan).forEach(key => {
      if (newMealPlan[key]?._id === draggableId) {
        console.log('Removing from existing slot:', key)
        delete newMealPlan[key]
      }
    })

    // Add to destination
    newMealPlan[mealKey] = recipe
    console.log('Added to new slot:', mealKey)

    setMealPlan(newMealPlan)
    console.log('Updated meal plan:', newMealPlan)
    
    // Show success message
    toast.success(`Added ${recipe.title} to ${destination.droppableId}`)
  }

  const removeMeal = (mealKey) => {
    const newMealPlan = { ...mealPlan }
    delete newMealPlan[mealKey]
    setMealPlan(newMealPlan)
    toast.success('Meal removed from plan')
  }

  const addMealToSlot = (day, mealType, recipe) => {
    const mealKey = `${day}-${mealType}`
    const newMealPlan = { ...mealPlan }
    newMealPlan[mealKey] = recipe
    setMealPlan(newMealPlan)
    toast.success(`Added ${recipe.title} to ${day} ${mealType}`)
  }

  const saveMealPlan = async () => {
    setSaving(true)
    try {
      console.log('Saving meal plan...')
      console.log('Current meal plan:', mealPlan)
      
      const weekStart = new Date(selectedWeek)
      const weekEnd = new Date(selectedWeek)
      weekEnd.setDate(weekEnd.getDate() + 6)

      // Convert meal plan to the format expected by the backend
      const dailyPlan = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }

      // Map meals to the correct format
      Object.keys(mealPlan).forEach(mealKey => {
        const [day, mealType] = mealKey.split('-')
        const dayKey = day.toLowerCase()
        if (dailyPlan[dayKey] && mealPlan[mealKey]) {
          dailyPlan[dayKey].push(mealPlan[mealKey]._id)
        }
      })

      const mealPlanData = {
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        dailyPlan,
        notes: 'Weekly meal plan'
      }

      console.log('Saving meal plan data:', mealPlanData)
      await axios.post('/api/meal-plan/save', mealPlanData)
      toast.success('Meal plan saved successfully!')
    } catch (error) {
      console.error('Error saving meal plan:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to save meal plan')
      } else {
        toast.error('Failed to save meal plan')
      }
    } finally {
      setSaving(false)
    }
  }

  const getMealForSlot = (day, mealType) => {
    const mealKey = `${day}-${mealType}`
    return mealPlan[mealKey]
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
              <Calendar className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
            </div>
            <button
              onClick={saveMealPlan}
              disabled={saving}
              className="btn-primary flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Plan
                </>
              )}
            </button>
          </div>
          <p className="text-gray-600">
            Plan your weekly meals by dragging recipes to your preferred time slots
          </p>
        </div>

        {/* Week Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Week
          </label>
          <input
            type="date"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
            {/* Recipe Library */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipe Library</h2>
                
                {savedRecipes.length > 0 ? (
                  <Droppable droppableId="recipe-library" isDropDisabled={true}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3"
                      >
                        {savedRecipes.map((recipe, index) => (
                          <Draggable
                            key={recipe._id}
                            draggableId={recipe._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 cursor-move border-2 transition-all duration-200 hover:scale-105 ${
                                  snapshot.isDragging ? 'border-orange-500 shadow-xl scale-105 rotate-2' : 'border-orange-200 hover:border-orange-300'
                                }`}
                                onClick={() => {
                                  // Show a simple dropdown to select meal slot
                                  const mealType = prompt(`Add ${recipe.title} to which meal?\n1. Breakfast\n2. Lunch\n3. Dinner\n\nEnter 1, 2, or 3:`)
                                  if (mealType) {
                                    const mealTypes = ['Breakfast', 'Lunch', 'Dinner']
                                    const selectedMeal = mealTypes[parseInt(mealType) - 1]
                                    if (selectedMeal) {
                                      const day = prompt(`Add to which day?\n1. Monday\n2. Tuesday\n3. Wednesday\n4. Thursday\n5. Friday\n6. Saturday\n7. Sunday\n\nEnter 1-7:`)
                                      if (day) {
                                        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                                        const selectedDay = days[parseInt(day) - 1]
                                        if (selectedDay) {
                                          addMealToSlot(selectedDay, selectedMeal, recipe)
                                        }
                                      }
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-center mb-2">
                                  <ChefHat className="h-4 w-4 text-primary-600 mr-2" />
                                  <h3 className="font-medium text-gray-900 text-sm">
                                    {recipe.title}
                                  </h3>
                                </div>
                                <div className="flex items-center text-xs text-gray-600 space-x-3">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {recipe.cookTime}m
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {recipe.servings}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ) : (
                  <div className="text-center py-8">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No recipes saved</p>
                    <p className="text-sm text-gray-500">
                      Save some recipes first to plan your meals
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Calendar */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-200">
                  {daysOfWeek.map(day => (
                    <div key={day} className="p-4 text-center font-semibold text-gray-900 bg-gray-50">
                      {day}
                    </div>
                  ))}
                </div>

                {mealTypes.map(mealType => (
                  <div key={mealType} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
                    <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-center justify-center">
                      <span className="font-medium text-gray-700">{mealType}</span>
                    </div>
                    
                    {daysOfWeek.map(day => (
                      <Droppable key={`${day}-${mealType}`} droppableId={`${day}-${mealType}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-4 border-r border-gray-200 last:border-r-0 min-h-[120px] transition-colors duration-200 ${
                              snapshot.isDraggingOver ? 'bg-orange-100 border-2 border-orange-300' : 'bg-white'
                            }`}
                          >
                            {getMealForSlot(day, mealType) ? (
                              <div className="relative">
                                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 border border-green-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm">
                                      {getMealForSlot(day, mealType).title}
                                    </h4>
                                    <button
                                      onClick={() => removeMeal(`${day}-${mealType}`)}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600 space-x-2">
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {getMealForSlot(day, mealType).cookTime}m
                                    </div>
                                    <div className="flex items-center">
                                      <Users className="h-3 w-3 mr-1" />
                                      {getMealForSlot(day, mealType).servings}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <Plus className="h-6 w-6" />
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DragDropContext>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to use the Meal Planner</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Drag recipes from the library to any meal slot</li>
            <li>• Or click on a recipe to add it via popup</li>
            <li>• Click the trash icon to remove a meal</li>
            <li>• Save your plan to keep it for future reference</li>
            <li>• Generate grocery lists from your meal plans</li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Debug Info</h3>
          <div className="text-sm text-gray-600">
            <p>Saved Recipes: {savedRecipes.length}</p>
            <p>Meal Plan Slots: {Object.keys(mealPlan).length}</p>
            <p>Selected Week: {selectedWeek}</p>
            <button 
              onClick={() => {
                console.log('Current meal plan:', mealPlan)
                console.log('Saved recipes:', savedRecipes)
                toast.success('Debug info logged to console')
              }}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
            >
              Log Debug Info
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealPlanner 