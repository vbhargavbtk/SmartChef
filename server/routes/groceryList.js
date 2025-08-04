const express = require('express');
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const MealPlan = require('../models/MealPlan');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's grocery lists
router.get('/', auth, async (req, res) => {
  try {
    // For now, return empty array since we don't have a grocery list model yet
    res.json([]);
  } catch (error) {
    console.error('Get grocery lists error:', error);
    res.status(500).json({ error: 'Failed to fetch grocery lists' });
  }
});

// Generate grocery list from meal plan
router.post('/generate', auth, [
  body('mealPlanId').isMongoId().withMessage('Valid meal plan ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mealPlanId } = req.body;

    // Get meal plan with populated recipes
    const mealPlan = await MealPlan.findById(mealPlanId)
      .populate({
        path: 'dailyPlan.monday dailyPlan.tuesday dailyPlan.wednesday dailyPlan.thursday dailyPlan.friday dailyPlan.saturday dailyPlan.sunday',
        model: 'Recipe'
      });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Check if user owns the meal plan
    if (mealPlan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Collect all ingredients from all recipes
    const allIngredients = [];
    const ingredientMap = new Map(); // To track quantities

    // Process each day's recipes
    for (const day in mealPlan.dailyPlan) {
      const recipes = mealPlan.dailyPlan[day];
      if (recipes && recipes.length > 0) {
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
      }
    }

    // Convert map to array and group by category
    const groceryList = groupByCategory(Array.from(ingredientMap.values()));

    res.json({
      message: 'Grocery list generated successfully',
      groceryList,
      mealPlan: {
        weekStart: mealPlan.weekStart,
        weekEnd: mealPlan.weekEnd,
        totalRecipes: Object.values(mealPlan.dailyPlan).flat().length
      }
    });
  } catch (error) {
    console.error('Generate grocery list error:', error);
    res.status(500).json({ error: 'Failed to generate grocery list' });
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

    if (recipes.length !== recipeIds.length) {
      return res.status(400).json({ error: 'Some recipes not found or access denied' });
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

    // Convert map to array and group by category
    const groceryList = groupByCategory(Array.from(ingredientMap.values()));

    res.json({
      message: 'Grocery list generated successfully',
      groceryList,
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
  // Simple combination logic - in a real app, you'd want more sophisticated parsing
  const num1 = parseFloat(amount1) || 0;
  const num2 = parseFloat(amount2) || 0;
  
  if (num1 === 0 && num2 === 0) {
    return amount1 || amount2;
  }
  
  const total = num1 + num2;
  const unit = amount1.replace(/[\d.]/g, '').trim() || amount2.replace(/[\d.]/g, '').trim();
  
  return `${total} ${unit}`.trim();
}

// Helper function to group ingredients by category
function groupByCategory(ingredients) {
  const categories = {
    produce: [],
    dairy: [],
    meat: [],
    pantry: [],
    spices: [],
    other: []
  };

  ingredients.forEach(ingredient => {
    const category = ingredient.category || 'other';
    if (categories[category]) {
      categories[category].push(ingredient);
    } else {
      categories.other.push(ingredient);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(category => {
    if (categories[category].length === 0) {
      delete categories[category];
    }
  });

  return categories;
}

module.exports = router; 