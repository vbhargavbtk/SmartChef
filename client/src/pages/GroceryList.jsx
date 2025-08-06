import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Download, 
  ChefHat,
  Loader2,
  CheckCircle,
  Circle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
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
      const [recipesRes, groceryListRes] = await Promise.all([
        axios.get('/api/recipes/saved'),
        axios.get('/api/grocery-list/current')
      ])



      setSavedRecipes(recipesRes.data)
      
      if (groceryListRes.data.items && groceryListRes.data.items.length > 0) {
        setGroceryList(groceryListRes.data.items)
      } else {
        setGroceryList([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load grocery list data')
    } finally {
      setLoading(false)
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
      
      // Save the generated list to backend
      await axios.post('/api/grocery-list/save', {
        items: response.data.items
      });
      
      toast.success('Grocery list generated from recipes!')
    } catch (error) {
      console.error('Error generating grocery list:', error)
      const errorMessage = error.response?.data?.error || 'Failed to generate grocery list'
      toast.error(errorMessage)
    } finally {
      setGenerating(false)
    }
  }

  const addItem = async () => {
    if (newItem.trim()) {
      const item = {
        name: newItem.trim(),
        category: newItemCategory,
        checked: false,
        tempId: Date.now() + Math.random() // Temporary ID for local operations
      }
      
      // Update local state immediately for better UX
      setGroceryList([...groceryList, item])
      setNewItem('')
      setNewItemCategory('Produce')
      
      // Save to backend
      try {
        await axios.post('/api/grocery-list/save', {
          items: [...groceryList, item]
        });
      } catch (error) {
        console.error('Error adding item:', error);
        toast.error('Failed to add item');
        // Remove item from local state on error
        setGroceryList(groceryList);
      }
    }
  }

  const removeItem = async (itemId) => {
    try {
      // Update local state immediately for better UX
      const updatedList = groceryList.filter(item => (item._id !== itemId && item.tempId !== itemId));
      setGroceryList(updatedList);
      
      // Save the updated list to backend
      await axios.post('/api/grocery-list/save', {
        items: updatedList
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      // Revert local state on error
      setGroceryList(groceryList);
    }
  }

  const toggleItem = async (itemId) => {
    try {
      const updatedItem = groceryList.find(item => (item._id === itemId || item.tempId === itemId));
      const newChecked = !updatedItem.checked;
      
      // Update local state immediately for better UX
      const updatedList = groceryList.map(item => 
        (item._id === itemId || item.tempId === itemId) ? { ...item, checked: newChecked } : item
      );
      setGroceryList(updatedList);
      
      // Save the entire updated list to backend
      await axios.post('/api/grocery-list/save', {
        items: updatedList
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
      // Revert local state on error
      setGroceryList(groceryList);
    }
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



  const exportToPDF = async () => {
    if (groceryList.length === 0) {
      toast.error('No items in grocery list to export')
      return
    }

    try {
      toast.loading('Generating PDF...', { id: 'grocery-pdf-export' })
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (2 * margin)
      
      let yPosition = margin
      
      // Add title
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Grocery List', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      
      // Add date
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      
      // Get items grouped by category
      const groupedItems = getItemsByCategory()
      
      // Add items by category
      Object.keys(groupedItems).forEach(category => {
        const items = groupedItems[category]
        if (items.length > 0) {
          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            pdf.addPage()
            yPosition = margin
          }
          
          // Add category header
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          pdf.text(category, margin, yPosition)
          yPosition += 10
          
          // Add items in this category
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
          items.forEach(item => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
              pdf.addPage()
              yPosition = margin
            }
            
            const checkbox = item.checked ? '☑' : '☐'
            const itemText = `${checkbox} ${item.name}`
            pdf.text(itemText, margin + 5, yPosition)
            yPosition += 6
          })
          
          yPosition += 5 // Add space between categories
        }
      })
      
      // Add summary
      if (yPosition > pageHeight - 60) {
        pdf.addPage()
        yPosition = margin
      }
      
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Summary:', margin, yPosition)
      yPosition += 10
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const totalItems = groceryList.length
      const checkedItems = groceryList.filter(item => item.checked).length
      const uncheckedItems = totalItems - checkedItems
      
      pdf.text(`Total Items: ${totalItems}`, margin, yPosition)
      yPosition += 6
      pdf.text(`Completed: ${checkedItems}`, margin, yPosition)
      yPosition += 6
      pdf.text(`Remaining: ${uncheckedItems}`, margin, yPosition)
      
      // Add footer
      const footerText = `Generated by YourSmartChef - ${new Date().toLocaleDateString()}`
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' })
      
      // Save the PDF
      const fileName = `grocery_list_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      toast.success('Grocery list PDF exported successfully!', { id: 'grocery-pdf-export' })
    } catch (error) {
      console.error('Error exporting grocery list PDF:', error)
      toast.error('Failed to export PDF', { id: 'grocery-pdf-export' })
    }
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
                onClick={exportToPDF}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Generate grocery lists from your saved recipes or add items manually. Your changes are saved automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Options */}
          <div className="lg:col-span-1 space-y-6">

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Tomatoes, Milk, Bread"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                

                
                <button
                  onClick={addItem}
                  disabled={!newItem.trim()}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Grocery List Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shopping List</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <span className="text-green-700 font-medium">
                      {groceryList.filter(item => item.checked).length} of {groceryList.length} items
                    </span>
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <span className="text-blue-700 font-medium">
                      {groceryList.length} total items
                    </span>
                  </div>
                </div>
              </div>
              
              {groceryList.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(getItemsByCategory()).map(([category, items]) => {
                    if (items.length === 0) return null
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                          {category}
                        </h3>
                        <div className="space-y-3">
                          {items.map(item => (
                            <div key={item._id || item.tempId} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center space-x-4 flex-1">
                                <button
                                  onClick={() => toggleItem(item._id || item.tempId)}
                                  className="text-gray-400 hover:text-primary-600 transition-colors flex-shrink-0"
                                >
                                  {item.checked ? (
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                  ) : (
                                    <Circle className="h-6 w-6" />
                                  )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <span className={`text-lg font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {item.name}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => removeItem(item._id || item.tempId)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                                >
                                  <Trash2 className="h-5 w-5" />
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