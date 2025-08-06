const express = require('express');
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');

const GroceryList = require('../models/GroceryList');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's grocery lists
router.get('/', auth, async (req, res) => {
  try {
    const groceryLists = await GroceryList.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    
    res.json(groceryLists);
  } catch (error) {
    console.error('Get grocery lists error:', error);
    res.status(500).json({ error: 'Failed to fetch grocery lists' });
  }
});

// Get current grocery list (most recent or create new one)
router.get('/current', auth, async (req, res) => {
  try {
    let groceryList = await GroceryList.findOne({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    
    if (!groceryList) {
      // Create a new empty grocery list
      groceryList = new GroceryList({
        userId: req.user._id,
        name: 'My Grocery List',
        items: []
      });
      await groceryList.save();
    }
    
    res.json(groceryList);
  } catch (error) {
    console.error('Get current grocery list error:', error);
    res.status(500).json({ error: 'Failed to fetch current grocery list' });
  }
});

// Save grocery list
router.post('/save', auth, [
  body('items').isArray().withMessage('Items array is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, name = 'My Grocery List' } = req.body;

    // Validate items structure
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    // Find existing grocery list or create new one
    let groceryList = await GroceryList.findOne({ userId: req.user._id });
    
    if (groceryList) {
      // Update existing list
      groceryList.items = items;
      groceryList.name = name;
      groceryList.updatedAt = Date.now();
    } else {
      // Create new list
      groceryList = new GroceryList({
        userId: req.user._id,
        name: name,
        items: items
      });
    }

    await groceryList.save();

    // Grocery list saved successfully

    res.json({
      message: 'Grocery list saved successfully',
      groceryList: groceryList
    });
  } catch (error) {
    console.error('Save grocery list error:', error);
    res.status(500).json({ error: 'Failed to save grocery list' });
  }
});



// Generate grocery list from specific recipes
router.post('/from-recipes', auth, [
  body('recipeIds').isArray({ min: 1 }).withMessage('At least one recipe ID is required'),
  body('recipeIds.*').isMongoId().withMessage('Valid recipe ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipeIds } = req.body;

    // Get recipes that belong to the user
    const recipes = await Recipe.find({
      _id: { $in: recipeIds },
      userId: req.user._id
    });

    // Found recipes for grocery list generation

    if (recipes.length !== recipeIds.length) {
      return res.status(400).json({ 
        error: `Some recipes not found or access denied. Requested: ${recipeIds.length}, Found: ${recipes.length}` 
      });
    }

    if (recipes.length === 0) {
      return res.status(400).json({ 
        error: 'No recipes found. Please save some recipes first.' 
      });
    }

    // Collect all ingredients
    const ingredientMap = new Map();

    recipes.forEach(recipe => {
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.name.toLowerCase()}-${ingredient.category}`;
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            existing.amount = combineAmounts(existing.amount, ingredient.amount);
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              amount: ingredient.amount,
              category: ingredient.category
            });
          }
        });
      }
    });

    // Convert map to array and format for frontend
    const groceryItems = Array.from(ingredientMap.values()).map(ingredient => ({
      _id: Date.now() + Math.random(), // Generate unique ID
      name: ingredient.name,
      category: capitalizeFirst(ingredient.category || 'Other'),
      quantity: 1,
      unit: ingredient.amount.replace(/[\d.]/g, '').trim() || '',
      checked: false
    }));

    // Generated grocery items from recipes successfully

    if (groceryItems.length === 0) {
      return res.status(400).json({ 
        error: 'No ingredients found in the selected recipes. Please make sure your recipes have ingredients listed.' 
      });
    }

    res.json({
      message: 'Grocery list generated successfully',
      items: groceryItems,
      recipes: recipes.map(recipe => ({
        id: recipe._id,
        title: recipe.title
      }))
    });
  } catch (error) {
    console.error('Generate grocery list from recipes error:', error);
    res.status(500).json({ error: 'Failed to generate grocery list' });
  }
});

// Helper function to combine ingredient amounts
function combineAmounts(amount1, amount2) {
  // Handle undefined or null amounts
  if (!amount1 && !amount2) return '';
  if (!amount1) return amount2 || '';
  if (!amount2) return amount1 || '';
  
  // Simple combination logic - in a real app, you'd want more sophisticated parsing
  const num1 = parseFloat(amount1) || 0;
  const num2 = parseFloat(amount2) || 0;
  
  if (num1 === 0 && num2 === 0) {
    return amount1 || amount2 || '';
  }
  
  const total = num1 + num2;
  const unit1 = (amount1 || '').replace(/[\d.]/g, '').trim();
  const unit2 = (amount2 || '').replace(/[\d.]/g, '').trim();
  const unit = unit1 || unit2;
  
  return unit ? `${total} ${unit}`.trim() : total.toString();
}

// Debug endpoint to check grocery list status
router.get('/debug', auth, async (req, res) => {
  try {
    const groceryLists = await GroceryList.find({ userId: req.user._id });
    const currentList = await GroceryList.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });
    
    res.json({
      totalLists: groceryLists.length,
      currentList: currentList ? {
        id: currentList._id,
        name: currentList.name,
        itemCount: currentList.items.length,
        updatedAt: currentList.updatedAt
      } : null,
      allLists: groceryLists.map(list => ({
        id: list._id,
        name: list.name,
        itemCount: list.items.length,
        updatedAt: list.updatedAt
      }))
    });
  } catch (error) {
    console.error('Debug grocery list error:', error);
    res.status(500).json({ error: 'Failed to debug grocery list' });
  }
});

// Update grocery list item
router.put('/item/:itemId', auth, [
  body('checked').optional().isBoolean(),
  body('quantity').optional().isInt({ min: 1 }),
  body('unit').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId } = req.params;
    const { checked, quantity, unit } = req.body;

    const groceryList = await GroceryList.findOne({ userId: req.user._id });
    
    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    const item = groceryList.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (checked !== undefined) item.checked = checked;
    if (quantity !== undefined) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;

    groceryList.updatedAt = Date.now();
    await groceryList.save();

    res.json({
      message: 'Item updated successfully',
      item: item
    });
  } catch (error) {
    console.error('Update grocery item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Get current grocery list
router.get('/current', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({ userId: req.user._id });
    
    if (!groceryList) {
      return res.json({ items: [] });
    }

    res.json({
      items: groceryList.items,
      name: groceryList.name,
      updatedAt: groceryList.updatedAt
    });
  } catch (error) {
    console.error('Get current grocery list error:', error);
    res.status(500).json({ error: 'Failed to fetch current grocery list' });
  }
});

// Helper function to capitalize first letter
function capitalizeFirst(str) {
  if (!str) return 'Other';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = router; 